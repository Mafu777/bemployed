import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedInFromCookies } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const { title, excerpt, content, coverImageUrl, metaTitle, metaDescription, published, featured } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Keep slugs stable once published so links never break.
  const slug =
    !existing.slug || (!existing.published && existing.title !== title)
      ? await uniqueSlug(title, id)
      : existing.slug;

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImageUrl: coverImageUrl || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      published,
      featured,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}