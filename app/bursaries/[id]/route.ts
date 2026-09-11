import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedInFromCookies } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const bursary = await prisma.bursary.findUnique({ where: { id: params.id } });
  if (!bursary) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(bursary);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  if (body.closingDate) {
    body.closingDate = new Date(body.closingDate);
  }
  const bursary = await prisma.bursary.update({ where: { id: params.id }, data: body });
  return NextResponse.json(bursary);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.bursary.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}