import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const features = [
    {
      title: "Smart highlight detection",
      description:
        "Clipper scans your content, finds peak moments, and creates bite-sized segments.",
    },
    {
      title: "Ready-for-social formats",
      description:
        "Output clips optimized for Reels, TikTok, Shorts, and carousel teasers.",
    },
    {
      title: "Organized clip library",
      description:
        "Track uploads, clip status, and performance in one tidy dashboard.",
    },
  ];

  const featureDelays = [
    "motion-safe:delay-100",
    "motion-safe:delay-200",
    "motion-safe:delay-300",
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Upload your source",
      description: "Drag and drop your podcast or video recording in seconds.",
    },
    {
      step: "02",
      title: "Review AI suggestions",
      description: "Choose the highlights that match your audience and tone.",
    },
    {
      step: "03",
      title: "Export and publish",
      description: "Download clips or send them directly to your social tools.",
    },
  ];

  const workflowDelays = [
    "motion-safe:delay-100",
    "motion-safe:delay-200",
    "motion-safe:delay-300",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f3ed] text-[#1f1b16]">
      <div className="pointer-events-none absolute -top-36 right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#ffb454]/45 blur-[140px]" />
      <div className="pointer-events-none absolute top-24 left-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[#3fb6a8]/25 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_60%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-20">
        <header className="flex items-center justify-between py-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-semibold"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1f1b16] text-white">
              C
            </span>
            Clipper
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#5b5146] md:flex">
            <Link href="#features" className="hover:text-[#1f1b16]">
              Features
            </Link>
            <Link href="#workflow" className="hover:text-[#1f1b16]">
              Workflow
            </Link>
            <Link href="#get-started" className="hover:text-[#1f1b16]">
              Get started
            </Link>
          </nav>
          <Link
            href="/sign-in"
            className="rounded-full border border-[#1f1b16]/15 bg-white/80 px-4 py-2 text-sm font-medium text-[#1f1b16] shadow-sm transition hover:-translate-y-0.5 hover:border-[#1f1b16]/25 hover:bg-white"
          >
            Sign in
          </Link>
        </header>

        <section className="grid items-center gap-12 pt-10 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 space-y-6 motion-safe:duration-700">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1f1b16]/10 bg-white/70 px-3 py-1 text-xs tracking-[0.25em] text-[#7a6048] uppercase">
              Clipper AI Studio
            </span>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Turn long conversations into viral-ready clips in minutes.
            </h1>
            <p className="text-lg text-[#5b5146] sm:text-xl">
              Upload your podcast, stream, or interview. Clipper finds the best
              moments, adds structure, and prepares highlights ready for social
              distribution.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#get-started"
                className="rounded-full bg-[#1f1b16] px-10 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#1f1b16]/20 transition hover:-translate-y-0.5 hover:bg-[#2c2620]"
              >
                Get started
              </Link>
              {/* <Link
                href="/sign-up"
                className="rounded-full border border-[#1f1b16]/20 bg-white/80 px-6 py-3 text-center text-sm font-semibold text-[#1f1b16] transition hover:-translate-y-0.5 hover:border-[#1f1b16]/30 hover:bg-white"
              >
                Create account
              </Link> */}
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#6b5c4e]">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-[#1f1b16]">
                  3x
                </span>
                Faster clip turnaround
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-[#1f1b16]">
                  48h
                </span>
                Weekly creator time saved
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-[#1f1b16]">1</span>
                Upload, auto highlight
              </div>
            </div>
          </div>

          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 relative motion-safe:delay-150 motion-safe:duration-700">
            <div className="absolute top-10 -left-6 hidden h-20 w-20 rounded-3xl border border-white/70 bg-white/80 shadow-lg shadow-[#1f1b16]/10 lg:block" />
            <div className="absolute -right-6 bottom-6 hidden h-16 w-16 rounded-full border border-white/70 bg-white/80 shadow-lg shadow-[#1f1b16]/10 lg:block" />
            <div className="rounded-[2.5rem] border border-white/60 bg-white/80 p-6 shadow-xl shadow-[#1f1b16]/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#1f1b16]">
                  New Upload
                </div>
                <span className="rounded-full bg-[#3fb6a8]/20 px-3 py-1 text-xs font-medium text-[#1f1b16]">
                  Processing
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  "Upload audio or video",
                  "AI detects highlight segments",
                  "Clips ready for export",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-[#1f1b16]/10 bg-white/70 px-4 py-3"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1f1b16]" />
                    <span className="text-sm font-medium text-[#3d332b]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-[#1f1b16]/10 bg-[#fef6eb] px-4 py-4">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#7a6048] uppercase">
                  Highlight pack
                </p>
                <p className="mt-2 text-sm text-[#3d332b]">
                  6 clips, each under 45 seconds, with captions auto-synced.
                </p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-[#f3e3cf]">
                  <div className="h-1.5 w-2/3 rounded-full bg-[#1f1b16]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="grid gap-6 border-t border-[#1f1b16]/10 py-14 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 flex flex-col gap-3 rounded-3xl border border-[#1f1b16]/10 bg-white/80 p-6 shadow-sm motion-safe:duration-700 ${featureDelays[index] ?? ""}`}
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-[#5b5146]">{feature.description}</p>
            </div>
          ))}
        </section>

        <section
          id="workflow"
          className="grid gap-10 border-t border-[#1f1b16]/10 py-14 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-700">
            <p className="text-xs tracking-[0.3em] text-[#7a6048] uppercase">
              Workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              From raw file to shareable highlight in one flow.
            </h2>
            <p className="mt-4 text-base text-[#5b5146]">
              No complicated editing pipeline. Upload once and let Clipper
              structure, caption, and prepare your best moments automatically.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#5b5146]">
              <span className="rounded-full border border-[#1f1b16]/10 bg-white/80 px-4 py-2">
                Auto timestamps
              </span>
              <span className="rounded-full border border-[#1f1b16]/10 bg-white/80 px-4 py-2">
                Multi-clip exports
              </span>
              <span className="rounded-full border border-[#1f1b16]/10 bg-white/80 px-4 py-2">
                Status tracking
              </span>
            </div>
          </div>
          <div className="grid gap-4">
            {workflowSteps.map((item, index) => (
              <div
                key={item.step}
                className={`motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 flex items-start gap-4 rounded-3xl border border-[#1f1b16]/10 bg-white/80 p-5 motion-safe:duration-700 ${workflowDelays[index] ?? ""}`}
              >
                <span className="text-sm font-semibold text-[#7a6048]">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#5b5146]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="get-started"
          className="grid gap-8 border-t border-[#1f1b16]/10 py-14 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div>
            <p className="text-xs tracking-[0.3em] text-[#7a6048] uppercase">
              Get started
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Ready to build your next highlight pack?
            </h2>
            <p className="mt-4 text-base text-[#5b5146]">
              Login or create new account to start clipping
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/sign-in"
              className="rounded-3xl border border-[#1f1b16]/15 bg-white/90 px-6 py-5 text-left transition hover:-translate-y-0.5 hover:border-[#1f1b16]/25"
            >
              <p className="text-sm font-semibold text-[#1f1b16]">Sign in</p>
              <p className="mt-2 text-sm text-[#5b5146]">
                Sign in to go to your dashboard directly
              </p>
            </Link>
            <Link
              href="/sign-up"
              className="rounded-3xl bg-[#1f1b16] px-6 py-5 text-left text-white shadow-lg shadow-[#1f1b16]/20 transition hover:-translate-y-0.5 hover:bg-[#2c2620]"
            >
              <p className="text-sm font-semibold">Create an account</p>
              <p className="mt-2 text-sm text-white/80">
                Create account if you did not have one
              </p>
            </Link>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#1f1b16]/10 py-8 text-sm text-[#6b5c4e] md:flex-row">
          {/* <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:text-[#1f1b16]">
              Login
            </Link>
            <Link href="/sign-up" className="hover:text-[#1f1b16]">
              Sign up
            </Link>
          </div> */}
          <span>Clipper AI Studio</span>
        </footer>
      </div>
    </main>
  );
}
