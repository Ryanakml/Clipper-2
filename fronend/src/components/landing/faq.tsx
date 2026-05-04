"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What types of videos can I upload?",
    answer: "Almost any long-form video. Podcasts, Zoom webinar recordings, live game streams, even YouTube vlogs. MP4/MOV formats work great."
  },
  {
    question: "Will there be a watermark on the clips?",
    answer: "No watermarks. All clips you download are clean and watermark-free, looking professional on your brand account."
  },
  {
    question: "How long does processing take?",
    answer: "Very fast. Average 2-5 minutes for a 1-hour video. Much faster than manual rendering on your laptop."
  },
  {
    question: "Do I need editing skills?",
    answer: "Not at all. ClipperAI is designed for non-technical users. Just upload, wait for AI to process, then select the clips you like."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="w-full py-24 px-6 bg-[var(--bg-base)]">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl font-display text-[var(--text-primary)]">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`border border-[var(--border-subtle)] rounded-xl overflow-hidden transition-colors duration-200 hover:bg-[var(--bg-elevated)] ${isOpen ? 'bg-[var(--bg-surface)]' : 'bg-[var(--bg-base)]'}`}
      style={{
        borderLeft: isOpen ? "3px solid var(--brand-accent)" : "1px solid var(--border-subtle)"
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent-dim)]"
      >
        <span className="text-[var(--text-primary)] pr-4 font-medium text-lg">{question}</span>
        {isOpen ? (
          <Minus className="text-[var(--brand-accent)] h-5 w-5 shrink-0" />
        ) : (
          <Plus className="text-[var(--text-muted)] h-5 w-5 shrink-0" />
        )}
      </button>
      <div
        className={`text-[var(--text-secondary)] overflow-hidden px-6 leading-relaxed transition-all duration-200 ease-in-out`}
        style={{
          maxHeight: isOpen ? "200px" : "0px",
          paddingBottom: isOpen ? "24px" : "0px",
          opacity: isOpen ? 1 : 0
        }}
      >
        {answer}
      </div>
    </div>
  );
}
