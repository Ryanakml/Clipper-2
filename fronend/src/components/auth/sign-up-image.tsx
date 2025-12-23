import {
  CheckCircle2,
  Play,
  Type,
  Zap,
  Sparkles,
  FileVideo,
} from "lucide-react";

export function SignupImage() {
  return (
    <div className="relative hidden h-full w-full flex-col items-center justify-center overflow-hidden border-l border-slate-100 bg-slate-50 p-10 md:flex dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. Background Accents (Adapted for Dark Mode) */}
      <div className="absolute top-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-purple-200/30 blur-[100px] dark:bg-purple-900/20" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-orange-200/30 blur-[80px] dark:bg-orange-900/20" />

      {/* Grid Pattern (Opacity adjusted for Dark Mode) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-20" />

      {/* 2. Main Abstract Container */}
      <div className="relative z-10 w-full max-w-sm">
        {/* THE CARD: "Export Ready" Simulation */}
        <div className="group rotate-[-2deg] transform rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:rotate-0 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          {/* Card Header: Processing Status */}
          <div className="mb-5 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200 transition-colors group-hover:bg-red-400 dark:bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200 transition-colors group-hover:bg-amber-400 dark:bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200 transition-colors group-hover:bg-green-400 dark:bg-zinc-700" />
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1 dark:border-green-500/20 dark:bg-green-500/10">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <span className="text-[10px] font-bold tracking-wide text-green-700 uppercase dark:text-green-400">
                Ready to Export
              </span>
            </div>
          </div>

          {/* Main Content: Thumbnail & Features */}
          <div className="flex gap-5">
            {/* Left: Video Thumbnail 9:16 (Result) */}
            <div className="relative h-48 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-inner dark:border-zinc-700 dark:bg-zinc-800">
              {/* Mockup Gradient Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-300 transition-transform duration-700 group-hover:scale-110 dark:from-zinc-800 dark:to-zinc-700" />

              {/* Center Play Button */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm dark:bg-zinc-200">
                  <Play className="ml-0.5 h-4 w-4 fill-slate-900 text-slate-900 dark:fill-zinc-900 dark:text-zinc-900" />
                </div>
              </div>

              {/* Visualisasi Captions (Garis-garis teks di bawah) */}
              <div className="absolute right-2 bottom-3 left-2 flex flex-col items-center gap-1">
                <div className="h-1 w-full rounded-full bg-slate-400/80 dark:bg-zinc-500" />
                <div className="h-1 w-2/3 rounded-full bg-slate-400/60 dark:bg-zinc-600" />
              </div>
            </div>

            {/* Right: Feature Checklist */}
            <div className="flex flex-1 flex-col justify-between py-1">
              <div className="space-y-3">
                {/* File Info */}
                <div className="mb-2 flex items-center gap-2">
                  <FileVideo className="h-4 w-4 text-slate-400 dark:text-zinc-600" />
                  <div className="h-3 w-20 rounded-full bg-slate-100 dark:bg-zinc-800" />
                </div>

                {/* Feature 1: AI Selection */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      Smart Highlights
                    </p>
                    <p className="text-[10px] leading-tight text-slate-400 dark:text-zinc-500">
                      Momen terbaik dipilih AI
                    </p>
                  </div>
                </div>

                {/* Feature 2: Auto Captions */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Type className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      Auto Captions
                    </p>
                    <p className="text-[10px] leading-tight text-slate-400 dark:text-zinc-500">
                      Subtitle otomatis akurat
                    </p>
                  </div>
                </div>

                {/* Feature 3: Speed */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-orange-50 p-1.5 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      Fast Render
                    </p>
                    <p className="text-[10px] leading-tight text-slate-400 dark:text-zinc-500">
                      Selesai dalam detik
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fake Download Button */}
          <div className="mt-6">
            <div className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-black dark:bg-white dark:text-zinc-950 dark:shadow-none dark:hover:bg-zinc-200">
              Download Clip .MP4
            </div>
          </div>
        </div>

        {/* Bottom Copywriting */}
        <div className="mt-10 space-y-1 text-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Satu klik, jadi konten.
          </h3>
          <p className="mx-auto max-w-xs text-sm text-slate-500 dark:text-zinc-400">
            Upload video panjang, biarkan AI memotong, memberi caption, dan
            memilih momen viralnya.
          </p>
        </div>
      </div>
    </div>
  );
}
