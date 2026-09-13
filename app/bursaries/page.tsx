import { prisma } from "@/lib/prisma";
import BursaryCard from "@/components/BursaryCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "South African Bursaries | Find Funding for Your Studies – BEmployed",
  description:
    "Explore bursaries and funding opportunities for South African students, including NSFAS, corporate and university-funded bursaries. Updated regularly.",
  alternates: {
    canonical: "https://bemployed.co.za/bursaries",
  },
};

async function getBursaries() {
  return prisma.bursary.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function BursariesPage() {
  const bursaries = await getBursaries();

  return (
    <div>
      <div className="bg-gray-50 border-b px-4 pt-5 pb-4">
        <p className="text-lg font-medium mb-1">Bursaries for students</p>
        <p className="text-sm text-gray-500">
          Funding opportunities from universities, companies, and government
          programmes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {bursaries.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">
            No bursaries listed right now. Check back soon.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {bursaries.map((bursary) => (
              <BursaryCard key={bursary.id} bursary={bursary} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}