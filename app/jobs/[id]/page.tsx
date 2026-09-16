import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

const BASE_URL = "https://bemployed.co.za";

async function getJob(id: string) {
  return prisma.job.findUnique({ where: { id } });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  if (!job) return {};

  const plainDescription = stripHtml(job.description);
  const description =
    plainDescription.length > 155
      ? `${plainDescription.slice(0, 155)}...`
      : plainDescription;

  return {
    title: `${job.title} at ${job.company}${job.location ? ` | ${job.location}` : ""} – BEmployed`,
    description,
    alternates: {
      canonical: `${BASE_URL}/jobs/${job.id}`,
    },
  };
}

// Only maps job types that have a clear, correct schema.org equivalent.
// Anything else is left out of the structured data rather than guessed.
const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACT",
  Internship: "INTERN",
};

function buildJobPostingJsonLd(job: NonNullable<Awaited<ReturnType<typeof getJob>>>) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: stripHtml(job.description),
    datePosted: job.createdAt.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
  };

  if (job.closingDate) {
    jsonLd.validThrough = job.closingDate.toISOString();
  }

  if (job.jobType === "Remote") {
    jsonLd.jobLocationType = "TELECOMMUTE";
  } else if (job.location) {
    jsonLd.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "ZA",
      },
    };
  }

  if (EMPLOYMENT_TYPE_MAP[job.jobType]) {
    jsonLd.employmentType = EMPLOYMENT_TYPE_MAP[job.jobType];
  }

  if (job.salaryMin || job.salaryMax) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "ZAR",
      value: {
        "@type": "QuantitativeValue",
        ...(job.salaryMin ? { minValue: job.salaryMin } : {}),
        ...(job.salaryMax ? { maxValue: job.salaryMax } : {}),
        unitText: job.salaryPeriod === "year" ? "YEAR" : "MONTH",
      },
    };
  }

  return jsonLd;
}

function formatJobClosingDate(date?: Date | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await getJob(params.id);
  if (!job) notFound();

  const jobPostingJsonLd = buildJobPostingJsonLd(job);
  const closing = formatJobClosingDate(job.closingDate);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />

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
      <div className="flex gap-2 mb-3">
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {job.jobType}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {job.category}
        </span>
      </div>

      {closing && (
        <p className="text-xs text-gray-500 mb-5">Closing date: {closing}</p>
      )}

      <a
        href={job.applyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-brand-600 text-white text-sm px-5 py-2.5 rounded-md mb-6"
      >
        Apply for this job
      </a>

      <div
        className="prose prose-sm max-w-none text-gray-700 mb-6"
        dangerouslySetInnerHTML={{ __html: job.description }}
      />

      <AdSlot slotId="2222222222" />
    </div>
  );
}