import glob
import json
import pathlib
import pickle
import shutil
import subprocess
import time
import uuid
import boto3
import cv2
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import ffmpegcv
import modal
import numpy as np
from pydantic import BaseModel
import os
from google import genai
import torch, torchaudio

import pysubs2
from tqdm import tqdm
import whisperx

class ProcessVideoRequests(BaseModel):
    s3_key: str

image = (modal.Image.from_registry(
    "nvidia/cuda:12.4.0-devel-ubuntu22.04", add_python="3.10")
    .apt_install(["ffmpeg", "libgl1-mesa-glx", "wget", "libcudnn8", "libcudnn8-dev", "pkg-config", "libavcodec-dev", "libavformat-dev", "libavutil-dev", "libswscale-dev", "libavfilter-dev", "libavdevice-dev", "build-essential", "clang"])
    .pip_install_from_requirements("requirements.txt")
    .run_commands(["mkdir -p /usr/share/fonts/truetype/custom",
                   "wget -O /usr/share/fonts/truetype/custom/Anton-Regular.ttf https://github.com/google/fonts/raw/main/ofl/anton/Anton-Regular.ttf",
                   "fc-cache -f -v"])
    .add_local_dir("asd", "/asd", copy=True))

app = modal.App("clipper", image=image)

volume = modal.Volume.from_name(
    "clipper-modal-cache", create_if_missing=True
)

mount_path = "/root/.cache/torch"

auth_scheme = HTTPBearer()

def create_vertical_video(tracks, scores, pyframes_path, pyavi_path, audio_path, output_path, framerate=25):
    target_width = 1080
    target_height = 1920

    flist = glob.glob(os.path.join(pyframes_path, "*.jpg"))
    flist.sort()

    faces = [[] for _ in range(len(flist))]

    for tidx, track in enumerate(tracks):
        score_array = scores[tidx]
        for fidx, frame in enumerate(track["track"]["frame"].tolist()):
            slice_start = max(fidx - 30, 0)
            slice_end = min(fidx + 30, len(score_array))
            score_slice = score_array[slice_start:slice_end]
            avg_score = float(np.mean(score_slice)
                              if len(score_slice) > 0 else 0)

            faces[frame].append(
                {'track': tidx, 'score': avg_score, 's': track['proc_track']["s"][fidx], 'x': track['proc_track']["x"][fidx], 'y': track['proc_track']["y"][fidx]})

    temp_video_path = os.path.join(pyavi_path, "video_only.mp4")

    vout = None
    for fidx, fname in tqdm(enumerate(flist), total=len(flist), desc="Creating vertical video"):
        img = cv2.imread(fname)
        if img is None:
            continue

        current_faces = faces[fidx]

        max_score_face = max(
            current_faces, key=lambda face: face['score']) if current_faces else None

        if max_score_face and max_score_face['score'] < 0:
            max_score_face = None

        if vout is None:
            vout = ffmpegcv.VideoWriterNV(
                file=temp_video_path,
                codec=None,
                fps=framerate,
                resize=(target_width, target_height)
            )

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

            vout.write(blurred_background)

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

            vout.write(image_cropped)

    if vout:
        vout.release()

    ffmpeg_command = (f"ffmpeg -y -i {temp_video_path} -i {audio_path} "
                      f"-c:v h264 -preset fast -crf 23 -c:a aac -b:a 128k "
                      f"{output_path}")
    subprocess.run(ffmpeg_command, shell=True, check=True, text=True)

def create_subtitles_with_ffmpeg(transcript_segments: list, clip_start: float, clip_end: float, clip_video_path: str, output_path: str, max_words: int = 5):
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

    subs = pysubs2.SSAFile()

    subs.info["WrapStyle"] = 0
    subs.info["ScaledBorderAndShadow"] = "yes"
    subs.info["PlayResX"] = 1080
    subs.info["PlayResY"] = 1920
    subs.info["ScriptType"] = "v4.00+"

    style_name = "Default"
    new_style = pysubs2.SSAStyle()
    new_style.fontname = "Anton"
    new_style.fontsize = 140
    new_style.primarycolor = pysubs2.Color(255, 255, 255)
    new_style.outline = 2.0
    new_style.shadow = 2.0
    new_style.shadowcolor = pysubs2.Color(0, 0, 0, 128)
    new_style.alignment = 2
    new_style.marginl = 50
    new_style.marginr = 50
    new_style.marginv = 50
    new_style.spacing = 0.0

    subs.styles[style_name] = new_style

    for i, (start, end, text) in enumerate(subtitles):
        start_time = pysubs2.make_time(s=start)
        end_time = pysubs2.make_time(s=end)
        line = pysubs2.SSAEvent(
            start=start_time, end=end_time, text=text, style=style_name)
        subs.events.append(line)

    subs.save(subtitle_path)

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

