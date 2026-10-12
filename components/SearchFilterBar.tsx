"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const JOB_TYPES = ["All jobs", "Full-time", "Part-time", "Contract", "Remote"];

export default function SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const activeType = searchParams.get("type") || "All jobs";

  function applyFilters(nextQuery: string, nextType: string) {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    if (nextType && nextType !== "All jobs") params.set("type", nextType);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="px-1.5 py-1.5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters(query, activeType);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Job title or keyword"
          className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="h-11 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition shrink-0"
        >
          Search
        </button>
      </form>
      <div className="flex gap-2 overflow-x-auto mt-2.5 pb-0.5">
        {JOB_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => applyFilters(query, type)}
            className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-full border transition ${
              activeType === type
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}