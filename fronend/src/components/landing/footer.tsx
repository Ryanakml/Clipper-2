export default function Footer() {
  return (
    <footer className="border-white/10 bg-neutral-950 text-neutral-200 border-t">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <span className="text-neutral-300 text-sm font-medium">
          © 2025 ClipperAI. All rights reserved.
        </span>
        <div className="text-neutral-400 flex gap-8 text-sm font-semibold">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
