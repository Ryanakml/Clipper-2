from __future__ import annotations

import glob
import json
import os
import pathlib
import pickle
import re
import shutil
import subprocess
import threading
import time
import uuid
from typing import Optional

import modal
import torch
from fastapi import Request

image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install(
        "git", "ffmpeg", "wget", "pkg-config", "build-essential",
        "libavformat-dev", "libavcodec-dev", "libavutil-dev",
        "libswscale-dev", "libavdevice-dev", "libavfilter-dev",
        "libswresample-dev", "libsm6", "libxext6",
        "libsndfile1" 
    )
    .run_commands(
        [
            "pip install --upgrade pip",
            
            # 1. FONDASI ANTI-CRASH
            "pip install 'Cython<3.0' 'numpy<2.0' setuptools wheel",
            
            # 2. OPERASI MANUAL 'AV'
            "pip install av==11.0.0 --no-build-isolation --no-deps",
            
            # 3. CORE APPS
            "pip install faster-whisper==0.10.1 --no-deps",
            "pip install whisperx==3.1.1 --no-deps",
            
            # 4. INSTALASI LENGKAP DEPENDENSI
            # Gw apus huggingface_hub karena kita gausah login lagi!
            "pip install 'numpy<2.0' \
                         'ctranslate2==3.24.0' \
                         'tokenizers' \
                         'transformers' \
                         'pandas' \
                         'nltk' \
                         'scipy' \
                         'soundfile' \
                         'python_speech_features' \
                         'scikit-learn' \
                         'tqdm' \
                         'scenedetect' \
                         'pyannote.audio' \
                         'speechbrain' \
                         'torch==2.0.1' \
                         'torchaudio==2.0.2' \
                         'torchvision==0.15.2' \
                         'boto3' \
                         'opencv-python-headless' \
                         'google-genai' \
                         'gdown' \
                         'fastapi[standard]'"
        ]
    )
    # 5. [FIX FINAL] - DOWNLOAD MANUAL DARI LINK TEMUAN LU
    # Kita download 'whisperx-vad-segmentation.bin' dari repo Synthetai (Public).
    # Disimpan ke /root/.cache/torch/ biar WhisperX langsung nemu.
    .run_commands(
        [
            "mkdir -p /root/.cache/torch",
            
            # INI DIA LINK PENYELAMATNYA:
            "wget -O /root/.cache/torch/whisperx-vad-segmentation.bin https://huggingface.co/Synthetai/whisperx-vad-segmentation/resolve/main/pytorch_model.bin",
            
            # Sisa setup file pendukung
            "mkdir -p /usr/share/fonts/truetype/custom",
            "wget -O /usr/share/fonts/truetype/custom/Anton-Regular.ttf https://github.com/google/fonts/raw/main/ofl/anton/Anton-Regular.ttf",
            "wget -O /usr/share/fonts/truetype/custom/Montserrat-Black.ttf https://raw.githubusercontent.com/google/fonts/main/ofl/montserratalternates/MontserratAlternates-Black.ttf",
            "fc-cache -f -v",
            "git clone https://github.com/Junhua-Liao/LR-ASD /asd",
            "sed -i 's/np.int)/int)/g' /asd/model/faceDetector/s3fd/box_utils.py",
            "mkdir -p /asd/model/faceDetector/s3fd",
            "cd /asd && gdown --id 1KafnHz7ccT-3IyddBsL5yi2xGtxAKypt -O model/faceDetector/s3fd/sfd_face.pth",
        ]
    )
)

app = modal.App("clipper", image=image)

volume = modal.Volume.from_name("clipper-modal-cache", create_if_missing=True)

# Use a fresh path for the cache volume to avoid mounting over non-empty defaults.
mount_path = "/root/clipper-cache/torch"


