import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import SearchFilterBar from "@/components/SearchFilterBar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Jobs | BEmployed",
  description:
    "Browse all job listings on BEmployed — full-time, part-time, contract, and remote opportunities across South Africa.",
};

async function getJobs(q?: string, type?: string) {
  return prisma.job.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q } },
                { company: { contains: q } },
              ],
            }
          : {},
        type && type !== "All jobs" ? { jobType: type } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const jobs = await getJobs(searchParams.q, searchParams.type);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {searchParams.type ? `${searchParams.type} jobs` : "All jobs"}
          </h1>
          <p className="mt-2 text-slate-600">
            {jobs.length} opportunit{jobs.length === 1 ? "y" : "ies"} found
            {searchParams.q ? ` for "${searchParams.q}"` : ""}
          </p>
        </div>

        <div className="mb-8 bg-white rounded-2xl p-2 shadow border border-slate-200">
          <Suspense fallback={null}>
            <SearchFilterBar />
          </Suspense>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">🔎</div>
            <h3 className="font-semibold text-slate-900">
              No opportunities found
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Try another search or check back soon for new opportunities.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}