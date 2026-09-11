import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BursaryForm from "@/components/BursaryForm";

export const dynamic = "force-dynamic";

export default async function EditBursaryPage({ params }: { params: { id: string } }) {
  const bursary = await prisma.bursary.findUnique({ where: { id: params.id } });
  if (!bursary) notFound();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-lg font-medium mb-4">Edit bursary</h1>
      <BursaryForm
        bursaryId={bursary.id}
        initialValues={{
          title: bursary.title,
          provider: bursary.provider,
          fieldOfStudy: bursary.fieldOfStudy || "",
          description: bursary.description,
          closingDate: bursary.closingDate
            ? new Date(bursary.closingDate).toISOString().split("T")[0]
            : "",
          applyLink: bursary.applyLink,
        }}
      />
    </div>
  );
}