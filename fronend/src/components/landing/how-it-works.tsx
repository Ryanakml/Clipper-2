"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, Activity, LayoutGrid, CheckCircle } from "lucide-react";

export default function HowItWorks() {
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
    <section ref={sectionRef} id="how-it-works" className="w-full flex flex-col items-center justify-center py-[120px] px-6">
      <div className="text-center mb-16">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl font-display text-[var(--text-primary)]">
          How ClipperAI Works
        </h2>
        <p className="text-[var(--text-secondary)] text-base md:text-lg">
          From raw file upload to content ready to post.
        </p>
      </div>

      {/* Stepper */}
      <div className="relative mx-auto w-full max-w-4xl flex flex-col md:flex-row justify-between mb-16 gap-8 md:gap-0">
        {/* Step 1 */}
        <div 
          className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 transition-all duration-700 ease-out"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : "translateX(-20px)", transitionDelay: "100ms" }}
        >
          <div className="w-12 h-12 rounded-full bg-[var(--brand-accent)] text-[#080808] font-bold text-xl flex items-center justify-center mb-4 shadow-[0_0_20px_#00E5A040]">
            1
          </div>
          <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[var(--brand-accent)]" /> Upload
          </h3>
          <p className="text-[var(--text-secondary)] text-sm px-4">Upload any video up to 3 hours</p>
        </div>

        {/* Step 2 */}
        <div 
          className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 transition-all duration-700 ease-out"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : "translateX(-20px)", transitionDelay: "300ms" }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-[var(--brand-accent)] bg-[var(--bg-surface)] text-[var(--brand-accent)] font-bold text-xl flex items-center justify-center mb-4">
            2
          </div>
          <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--brand-accent)]" /> AI Processing
          </h3>
          <p className="text-[var(--text-secondary)] text-sm px-4">AI scans every second for viral moments</p>
        </div>

        {/* Step 3 */}
        <div 
          className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 transition-all duration-700 ease-out"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : "translateX(-20px)", transitionDelay: "500ms" }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-[var(--border-bright)] bg-[var(--bg-surface)] text-[var(--text-muted)] font-bold text-xl flex items-center justify-center mb-4">
            3
          </div>
          <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[var(--text-muted)]" /> Get Clips
          </h3>
          <p className="text-[var(--text-secondary)] text-sm px-4">Download ready-to-post vertical clips</p>
        </div>

        {/* Connecting Lines (Desktop Only) */}
        <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-[2px] -z-0">
          {/* Line 1 to 2 */}
          <div className="absolute left-0 w-1/2 h-full">
            <div 
              className="h-full bg-[var(--brand-accent)] transition-all duration-1000 ease-out origin-left"
              style={{ transform: isVisible ? "scaleX(1)" : "scaleX(0)" }}
            />
          </div>
          {/* Line 2 to 3 */}
          <div className="absolute right-0 w-1/2 h-full border-t-2 border-dashed border-[var(--border-bright)]"></div>
        </div>
      </div>

      {/* Progress UI Mockup */}
      <div 
        className="w-full max-w-3xl mx-auto bg-[#111111] border border-[#1E1E1C] rounded-[24px] shadow-2xl overflow-hidden mb-24 transition-all duration-1000 delay-500"
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)" }}
      >
        {/* Browser Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E1C] bg-[#1a1a1a]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
          </div>
          <div className="flex gap-4 text-xs font-medium text-[var(--text-muted)]">
            <span className="text-[var(--brand-accent)]">1. Upload</span>
            <span>·</span>
            <span className="text-[var(--text-secondary)]">2. AI Processing</span>
            <span>·</span>
            <span>3. Clip Results</span>
          </div>
          <div className="w-12"></div> {/* Spacer for balance */}
        </div>
        
        {/* App Content */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px] relative bg-gradient-to-b from-[#111] to-[#080808]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 w-full max-w-md bg-[#1a1a1a] border-2 border-dashed border-[var(--brand-accent-dim)] rounded-xl p-8 flex flex-col items-center text-center">
            <CheckCircle className="w-12 h-12 text-[var(--brand-accent)] mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-1">File Uploaded!</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-6">podcast_episode_42.mp4 (1.2GB)</p>
            
            {/* Scanning Bar Animation */}
            <div className="w-full h-1.5 bg-[#2E2E2C] rounded-full overflow-hidden mb-2 relative">
              <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-[var(--brand-accent)] rounded-full animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
            <p className="text-xs text-[var(--brand-accent)] font-medium animate-pulse">AI is scanning for viral moments...</p>
          </div>

          <div className="absolute top-4 right-4 bg-[var(--brand-accent-dim)] text-[var(--brand-accent)] border border-[var(--brand-accent)] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-accent)] animate-ping"></span> Live Preview
          </div>
        </div>
      </div>

      {/* Supported Platforms */}
      <div className="flex flex-col items-center w-full">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold mb-6">
          Supported Platforms
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
          <PlatformLogo name="YOUTUBE" />
          <PlatformLogo name="TIKTOK" />
          <PlatformLogo name="INSTAGRAM" />
          <PlatformLogo name="SPOTIFY" />
        </div>
      </div>
    </section>
  );
}

function PlatformLogo({ name }: { name: string }) {
  return (
    <div className="text-[var(--text-secondary)] hover:text-white text-xl md:text-2xl font-bold font-display transition-colors cursor-default">
      {name}
    </div>
  );
}
