"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative w-full py-[160px] px-6 overflow-hidden bg-[var(--bg-base)]">
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-[var(--brand-accent)] opacity-[0.08] blur-[150px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
        <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl font-display text-[var(--text-primary)] tracking-tight">
          Ready to Create Viral Content?
        </h2>
        
        <p className="mb-12 max-w-2xl text-lg text-[var(--text-secondary)] leading-relaxed">
          Join now and save hours on editing. Focus on creating great
          content, let us handle the video cutting.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full sm:w-auto">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto bg-[var(--brand-accent)] text-[#080808] px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300 glow-accent text-center"
          >
            Sign Up Free Now
          </Link>
          
          <Link
            href="#demo"
            className="w-full sm:w-auto bg-transparent text-[var(--text-primary)] border border-[var(--border-bright)] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[var(--bg-elevated)] transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Watch Demo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-[13px] text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[var(--brand-accent)]" /> No credit card required
          </div>
          <span className="hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[var(--brand-accent)]" /> Free plan available
          </div>
          <span className="hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[var(--brand-accent)]" /> Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}
