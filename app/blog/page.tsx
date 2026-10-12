// STEP 1 - replace app/blog/page.tsx with this code.
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Career Blog | BEmployed",
  description: "Career advice, job search tips, and workplace insights.",
};

async function getPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    // Featured article first (newest featured wins), then the rest newest first.
    // If nothing is marked featured, the newest article leads.
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

const formatDate = (d: Date) =>
  new Date(d).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function BlogPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      <div className="bg-gray-50 border-b px-4 pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Career Blog
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Advice and insights to help your job search.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">
            No articles yet. Check back soon.
          </p>
        ) : (
          <>
            {/* Featured article */}
            <Link
              href={`/blog/${featured.id}`}
              className="group grid md:grid-cols-2 bg-white border rounded-2xl overflow-hidden hover:border-brand-400 transition-colors"
            >
              <div className="relative w-full aspect-[16/9] md:aspect-auto md:min-h-[280px] bg-gradient-to-br from-brand-600 to-blue-300">
                {featured.coverImageUrl && (
                  <Image
                    src={featured.coverImageUrl}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-5 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-brand-600 text-white font-semibold rounded px-2 py-0.5">
                    {featured.featured ? "Featured" : "Latest"}
                  </span>
                  <span>{formatDate(featured.createdAt)}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold leading-snug mt-3 group-hover:text-brand-600 transition-colors">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-gray-600 mt-2 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
                <span className="mt-4 font-semibold text-brand-600">
                  Read article
                </span>
              </div>
            </Link>

            {/* Latest articles */}
            {rest.length > 0 && (
              <section className="mt-10" aria-label="Latest articles">
                <h2 className="text-lg font-bold mb-2">Latest articles</h2>
                <div>
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="group grid gap-4 sm:grid-cols-[1fr_200px] sm:gap-8 border-t py-6"
                    >
                      <div>
                        <p className="text-xs text-gray-400">
                          {formatDate(post.createdAt)}
                        </p>
                        <h3 className="text-lg font-semibold leading-snug mt-1 group-hover:text-brand-600 transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="relative order-first sm:order-none w-full h-36 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-brand-600 to-blue-300">
                        {post.coverImageUrl && (
                          <Image
                            src={post.coverImageUrl}
                            alt={post.title}
                            fill
                            sizes="(min-width: 640px) 200px, 100vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Call to action */}
            <section className="mt-10 bg-gray-50 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">
                  Ready to apply what you learned?
                </h2>
                <p className="text-sm text-gray-600">
                  Browse the latest jobs, learnerships and bursaries across
                  South Africa.
                </p>
              </div>
              <Link
                href="/jobs"
                className="bg-brand-600 text-white font-semibold rounded-lg px-5 py-3"
              >
                Browse jobs
              </Link>
            </section>
          </>
        )}
      </div>
    </div>
  );
}