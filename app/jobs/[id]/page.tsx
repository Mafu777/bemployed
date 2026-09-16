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
        unitText: job.salaryPeriod === "year" ? "YEAR" :