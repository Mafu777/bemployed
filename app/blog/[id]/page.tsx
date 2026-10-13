// STEP 6 - replace app/blog/[id]/page.tsx with this code.
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPost(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post || !post.published) return null;
  return post;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return { title: "Article not found | BEmployed" };
  return {
    title: `${post.title} | BEmployed Career Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      <Link
        href="/blog"
        className="text-sm font-semibold text-brand-600 hover:underline"
      >
        &larr; All articles
      </Link>

      {post.coverImageUrl && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mt-4">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <p className="text-sm text-gray-400 mt-5">
        {new Date(post.createdAt).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight mt-2">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="text-lg text-gray-600 mt-3">{post.excerpt}</p>
      )}

      <div
        className="article-body mt-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <section className="mt-10 bg-gray-50 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Ready to apply what you learned?</h2>
          <p className="text-sm text-gray-600">
            Browse the latest jobs, learnerships and bursaries across South
            Africa.
          </p>
        </div>
        <Link
          href="/jobs"
          className="bg-brand-600 text-white font-semibold rounded-lg px-5 py-3"
        >
          Browse jobs
        </Link>
      </section>

      {/* Styles for the article text. Overrides fonts pasted in from Word/Docs. */}
      <style>{`
        .article-body { font-size: 1.05rem; line-height: 1.75; color: #1f2937; }
        .article-body * { font-family: inherit !important; }
        .article-body span { font-size: inherit !important; color: inherit !important; background: none !important; }
        .article-body p { margin: 0 0 1rem; }
        .article-body h2 { font-size: 1.5rem; font-weight: 800; line-height: 1.25; margin: 2rem 0 .75rem; }
        .article-body h3 { font-size: 1.25rem; font-weight: 700; margin: 1.5rem 0 .5rem; }
        .article-body strong { font-weight: 700; }
        .article-body ul, .article-body ol { margin: 0 0 1rem 1.25rem; padding: 0; }
        .article-body ul { list-style: disc; }
        .article-body ol { list-style: decimal; }
        .article-body li { margin: .35rem 0; }
        .article-body a { color: #2563eb; text-decoration: underline; }
        .article-body img { max-width: 100%; height: auto; border-radius: 12px; margin: 1rem 0; }
        .article-body blockquote { border-left: 4px solid #2563eb; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; }
        .article-body table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; margin: 1rem 0; }
        .article-body td, .article-body th { border: 1px solid #e5e7eb; padding: .5rem .75rem; }
      `}</style>
    </article>
  );
}