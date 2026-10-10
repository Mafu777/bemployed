import Link from "next/link";
import Image from "next/image";

type Bursary = {
  id: string;
  title: string;
  provider: string;
  providerLogoUrl?: string | null;
  fieldOfStudy?: string | null;
  description: string;
  closingDate?: string | Date | null;
  applyLink: string;
};

function formatClosingDate(date?: string | Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const today = new Date();
  const days = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const formatted = d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (days < 0) return `Closed ${formatted}`;
  if (days === 0) return `Closes today (${formatted})`;
  if (days <= 7) return `Closes in ${days} days (${formatted})`;
  return `Closes ${formatted}`;
}

// Strips HTML tags for the card preview — descriptions are stored as HTML,
// but a truncated 2-line preview should just be plain text.
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

const FALLBACK_COLORS = ["#2563EB", "#0EA5A4", "#DB2777", "#D97706", "#7C3AED"];

function fallbackColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

export default function BursaryCard({ bursary }: { bursary: Bursary }) {
  const closing = formatClosingDate(bursary.closingDate);
  const preview = stripHtml(bursary.description);

  return (
    <Link
      href={`/bursaries/${bursary.id}`}
      className="flex gap-3 bg-white border rounded-xl p-4 hover:border-brand-400 transition-colors"
    >
      {bursary.providerLogoUrl ? (
        <Image
          src={bursary.providerLogoUrl}
          alt={bursary.provider}
          width={44}
          height={44}
          className="w-11 h-11 rounded-lg object-contain border shrink-0 bg-white"
        />
      ) : (
        <div
          className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: fallbackColor(bursary.provider) }}
        >
          {initials(bursary.provider)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{bursary.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {bursary.provider}
          {bursary.fieldOfStudy ? ` · ${bursary.fieldOfStudy}` : ""}
        </p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{preview}</p>
        {closing && (
          <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
            {closing}
          </span>
        )}
      </div>
    </Link>
  );
}