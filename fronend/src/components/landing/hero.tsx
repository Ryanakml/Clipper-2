"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headlineLine1 = "One Long Video".split(" ");
  const headlineLine2 = "Becomes Multiple Viral Clips".split(" ");

  return (
    <section id="beranda" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-accent)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Floating Phone Mockups (Desktop Only) */}
      <div className="absolute inset-0 z-0 hidden md:block overflow-hidden pointer-events-none">
        {/* Phone 1 */}
        <div 
          className="absolute top-[20%] left-[15%] w-[160px] aspect-[9/16] rounded-[24px] bg-[#1a1a1a] border border-[#2e2e2c] flex items-center justify-center shadow-2xl animate-float-slow"
          style={{ transform: "rotate(-6deg)" }}
        >
          <div className="absolute inset-x-2 top-2 bottom-12 rounded-[16px] bg-[#222] overflow-hidden">
            <div className="absolute bottom-4 left-3 right-3">
              <div className="h-2 w-2/3 bg-[#333] rounded mb-2"></div>
              <div className="h-2 w-1/2 bg-[#333] rounded"></div>
            </div>
          </div>
          <div className="absolute bottom-4 w-full text-center px-2">
            <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded-full">Morning Routine 🔥</span>
          </div>
        </div>

        {/* Phone 2 */}
        <div 
          className="absolute top-[15%] right-[15%] w-[160px] aspect-[9/16] rounded-[24px] bg-[#1a1a1a] border border-[#2e2e2c] flex items-center justify-center shadow-2xl animate-float-medium"
          style={{ transform: "rotate(5deg)" }}
        >
          <div className="absolute inset-x-2 top-2 bottom-12 rounded-[16px] bg-[#222] overflow-hidden">
            <div className="absolute bottom-4 left-3 right-3">
              <div className="h-2 w-3/4 bg-[#333] rounded mb-2"></div>
              <div className="h-2 w-1/3 bg-[#333] rounded"></div>
            </div>
          </div>
          <div className="absolute bottom-4 w-full text-center px-2">
            <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded-full">Highlight Reel</span>
          </div>
        </div>

        {/* Phone 3 */}
        <div 
          className="absolute bottom-[10%] left-[25%] w-[160px] aspect-[9/16] rounded-[24px] bg-[#1a1a1a] border border-[#2e2e2c] flex items-center justify-center shadow-2xl animate-float-fast"
          style={{ transform: "rotate(-3deg)" }}
        >
          <div className="absolute inset-x-2 top-2 bottom-12 rounded-[16px] bg-[#222] overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[var(--brand-accent)] border-t-transparent animate-spin"></div>
          </div>
          <div className="absolute bottom-4 w-full text-center px-2">
            <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded-full">Best Quote 💡</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
        {/* Pill Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-[var(--brand-accent)] bg-[var(--brand-accent-dim)] px-4 py-1.5 text-xs font-semibold text-[var(--brand-accent)]">
          <Sparkles className="h-3.5 w-3.5" /> ✦ Powered by Advanced AI
        </div>

        {/* Headline */}
        <h1 className="mb-6 font-display font-bold leading-[1.0] tracking-tight text-[var(--text-primary)]" style={{ fontSize: "clamp(44px, 7vw, 88px)", letterSpacing: "-0.03em" }}>
          <div className="overflow-hidden pb-2">
            {headlineLine1.map((word, i) => (
              <span
                key={i}
                className="inline-block translate-y-[20px] opacity-0 transition-all duration-700 ease-out"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                {word}&nbsp;
              </span>
            ))}
          </div>
          <div className="overflow-hidden pt-1 pb-4">
            {headlineLine2.map((word, i) => (
              <span
                key={i}
                className="inline-block translate-y-[20px] opacity-0 transition-all duration-700 ease-out"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${(headlineLine1.length + i) * 60}ms`,
                }}
              >
                {word}&nbsp;
              </span>
            ))}
          </div>
        </h1>

        {/* Subheadline */}
        <p className="mb-12 max-w-xl text-[var(--text-secondary)] text-base md:text-lg leading-[1.7] transition-all duration-1000 delay-500" style={{ opacity: mounted ? 1 : 0 }}>
          Upload your YouTube video, Zoom recording, or Podcast. AI will find the best moments for Shorts, Reels, and TikTok.
        </p>

        {/* CTA */}
        <Link
          href="/sign-in"
          className="group relative flex items-center gap-2 rounded-full bg-[var(--brand-accent)] text-[#080808] px-[32px] py-[14px] text-[18px] font-semibold transition-all duration-300 hover:scale-[1.04] glow-accent z-20"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
            transitionDelay: "800ms",
          }}
        >
          Try ClipperAI Free
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-12px) rotate(-6deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(5deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
        }
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
          animation-delay: 0s;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