def process_clip(base_dir: str, original_video_path: str, s3_key: str, start_time: float, end_time: float, clip_index: int, transcript_segments: list):
        clip_name = f"clip_{clip_index}"
        s3_key_dir = os.path.dirname(s3_key)
        output_s3_key = f"{s3_key_dir}/{clip_name}.mp4"
        print(f"Output s3_key: {output_s3_key}")

        clip_dir = base_dir / clip_name
        clip_dir.mkdir(parents=True, exist_ok=True)

        clip_segments_path = clip_dir / f"{clip_name}_segment.mp4"
        vertical_mp4_path = clip_dir / "pyavi" / "video_out_vertical.mp4"
        subtitle_output_path = clip_dir / "pyavi"/ "video_with_subtitles.mp4"

        (clip_dir / "pywork").mkdir(exist_ok=True)
        pyframes_path = clip_dir / "pyframes"
        pyavi_path = clip_dir / "pyavi"
        audio_path = clip_dir / "pyavi" / "audio.wav"

        pyframes_path.mkdir(exist_ok=True)
        pyavi_path.mkdir(exist_ok=True)

        duration = end_time - start_time
        cut_command = (
            f"ffmpeg -y -ss {start_time} -t {duration} -i {original_video_path} "
            f"-c copy {clip_segments_path}"
        )
        subprocess.run(cut_command, shell=True, check=True, capture_output=True, text=True)

        extract_audio_cmd = f"ffmpeg -i {clip_segments_path} -vn -acodec pcm_s16le -ar 16000 -ac 1 {audio_path}"
        subprocess.run(extract_audio_cmd, shell=True, check=True, capture_output=True)

        shutil.copy(clip_segments_path, base_dir / f"{clip_name}.mp4")

        columbia_cmd = (
            f"python Columbia_test.py --videoName {clip_name} "
            f"--videoFolder {str(base_dir)} "
            f"--pretrainModel weight/finetuning_TalkSet.model"
        )
        
        columbia_start_time = time.time()
        subprocess.run(columbia_cmd, cwd="/asd", shell=True)
        columbia_end_time = time.time()
        print(f"Columbia script completed in {columbia_end_time - columbia_start_time:.2f} seconds")

        tracks_path = clip_dir / "pywork" / "tracks.pckl"
        scores_path = clip_dir / "pywork" / "scores.pckl"
        if not tracks_path.exists() or not scores_path.exists():
            raise FileNotFoundError("Tracks or scores not found")
        
        with open(tracks_path, "rb") as f:
            tracks = pickle.load(f)
            
        with open(scores_path, "rb") as f:
            scores = pickle.load(f)

        cv_start_time = time.time()
        create_vertical_video(
            tracks, scores, pyframes_path, pyavi_path, audio_path, vertical_mp4_path, 
        )
        cv_end_time = time.time()
        print(f"Clip {clip_index} vertical video creation time: {cv_end_time - cv_start_time:.2f} seconds")

        create_subtitles_with_ffmpeg(transcript_segments, start_time, end_time, vertical_mp4_path, subtitle_output_path, max_words=5)

        s3_client = boto3.client("s3")
        s3_client.upload_file(
        subtitle_output_path, "clipper-demo-bucket", output_s3_key)

@app.cls(
    gpu="L40S", 
    timeout=900, 
    retries=0, 
    scaledown_window=20, 
    secrets=[modal.Secret.from_name("clipper-secret")], 
    volumes={mount_path: volume}
    )

