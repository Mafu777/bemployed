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
  accent: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  quickLinks?: { label: string; href: string }[];
  Icon: (props: { className?: string }) => React.ReactNode;
};

function IconBriefcase({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function IconGradCap({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}
function IconRocket({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2.5c3 0 7 3 7 7-3 0-9 1.5-11.5 4L7 10.5c2.5-2.5 4-8 7.5-8Z" />
      <path d="m8 16-4 4M7 13l-3 1 1 3M11 17l-1 3 3 1" />
    </svg>
  );
}
function IconChart({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10M12 20V4M20 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}
function IconBulb({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 21h4" />
      <path d="M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />
    </svg>
  );
}

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
    Icon: IconBriefcase,
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
    Icon: IconGradCap,
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
    Icon: IconRocket,
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
    Icon: IconChart,
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
    Icon: IconBulb,
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
  const SlideIcon = slide.Icon;

  return (
    <section
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Explore BEmployed"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
          {/* TEXT + SEARCH */}
          <div role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${SLIDES.length}: ${slide.tabLabel}`}>
            <p className={`text-xs sm:text-sm font-semibold uppercase tracking-wider text-${slide.accent}-300 mb-3`}>
              {slide.eyebrow}
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              {slide.heading}
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-300 max-w-xl">
              {slide.body}
            </p>

            {slide.key === "jobs" ? (
              <div className="mt-6 max-w-xl bg-white rounded-2xl p-2.5 shadow-2xl ring-1 ring-black/5">
                <Suspense fallback={null}>
                  <SearchFilterBar />
                </Suspense>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href={slide.primary.href}
                  className={`inline-block bg-${slide.accent}-500 hover:bg-${slide.accent}-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition`}
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
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
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

          {/* ILLUSTRATION — desktop/tablet only, keeps mobile compact */}
          <div className="hidden md:flex justify-center">
            <div className={`w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-${slide.accent}-500/15 ring-1 ring-${slide.accent}-400/30 flex items-center justify-center`}>
              <SlideIcon className={`w-16 h-16 lg:w-20 lg:h-20 text-${slide.accent}-300`} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-7 flex flex-wrap gap-2 sm:gap-3" role="tablist" aria-label="Choose a category">
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