"use client";

import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  Wand2,
  Download,
  Play,
  FileVideo,
  MousePointer2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ProductDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Durasi per slide (ms)
  const STEP_DURATION = 4000;

  // --- LOGIC AUTO PLAY ---
  useEffect(() => {
    const stepTimer = setTimeout(() => {
      setActiveStep((s) => (s + 1) % 3);
      setProgress(0);
    }, STEP_DURATION);

    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1));
    }, STEP_DURATION / 100);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, []);

  // Handle klik manual pada tab
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-0">
      {/* Browser Window Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
        {/* --- 1. TOP BAR: PROGRESS TIMELINE --- */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 p-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
          {/* Traffic Lights */}
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/80"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/80"></div>
          </div>

          {/* Steps Timeline */}
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-200/50 p-1 md:gap-2 dark:bg-zinc-800/50">
            {[
              { id: 0, label: "1. Upload", icon: UploadCloud },
              { id: 1, label: "2. Proses AI", icon: Wand2 },
              { id: 2, label: "3. Hasil Clip", icon: Play },
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`relative flex items-center gap-1.5 overflow-hidden rounded-md px-3 py-1.5 text-[10px] font-medium whitespace-nowrap transition-all duration-300 md:text-xs ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-zinc-800 dark:text-white dark:ring-white/10"
                      : "text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  }`}
                >
                  {/* Background Progress Bar (Hanya di step aktif) */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-purple-500 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  <Icon className="relative z-10 h-3 w-3" />
                  <span className="relative z-10 hidden sm:inline">
                    {step.label}
                  </span>
                  <span className="relative z-10 inline sm:hidden">
                    {step.label.split(". ")[1]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="w-8 md:w-12"></div>
        </div>

        {/* --- 2. CONTENT AREA --- */}
        <div className="relative flex h-[350px] items-center justify-center overflow-hidden bg-slate-50/30 p-4 md:h-[420px] md:p-8 dark:bg-black/20">
          {/* STEP 0: UPLOAD SIMULATION */}
          {activeStep === 0 && <StepUpload progress={progress} />}

          {/* STEP 1: PROCESSING SIMULATION */}
          {activeStep === 1 && <StepProcessing progress={progress} />}

          {/* STEP 2: RESULT SIMULATION (3 CLIPS POP-UP) */}
          {activeStep === 2 && <StepResult />}
        </div>

        {/* Overlay Label "Auto Preview" */}
        <div className="pointer-events-none absolute right-4 bottom-3 z-30">
          <span className="rounded border border-slate-100 bg-white/50 px-2 py-1 font-mono text-[10px] text-slate-400 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/50 dark:text-zinc-600">
            AUTO PREVIEW
          </span>
        </div>
      </div>
    </div>
  );
}

// --- STEP 1: UPLOAD ANIMATION ---
function StepUpload({ progress }: { progress: number }) {
  const isDragging = progress > 15 && progress < 60;
  const isDropped = progress >= 60;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Dropzone Area */}
      <div
        className={`flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-500 ${
          isDropped
            ? "border-green-500 bg-green-50/50 dark:border-green-500/50 dark:bg-green-900/20"
            : isDragging
              ? "scale-[1.02] border-purple-400 bg-purple-50/30 dark:bg-purple-900/20"
              : "border-slate-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
        }`}
      >
        {isDropped ? (
          <div className="animate-in fade-in zoom-in flex flex-col items-center duration-300">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 md:h-16 md:w-16 dark:bg-green-500/20">
              <CheckCircle2 className="h-7 w-7 text-green-600 md:h-8 md:w-8 dark:text-green-400" />
            </div>
            <p className="text-sm font-semibold text-green-700 md:text-base dark:text-green-400">
              File Uploaded!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 md:h-14 md:w-14 dark:bg-zinc-800">
              <UploadCloud className="h-6 w-6 text-slate-400 md:h-7 md:w-7 dark:text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 md:text-base dark:text-slate-200">
              Drop file here
            </h3>
          </>
        )}
      </div>

      {/* --- FAKE CURSOR & FILE --- */}
      {!isDropped && (
        <div
          className="pointer-events-none absolute z-20 transition-all duration-[2000ms] ease-in-out"
          style={{
            top: isDragging ? "50%" : "80%",
            left: isDragging ? "50%" : "80%",
            transform: "translate(-50%, -50%)",
            opacity: progress < 5 ? 0 : 1,
          }}
        >
          <MousePointer2 className="absolute -top-2 -left-2 z-30 h-6 w-6 fill-white text-black drop-shadow-md" />

          <div
            className={`flex w-40 items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-xl transition-transform md:w-48 md:p-3 dark:border-zinc-700 dark:bg-zinc-800 ${isDragging ? "scale-110 rotate-3" : "scale-100"}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-100 dark:bg-purple-900/30">
              <FileVideo className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-xs">
              <p className="truncate font-semibold text-slate-700 dark:text-slate-200">
                podcast_full.mp4
              </p>
              <p className="text-slate-400 dark:text-zinc-500">250 MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STEP 2: PROCESSING ANIMATION ---
function StepProcessing({ progress }: { progress: number }) {
  const aiProgress = Math.min(Math.round(progress * 1.2), 100);

  return (
    <div className="w-full max-w-sm px-4 text-center">
      <div className="relative mx-auto mb-6 h-16 w-16 md:h-20 md:w-20">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-zinc-800"></div>
        <div
          className="absolute inset-0 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"
          style={{ animationDuration: "1s" }}
        ></div>
        <Wand2 className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-purple-600 md:h-8 md:w-8" />
      </div>

      <h3 className="mb-2 text-base font-bold text-slate-900 md:text-lg dark:text-white">
        AI Sedang Bekerja...
      </h3>

      <p className="mb-6 h-5 text-xs text-slate-500 md:text-sm dark:text-zinc-400">
        {progress < 30 && "Menganalisis Konteks Audio..."}
        {progress >= 30 && progress < 60 && "Memotong Bagian Viral..."}
        {progress >= 60 && progress < 90 && "Menambahkan Subtitle ID..."}
        {progress >= 90 && "Finalizing Clips..."}
      </p>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-orange-500 transition-all duration-300 ease-out"
          style={{ width: `${aiProgress}%` }}
        ></div>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-400 md:text-xs dark:text-zinc-500">
        <span>Processing</span>
        <span>{aiProgress}%</span>
      </div>
    </div>
  );
}

// --- STEP 3: RESULT ANIMATION (3 POP-UP CLIPS) ---
function StepResult() {
  const clips = [
    { title: "Momen Lucu", score: 98, color: "bg-green-100 text-green-700" },
    { title: "Insight Bisnis", score: 92, color: "bg-blue-100 text-blue-700" },
    {
      title: "Quote Motivasi",
      score: 89,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h3 className="animate-in fade-in slide-in-from-top-2 mb-6 text-sm font-semibold text-slate-500 dark:text-zinc-400">
        <Sparkles className="mr-1 inline h-4 w-4 text-orange-500" />3 Clips
        Generated
      </h3>

      {/* Grid 3 Kartu */}
      <div className="flex w-full items-center justify-center gap-3 md:gap-6">
        {clips.map((clip, idx) => (
          <div
            key={idx}
            className="group animate-in zoom-in-50 slide-in-from-bottom-8 fade-in fill-mode-both relative cursor-pointer"
            style={{ animationDelay: `${idx * 150}ms` }} // Efek Pop-up berurutan
          >
            {/* Video Card */}
            <div
              className={`w-24 transform overflow-hidden rounded-xl border-2 border-white bg-black shadow-xl transition-transform duration-300 md:w-32 dark:border-zinc-700 ${idx === 1 ? "z-10 scale-110" : "scale-90 opacity-80 hover:scale-100 hover:opacity-100"} `}
            >
              {/* Mockup Thumbnail */}
              <div className="relative aspect-[9/16] bg-zinc-800">
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-60 ${
                    idx === 0
                      ? "from-green-900/40 to-black"
                      : idx === 1
                        ? "from-purple-900/40 to-black"
                        : "from-blue-900/40 to-black"
                  }`}
                ></div>

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <Play className="ml-0.5 h-3 w-3 fill-white text-white" />
                  </div>
                </div>

                {/* Caption Mockup */}
                <div className="absolute right-2 bottom-6 left-2 text-center">
                  <div className="mb-1 h-1 w-full rounded-full bg-white/80"></div>
                  <div className="mx-auto h-1 w-2/3 rounded-full bg-white/60"></div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-white p-2 text-center dark:bg-zinc-800">
                <div className="mb-1 flex justify-center">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${clip.color}`}
                  >
                    SCORE {clip.score}
                  </span>
                </div>
                <p className="truncate text-[9px] font-medium text-slate-500 md:text-[10px] dark:text-zinc-400">
                  {clip.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button Action */}
      <div className="animate-in fade-in mt-8 delay-500 duration-700">
        <button className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black">
          <Download className="h-3 w-3" />
          Download All
        </button>
      </div>
    </div>
  );
}
