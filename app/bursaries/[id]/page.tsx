import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getBursary(id: string) {
  return prisma.bursary.findUnique({ where: { id } });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const bursary = await getBursary(params.id);
  if (!bursary) return {};
  return {
    title: `${bursary.title} | ${bursary.provider} – BEmployed Bursaries`,
    description: stripHtml(bursary.description).slice(0, 155),
  };
}

function formatClosingDate(date?: Date | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BursaryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const bursary = await getBursary(params.id);
  if (!bursary) notFound();

  const closing = formatClosingDate(bursary.closingDate);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {bursary.providerLogoUrl && (
        <div className="w-12 h-12 rounded-lg overflow-hidden border mb-3">
          <Image
            src={bursary.providerLogoUrl}
            alt={bursary.provider}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <p className="text-xs text-gray-400 mb-1">
        {bursary.provider}
        {bursary.fieldOfStudy ? ` · ${bursary.fieldOfStudy}` : ""}
      </p>
      <h1 className="text-xl font-medium mb-3">{bursary.title}</h1>

      {closing && (
        <span className="inline-block mb-5 text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          Closing date: {closing}
        </span>
      )}

      <a
        href={bursary.applyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-brand-600 text-white text-sm px-5 py-2.5 rounded-md mb-6"
      >
        Apply for this bursary
      </a>

      <div
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: bursary.description }}
      />
    </div>
  );
}