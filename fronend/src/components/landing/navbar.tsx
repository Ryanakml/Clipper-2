"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#fitur", label: "Fitur" },
  { href: "#faq", label: "FAQ" },
];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 flex h-16 w-full items-center transition-all duration-300 ${
        isScrolled
          ? "bg-[#08080895] backdrop-blur-[20px] border-b border-[#ffffff08]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[var(--brand-accent)] text-xl font-bold">✂</span>
          <span className="text-[var(--text-primary)] text-xl font-bold tracking-tight font-display">
            ClipperAI
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[var(--brand-accent)] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/sign-in"
            className="text-[var(--text-primary)] hover:text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/sign-up"
            className="bg-[var(--brand-accent)] text-[#080808] hover:shadow-[0_0_20px_#00E5A040] rounded-full px-5 py-2 text-sm font-semibold transition-all hover:scale-105"
          >
            Daftar
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[var(--text-primary)]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 flex w-full flex-col space-y-4 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] p-6 shadow-xl md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-[var(--border-subtle)] my-2" />
          <Link
            href="/sign-in"
            className="text-[var(--text-primary)] w-full text-left text-sm font-medium transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Masuk
          </Link>
          <Link
            href="/sign-up"
            className="bg-[var(--brand-accent)] text-[#080808] w-full rounded-full py-3 text-center text-sm font-semibold shadow-sm transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Daftar
          </Link>
        </div>
      )}
    </nav>
  );
}