class Clipper:
    @modal.enter()
    def load_model(self):
        print("loading models...")
        print("torch:", torch.__version__)
        print("torchaudio:", torchaudio.__version__)

        self.whisperx_model = whisperx.load_model(
            "large-v2",
            device="cuda", 
            compute_type="float16"
        )
        self.alignment_model, self.metadata = whisperx.load_align_model(
            language_code="en",
            device="cuda",
        )

        print(f"transcription model loaded successfully!")

        print("Creating gemini client")
        self.gemini_client = genai.Client(
            api_key=os.environ["GEMINI_API_KEY"],
            http_options={"api_version": "v1"},
        )
        print("Gemini client setup succesfully ")

    def transcribe_video(self, base_dir: str, video_path:str) -> dict: 
        audio_path = base_dir / "audio.wav"
        extract_command = f"ffmpeg -i {video_path} -vn -acodec pcm_s16le -ar 16000 -ac 1 {audio_path}"
        subprocess.run(extract_command, shell=True, check=True, capture_output=True)

        print("Starting transcription with whisperx ...")

        audio = whisperx.load_audio(str(audio_path))
        result = self.whisperx_model.transcribe(audio, batch_size=16, )

        result = whisperx.align(
            result["segments"],
            self.alignment_model, 
            self.metadata,
            audio,
            device="cuda",
            return_char_alignments=False
        )

        start_time = time.time()
        duration = time.time() - start_time
        print(f"Done in {duration} seconds!")

        segments = []

        if "word_segments" in result:
            for word_segment in result["word_segments"]:
                # Skip malformed entries that don't include required timing info
                if not all(key in word_segment for key in ("start", "end", "word")):
                    continue
                segments.append({
                    "start": word_segment["start"],
                    "end": word_segment["end"],
                    "word": word_segment["word"],
                })

        return json.dumps(segments)
    
    def identify_moments(self, transcript: dict):
        prompt = """This is a podcast video transcript consisting of word, along with each words's start and end time. I am looking to create clips between a minimum of 30 and maximum of 60 seconds long. The clip should never exceed 60 seconds. Your task is to find and extract stories, or question and their corresponding answers from the transcript. Each clip should begin with the question and conclude with the answer. It is acceptable for the clip to include a few additional sentences before a question if it aids in contextualizing the question.
        
        Please adhere to the following rules:
        - Ensure that clips do not overlap with one another.
        - Start and end timestamps of the clips should align perfectly with the sentence boundaries in the transcript.
        - Only use the start and end timestamps provided in the input. modifying timestamps is not allowed.
        - Format the output as a list of JSON objects, each representing a clip with 'start' and 'end' timestamps: [{"start": seconds, "end": seconds}, ...clip2, clip3]. The output should always be readable by the python json.loads function.
        - Aim to generate longer clips between 40-60 seconds, and ensure to include as much content from the context as viable.
        
        Avoid including:
        - Moments of greeting, thanking, or saying goodbye.
        - Non-question and answer interactions.
        
        If there are no valid clips to extract, the output should be an empty list [], in JSON format. Also readable by json.loads() in Python. The transcript is as follows:\n\n"""

        preferred_models = [
            "models/gemini-2.5-flash",
            "models/gemini-2.5-pro",
            "models/gemini-2.0-flash",
            "models/gemini-2.0-flash-001",
            "models/gemini-2.0-flash-lite-001",
            "models/gemini-2.0-flash-lite",
        ]

        for model_name in preferred_models:
            try:
                response = self.gemini_client.models.generate_content(
                    model=model_name,
                    contents=prompt + str(transcript),
                )
                print(f"Identified moments response: ${response.text}")
                return response.text
            except Exception as exc:
                print(f"identify_moments failed for {model_name}: {exc}")

        # As a last resort, list available models and try them in order
        try:
            available_models = [
                model.name
                for model in self.gemini_client.models.list(
                    config={"page_size": 20}
                )
            ]
            print(f"Available Gemini models: {available_models}")

            for model_name in available_models:
                try:
                    response = self.gemini_client.models.generate_content(
                        model=model_name,
                        contents=prompt + str(transcript),
                    )
                    print(f"Identified moments response with fallback {model_name}: ${response.text}")
                    return response.text
                except Exception as exc:
                    print(f"identify_moments failed for fallback {model_name}: {exc}")
        except Exception as list_exc:
            print(f"Failed to list Gemini models: {list_exc}")

        return "[]"
    
    @modal.fastapi_endpoint(method="POST")
    def process_video(self, requests: ProcessVideoRequests, token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
        s3_key = requests.s3_key

        if token.credentials != os.environ["TOKEN"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Icorrect Bearer tokens",
                headers={
                    "WWW-Authenticate": "Bearer"
                }
            )
        
        run_id = str(uuid.uuid4())
        base_dir = pathlib.Path("/tmp/" + run_id)
        base_dir.mkdir(parents=True, exist_ok=True)

        # Download video files
        video_path = base_dir / "input.mp4"
        s3_client = boto3.client("s3")
        s3_client.download_file("clipper-demo-bucket", s3_key, str(video_path))

        # Transcription
        transcript_segments_json = self.transcribe_video(base_dir, video_path)
        transcript_segments = json.loads(transcript_segments_json)

        # Identify moments for clip
        print("Identifying clip moments")
        identify_moments_raw = self.identify_moments(transcript_segments)

        clean_json_string = identify_moments_raw.strip()

        if clean_json_string.startswith("```json"):
            clean_json_string = clean_json_string[len("```json"):].strip()
        if clean_json_string.endswith("```"):
            clean_json_string = clean_json_string[:-len("```")].strip()

        try:
            clip_moments = json.loads(clean_json_string)
            if not clip_moments or not isinstance(clip_moments, list):
                print("Error, moments not in the list")
                clip_moments = []
        except json.JSONDecodeError as exc:
            print(f"Failed to decode moments JSON: {exc}")
            clip_moments = []

        print(clip_moments)

        # Process Clip
        for index, moment in enumerate(clip_moments[:1]):
            if "start" in moment and "end" in moment:
                print("Processing clip"+ str(index) + " from " + str(moment["start"]) + " to " + str(moment["end"]))
                process_clip(base_dir, video_path, s3_key, moment["start"], moment["end"], index, transcript_segments)

        
        if base_dir.exists():
            print(f"Cleaning up temp dir after {base_dir}")
            shutil.rmtree(base_dir, ignore_errors=True)


@app.local_entrypoint()
def main():
    import requests

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
