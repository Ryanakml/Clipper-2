"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "../theme-switcher";

const LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#fitur", label: "Fitur" },
  { href: "#faq", label: "FAQ" },
  // { href: "#tentang", label: "Tentang" },
];

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#beranda");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sectionIds = LINKS.map((link) => link.href.replace("#", ""));
    const sectionEls = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const updateHash = (hash: string) => setActiveHash(hash || "#beranda");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          updateHash(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.2 },
    );

    sectionEls.forEach((el) => observer.observe(el));

    const onHash = () => updateHash(window.location.hash || "#beranda");
    window.addEventListener("hashchange", onHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    <nav className="border-border bg-card/80 fixed top-0 z-50 flex h-16 w-full items-center border-b backdrop-blur-md transition-all">
      <div className="mx-auto flex w-full max-w-360 items-center justify-between px-6 md:px-12">
        <div className="flex shrink-0 items-center gap-3">
          <div className="border-border bg-background relative h-8 w-8 overflow-hidden rounded-lg border shadow-sm">
            <Image
              src="/favicon.ico"
              alt="ClipperAI"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-foreground text-lg font-bold tracking-tight">
            ClipperAI
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center space-x-8">
            {LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={link.href === activeHash}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="border-border/60 flex items-center space-x-4 border-l pl-4">
            <ThemeSwitcher />
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-foreground px-2 text-sm font-medium transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/sign-up"
              className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium shadow-sm transition-all hover:opacity-90"
            >
              Daftar
            </Link>
          </div>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground"
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
        <div className="animate-in slide-in-from-top-2 border-border bg-card absolute top-16 left-0 flex w-full flex-col space-y-5 border-b p-6 shadow-xl md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                link.href === activeHash
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }`}
              onClick={() => {
                setActiveHash(link.href);
                setIsMobileMenuOpen(false);
              }}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-border/60" />
          <Link
            href="/sign-in"
            className="text-muted-foreground hover:text-foreground w-full text-left text-sm font-medium transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Masuk
          </Link>
          <button className="bg-foreground text-background w-full rounded-lg py-3 text-sm font-medium shadow-sm transition-all hover:opacity-90">
            Daftar
          </button>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {active && (
        <span className="bg-primary absolute -bottom-6 left-0 h-0.5 w-full rounded-full"></span>
      )}
    </Link>
  );
}
