"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(endValue: number, duration: number, isVisible: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration, isVisible]);

  return count;
}

export default function StatsBar() {
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
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const creatorsCount = useCountUp(10000, 1500, isVisible);
  const clipsCount = useCountUp(500000, 1500, isVisible);
  const hoursCount = useCountUp(10, 1500, isVisible);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[var(--bg-surface)] border-y border-[var(--border-subtle)] py-12"
    >
      <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
        
        {/* Stat 1 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="font-display text-4xl md:text-[48px] font-bold text-[var(--brand-accent)] mb-2 tracking-tight">
            {creatorsCount.toLocaleString()}+
          </div>
          <div className="text-[var(--text-secondary)] text-sm font-medium">
            creators using ClipperAI
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-16 bg-[var(--border-subtle)]"></div>

        {/* Stat 2 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="font-display text-4xl md:text-[48px] font-bold text-[var(--brand-accent)] mb-2 tracking-tight">
            {clipsCount.toLocaleString()}+
          </div>
          <div className="text-[var(--text-secondary)] text-sm font-medium">
            clips generated
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-16 bg-[var(--border-subtle)]"></div>

        {/* Stat 3 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="font-display text-4xl md:text-[48px] font-bold text-[var(--brand-accent)] mb-2 tracking-tight">
            {hoursCount.toLocaleString()} hrs
          </div>
          <div className="text-[var(--text-secondary)] text-sm font-medium">
            saved per week on average
          </div>
        </div>

      </div>
    </section>
  );
}
