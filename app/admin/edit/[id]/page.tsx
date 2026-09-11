import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JobForm from "@/components/JobForm";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) notFound();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-lg font-medium mb-4">Edit job</h1>
      <JobForm
        jobId={job.id}
        initialValues={{
          title: job.title,
          company: job.company,
          companyLogoUrl: job.companyLogoUrl || "",
          location: job.location,
          jobType: job.jobType,
          category: job.category,
          description: job.description,
          applyLink: job.applyLink,
        }}
      />
    </div>
  );
}
