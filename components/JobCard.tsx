"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconBookmark, IconShare } from "@/components/Icons";

type Job = {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string | null;
  location: string;
  jobType: string;
  createdAt: string | Date;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string | null;
  closingDate?: string | Date | null;
};

function timeAgo(date: string | Date): string {
  const then = new Date(date).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  return `Posted ${days} days ago`;
}

function formatSalary(
  min?: number | null,
  max?: number | null,
  period?: string | null
): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => `R${n.toLocaleString("en-ZA")}`;
  const label = period === "year" ? "/ year" : "/ month";
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${label}`;
  if (min) return `From ${fmt(min)} ${label}`;
  return `Up to ${fmt(max!)} ${label}`;
}

function formatJobClosingDate(date?: string | Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const today = new Date();
  const days = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (days < 0) return `Closed ${formatted}`;
  if (days === 0) return `Closes today (${formatted})`;
  if (days <= 7) return `Closes in ${days} days (${formatted})`;
  return `Closes ${formatted}`;
}

export default function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

  const initials = job.company
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod);
  const closing = formatJobClosingDate(job.closingDate);

  return (
    <div className="relative bg-white border rounded-xl p-4 hover:border-brand-400 transition-colors">
      {/* Stretched link: makes the whole card clickable without nesting
          interactive elements inside an <a>. The save/share buttons sit
          above it via z-10 and stop propagation so their own clicks win. */}
      <Link
        href={`/jobs/${job.id}`}
        className="absolute inset-0 z-0"
        aria-label={`View ${job.title} at ${job.company}`}
      />

      <div className="flex items-start gap-3">
        {job.companyLogoUrl ? (
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border">
            <Image
              src={job.companyLogoUrl}
              alt={job.company}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-800 flex items-center justify-center font-medium text-sm shrink-0">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{job.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {job.company} &middot; {job.location}
          </p>
        </div>

        <div className="relative z-10 flex gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved jobs" : "Save job"}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              saved ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"
            }`}
          >
            <IconBookmark className={`w-4 h-4 ${saved ? "fill-amber-600" : ""}`} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (navigator.share) {
                navigator.share({
                  title: job.title,
                  text: `${job.title} at ${job.company} — BEmployed`,
                  url: `${window.location.origin}/jobs/${job.id}`,
                }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(`${window.location.origin}/jobs/${job.id}`);
              }
            }}
            aria-label="Share job"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500"
          >
            <IconShare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {salary && (
        <p className="text-sm font-medium text-brand-700 mt-2">{salary}</p>
      )}

      {closing && (
        <p className="text-xs text-gray-500 mt-1">{closing}</p>
      )}

      <div className="flex gap-2 mt-3">
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {job.jobType}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {timeAgo(job.createdAt)}
        </span>
      </div>
    </div>
  );
}