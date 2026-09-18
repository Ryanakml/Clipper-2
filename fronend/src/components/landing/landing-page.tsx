"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CirclePlay,
  Clapperboard,
  FileVideo,
  Menu,
  Scissors,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const workflow = [
  [
    "01",
    "Drop in your video",
    "Paste a YouTube link or upload an MP4. No editing timeline required.",
  ],
  [
    "02",
    "Let AI find the gold",
    "We score the moments that deserve to become their own post.",
  ],
  [
    "03",
    "Post while it is hot",
    "Review polished vertical clips, then download them ready for every feed.",
  ],
] as const;
const audiences = [
  {
    name: "Podcasters",
    eyebrow: "One episode. A full content week.",
    copy: "Turn conversations into high-retention moments your audience actually shares.",
    items: [
      "Speaker-aware framing",
      "Captioned soundbites",
      "Guest highlight packs",
    ],
  },
  {
    name: "Creators",
    eyebrow: "Make your long-form work harder.",
    copy: "Find the parts that hook viewers before you lose another afternoon in an editor.",
    items: [
      "Hook detection",
      "Platform-ready 9:16 crops",
      "Viral moment scoring",
    ],
  },
  {
    name: "Agencies",
    eyebrow: "Deliver more without a bigger edit queue.",
    copy: "A fast, repeatable way to turn client footage into short-form deliverables.",
    items: [
      "Batch-ready workflow",
      "Organised clip libraries",
      "Shareable client exports",
    ],
  },
];
const faqs = [
  [
    "What can I upload?",
    "Paste a YouTube URL or upload MP4 video files. Your workspace shows what is currently processing and what is ready to download.",
  ],
  [
    "How fast is it?",
    "Processing time depends on the source length and queue, but the workflow is designed to replace the manual hunt for good moments.",
  ],
  [
    "Can I review clips before exporting?",
    "Yes. Clipper puts the generated clips in one place so you can decide exactly what makes the final cut.",
  ],
  [
    "Will my exports have a watermark?",
    "Your export options depend on the plan you choose. The product makes this clear before you start a paid workflow.",
  ],
];

