import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Remote Jobs | BEmployed",
  description:
    "Find remote and work-from-home job opportunities in South Africa and around the world.",
};

export default async function RemoteJobsPage() {
  const jobs = await prisma.job.findMany({
    where: { placementType: "Remote" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            BEmployed Remote Jobs
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Work from anywhere.
          </h1>
          <p className="text-lg text-slate-300 mt-5 max-w-2xl mx-auto">
            Discover remote and work-from-home opportunities that give you the
            flexibility to build your career from wherever you are.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        {jobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <h3 className="font-semibold text-slate-900">No remote jobs listed right now</h3>
            <p className="text-sm text-slate-500 mt-2">Check back soon, or browse all jobs.</p>
            <Link href="/jobs" className="inline-block mt-5 text-blue-600 font-semibold">
              Browse all jobs →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}