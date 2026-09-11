import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./LogoutButton";
import DeleteJobButton from "./DeleteJobButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">Manage jobs</h1>
        <LogoutButton />
      </div>

      <div className="flex gap-3 mb-5">
  <Link
    href="/admin/new"
    className="inline-block bg-brand-600 text-white text-sm px-4 py-2 rounded-md"
  >
    + Post a new job
  </Link>
  <Link
    href="/admin/bursaries"
    className="inline-block bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-md"
  >
    Manage bursaries
  </Link>
</div>

      <div className="flex flex-col gap-2">
        {jobs.length === 0 && (
          <p className="text-sm text-gray-500">No jobs posted yet.</p>
        )}
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border rounded-lg p-3 flex items-center justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{job.title}</p>
              <p className="text-xs text-gray-500">
                {job.company} &middot; {job.location}
              </p>
            </div>
            <div className="flex gap-3 shrink-0 text-xs">
              <Link href={`/admin/edit/${job.id}`} className="text-brand-600">
                Edit
              </Link>
              <DeleteJobButton jobId={job.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
