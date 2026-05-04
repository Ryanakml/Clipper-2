"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(endValue: number, duration: number, isVisible: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      startTimestamp ??= timestamp;
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
      { threshold: 0.5 },
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
      className="w-full border-y border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-12 px-6 md:flex-row md:gap-0">
        {/* Stat 1 */}
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="font-display mb-2 text-4xl font-bold tracking-tight text-[var(--brand-accent)] md:text-[48px]">
            {creatorsCount.toLocaleString()}+
          </div>
          <div className="text-sm font-medium text-[var(--text-secondary)]">
            creators using ClipperAI
          </div>
        </div>

        {/* Divider */}
        <div className="hidden h-16 w-px bg-[var(--border-subtle)] md:block"></div>

        {/* Stat 2 */}
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="font-display mb-2 text-4xl font-bold tracking-tight text-[var(--brand-accent)] md:text-[48px]">
            {clipsCount.toLocaleString()}+
          </div>
          <div className="text-sm font-medium text-[var(--text-secondary)]">
            clips generated
          </div>
        </div>

        {/* Divider */}
        <div className="hidden h-16 w-px bg-[var(--border-subtle)] md:block"></div>

        {/* Stat 3 */}
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="font-display mb-2 text-4xl font-bold tracking-tight text-[var(--brand-accent)] md:text-[48px]">
            {hoursCount.toLocaleString()} hrs
          </div>
          <div className="text-sm font-medium text-[var(--text-secondary)]">
            saved per week on average
          </div>
        </div>
      </div>
    </section>
  );
}
