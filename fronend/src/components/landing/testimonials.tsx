"use client";

import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    quote: "ClipperAI cut my editing time by 80%. I post 3x more content now.",
    name: "Sarah K.",
    handle: "@sarahcreates",
    followers: "12k followers",
    initials: "SK"
  },
  {
    quote: "The viral score is scary accurate. My last clip got 2M views.",
    name: "Marcus T.",
    handle: "@techwithmarcus",
    followers: "45k followers",
    initials: "MT"
  },
  {
    quote: "Finally a tool that actually understands what's engaging. Game changer.",
    name: "Priya M.",
    handle: "@priyalifestyle",
    followers: "8k followers",
    initials: "PM"
  }
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl font-display text-[var(--text-primary)]">
            Trusted by Creators
          </h2>
        </div>

        {/* Scroll snap container for mobile, grid for desktop */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
          {TESTIMONIALS.map((t, i) => (
            <div 
              key={i}
              className="testimonial-card snap-center shrink-0 w-[85vw] md:w-auto relative"
              style={{ 
                opacity: isVisible ? 1 : 0, 
                transform: isVisible ? "translateY(0)" : "translateY(40px)", 
                transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                transitionDelay: `${i * 150}ms`
              }}
            >
              <p className="italic text-[var(--text-secondary)] mb-8 text-lg leading-relaxed">
                &quot;{t.quote}&quot;
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-accent-dim)] text-[var(--brand-accent)] font-bold flex items-center justify-center font-display">
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-[var(--text-primary)]">{t.name}</div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {t.handle} · {t.followers}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonial-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #111111 100%);
          border: 1px solid #1E1E1C;
          border-radius: 20px;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
