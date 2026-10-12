"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SearchFilterBar from "@/components/SearchFilterBar";

type AccentKey = "blue" | "emerald" | "fuchsia" | "amber" | "sky";

// Static class map — Tailwind can only generate classes it can see as full
// literal strings in the source, so these must be written out, not built
// with template literals like `text-${accent}-300`.
const ACCENTS: Record<AccentKey, { eyebrow: string; btn: string; badgeBg: string; badgeRing: string; badgeText: string }> = {
  blue: { eyebrow: "text-blue-300", btn: "bg-blue-500 hover:bg-blue-400", badgeBg: "bg-blue-500/15", badgeRing: "ring-blue-400/30", badgeText: "text-blue-300" },
  emerald: { eyebrow: "text-emerald-300", btn: "bg-emerald-500 hover:bg-emerald-400", badgeBg: "bg-emerald-500/15", badgeRing: "ring-emerald-400/30", badgeText: "text-emerald-300" },
  fuchsia: { eyebrow: "text-fuchsia-300", btn: "bg-fuchsia-500 hover:bg-fuchsia-400", badgeBg: "bg-fuchsia-500/15", badgeRing: "ring-fuchsia-400/30", badgeText: "text-fuchsia-300" },
  amber: { eyebrow: "text-amber-300", btn: "bg-amber-500 hover:bg-amber-400", badgeBg: "bg-amber-500/15", badgeRing: "ring-amber-400/30", badgeText: "text-amber-300" },
  sky: { eyebrow: "text-sky-300", btn: "bg-sky-500 hover:bg-sky-400", badgeBg: "bg-sky-500/15", badgeRing: "ring-sky-400/30", badgeText: "text-sky-300" },
};

type Slide = {
  key: string;
  tabLabel: string;
  eyebrow: string;
  heading: React.ReactNode;
  body: string;
  accent: AccentKey;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  quickLinks?: { label: string; href: string }[];
  icon: React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    key: "jobs",
    tabLabel: "Jobs",
    eyebrow: "Welcome to BEmployed",
    heading: (
      <>
        Your next opportunity
        <span className="text-blue-400"> starts here.</span>
      </>
    ),
    body: "Find jobs, remote work, internships, learnerships, bursaries and career opportunities — all in one place.",
    accent: "blue",
    primary: { label: "Search jobs", href: "/jobs" },
    quickLinks: [
      { label: "Admin", href: "/jobs?q=Admin" },
      { label: "Driver", href: "/jobs?q=Driver" },
      { label: "Sales", href: "/jobs?q=Sales" },
      { label: "Retail", href: "/jobs?q=Retail" },
      { label: "IT", href: "/jobs?q=IT" },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    key: "students",
    tabLabel: "Students & Learners",
    eyebrow: "For students & learners",
    heading: (
      <>
        Get funding
        <span className="text-emerald-400"> to study.</span>
      </>
    ),
    body: "Bursaries and learnerships for matrics and students. See what you qualify for and apply before it closes.",
    accent: "emerald",
    primary: { label: "Find bursaries", href: "/bursaries" },
    secondary: { label: "See learnerships", href: "/bursaries" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
  {
    key: "graduates",
    tabLabel: "Graduates",
    eyebrow: "For graduates",
    heading: (
      <>
        Turn your degree
        <span className="text-fuchsia-400"> into experience.</span>
      </>
    ),
    body: "Internships, graduate programmes and entry-level jobs that don't ask for years of experience.",
    accent: "fuchsia",
    primary: { label: "See graduate jobs", href: "/jobs?q=Graduate" },
    secondary: { label: "Find internships", href: "/jobs?q=Intern" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14.5 2.5c3 0 7 3 7 7-3 0-9 1.5-11.5 4L7 10.5c2.5-2.5 4-8 7.5-8Z" /><path d="m8 16-4 4M7 13l-3 1 1 3M11 17l-1 3 3 1" />
      </svg>
    ),
  },
  {
    key: "entrepreneurs",
    tabLabel: "Entrepreneurship",
    eyebrow: "For entrepreneurs",
    heading: (
      <>
        Start and grow
        <span className="text-amber-400"> your business.</span>
      </>
    ),
    body: "Open tenders, funding and grants for small businesses and start-ups across South Africa.",
    accent: "amber",
    primary: { label: "Explore tenders", href: "/tenders" },
    secondary: { label: "Find funding", href: "/funding" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 20V10M12 20V4M20 20v-7" /><path d="M3 20h18" />
      </svg>
    ),
  },
  {
    key: "advice",
    tabLabel: "Career Advice",
    eyebrow: "Career support",
    heading: (
      <>
        Get hired
        <span className="text-sky-400"> faster.</span>
      </>
    ),
    body: "CV tips, interview guides and job scam warnings written for South African job seekers.",
    accent: "sky",
    primary: { label: "Read career advice", href: "/blog" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 18h6M10 21h4" /><path d="M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />
      </svg>
    ),
  },
];

const DURATION_MS = 7000;

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused]);

  const slide = SLIDES[index];
  const a = ACCENTS[slide.accent];

  return (
    <section
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Explore BEmployed"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {/* Fixed-height stage keeps every slide the same height, no layout jump */}
        <div className="min-h-[430px] sm:min-h-[400px] md:min-h-[360px] flex flex-col justify-center">
          <div
            key={slide.key}
            className="text-center animate-[heroFade_.5s_ease]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}: ${slide.tabLabel}`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`w-8 h-8 rounded-full ${a.badgeBg} ring-1 ${a.badgeRing} flex items-center justify-center ${a.badgeText}`}>
                {slide.icon}
              </span>
              <p className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${a.eyebrow}`}>
                {slide.eyebrow}
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              {slide.heading}
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-300 max-w-xl mx-auto">
              {slide.body}
            </p>

            {slide.key === "jobs" ? (
              <div className="mt-6 w-full bg-white rounded-2xl p-2.5 shadow-2xl ring-1 ring-black/5 text-left">
                <Suspense fallback={null}>
                  <SearchFilterBar />
                </Suspense>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={slide.primary.href}
                  className={`inline-block ${a.btn} text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition`}
                >
                  {slide.primary.label}
                </Link>
                {slide.secondary && (
                  <Link
                    href={slide.secondary.href}
                    className="inline-block font-semibold text-white/90 hover:text-white underline underline-offset-4"
                  >
                    {slide.secondary.label}
                  </Link>
                )}
              </div>
            )}

            {slide.quickLinks && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
                <span className="text-slate-400">Popular:</span>
                {slide.quickLinks.map((link, i) => (
                  <span key={link.href} className="flex items-center gap-2">
                    {i > 0 && <span className="text-slate-600">•</span>}
                    <Link href={link.href} className="hover:text-blue-300 transition">
                      {link.label}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-7 flex flex-wrap justify-center gap-2 sm:gap-3" role="tablist" aria-label="Choose a category">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`relative overflow-hidden rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                i === index
                  ? "bg-white/15 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {i === index && !paused && (
                <span
                  key={index}
                  className="absolute inset-0 bg-white/10 origin-left"
                  style={{ animation: `bemployed-fill ${DURATION_MS}ms linear forwards` }}
                />
              )}
              <span className="relative">{s.tabLabel}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bemployed-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}