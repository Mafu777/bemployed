import Link from "next/link";
import Image from "next/image";

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
  const fmt = (n: number) =>
    `R${n.toLocaleString("en-ZA")}`;
  const label = period === "year" ? "/ year" : "/ month";
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${label}`;
  if (min) return `From ${fmt(min)} ${label}`;
  return `Up to ${fmt(max!)} ${label}`;
}
export default function JobCard({ job }: { job: Job }) {
  const initials = job.company
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block bg-white border rounded-xl p-4 hover:border-brand-400 transition-colors"
    >
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
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{job.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {job.company} &middot; {job.location}
          </p>
        </div>
      </div>
      {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod) && (
  <p className="text-sm font-medium text-brand-700 mt-2">
    {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
  </p>
)}

<div className="flex gap-2 mt-3">
  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
    {job.jobType}
  </span>
  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
    {timeAgo(job.createdAt)}
  </span>
</div>
    </Link>
  );
}