class TokenBucketRateLimiter:
    """
    Simple token bucket limiter to keep Gemini usage under TPM limits.
    """

    def __init__(self, tokens_per_minute: int, max_bucket: Optional[int] = None):
        self.tokens_per_minute = tokens_per_minute
        self.capacity = max_bucket or tokens_per_minute
        self.tokens = float(self.capacity)
        self.last_refill = time.time()
        self.lock = threading.Lock()

    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        refill_amount = (self.tokens_per_minute / 60.0) * elapsed
        self.tokens = min(self.capacity, self.tokens + refill_amount)
        self.last_refill = now

    def acquire(self, tokens: int):
        tokens = max(tokens, 1)
        while True:
            with self.lock:
                self._refill()
                if self.tokens >= tokens:
                    self.tokens -= tokens
                    return
                needed = tokens - self.tokens
                # Time to wait until enough tokens are available
                wait_time = needed / (self.tokens_per_minute / 60.0)
            time.sleep(max(wait_time, 0.05))


def estimate_tokens_from_text(text: str) -> int:
    """
    Rough token estimator (~4 chars per token for English-like text).
    """
    return max(1, len(text) // 4)


def parse_json_block(raw_text):
    """
    Extract a JSON array from a model response, handling fenced code blocks.
    """
    if not isinstance(raw_text, str):
        return []
    cleaned = raw_text.strip()
    fenced_match = re.search(r"```json(.*?)```", cleaned, re.DOTALL | re.IGNORECASE)
    if fenced_match:
        cleaned = fenced_match.group(1).strip()
    else:
        bracket_match = re.search(r"\[.*\]", cleaned, re.DOTALL)
        if bracket_match:
            cleaned = bracket_match.group(0).strip()
    # If it's a single object, wrap it.
    if cleaned.startswith("{") and cleaned.endswith("}"):
        try:
            obj = json.loads(cleaned)
            return [obj] if isinstance(obj, dict) else []
        except json.JSONDecodeError:
            pass
    try:
        data = json.loads(cleaned)
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def chunk_transcript_segments(transcript_segments: list, max_words_per_chunk: int = 3000):
    """
    Break transcript into word chunks to keep Gemini requests small.
    """
    chunks = []
    words = []
    start_time = None
    end_time = None

    for segment in transcript_segments:
        word = segment.get("word", "").strip()
        seg_start = segment.get("start")
        seg_end = segment.get("end")
        if not word or seg_start is None or seg_end is None:
            continue

        if start_time is None:
            start_time = seg_start
        end_time = seg_end
        words.append(word)

        if len(words) >= max_words_per_chunk:
            chunks.append({
                "text": " ".join(words),
                "start": float(start_time),
                "end": float(end_time)
            })
            words = []
            start_time = None
            end_time = None

    if words:
        chunks.append({
            "text": " ".join(words),
            "start": float(start_time) if start_time is not None else 0.0,
            "end": float(end_time) if end_time is not None else 0.0,
        })

    return chunks


def s3_load_json(client, bucket: str, key: str):
    try:
        obj = client.get_object(Bucket=bucket, Key=key)
        body = obj["Body"].read()
        return json.loads(body.decode("utf-8"))
    except Exception:
        return None


def s3_upload_json(client, bucket: str, key: str, data):
    try:
        payload = json.dumps(data).encode("utf-8")
        client.put_object(Bucket=bucket, Key=key, Body=payload, ContentType="application/json")
    except Exception as exc:
        print(f"Failed to cache JSON to s3://{bucket}/{key}: {exc}")


def get_video_duration(video_path: pathlib.Path) -> Optional[float]:
    """
    Return video duration in seconds using ffprobe. None if unavailable.
    """
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(video_path),
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        return float(result.stdout.strip())
    except Exception as exc:
        print(f"Could not determine video duration for {video_path}: {exc}")
        return None

def create_vertical_video(tracks, scores, pyframes_path, pyavi_path, audio_path, output_path, framerate=25):
    import cv2
    import numpy as np

    target_width = 1080
    target_height = 1920

    flist = glob.glob(os.path.join(pyframes_path, "*.jpg"))
    flist.sort()

    if not flist:
        raise FileNotFoundError(f"No frames found in {pyframes_path}")

    faces = [[] for _ in range(len(flist))]

    for tidx, track in enumerate(tracks):
        if tidx >= len(scores):
            print(f"Skipping track {tidx}: score array missing")
            continue
        score_array = scores[tidx]
        for fidx, frame in enumerate(track["track"]["frame"].tolist()):
            slice_start = max(fidx - 30, 0)
            slice_end = min(fidx + 30, len(score_array))
            score_slice = score_array[slice_start:slice_end]
            avg_score = float(np.mean(score_slice)
                              if len(score_slice) > 0 else 0)

            frame_idx = int(frame)
            if frame_idx < 0 or frame_idx >= len(flist):
                print(f"Ignoring out-of-range frame index {frame_idx} for track {tidx}")
                continue

            faces[frame_idx].append(
                {'track': tidx, 'score': avg_score, 's': track['proc_track']["s"][fidx], 'x': track['proc_track']["x"][fidx], 'y': track['proc_track']["y"][fidx]})

    temp_video_path = os.path.join(pyavi_path, "video_only.mp4")

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    vout = cv2.VideoWriter(temp_video_path, fourcc, framerate, (target_width, target_height))
    if not vout.isOpened():
        raise RuntimeError("Failed to initialize video writer for vertical output.")

    for fidx, fname in enumerate(flist):
        img = cv2.imread(fname)
        if img is None:
            continue

        current_faces = faces[fidx]

        max_score_face = max(
            current_faces, key=lambda face: face['score']) if current_faces else None

        if max_score_face and max_score_face['score'] < 0:
            max_score_face = None

        if max_score_face:
            mode = "crop"
        else:
            mode = "resize"

        if mode == "resize":
            scale = target_width / img.shape[1]
            resized_height = int(img.shape[0] * scale)
            resized_image = cv2.resize(
                img, (target_width, resized_height), interpolation=cv2.INTER_AREA)

            scale_for_bg = max(
                target_width / img.shape[1], target_height / img.shape[0])
            bg_width = int(img.shape[1] * scale_for_bg)
            bg_heigth = int(img.shape[0] * scale_for_bg)

            blurred_background = cv2.resize(img, (bg_width, bg_heigth))
            blurred_background = cv2.GaussianBlur(
                blurred_background, (121, 121), 0)

            crop_x = (bg_width - target_width) // 2
            crop_y = (bg_heigth - target_height) // 2
            blurred_background = blurred_background[crop_y:crop_y +
                                                    target_height, crop_x:crop_x + target_width]

            center_y = (target_height - resized_height) // 2
            blurred_background[center_y:center_y +
                               resized_height, :] = resized_image

            vout.write(blurred_background.astype("uint8"))

        elif mode == "crop":
            scale = target_height / img.shape[0]
            resized_image = cv2.resize(
                img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
            frame_width = resized_image.shape[1]

            center_x = int(
                max_score_face["x"] * scale if max_score_face else frame_width // 2)
            top_x = max(min(center_x - target_width // 2,
                        frame_width - target_width), 0)

            image_cropped = resized_image[0:target_height,
                                          top_x:top_x + target_width]

            vout.write(image_cropped.astype("uint8"))

    if vout:
        vout.release()

    ffmpeg_command = (f"ffmpeg -y -i {temp_video_path} -i {audio_path} "
                      f"-c:v h264 -preset fast -crf 23 -c:a aac -b:a 128k "
                      f"{output_path}")
    subprocess.run(ffmpeg_command, shell=True, check=True, text=True)

def create_subtitles_with_ffmpeg(transcript_segments: list, clip_start: float, clip_end: float, clip_video_path: str, output_path: str, max_words: int = 3):
    temp_dir = os.path.dirname(output_path)
    subtitle_path = os.path.join(temp_dir, "temp_subtitles.ass")
    os.makedirs(temp_dir, exist_ok=True)

    clip_segments = [segment for segment in transcript_segments
                     if segment.get("start") is not None
                     and segment.get("end") is not None
                     and segment.get("end") > clip_start
                     and segment.get("start") < clip_end
                     ]

    subtitles = []
    current_words = []
    current_start = None
    current_end = None

    for segment in clip_segments:
        word = segment.get("word", "").strip()
        seg_start = segment.get("start")
        seg_end = segment.get("end")

        if not word or seg_start is None or seg_end is None:
            continue

        start_rel = max(0.0, seg_start - clip_start)
        end_rel = min(max(0.0, seg_end - clip_start), clip_end - clip_start)

        if end_rel <= 0 or end_rel <= start_rel:
            continue

        if not current_words:
            current_start = start_rel
            current_end = end_rel
            current_words = [word]
        elif len(current_words) >= max_words:
            subtitles.append(
                (current_start, current_end, ' '.join(current_words)))
            current_words = [word]
            current_start = start_rel
            current_end = end_rel
        else:
            current_words.append(word)
            current_end = end_rel

    if current_words:
        subtitles.append(
            (current_start, current_end, ' '.join(current_words)))

    if not subtitles:
        shutil.copy(clip_video_path, output_path)
        return

    def format_ass_timestamp(seconds: float) -> str:
        total_centiseconds = max(0, int(seconds * 100))
        hours = total_centiseconds // 360000
        minutes = (total_centiseconds // 6000) % 60
        secs = (total_centiseconds // 100) % 60
        centis = total_centiseconds % 100
        return f"{hours:d}:{minutes:02d}:{secs:02d}.{centis:02d}"

    style_header = [
        "[Script Info]",
        "ScriptType: v4.00+",
        "WrapStyle: 0",
        "ScaledBorderAndShadow: yes",
        "PlayResX: 1080",
        "PlayResY: 1920",
        "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        "Style: HormoziStyle,Anton,80,&H0000FFFF,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,4,0,2,0,0,550,0",
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]

    dialogue_lines = [
        f"Dialogue: 0,{format_ass_timestamp(start)},{format_ass_timestamp(end)},HormoziStyle,,0,0,0,,{text.upper()}"
        for start, end, text in subtitles
    ]

    with open(subtitle_path, "w", encoding="utf-8") as sub_file:
        sub_file.write("\n".join(style_header + dialogue_lines))

    ffmpeg_cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(clip_video_path),
        "-vf",
        f"ass={subtitle_path}",
        "-c:v",
        "h264",
        "-preset",
        "fast",
        "-crf",
        "23",
        str(output_path),
    ]

    subprocess.run(ffmpeg_cmd, check=True)

def process_clip(base_dir: str, original_video_path: str, s3_key: str, start_time: float, end_time: float, clip_index: int, transcript_segments: list, video_duration: Optional[float] = None):
    print(f"[Clip {clip_index}] Requested segment start={start_time} end={end_time}")
    try:
        clip_start = float(start_time)
        clip_end = float(end_time)
    except (TypeError, ValueError):
        print(f"Skipping clip {clip_index}: invalid timestamps start={start_time} end={end_time}")
        return

    # Clamp to video duration to avoid invalid segments.
    if video_duration is not None:
        clip_start = max(0.0, min(clip_start, video_duration))
        clip_end = max(clip_start, min(clip_end, video_duration))
    else:
        clip_start = max(0.0, clip_start)
        clip_end = max(clip_start, clip_end)

    if clip_end - clip_start < 0.5:
        print(f"Skipping clip {clip_index}: duration too short after clamping start={clip_start} end={clip_end}")
        return

    clip_name = f"clip_{clip_index}"
    s3_key_dir = os.path.dirname(s3_key)
    output_s3_key = f"{s3_key_dir}/{clip_name}.mp4"
    print(f"Output s3_key: {output_s3_key}")

    base_dir = pathlib.Path(base_dir).resolve()
    original_video_path = pathlib.Path(original_video_path).resolve()

    clip_dir = (base_dir / clip_name).resolve()
    clip_dir.mkdir(parents=True, exist_ok=True)

    clip_segments_path = (clip_dir / f"{clip_name}_segment.mp4").resolve()
    clip_segments_backup_path = (base_dir / f"{clip_name}_segment_backup.mp4").resolve()
    vertical_mp4_path = (clip_dir / "pyavi" / "video_out_vertical.mp4").resolve()
    subtitle_output_path = (clip_dir / "pyavi"/ "video_with_subtitles.mp4").resolve()

    (clip_dir / "pywork").mkdir(exist_ok=True)
    pyframes_path = (clip_dir / "pyframes").resolve()
    pyavi_path = (clip_dir / "pyavi").resolve()
    audio_path = (clip_dir / "pyavi" / "audio.wav").resolve()

    pyframes_path.mkdir(exist_ok=True)
    pyavi_path.mkdir(exist_ok=True)

    duration = clip_end - clip_start
    cut_command = (
        f"ffmpeg -y -ss {clip_start} -t {duration} -i {original_video_path} "
        f"-c copy {clip_segments_path}"
    )
    try:
        subprocess.run(cut_command, shell=True, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as exc:
        print(f"[Clip {clip_index}] ffmpeg segment extraction failed: {exc.stderr or exc.stdout}")
        return

    if not clip_segments_path.exists() or clip_segments_path.stat().st_size == 0:
        print(f"[Clip {clip_index}] Segment file missing after ffmpeg: {clip_segments_path}")
        return
    print(f"[Clip {clip_index}] Segment created at {clip_segments_path.resolve()} (exists={clip_segments_path.exists()}) size={clip_segments_path.stat().st_size} bytes duration ~{duration:.2f}s")
    # Keep a backup outside clip_dir to survive any downstream cleanup.
    try:
        shutil.copy2(clip_segments_path, clip_segments_backup_path)
        print(f"[Clip {clip_index}] Backup of segment stored at {clip_segments_backup_path}")
    except Exception as exc:
        print(f"[Clip {clip_index}] Failed to create segment backup: {exc}")

    extract_audio_cmd = f"ffmpeg -i {clip_segments_path} -vn -acodec pcm_s16le -ar 16000 -ac 1 {audio_path}"
    try:
        subprocess.run(extract_audio_cmd, shell=True, check=True, capture_output=True)
    except subprocess.CalledProcessError as exc:
        print(f"[Clip {clip_index}] ffmpeg audio extraction failed: {exc.stderr or exc.stdout}")
        return

    shutil.copy(clip_segments_path, base_dir / f"{clip_name}.mp4")

    # PATH TETAP /asd (karena sudah di-clone ke /asd)
    columbia_cmd = (
        f"python Columbia_test.py --videoName {clip_name} "
        f"--videoFolder {str(base_dir)} "
        f"--pretrainModel weight/finetuning_TalkSet.model"
    )
    
    columbia_start_time = time.time()
    # CWD TETAP /asd
    if not clip_segments_path.exists():
        print(f"[Clip {clip_index}] Skipping Columbia pipeline; segment missing at {clip_segments_path}")
        return
    columbia_result = subprocess.run(
        columbia_cmd,
        cwd="/asd",
        shell=True,
        capture_output=True,
        text=True,
    )
    if columbia_result.returncode != 0:
        print(
            f"[Clip {clip_index}] Columbia pipeline failed (exit {columbia_result.returncode}). "
            f"stdout: {columbia_result.stdout} stderr: {columbia_result.stderr}"
        )
        return

    columbia_end_time = time.time()
    print(
        f"Columbia script completed in {columbia_end_time - columbia_start_time:.2f} seconds"
    )

    # Verify segment survived Columbia pipeline; restore from backup if needed.
    if not clip_segments_path.exists():
        print(f"[Clip {clip_index}] Segment missing after Columbia; attempting restore from backup {clip_segments_backup_path}")
        if clip_segments_backup_path.exists():
            try:
                shutil.copy2(clip_segments_backup_path, clip_segments_path)
                print(f"[Clip {clip_index}] Restored segment from backup.")
            except Exception as exc:
                print(f"[Clip {clip_index}] Failed to restore segment from backup: {exc}")
                return
        else:
            print(f"[Clip {clip_index}] Backup not found; cannot proceed without segment.")
            return

    tracks_path = clip_dir / "pywork" / "tracks.pckl"
    scores_path = clip_dir / "pywork" / "scores.pckl"
    if not tracks_path.exists() or not scores_path.exists():
        print(f"[Clip {clip_index}] Tracks or scores not found; skipping clip.")
        return
    
    with open(tracks_path, "rb") as f:
        tracks = pickle.load(f)
        
    with open(scores_path, "rb") as f:
        scores = pickle.load(f)

    print(f"Extracting frames to {pyframes_path}...")
    if not clip_segments_path.exists():
        print(f"[Clip {clip_index}] Cannot extract frames; segment missing at {clip_segments_path}")
        return
    extract_frames_cmd = (
    f"ffmpeg -i {clip_segments_path} "
    f"-vf fps=25 "  # Pastikan fps sama dengan framerate script (25)
    f"-qscale:v 2 " # Kualitas gambar tinggi
    f"{pyframes_path}/%06d.jpg"
    )
    
    try:
        subprocess.run(extract_frames_cmd, shell=True, check=True)
    except subprocess.CalledProcessError as exc:
        print(f"[Clip {clip_index}] ffmpeg frame extraction failed: {exc.stderr or exc.stdout}")
        return

    cv_start_time = time.time()
    create_vertical_video(
        tracks, scores, pyframes_path, pyavi_path, audio_path, vertical_mp4_path, 
    )
    cv_end_time = time.time()
    print(f"Clip {clip_index} vertical video creation time: {cv_end_time - cv_start_time:.2f} seconds")

    create_subtitles_with_ffmpeg(transcript_segments, clip_start, clip_end, vertical_mp4_path, subtitle_output_path, max_words=5)

    import boto3

    s3_client = boto3.client("s3")
    s3_client.upload_file(
    subtitle_output_path, "clipper-demo-bucket", output_s3_key)
    print(f"[Clip {clip_index}] Upload complete: s3://clipper-demo-bucket/{output_s3_key}")

@app.cls(
    gpu="L40S",
    timeout=900,
    retries=0,
    scaledown_window=20,
    image=image,
    secrets=[modal.Secret.from_name("clipper-secret")],
    # volumes={mount_path: volume},
    # env={"TORCH_HOME": mount_path, "HF_HOME": mount_path},
)
class Clipper:
    @modal.enter()
    def load_model(self):
        import torch
        import torchaudio
        import whisperx
        from google import genai

        # Ensure torch is globally available for any imported modules that expect a global binding.
        globals()["torch"] = torch
        import builtins
        builtins.torch = torch

        print("loading models...")
        print("torch:", torch.__version__)
        print("torchaudio:", torchaudio.__version__)

        self.whisperx = whisperx
        self.whisperx_model = whisperx.load_model(
            "large-v2",
            device="cuda",
            compute_type="float16",
        )
        self.alignment_model, self.metadata = whisperx.load_align_model(
            language_code="en",
            device="cuda",
        )

        self.rate_limiter = TokenBucketRateLimiter(
            tokens_per_minute=int(os.getenv("GEMINI_TOKENS_PER_MINUTE", "240000")),
            max_bucket=int(os.getenv("GEMINI_MAX_BUCKET", "240000")),
        )

        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise RuntimeError("GEMINI_API_KEY is missing; ensure the secret is configured in Modal.")
        self.gemini_client = genai.Client(
            api_key=gemini_api_key,
            http_options={"api_version": "v1"},
        )
        print("Models and Gemini client ready.")

    def transcribe_video(self, base_dir: pathlib.Path, video_path: pathlib.Path) -> str:
        audio_path = base_dir / "audio.wav"
        extract_command = f"ffmpeg -i {video_path} -vn -acodec pcm_s16le -ar 16000 -ac 1 {audio_path}"
        subprocess.run(extract_command, shell=True, check=True, capture_output=True)

        print("Starting transcription with whisperx ...")

        audio = self.whisperx.load_audio(str(audio_path))
        result = self.whisperx_model.transcribe(audio, batch_size=16)

        result = self.whisperx.align(
            result["segments"],
            self.alignment_model,
            self.metadata,
            audio,
            device="cuda",
            return_char_alignments=False,
        )

        start_time = time.time()
        duration = time.time() - start_time
        print(f"Done in {duration} seconds!")

        segments = []

        if "word_segments" in result:
            for word_segment in result["word_segments"]:
                if not all(key in word_segment for key in ("start", "end", "word")):
                    continue
                segments.append({
                    "start": word_segment["start"],
                    "end": word_segment["end"],
                    "word": word_segment["word"],
                })

        return json.dumps(segments)

    def identify_moments(self, transcript: list, s3_key: Optional[str] = None):
        """
        Identify top moments using a token-capped map/reduce flow to avoid TPM spikes.
        """
        model_name = "models/gemini-2.5-flash"
        map_chunks = chunk_transcript_segments(transcript, max_words_per_chunk=3000)

        if not map_chunks:
            return "[]"

        map_candidates = []
        map_prompt_template = """
You are a professional video editor for viral TikTok/Reels/Shorts.
Given a transcript chunk from the FULL video between {start:.2f}s and {end:.2f}s,
propose up to 2 candidate clips that would perform well.

Rules (be concise):
- Clip length 30-60 seconds.
- Start with a strong hook.
- Must be self-contained (beginning, middle, end).
- Use ABSOLUTE timestamps relative to the original video timeline (not the chunk).
- Return ONLY JSON array. Fields: start (float), end (float), summary (string), viral_score (1-100).
- If unsure, return [].
Example: [{{"start": 120.5, "end": 155.0, "summary": "Why AI will replace coders", "viral_score": 95}}]

Transcript:
"""

        for chunk in map_chunks:
            chunk_prompt = map_prompt_template.format(start=chunk["start"], end=chunk["end"])
            payload_text = chunk_prompt + chunk["text"]
            tokens_in = estimate_tokens_from_text(payload_text)
            self.rate_limiter.acquire(tokens_in)
            try:
                response = self.gemini_client.models.generate_content(
                    model=model_name,
                    contents=payload_text,
                    config={"max_output_tokens": 512},
                )
                response_text = getattr(response, "text", "") or ""
                parsed = parse_json_block(response_text)
                print(f"Map raw Gemini response ({chunk['start']}-{chunk['end']}): {response_text[:200]}")
                if parsed:
                    map_candidates.extend(parsed)
                else:
                    print(f"Map step returned no clips for chunk {chunk['start']}-{chunk['end']}")
            except Exception as exc:
                print(f"identify_moments map step failed for chunk {chunk['start']}-{chunk['end']}: {exc}")
                continue

        if not map_candidates:
            # Fallback: build a single clip using transcript timing to avoid empty results.
            try:
                transcript_start = float(transcript[0].get("start", 0.0)) if transcript else 0.0
                transcript_end = float(transcript[-1].get("end", 0.0)) if transcript else 60.0
                clip_start = max(0.0, transcript_start)
                clip_end = min(transcript_end, clip_start + 55.0)
                fallback = [{
                    "start": clip_start,
                    "end": clip_end if clip_end > clip_start else clip_start + 45.0,
                    "summary": "Auto clip (fallback)",
                    "viral_score": 50,
                }]
                print("Map step empty; using fallback clip from transcript bounds")
                return json.dumps(fallback)
            except Exception as exc:
                print(f"Fallback clip creation failed: {exc}")
                return "[]"

        # Reduce step to pick the best clips from all candidates.
        # Limit the number of candidates sent to reduce token usage.
        limited_candidates = map_candidates[:20]
        reduce_prompt = f"""
You are ranking candidate clips for a short-form edit.
Pick the top 3 clips by viral_score and tighten start/end to the best hook within 30-60s.
Return STRICT JSON array with fields: start, end, summary, viral_score (1-100).
Candidates (JSON): {json.dumps(limited_candidates)}
"""
        tokens_in = estimate_tokens_from_text(reduce_prompt)
        self.rate_limiter.acquire(tokens_in)
        try:
            response = self.gemini_client.models.generate_content(
                model=model_name,
                contents=reduce_prompt,
                config={"max_output_tokens": 512},
            )
            response_text = getattr(response, "text", "") or ""
            print(f"Identified moments response: {response_text}")
            return response_text or json.dumps(limited_candidates[:3])
        except Exception as exc:
            print(f"identify_moments reduce step failed: {exc}")
            return json.dumps(limited_candidates[:3])
    
    @modal.fastapi_endpoint(method="POST")
    async def process_video(self, request: Request):
        from fastapi import HTTPException, status
        from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
        import boto3

        bearer = HTTPBearer(auto_error=False)
        credentials: HTTPAuthorizationCredentials | None = await bearer(request)  # type: ignore[arg-type]
        token_value = credentials.credentials if credentials else None

        env_token = os.getenv("TOKEN")
        if not env_token:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server token is not configured",
            )

        if token_value != env_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect Bearer token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        payload = await request.json()
        s3_key = payload.get("s3_key") if isinstance(payload, dict) else None
        if not s3_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing s3_key in request body",
            )

        run_id = str(uuid.uuid4())
        base_dir = pathlib.Path("/tmp/" + run_id)
        base_dir.mkdir(parents=True, exist_ok=True)

        video_path = base_dir / "input.mp4"
        s3_client = boto3.client("s3")
        s3_client.download_file("clipper-demo-bucket", s3_key, str(video_path))

        video_duration = get_video_duration(video_path)
        transcript_segments_json = self.transcribe_video(base_dir, video_path)
        transcript_segments = json.loads(transcript_segments_json)

        print("Identifying clip moments")
        cache_bucket = os.getenv("CLIPPER_CACHE_BUCKET", "clipper-demo-bucket")
        moments_cache_key = f"{s3_key}.moments.json"
        using_moments_cache = False

        cached_moments = s3_load_json(s3_client, cache_bucket, moments_cache_key)
        if cached_moments:
            print(f"Using cached moments from s3://{cache_bucket}/{moments_cache_key}")
            identify_moments_raw = json.dumps(cached_moments)
            using_moments_cache = True
        else:
            identify_moments_raw = self.identify_moments(transcript_segments, s3_key=s3_key)

        try:
            clip_moments = parse_json_block(identify_moments_raw)
            if not clip_moments:
                print("Error, moments not in the list")
        except Exception as exc:
            print(f"Failed to decode moments JSON: {exc} | raw='{identify_moments_raw[:200]}'")
            clip_moments = []

        clean_clip_moments = []
        for m in clip_moments:
            if isinstance(m, dict) and "start" in m and "end" in m:
                clean_clip_moments.append(m)
            else:
                print(f"Skipping malformed moment: {m}")

        try:
            clean_clip_moments.sort(key=lambda x: x.get('viral_score', 0), reverse=True)
        except Exception as exc:
            print(f"Failed to sort moments: {exc}")

        if clean_clip_moments and not using_moments_cache:
            s3_upload_json(s3_client, cache_bucket, moments_cache_key, clean_clip_moments)

        max_clips = 3
        print(f"Found {len(clip_moments)} moments, processing top {max_clips}...")

        for index, moment in enumerate(clean_clip_moments[:max_clips]):
            print("Processing clip "+ str(index) + " (Score: " + str(moment.get('viral_score', 'N/A')) + ")")
            process_clip(base_dir, video_path, s3_key, moment["start"], moment["end"], index, transcript_segments, video_duration)

        if base_dir.exists():
            print(f"Cleaning up temp dir after {base_dir}")
            shutil.rmtree(base_dir, ignore_errors=True)


@app.local_entrypoint()
def main():
    try:
        import requests  # Lightweight convenience for local smoke test.
    except ImportError:
        print("requests is not installed locally. Run `modal run backend/main.py` or install requests to use the local entrypoint.")
        return

    clipper = Clipper()

    url = clipper.process_video.get_web_url()

    payload = {
        "s3_key": "test1/input5min.mp4"
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 123123"
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    results = response.json()
    print(results)
