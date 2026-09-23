"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SearchFilterBar from "@/components/SearchFilterBar";

type Slide = {
  key: string;
  tabLabel: string;
  eyebrow: string;
  heading: React.ReactNode;
  body: string;
  accent: string; // tailwind color word, e.g. "blue"
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  quickLinks?: { label: string; href: string }[];
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

  return (
    <section
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Explore BEmployed"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="max-w-3xl" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${SLIDES.length}: ${slide.tabLabel}`}>
          <p className={`text-sm font-semibold uppercase tracking-wider text-${slide.accent}-300 mb-4`}>
            {slide.eyebrow}
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            {slide.heading}
          </h1>

          <p className="mt-5 text-lg md:text-xl text-slate-300 max-w-2xl">
            {slide.body}
          </p>

          {slide.key === "jobs" ? (
            <div className="mt-8 bg-white rounded-2xl p-2 shadow-xl">
              <Suspense fallback={null}>
                <SearchFilterBar />
              </Suspense>
            </div>
          ) : (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={slide.primary.href}
                className={`inline-block bg-${slide.accent}-500 hover:bg-${slide.accent}-400 text-slate-900 font-semibold px-6 py-3 rounded-xl transition`}
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
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
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

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 sm:gap-3" role="tablist" aria-label="Choose a category">
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
      `}</style>
    </section>
  );
}