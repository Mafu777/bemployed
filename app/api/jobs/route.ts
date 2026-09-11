import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedInFromCookies } from "@/lib/auth";

export async function GET() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    company,
    companyLogoUrl,
    location,
    jobType,
    category,
    description,
    applyLink,
    salaryMin,
    salaryMax,
    salaryPeriod,
  } = body;

  if (!title || !company || !location || !jobType || !category || !description || !applyLink) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      title,
      company,
      companyLogoUrl: companyLogoUrl || null,
      location,
      jobType,
      category,
      description,
      applyLink,
      salaryMin: salaryMin ?? null,
      salaryMax: salaryMax ?? null,
      salaryPeriod: salaryPeriod ?? null,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
