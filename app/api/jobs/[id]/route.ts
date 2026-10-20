import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedInFromCookies } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const job = await prisma.job.update({
    where: { id: params.id },
    data: {
      title: body.title,
      company: body.company,
      companyLogoUrl: body.companyLogoUrl || null,
      location: body.location,
      city: body.city || null,
      jobType: body.jobType,
      category: body.category,
      placementType: body.placementType || "Local",
      description: body.description,
      minRequirements: body.minRequirements || null,
      keyResponsibilities: body.keyResponsibilities || null,
      applyLink: body.applyLink,
      salaryMin: body.salaryMin ?? null,
      salaryMax: body.salaryMax ?? null,
      salaryPeriod: body.salaryPeriod ?? null,
      closingDate: body.closingDate ? new Date(body.closingDate) : null,
    },
  });

  return NextResponse.json(job);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.job.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}