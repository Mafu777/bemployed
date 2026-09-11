type Bursary = {
  id: string;
  title: string;
  provider: string;
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

export default function BursaryCard({ bursary }: { bursary: Bursary }) {
  const closing = formatClosingDate(bursary.closingDate);

  return (
    <a
      href={bursary.applyLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border rounded-xl p-4 hover:border-brand-400 transition-colors"
    >
      <p className="font-medium text-sm">{bursary.title}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {bursary.provider}
        {bursary.fieldOfStudy ? ` · ${bursary.fieldOfStudy}` : ""}
      </p>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {bursary.description}
      </p>
      {closing && (
        <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {closing}
        </span>
      )}
    </a>
  );
}