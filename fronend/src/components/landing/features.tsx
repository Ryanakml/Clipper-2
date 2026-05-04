"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, TrendingUp, MessageSquareText } from "lucide-react";

export default function Features() {
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
    <section ref={sectionRef} id="fitur" className="w-full py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 md:mx-auto md:max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl font-display text-[var(--text-primary)]">
            Save 10 Hours of Editing <br className="hidden md:block" />
            <span className="text-[var(--brand-accent)]">Every Week</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Forget complicated timeline editors. Focus on creating great
            content, let AI handle the technical cutting and editing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div 
            className="feature-card group relative overflow-hidden"
            style={{ 
              opacity: isVisible ? 1 : 0, 
              transform: isVisible ? "translateY(0)" : "translateY(40px)", 
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "100ms"
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-accent-dim)] text-[var(--brand-accent)] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Maximize className="w-6 h-6 absolute transition-all duration-300 group-hover:opacity-0 group-hover:scale-50" />
                <div className="w-4 h-6 border-2 border-[var(--brand-accent)] rounded-sm absolute opacity-0 scale-150 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></div>
              </div>
            </div>
            <h3 className="mb-3 text-xl font-bold text-[var(--text-primary)] font-display">Auto-Framing 9:16</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Have a landscape video? AI automatically crops the speaker&apos;s
              face to fit mobile screens (vertical) without cutting off
              important content.
            </p>
          </div>

          {/* Feature 2 */}
          <div 
            className="feature-card group relative overflow-hidden"
            style={{ 
              opacity: isVisible ? 1 : 0, 
              transform: isVisible ? "translateY(0)" : "translateY(40px)", 
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "200ms"
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-accent-dim)] text-[var(--brand-accent)] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <TrendingUp className="w-6 h-6" />
              </div>
              
              {/* Animated Badge */}
              <div className="px-3 py-1 rounded-full bg-[#111] border border-[var(--border-bright)] flex items-center gap-2 group-hover:border-[var(--brand-accent)] group-hover:bg-[var(--brand-accent-dim)] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-accent)] animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-accent)]">
                  <span className="inline-block w-[18px] overflow-hidden align-bottom h-4 relative">
                    <span className="absolute top-0 left-0 transition-transform duration-1000 ease-out group-hover:-translate-y-4">
                      7<br/>8
                    </span>
                  </span>
                  <span className="inline-block w-[10px] overflow-hidden align-bottom h-4 relative">
                    <span className="absolute top-0 left-0 transition-transform duration-1000 ease-out group-hover:-translate-y-4 delay-100">
                      2<br/>7
                    </span>
                  </span>
                  /100
                </span>
              </div>
            </div>
            <h3 className="mb-3 text-xl font-bold text-[var(--text-primary)] font-display">Viral Score AI</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              No guessing required. AI scores the viral potential of each clip
              based on current social media trends.
            </p>
          </div>

          {/* Feature 3 */}
          <div 
            className="feature-card group relative overflow-hidden"
            style={{ 
              opacity: isVisible ? 1 : 0, 
              transform: isVisible ? "translateY(0)" : "translateY(40px)", 
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "300ms"
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-accent-dim)] text-[var(--brand-accent)] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-[var(--text-primary)] font-display">Auto Subtitles</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Silent videos don&apos;t work. AI automatically generates 98%
              accurate subtitles that keep your audience watching until the
              end.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .feature-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #111111 100%);
          border: 1px solid #1E1E1C;
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          border-color: #00E5A040;
          box-shadow: 0 0 40px #00E5A015, inset 0 1px 0 #00E5A020;
          transform: translateY(-4px) !important;
        }
      `}</style>
    </section>
  );
}
