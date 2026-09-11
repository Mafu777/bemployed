import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {job.companyLogoUrl && (
        <div className="w-12 h-12 rounded-lg overflow-hidden border mb-3">
          <Image
            src={job.companyLogoUrl}
            alt={job.company}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <p className="text-xs text-gray-400 mb-1">
        {job.company} &middot; {job.location}
      </p>
      <h1 className="text-xl font-medium mb-3">{job.title}</h1>
      <div className="flex gap-2 mb-5">
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {job.jobType}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {job.category}
        </span>
      </div>

      <a
        href={job.applyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-brand-600 text-white text-sm px-5 py-2.5 rounded-md mb-6"
      >
        Apply for this job
      </a>

      <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 mb-6">
        {job.description}
      </div>

      <AdSlot slotId="2222222222" />
    </div>
  );
}
