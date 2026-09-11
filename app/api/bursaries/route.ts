import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedInFromCookies } from "@/lib/auth";

export async function GET() {
  const bursaries = await prisma.bursary.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(bursaries);
}

export async function POST(request: NextRequest) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, provider, fieldOfStudy, description, closingDate, applyLink } = body;

  if (!title || !provider || !description || !applyLink) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const bursary = await prisma.bursary.create({
    data: {
      title,
      provider,
      fieldOfStudy: fieldOfStudy || null,
      description,
      closingDate: closingDate ? new Date(closingDate) : null,
      applyLink,
    },
  });

  return NextResponse.json(bursary, { status: 201 });
}