import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedInFromCookies } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  if (!(await isLoggedInFromCookies())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, excerpt, content, coverImageUrl, metaTitle, metaDescription, published, featured } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: await uniqueSlug(title),
      excerpt: excerpt || null,
      content,
      coverImageUrl: coverImageUrl || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      published: published ?? true,
      featured: featured ?? false,
    },
  });

  return NextResponse.json(post, { status: 201 });
}