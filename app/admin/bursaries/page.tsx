import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "../LogoutButton";
import DeleteBursaryButton from "./DeleteBursaryButton";

export const dynamic = "force-dynamic";

export default async function AdminBursariesDashboard() {
  const bursaries = await prisma.bursary.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">Manage bursaries</h1>
        <LogoutButton />
      </div>

      <div className="flex gap-3 mb-5">
        <Link
          href="/admin"
          className="text-sm text-gray-500 underline underline-offset-4 self-center"
        >
          Back to jobs
        </Link>
        <Link
          href="/admin/bursaries/new"
          className="inline-block bg-brand-600 text-white text-sm px-4 py-2 rounded-md"
        >
          + Post a new bursary
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {bursaries.length === 0 && (
          <p className="text-sm text-gray-500">No bursaries posted yet.</p>
        )}
        {bursaries.map((bursary) => (
          <div
            key={bursary.id}
            className="bg-white border rounded-lg p-3 flex items-center justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{bursary.title}</p>
              <p className="text-xs text-gray-500">
                {bursary.provider}
                {bursary.fieldOfStudy ? ` · ${bursary.fieldOfStudy}` : ""}
              </p>
            </div>
            <div className="flex gap-3 shrink-0 text-xs">
              <Link href={`/admin/bursaries/edit/${bursary.id}`} className="text-brand-600">
                Edit
              </Link>
              <DeleteBursaryButton bursaryId={bursary.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}