function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-semibold tracking-[-0.04em] text-white"
    >
      <span className="grid size-8 place-items-center rounded-[10px] bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-lg shadow-violet-500/25">
        <Scissors className="size-4 text-slate-950" strokeWidth={2.8} />
      </span>
      <span>
        clipper<span className="text-violet-300">.ai</span>
      </span>
    </Link>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [audience, setAudience] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);
  const selected = audiences[audience]!;
  return (
    <main className="landing-shell overflow-hidden bg-[#09090d] text-slate-100">
      <div className="landing-grid pointer-events-none absolute inset-x-0 top-0 h-[760px]" />
      <nav className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Wordmark />
        <div className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
          <a href="#how" className="hover:text-white">
            How it works
          </a>
          <a href="#made-for" className="hover:text-white">
            Made for you
          </a>
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-slate-300 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-100"
          >
            Start free
          </Link>
        </div>
        <button
          aria-label="Toggle navigation"
          className="grid size-10 place-items-center rounded-xl border border-white/10 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {menuOpen && (
        <div className="relative z-20 mx-5 mb-4 rounded-2xl border border-white/10 bg-[#12121a] p-4 md:hidden">
          <div className="grid gap-3 text-sm text-slate-300">
            <a href="#how" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#made-for" onClick={() => setMenuOpen(false)}>
              Made for you
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </a>
            <Link
              href="/sign-up"
              className="mt-2 rounded-xl bg-white px-4 py-2.5 text-center font-semibold text-slate-950"
            >
              Start free
            </Link>
          </div>
        </div>
      )}
      <section className="relative mx-auto max-w-7xl px-5 pt-16 pb-24 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
            <Sparkles className="size-3.5" /> AI video repurposing, without the
            editing slog
          </div>
          <h1 className="text-5xl leading-[0.98] font-semibold tracking-[-0.065em] text-balance text-white sm:text-6xl lg:text-8xl">
            Your best moments
            <br />
            <span className="landing-gradient">already exist.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-pretty text-slate-400 sm:text-lg">
            Upload one long video. Clipper finds the moments worth stopping for
            and turns them into sharp, vertical clips for Shorts, Reels, and
            TikTok.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-violet-400 px-6 text-sm font-bold text-slate-950 shadow-xl shadow-violet-500/20 transition hover:bg-violet-300"
            >
              Create clips for free{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              <CirclePlay className="size-4" /> See the workflow
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            No credit card needed · Start with 3 free clips
          </p>
        </div>
        <div className="landing-dashboard relative mx-auto mt-16 max-w-5xl rounded-[28px] border border-white/10 bg-[#111119]/90 p-2 shadow-2xl shadow-black/50 backdrop-blur sm:p-3">
          <div className="rounded-[22px] border border-white/[0.06] bg-[#171720] p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-rose-400" />
                <span className="size-2 rounded-full bg-amber-300" />
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-slate-500">
                  workspace / morning-podcast.mp4
                </span>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                12 clips ready
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-[1.22fr_.78fr]">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/60 via-fuchsia-500/25 to-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_30%,rgba(255,255,255,.28),transparent_17%),linear-gradient(135deg,transparent_40%,rgba(9,9,13,.62))]" />
                <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between">
                  <div>
                    <span className="rounded-md bg-black/35 px-2 py-1 text-[10px] font-semibold text-white">
                      02:14 — 02:48
                    </span>
                    <p className="mt-2 text-sm font-semibold text-white sm:text-lg">
                      &ldquo;The mistake everyone makes…&rdquo;
                    </p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-full bg-white text-slate-900">
                    <CirclePlay className="size-5" fill="currentColor" />
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-[#101017] p-4">
                <p className="text-xs font-medium tracking-[.15em] text-slate-500 uppercase">
                  Top moments
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    ["The mistake everyone makes", "94"],
                    ["Build in public is not enough", "91"],
                    ["Your first 100 customers", "88"],
                  ].map(([title, score], i) => (
                    <div key={title} className="flex items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-violet-400/10 text-xs font-bold text-violet-300">
                        0{i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-200">
                          {title}
                        </p>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                            style={{ width: `${Number(score) - 8}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-violet-300">
                        {score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/[0.07] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
          {[
            ["3× faster", "than finding clips manually"],
            ["9:16 ready", "for every vertical platform"],
            ["One workspace", "from upload to export"],
          ].map(([metric, detail]) => (
            <div key={metric} className="py-7 text-center">
              <p className="text-2xl font-semibold tracking-tight text-white">
                {metric}
              </p>
              <p className="mt-1 text-sm text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="how"
        className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-violet-300">THE WORKFLOW</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            The shortest path from long-form to posted.
          </h2>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {workflow.map(([number, title, copy]) => (
            <article
              key={number}
              className="group rounded-3xl border border-white/[0.08] bg-[#101017] p-6 transition hover:-translate-y-1 hover:border-violet-300/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-violet-300">
                  {number}
                </span>
                {number === "01" ? (
                  <FileVideo className="size-5 text-slate-500" />
                ) : number === "02" ? (
                  <Zap className="size-5 text-slate-500" />
                ) : (
                  <Clapperboard className="size-5 text-slate-500" />
                )}
              </div>
              <h3 className="mt-14 text-xl font-semibold text-white">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        id="made-for"
        className="border-y border-white/[0.07] bg-[#0d0d13]"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[.72fr_1.28fr] lg:px-8 lg:py-32">
          <div>
            <p className="text-sm font-semibold text-violet-300">
              MADE FOR MOMENTUM
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
              Your content, finally compounding.
            </h2>
            <div className="mt-9 flex flex-wrap gap-2">
              {audiences.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => setAudience(index)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${audience === index ? "bg-white text-slate-950" : "border border-white/10 text-slate-400 hover:text-white"}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.12] to-transparent p-7 sm:p-10">
            <p className="text-sm font-semibold text-violet-200">
              {selected.eyebrow}
            </p>
            <p className="mt-5 max-w-lg text-2xl leading-tight font-medium tracking-[-0.035em] text-white sm:text-3xl">
              {selected.copy}
            </p>
            <ul className="mt-9 grid gap-4 sm:grid-cols-3">
              {selected.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-5 text-slate-300"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-violet-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section id="faq" className="mx-auto max-w-3xl px-5 py-24 lg:py-32">
        <div className="text-center">
          <p className="text-sm font-semibold text-violet-300">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            A few quick answers.
          </h2>
        </div>
        <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faqs.map(([question, answer], index) => (
            <div key={question}>
              <button
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium text-white"
                onClick={() => setFaq(faq === index ? null : index)}
                aria-expanded={faq === index}
              >
                {question}
                <ChevronDown
                  className={`size-5 shrink-0 text-slate-500 transition ${faq === index ? "rotate-180" : ""}`}
                />
              </button>
              {faq === index && (
                <p className="max-w-2xl pb-5 text-sm leading-6 text-slate-400">
                  {answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="mx-5 mb-5 rounded-[32px] border border-violet-300/20 bg-[radial-gradient(circle_at_top,rgba(139,92,246,.26),transparent_45%),#13131d] px-6 py-20 text-center lg:mx-8">
        <p className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">
          Stop sitting on your best content.
        </p>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
          Your next batch of clips is hiding inside the videos you already made.
        </p>
        <Link
          href="/sign-up"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-violet-100"
        >
          Start making clips <ArrowRight className="size-4" />
        </Link>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Wordmark />
        <p>© 2026 Clipper AI. Turn moments into momentum.</p>
        <div className="flex gap-5">
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up">Get started</Link>
        </div>
      </footer>
    </main>
  );
}
