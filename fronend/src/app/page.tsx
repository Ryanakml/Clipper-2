"use client";

import {
  ArrowRight,
  Sparkles,
  Settings,
  Target,
  Timer,
  ChevronDown,
} from "lucide-react";
import LandingNavbar from "~/components/landing/navbar";
import ProductDemo from "~/components/landing/product-demo";
import Footer from "~/components/landing/footer";
import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary/15 selection:text-primary relative min-h-screen overflow-x-hidden font-sans">
      <BackgroundAccents />
      <LandingNavbar />

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-28 pb-20 text-center">
        {/* --- HERO SECTION: JANJI SURGA --- */}
        <section id="beranda" className="flex flex-col items-center">
          <div className="border-primary/20 bg-primary/10 text-primary dark:bg-primary/20 mb-6 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
            <Sparkles className="h-3 w-3" /> Powered by Advanced AI
          </div>
          <h1 className="mb-6 max-w-4xl text-4xl leading-[1.1] font-bold tracking-tight md:text-5xl lg:text-[60px]">
            One Long Video
            <br className="hidden md:block" />
            Becomes Multiple Viral Clips
          </h1>
          <p className="text-muted-foreground mb-10 max-w-xl text-base leading-relaxed md:text-lg">
            Upload your YouTube video, Zoom recording, or Podcast. AI will find
            the best moments for Shorts, Reels, and TikTok.
          </p>
          <Link
            href="/sign-in"
            className="group bg-foreground text-background mb-24 flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold shadow-lg shadow-black/5 transition-all hover:scale-[1.02] hover:opacity-90 md:text-base dark:shadow-black/40"
          >
            Try ClipperAI Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        <div className="bg-border/60 my-12 h-px w-full max-w-5xl" />

        {/* --- BENEFIT SECTION: KEY FEATURES --- */}
        <section id="demo" className="mx-auto mb-20 w-full max-w-4xl">
          <div className="mb-10">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">
              How ClipperAI Works
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              From raw file upload to content ready to post.
            </p>
          </div>

          <ProductDemo />

          <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 flex flex-col items-center delay-300 duration-700">
            <p className="text-muted-foreground mb-3 text-sm font-medium">
              Faster than brewing your coffee!
            </p>
            <button className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-semibold transition-colors">
              Create your first clip now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* --- SOCIAL PROOF: VALIDASI --- */}
        <section className="mb-32 w-full opacity-60 grayscale transition-all duration-500 hover:grayscale-0">
          <p className="text-muted-foreground mb-6 text-xs font-semibold tracking-widest uppercase">
            Supported Platforms
          </p>
          <div className="text-muted-foreground/50 flex flex-wrap items-center justify-center gap-8 text-xl font-bold md:gap-16">
            {/* Logo Text Placeholder - Ganti SVG Logo Asli Nanti */}
            <span>YOUTUBE</span>
            <span>TIKTOK</span>
            <span>SPOTIFY VIDEO</span>
            <span>INSTAGRAM REELS</span>
          </div>
        </section>

        {/* --- FEATURE SECTION: PROBLEM SOLUTIONS --- */}
        <section
          id="fitur"
          className="mx-auto mb-32 w-full max-w-6xl text-left md:text-center"
        >
          <div className="mb-16 md:mx-auto md:max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Save 10 Hours of Editing <br className="hidden md:block" />
              <span className="text-primary">Every Week</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Forget complicated timeline editors. Focus on creating great
              content, let AI handle the technical cutting and editing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 text-left md:grid-cols-3">
            {/* Feature 1 */}
            <div className="border-border bg-card/50 hover:border-primary/20 group flex flex-col items-center rounded-3xl border p-8 text-center transition-colors">
              <div className="bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Settings className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Auto-Framing 9:16</h3>
              <p className="text-muted-foreground leading-relaxed">
                Have a landscape video? AI automatically crops the speaker&aposs
                face to fit mobile screens (vertical) without cutting off
                important content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-border bg-card/50 hover:border-primary/20 group flex flex-col items-center rounded-3xl border p-8 text-center transition-colors">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 transition-transform duration-300 group-hover:scale-110">
                <Target className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Viral Score AI</h3>
              <p className="text-muted-foreground leading-relaxed">
                No guessing required. AI scores the viral potential of each clip
                based on current social media trends.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-border bg-card/50 hover:border-primary/20 group flex flex-col items-center rounded-3xl border p-8 text-center transition-colors">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 transition-transform duration-300 group-hover:scale-110">
                <Timer className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Auto Subtitles</h3>
              <p className="text-muted-foreground leading-relaxed">
                Silent videos don&apos;t work. AI automatically generates 98%
                accurate subtitles that keep your audience watching until the
                end.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- PRICING SECTION DELETED (Fokus Solusi & Edukasi) --- */}

      <div className="bg-border/60 my-12 h-px w-full max-w-5xl text-center" />
      {/* --- FAQ SECTION: BUILD TRUST --- */}
      <section id="faq" className="bg-background py-24">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FaqItem
              question="What types of videos can I upload?"
              answer="Almost any long-form video. Podcasts, Zoom webinar recordings, live game streams, even YouTube vlogs. MP4/MOV formats work great."
            />
            <FaqItem
              question="Will there be a watermark on the clips?"
              answer="No watermarks. All clips you download are clean and watermark-free, looking professional on your brand account."
            />
            <FaqItem
              question="How long does processing take?"
              answer="Very fast. Average 2-5 minutes for a 1-hour video. Much faster than manual rendering on your laptop."
            />
            <FaqItem
              question="Do I need editing skills?"
              answer="Not at all. ClipperAI is designed for non-technical users. Just upload, wait for AI to process, then select the clips you like."
            />
          </div>
        </div>
      </section>

      {/* <section id="tentang" className="bg-muted/20 py-20 text-left">
        <div className="border-border/60 bg-card/80 mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-3xl border px-6 py-10 shadow-xl shadow-black/5 dark:shadow-black/20">
          <p className="text-primary text-sm font-semibold">Tentang</p>
          <h3 className="text-2xl font-bold md:text-3xl">
            Kenapa ClipperAI dibuat?
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Ini placeholder singkat. Ceritain misi, value, atau tim kamu di
            sini. Tujuannya biar user tahu siapa di balik produk dan kenapa
            mereka bisa percaya.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Bisa diganti kapan saja tanpa ubah struktur page. Section ini juga
            jadi target navigasi supaya alur scroll dari navbar tetap jelas.
          </p>
        </div>
      </section> */}

      {/* --- FINAL CTA BANNER: SIKAT! --- */}
      <section className="relative w-full bg-neutral-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          {/* Abstract Decoration */}
          <div className="bg-primary/30 pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/30 blur-[80px]" />

          <div className="relative z-10">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              Ready to Create Viral Content?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-300">
              Join now and save hours on editing. Focus on creating great
              content, let us handle the video cutting.
            </p>
            {/* <button className="rounded-full bg-white px-8 py-4 text-lg font-bold text-neutral-950 transition-transform hover:scale-105 hover:bg-neutral-200">
              Try ClipperAI Free
            </button> */}
            <Link
              href="/sign-in"
              className="rounded-full bg-white px-8 py-4 text-lg font-bold text-neutral-950 transition-transform hover:scale-105 hover:bg-neutral-200"
            >
              Sign Up Free Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- HELPER COMPONENTS ---

function BackgroundAccents() {
  return (
    <div className="bg-background pointer-events-none absolute inset-0 -z-10">
      <div className="bg-primary/10 dark:bg-primary/20 absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full blur-[120px]"></div>
      <div className="absolute top-[10%] right-[-10%] h-[60%] w-[50%] rounded-full bg-orange-200/20 blur-[100px] dark:bg-orange-500/10"></div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-border bg-card hover:border-primary/30 overflow-hidden rounded-2xl border transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <span className="text-foreground pr-4 font-semibold">{question}</span>
        <ChevronDown
          className={`text-muted-foreground h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`text-muted-foreground overflow-hidden px-6 text-sm leading-relaxed transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {answer}
      </div>
    </div>
  );
}
