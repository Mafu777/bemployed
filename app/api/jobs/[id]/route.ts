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
  const job = await prisma.job.update({ where: { id: params.id }, data: body });
  return NextResponse.json(job);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.job.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}