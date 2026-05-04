"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    AOS?: {
      init: (options?: Record<string, unknown>) => void;
      refresh?: () => void;
    };
  }
}

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#" },
  { label: "How It Works", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "FAQ", href: "#" },
];

const steps = [
  {
    step: "01",
    title: "Upload Your Video",
    description:
      "Drop in any video up to 3 hours - YouTube link, MP4, Zoom recording, or podcast file.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-[var(--accent)]"
      >
        <path
          d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    step: "02",
    title: "AI Finds the Best Moments",
    description:
      "Our model scans every second, scoring moments for viewer retention, emotion, and trend alignment.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-[var(--highlight)]"
      >
        <path
          d="M12 4l1.8 3.6L18 9l-3 3 .7 4.2-3.7-2-3.7 2 .7-4.2-3-3 4.2-1.4L12 4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Download Your Clips",
    description:
      "Get ready-to-post 9:16 vertical clips with subtitles burned in. Export to any platform.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-[var(--accent)]"
      >
        <path
          d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const personaTabs = [
  {
    id: "podcasters",
    label: "Podcasters",
    headline: "Turn every episode into a week of clips",
    bullets: [
      "Auto-detect guest highlights and soundbites",
      "Instant vertical framing with speaker tracking",
      "Captions tuned for audio-first storytelling",
    ],
    mockTitle: "Podcast highlight pack",
  },
  {
    id: "youtubers",
    label: "YouTubers",
    headline: "Ship Shorts in minutes, not hours",
    bullets: [
      "Find the moments that spike retention",
      "One-click export to Shorts and Reels",
      "Batch process multiple long-form videos",
    ],
    mockTitle: "YouTube Shorts board",
  },
  {
    id: "coaches",
    label: "Coaches",
    headline: "Build authority with daily micro-content",
    bullets: [
      "Pull quote-worthy lessons from any session",
      "Auto add subtitles and hooks",
      "Schedule clips for every platform",
    ],
    mockTitle: "Client training recap",
  },
  {
    id: "agencies",
    label: "Agencies",
    headline: "Scale client deliverables effortlessly",
    bullets: [
      "Team-ready workflows with shared workspaces",
      "White-label exports for client delivery",
      "API access for automation",
    ],
    mockTitle: "Agency delivery queue",
  },
];

const stats = [
  { value: 12000, label: "Creators using ClipperAI", suffix: "+", decimals: 0 },
  { value: 840000, label: "Clips generated", suffix: "+", decimals: 0 },
  {
    value: 10,
    label: "Saved per creator per week",
    suffix: " Hours",
    decimals: 0,
  },
  {
    value: 3.4,
    label: "Higher engagement vs raw video",
    suffix: "x",
    decimals: 1,
  },
];

const testimonials = [
  {
    name: "Mike Carter",
    handle: "@techpodcast_mike",
    quote:
      "I went from 3 clips a week to 40. My Reels went from 200 views to 80k. ClipperAI is unreal.",
  },
  {
    name: "Lena Park",
    handle: "@growthwithlena",
    quote:
      "The viral score is scary accurate. I posted the top 5 clips and doubled my inbound leads in 10 days.",
  },
  {
    name: "Ravi Singh",
    handle: "@founderdiaries",
    quote:
      "We dropped a 2-hour founder story and walked away with 18 Shorts. Editing used to take my whole weekend.",
  },
  {
    name: "Claire Morgan",
    handle: "@coachclaire",
    quote:
      "ClipperAI nails the hooks. My average watch time jumped by 31 percent after switching to their clips.",
  },
  {
    name: "Andre Silva",
    handle: "@agencyandre",
    quote:
      "We package client content in half the time now. The team seat controls are perfect for agency workflows.",
  },
  {
    name: "Natalie Brooks",
    handle: "@storylab",
    quote:
      "The subtitles are clean and on-brand. It feels like a premium editor, without the editor price.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: 0,
    description: "For creators testing the waters",
    features: ["3 clips per month", "720p exports", "Watermark", "1 platform"],
    cta: "Start Free",
  },
  {
    name: "Creator",
    price: 19,
    description: "For consistent content output",
    features: [
      "50 clips per month",
      "1080p exports",
      "No watermark",
      "All platforms",
      "Viral scoring",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Pro",
    price: 49,
    description: "For teams and high-volume pipelines",
    features: [
      "Unlimited clips",
      "4K exports",
      "Team seats",
      "API access",
      "White-label export",
    ],
    cta: "Go Pro",
  },
];

const faqs = [
  {
    question: "What video formats do you support?",
    answer:
      "We support YouTube links, MP4, MOV, and MP3 audio-only uploads. Just drop your file and we handle the rest.",
  },
  {
    question: "How long does processing take?",
    answer:
      "Most videos are processed in under 2 minutes. Longer files can take a bit more time based on length and resolution.",
  },
  {
    question: "Will there be a watermark?",
    answer:
      "Only the Starter plan includes a watermark. Creator and Pro exports are watermark-free.",
  },
  {
    question: "Can I edit the clips after they're generated?",
    answer:
      "Yes. You can trim, reorder, and adjust captions before downloading or exporting to your platforms.",
  },
  {
    question: "Do you support team accounts?",
    answer:
      "Pro includes team seats, shared workspaces, and role-based access to keep client projects organized.",
  },
  {
    question: "Is my video data private and secure?",
    answer:
      "Absolutely. Files are encrypted in transit and at rest. We never share your content, and you can delete data anytime.",
  },
];

const formatNumber = (value: number, decimals: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

export default function LandingPage() {
  const defaultPersona = personaTabs[0] ?? {
    id: "default",
    label: "Default",
    headline: "",
    bullets: [],
    mockTitle: "",
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultPersona.id);
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [statValues, setStatValues] = useState(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedStats = useRef(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (window.AOS) {
        window.AOS.init({
          duration: 800,
          easing: "ease-out-cubic",
          once: true,
        });
        window.AOS.refresh?.();
        window.clearInterval(interval);
      }
    }, 120);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && !hasAnimatedStats.current) {
          hasAnimatedStats.current = true;
          const start = performance.now();
          const duration = 2000;

          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setStatValues(stats.map((stat) => stat.value * progress));
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activePersona =
    personaTabs.find((tab) => tab.id === activeTab) ?? defaultPersona;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-base)] font-sans text-[var(--text-primary)]">
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 right-0 left-0 z-50 transition duration-300 ${
          isScrolled
            ? "border-b border-white/10 bg-[rgba(13,13,20,0.75)] backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold">
            <img src="/favicon.ico" alt="ClipperAI logo" className="h-7 w-7" />
            ClipperAI
          </a>

          <div className="hidden items-center gap-8 text-sm text-[var(--text-muted)] md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] focus-visible:outline-none"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-4 text-sm leading-none text-[var(--text-primary)] transition hover:border-white/30 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] focus-visible:outline-none"
            >
              Log in
            </a>
            <a
              href="#"
              className="no-jitter inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm leading-none font-semibold text-white shadow-[0_0_25px_rgba(123,92,240,0.35)] transition hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] focus-visible:outline-none"
            >
              Start Free
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-white/30 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] focus-visible:outline-none md:hidden"
          >
            <span className="sr-only">Toggle menu</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-white"></span>
              <span className="block h-0.5 w-5 bg-white"></span>
              <span className="block h-0.5 w-5 bg-white"></span>
            </div>
          </button>
        </div>

        <div
          className={`overflow-hidden border-t border-white/10 bg-[var(--bg-surface)] transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[var(--text-primary)] transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <a
                href="#"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-4 text-center text-sm leading-none text-[var(--text-primary)]"
              >
                Log in
              </a>
              <a
                href="#"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-4 text-center text-sm leading-none font-semibold text-white"
              >
                Start Free
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main id="home" className="pt-20">
        <section className="relative overflow-hidden px-4 pt-24 pb-24 sm:px-6 md:pt-32">
          <div
            className="pointer-events-none absolute top-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(123,92,240,0.16) 0%, rgba(13,13,20,0) 60%)",
            }}
          />

          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10" data-aos="fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(123,92,240,0.5)] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path
                    d="M12 4l1.6 3.2L17 8.2l-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4L7 8.2l3.4-1L12 4z"
                    fill="currentColor"
                  />
                </svg>
                Powered by Advanced AI
              </span>
              <h1 className="mt-6 text-4xl leading-tight font-bold sm:text-5xl">
                One Long Video Becomes
                <span className="block bg-gradient-to-r from-[var(--accent)] to-[var(--highlight)] bg-clip-text text-transparent">
                  Multiple Viral Clips
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-[var(--text-muted)] sm:text-lg">
                Upload your YouTube video, Zoom recording, or podcast. AI finds
                the best moments for Shorts, Reels, and TikTok in under 2
                minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#"
                  className="no-jitter min-h-[48px] rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(123,92,240,0.4)] transition hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] focus-visible:outline-none"
                >
                  Try ClipperAI Free -&gt;
                </a>
                <a
                  href="#"
                  className="min-h-[48px] rounded-full border border-[rgba(34,211,238,0.5)] px-6 py-3 text-sm font-semibold text-[var(--highlight)] transition hover:border-[rgba(34,211,238,0.9)] focus-visible:ring-2 focus-visible:ring-[var(--highlight)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] focus-visible:outline-none"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
                {[
                  "No credit card",
                  "First 3 clips free",
                  "2-min processing",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(123,92,240,0.2)] text-[var(--accent)]">
                      <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className="h-3 w-3"
                      >
                        <path
                          d="M3.5 8.5l3 3 6-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative" data-aos="fade-up" data-aos-delay="150">
              <div className="absolute -inset-6 rounded-[32px] bg-[rgba(123,92,240,0.15)] blur-2xl" />
              <div className="glass-panel animate-float relative rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--highlight)]"></span>
                    Live Processing
                  </div>
                  <span>00:32 remaining</span>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-[rgba(13,13,20,0.8)] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        Weekly Podcast Episode
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        AI detected 7 viral moments
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(34,211,238,0.2)] px-3 py-1 text-xs font-semibold text-[var(--highlight)]">
                      Ready
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {["Clip 01", "Clip 02", "Clip 03"].map((clip, index) => (
                      <div
                        key={clip}
                        className="relative aspect-[9/16] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[rgba(123,92,240,0.25)] to-[rgba(13,13,20,0.8)]"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.12),transparent)]" />
                        <span className="absolute top-2 left-2 rounded-full bg-[rgba(123,92,240,0.25)] px-2 py-1 text-[10px] font-semibold text-[var(--accent)]">
                          {clip}
                        </span>
                        <div className="absolute right-2 bottom-2 left-2 text-[10px] text-[var(--text-muted)]">
                          Viral score {94 - index * 4}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">
                    AI clipping in progress
                  </span>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                    <div className="h-full w-4/5 rounded-full bg-[var(--accent)]"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-3 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(123,92,240,0.6)]">
                Viral Score 94%
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-y border-white/10 bg-[var(--bg-elevated)] px-4 py-6 sm:px-6"
          data-aos="fade-up"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-[var(--text-primary)]">
              Trusted by 12,000+ creators worldwide
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs tracking-[0.2em] uppercase">
              {"YouTube TikTok Instagram Spotify LinkedIn"
                .split(" ")
                .map((platform) => (
                  <span key={platform} className="text-[var(--text-muted)]">
                    {platform}
                  </span>
                ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-24 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl" data-aos="fade-up">
              <h2 className="text-3xl font-bold sm:text-4xl">
                From Upload to Viral in 3 Steps
              </h2>
              <p className="mt-3 text-base text-[var(--text-muted)]">
                No editing skills needed. No timeline. Just results.
              </p>
            </div>

            <div className="relative mt-12 grid gap-6 md:grid-cols-3">
              <div className="pointer-events-none absolute top-9 right-8 left-8 hidden h-px border-t border-dashed border-white/10 md:block" />
              {steps.map((step, index) => (
                <div
                  key={step.step}
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                  className="glass-panel hover-glow relative flex flex-col gap-4 rounded-3xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">
                      Step {step.step}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
                      {step.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      {step.description}
                    </p>
                  </div>
                  {index === 0 && (
                    <div className="mt-4 rounded-2xl border border-dashed border-white/20 bg-[rgba(255,255,255,0.02)] p-4">
                      <div className="text-xs text-[var(--text-muted)]">
                        Uploading...
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                        <div className="h-full w-full rounded-full bg-[var(--accent)]"></div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--highlight)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--highlight)]"></span>
                        Upload complete
                      </div>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[rgba(13,13,20,0.6)] p-4">
                      <div className="flex items-end gap-2">
                        {[20, 50, 30, 70, 25, 60].map((height, idx) => (
                          <span
                            key={`${height}-${idx}`}
                            className="w-2 rounded-full bg-[rgba(123,92,240,0.4)]"
                            style={{ height: `${height}px` }}
                          />
                        ))}
                        <span
                          className="w-2 rounded-full bg-[var(--accent)]"
                          style={{ height: "80px" }}
                        />
                        <span
                          className="w-2 rounded-full bg-[var(--accent)]"
                          style={{ height: "64px" }}
                        />
                        <span
                          className="w-2 rounded-full bg-[rgba(123,92,240,0.4)]"
                          style={{ height: "30px" }}
                        />
                      </div>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {["92%", "88%", "95%"].map((score) => (
                        <div
                          key={score}
                          className="relative aspect-[9/16] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[rgba(34,211,238,0.2)] to-[rgba(13,13,20,0.8)]"
                        >
                          <span className="absolute top-2 left-2 rounded-full bg-[rgba(34,211,238,0.2)] px-2 py-1 text-[10px] font-semibold text-[var(--highlight)]">
                            {score}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6" data-aos="fade-up">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                See the Difference
              </h2>
              <p className="mt-3 text-base text-[var(--text-muted)]">
                Same video. Completely different result.
              </p>
            </div>

            <div className="relative mt-12">
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">
                    Raw Footage
                  </span>
                  <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(13,13,20,0.85))]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[rgba(255,255,255,0.04)]">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-5 w-5 text-white/60"
                          >
                            <path d="M9 7l8 5-8 5V7z" fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-[10px] text-white/70">
                        01:23:45
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--highlight)] bg-clip-text text-xs font-semibold tracking-[0.2em] text-transparent uppercase">
                    AI-Clipped Short
                  </span>
                  <div className="rounded-3xl border border-[rgba(123,92,240,0.6)] bg-[rgba(123,92,240,0.12)] p-6 shadow-[0_0_40px_rgba(123,92,240,0.45)]">
                    <div className="flex items-center justify-center">
                      <div className="relative aspect-[9/16] w-[200px] scale-105 overflow-hidden rounded-2xl border border-[rgba(123,92,240,0.7)] bg-[rgba(13,13,20,0.65)] backdrop-blur">
                        <span className="absolute top-3 right-3 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-semibold text-white shadow-[0_0_15px_rgba(123,92,240,0.6)]">
                          Viral Score: 94%
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-lg font-semibold text-white">
                          Watch{" "}
                          <span className="text-[var(--highlight)]">
                            this shift
                          </span>
                          ...
                        </div>
                        <div className="absolute right-0 bottom-4 left-0 flex items-center justify-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.06)]">
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="h-4 w-4 text-white"
                            >
                              <path
                                d="M12 3c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zm-2 6.5v5l5-2.5-5-2.5z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.06)]">
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="h-4 w-4 text-white"
                            >
                              <path
                                d="M12 4c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8zm-3.5 7.2c.4.2 1.1.5 2.1.6l.4 3.1c.3 0 .7 0 1 0l.6-2.6c.6-.1 1.3-.4 1.8-.9l2.3 1.4c.3-.3.5-.6.7-1l-2-1.7c.2-.6.3-1.2.2-1.8l2.2-1c-.1-.4-.3-.8-.6-1.1l-2.4.7c-.5-.4-1.1-.7-1.8-.8l-.5-2.5c-.4 0-.8 0-1.2.1l-.3 2.8c-.7.2-1.3.5-1.8 1l-2.3-1.1c-.2.4-.4.8-.5 1.2l2.2 1c-.1.7-.1 1.4.1 2.1l-2 1.5c.2.4.4.7.7 1l2.3-1.4z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(123,92,240,0.5)] bg-[rgba(13,13,20,0.8)] shadow-[0_0_25px_rgba(123,92,240,0.6)]">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 text-[var(--accent)]"
                  >
                    <path
                      d="M5 12h14m0 0l-4-4m4 4l-4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
              AI identified 7 viral moments in this 90-minute podcast
            </p>
          </div>
        </section>

        <section id="features" className="px-4 py-24 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl" data-aos="fade-up">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Everything You Need to Go Viral
              </h2>
              <p className="mt-3 text-base text-[var(--text-muted)]">
                Built to replace hours of manual editing with an AI pipeline
                that never sleeps.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div
                className="glass-panel hover-glow relative overflow-hidden rounded-3xl p-6 md:col-span-2"
                data-aos="fade-up"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(123,92,240,0.18),_transparent_65%)]" />
                <div className="relative">
                  <h3 className="text-lg font-semibold">Auto-Framing 9:16</h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    AI tracks the speaker&apos;s face throughout the entire clip
                    - no manual cropping. Ever.
                  </p>
                  <div className="mt-6 flex items-center gap-6">
                    <div className="relative h-32 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(13,13,20,0.7)]">
                      <div className="animate-frame absolute inset-0 bg-[linear-gradient(120deg,rgba(123,92,240,0.2),rgba(34,211,238,0.05))]" />
                      <div className="absolute top-8 left-8 h-16 w-16 rounded-full border border-white/20 bg-[rgba(255,255,255,0.08)]" />
                    </div>
                    <div className="relative h-40 w-24 overflow-hidden rounded-2xl border border-[rgba(123,92,240,0.4)] bg-[rgba(123,92,240,0.15)]">
                      <div className="absolute inset-4 rounded-xl border border-white/20" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="glass-panel hover-glow rounded-3xl p-6"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3 className="text-lg font-semibold">Viral Score AI</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Each clip gets a virality score based on 50+ real social
                  signals updated daily.
                </p>
                <div className="mt-6">
                  <div className="relative h-28 w-28 overflow-hidden">
                    <div
                      className="h-full w-full rounded-full"
                      style={{
                        background:
                          "conic-gradient(var(--accent) 0 70%, rgba(255,255,255,0.1) 70% 100%)",
                      }}
                    />
                    <div className="absolute inset-3 rounded-full bg-[var(--bg-elevated)]" />
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                      94
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="glass-panel hover-glow rounded-3xl p-6"
                data-aos="fade-up"
              >
                <h3 className="text-lg font-semibold">Auto Subtitles</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  98% accuracy. Styled for each platform. Silent-scroll ready.
                </p>
                <div className="mt-6 space-y-3 text-xs text-white">
                  {[
                    "This is the moment...",
                    "Hook them instantly",
                    "Keep them watching",
                  ].map((line, index) => (
                    <div
                      key={line}
                      className="animate-subtitle rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-2"
                      style={{ animationDelay: `${index * 0.6}s` }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="glass-panel hover-glow rounded-3xl p-6"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3 className="text-lg font-semibold">Multi-platform Export</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  One click. All platforms. Correct aspect ratio every time.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  {["Shorts", "TikTok", "Reels", "LinkedIn"].map((label) => (
                    <span
                      key={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[rgba(255,255,255,0.06)] text-[10px]"
                    >
                      {label[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="glass-panel hover-glow relative overflow-hidden rounded-3xl p-6 md:col-span-2"
                data-aos="fade-up"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.12),_transparent_65%)]" />
                <div className="relative">
                  <h3 className="text-lg font-semibold">Processing Speed</h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Faster than brewing your coffee. Done in minutes.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-6">
                    <div className="rounded-2xl border border-white/10 bg-[rgba(13,13,20,0.7)] px-5 py-4 text-sm">
                      <div className="text-xs text-[var(--text-muted)]">
                        Processing
                      </div>
                      <div className="mt-2 text-lg font-semibold">00:18</div>
                      <div className="mt-4 h-2 w-40 overflow-hidden rounded-full bg-white/10">
                        <div className="animate-progress h-full w-full rounded-full bg-[var(--highlight)]" />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[rgba(123,92,240,0.16)] px-6 py-4 text-sm">
                      <div className="text-xs text-[var(--text-muted)]">
                        Status
                      </div>
                      <div className="mt-2 text-lg font-semibold">
                        Done! 7 clips ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6" data-aos="fade-up">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Built for Every Creator
              </h2>
              <p className="mt-3 text-base text-[var(--text-muted)]">
                Your workflow stays the same. The output becomes 10x faster.
              </p>
            </div>

            <div className="mt-8">
              <div
                role="tablist"
                aria-label="Persona tabs"
                className="flex flex-wrap gap-4"
              >
                {personaTabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] focus-visible:outline-none ${
                      activeTab === tab.id
                        ? "bg-[rgba(123,92,240,0.2)] text-[var(--accent)]"
                        : "border border-white/10 text-[var(--text-muted)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-8 rounded-3xl border border-white/10 bg-[var(--bg-surface)] p-8 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-4" data-aos="fade-up">
                  <h3 className="text-2xl font-semibold">
                    {activePersona.headline}
                  </h3>
                  <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                    {activePersona.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="flex items-center justify-center"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[rgba(13,13,20,0.8)] p-6">
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                      <span>{activePersona.mockTitle}</span>
                      <span className="rounded-full bg-[rgba(123,92,240,0.2)] px-2 py-1 text-[10px] font-semibold text-[var(--accent)]">
                        Live
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {["Highlight", "Teaser", "Clip"].map((label, index) => (
                        <div
                          key={`${label}-${index}`}
                          className="aspect-[9/16] rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(123,92,240,0.25),rgba(13,13,20,0.9))]"
                        />
                      ))}
                      <div className="flex aspect-[9/16] items-center justify-center rounded-2xl border border-dashed border-white/15 text-xs text-[var(--text-muted)]">
                        +2 more
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-[var(--text-muted)]">
                      Delivery ready in 2 minutes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 py-24 sm:px-6" ref={statsRef}>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(123,92,240,0.2) 0%, rgba(13,13,20,0) 60%)",
            }}
          />
          <div className="mx-auto w-full max-w-6xl" data-aos="fade-up">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="glass-panel hover-glow rounded-3xl p-6"
                >
                  <div className="text-3xl font-semibold">
                    {formatNumber(statValues[index] ?? 0, stat.decimals)}
                    {stat.suffix}
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6" data-aos="fade-up">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Creators Love ClipperAI
              </h2>
              <p className="mt-3 text-base text-[var(--text-muted)]">
                Real creators. Real growth. Real time saved every week.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.handle}
                  className="glass-panel hover-lift flex h-full flex-col gap-4 rounded-3xl p-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(123,92,240,0.25)] text-sm font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {testimonial.handle}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 text-[var(--highlight)]">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <svg
                        key={starIndex}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="h-4 w-4"
                      >
                        <path
                          d="M10 2.5l2 4 4.5.7-3.2 3.2.8 4.6L10 13.5 5.9 15l.8-4.6L3.5 7.2l4.5-.7 2-4z"
                          fill="currentColor"
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">
                    {testimonial.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-24 sm:px-6" data-aos="fade-up">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Simple, Creator-Friendly Pricing
              </h2>
              <p className="mt-3 text-base text-[var(--text-muted)]">
                Start free. Upgrade when you&apos;re ready.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span
                className={`text-sm ${!isAnnual ? "text-white" : "text-[var(--text-muted)]"}`}
              >
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual((prev) => !prev)}
                className="relative h-8 w-14 rounded-full bg-[rgba(255,255,255,0.1)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                aria-label="Toggle annual pricing"
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-[var(--accent)] transition ${
                    isAnnual ? "left-7" : "left-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${isAnnual ? "text-white" : "text-[var(--text-muted)]"}`}
              >
                Annual
              </span>
              <span className="rounded-full bg-[rgba(123,92,240,0.2)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                Save 40%
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {pricingTiers.map((tier) => {
                const price =
                  tier.price === 0
                    ? 0
                    : Math.round(tier.price * (isAnnual ? 0.6 : 1));
                return (
                  <div
                    key={tier.name}
                    className={`glass-panel hover-glow relative rounded-3xl p-6 ${
                      tier.highlighted
                        ? "border-[rgba(123,92,240,0.8)] shadow-[0_0_30px_rgba(123,92,240,0.35)]"
                        : ""
                    }`}
                    data-aos="fade-up"
                  >
                    {tier.highlighted && (
                      <span className="absolute -top-4 left-6 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      {tier.description}
                    </p>
                    <div className="mt-6 flex items-end gap-2">
                      <span className="text-4xl font-semibold">
                        {tier.price === 0 ? "Free" : `$${price}`}
                      </span>
                      {tier.price !== 0 && (
                        <span className="text-sm text-[var(--text-muted)]">
                          /mo {isAnnual ? "billed annually" : ""}
                        </span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-[var(--text-muted)]">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#"
                      className={`mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] focus-visible:outline-none ${
                        tier.highlighted
                          ? "bg-[var(--accent)] text-white"
                          : "border border-white/15 text-white"
                      }`}
                    >
                      {tier.cta}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-24 sm:px-6" data-aos="fade-up">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">Got Questions?</h2>
              <p className="mt-3 text-base text-[var(--text-muted)]">
                Everything you need to know before you hit upload.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="glass-panel rounded-2xl p-5"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold"
                    >
                      {faq.question}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[var(--accent)]">
                        {isOpen ? "x" : "+"}
                      </span>
                    </button>
                    <div
                      className="overflow-hidden text-sm text-[var(--text-muted)] transition-all duration-300"
                      style={{ maxHeight: isOpen ? "200px" : "0px" }}
                    >
                      <p className="mt-3">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative px-4 py-24 sm:px-6" data-aos="fade-up">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(123,92,240,0.35) 0%, rgba(13,13,20,0.2) 60%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-[rgba(123,92,240,0.12)] p-10 text-center shadow-[0_0_40px_rgba(123,92,240,0.4)]">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to 10x Your Content Output?
            </h2>
            <p className="mt-4 text-base text-[var(--text-muted)]">
              Join 12,000+ creators saving 10 hours a week. Start free - no
              credit card required.
            </p>
            <a
              href="#"
              className="no-jitter mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(123,92,240,0.4)] transition hover:translate-y-[-1px]"
            >
              Start Creating Free -&gt;
            </a>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
              {["Cancel anytime", "GDPR compliant", "SOC 2 certified"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <img
                  src="/favicon.ico"
                  alt="ClipperAI logo"
                  className="h-7 w-7"
                />
                ClipperAI
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                AI-powered video clipping for creators.
              </p>
              <div className="flex items-center gap-3 text-[var(--text-muted)]">
                {["YT", "X", "IG", "IN"].map((label) => (
                  <span
                    key={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] text-xs"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {["Features", "Pricing", "Integrations", "API"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {["About", "Careers", "Press", "Contact"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {["Blog", "Guides", "Support", "Status"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {["Privacy", "Terms", "Security", "Cookies"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center">
            <span>(c) 2025 ClipperAI. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
