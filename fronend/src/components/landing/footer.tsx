"use client";

import Link from "next/link";
import { Twitter, Instagram, Music2 } from "lucide-react"; // Using Music2 as TikTok approximation

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-base)] border-t border-[var(--border-subtle)] py-8 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        
        {/* Left: Copyright */}
        <div className="text-[var(--text-muted)] text-sm font-medium">
          © 2025 ClipperAI. All rights reserved.
        </div>

        {/* Right: Links & Socials */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
              Contact
            </Link>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden md:block w-px h-4 bg-[var(--border-subtle)]"></div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors" aria-label="Twitter">
              <Twitter className="w-[18px] h-[18px]" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors" aria-label="Instagram">
              <Instagram className="w-[18px] h-[18px]" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors" aria-label="TikTok">
              <Music2 className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
