import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Find Jobs in South Africa | Remote, Local & Learnership Opportunities – BEmployed",
  description:
    "Browse real, up-to-date job listings across South Africa, including remote jobs, local jobs, learnerships, internships and bursaries. Updated daily.",
  alternates: {
    canonical: "https://bemployed.co.za",
  },
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

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const jobs = await getJobs(searchParams.q, searchParams.type);

  return (
    <div>
      <Suspense fallback={null}>
        <SearchFilterBar />
      </Suspense>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {jobs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">
            No jobs match your search right now. Check back soon.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job, index) => (
              <div key={job.id} className="flex flex-col gap-3">
                <JobCard job={job} />
                {index === 1 && <AdSlot slotId="1111111111" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
