"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LINKS = [
  { href: "/", label: "Local Jobs" },
  { href: "/?type=Remote", label: "Remote Jobs" },
  { href: "/work-abroad", label: "Work Abroad" },
  { href: "/bursaries", label: "Bursaries" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split("?");
    if (pathname !== hrefPath) return false;
    if (!hrefQuery) return !searchParams.get("type");
    return searchParams.get("type") === new URLSearchParams(hrefQuery).get("type");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="BEmployed"
              width={1168}
              height={242}
              priority
              style={{ height: "32px", width: "auto" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-brand-700 bg-brand-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-md ${
                isActive(link.href)
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}