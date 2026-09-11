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
    <div className="bg-gray-50 border-b px-4 pt-5 pb-4">
      <p className="text-lg font-medium mb-1">Find your next role</p>
      <p className="text-sm text-gray-500 mb-3">
        Fresh jobs from real companies, updated daily
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters(query, activeType);
        }}
        className="flex gap-2 mb-3"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Job title or keyword"
          className="flex-1 h-9 px-3 rounded-md border text-sm bg-white"
        />
        <button
          type="submit"
          className="h-9 px-4 rounded-md bg-brand-600 text-white text-sm"
        >
          Search
        </button>
      </form>
      <div className="flex gap-2 overflow-x-auto">
        {JOB_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => applyFilters(query, type)}
            className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-full border ${
              activeType === type
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-gray-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
