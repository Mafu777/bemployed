import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import AdSlot from "@/components/AdSlot";
import HeroSlideshow from "@/components/HeroSlideshow";

export const dynamic = "force-dynamic";

export const metadata = {
  title:
    "BEmployed | Jobs, Career Opportunities, Remote Work & Learnerships in South Africa",
  description:
    "Find jobs, remote work, internships, learnerships, bursaries and career opportunities across South Africa with BEmployed.",
  alternates: {
    canonical: "https://bemployed.co.za",
  },
};

async function getJobs(q?: string, type?: string) {
  return prisma.job.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q } },
                { company: { contains: q } },
              ],
            }
          : {},
        type && type !== "All jobs" ? { jobType: type } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getFeaturedPosts() {
  return prisma.blogPost.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const [jobs, posts] = await Promise.all([
    getJobs(searchParams.q, searchParams.type),
    getFeaturedPosts(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <HeroSlideshow />

      {/* CAREER SUPPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-blue-600 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-blue-100">
              CAREER SUPPORT
            </p>
            <h3 className="text-xl md:text-2xl font-bold mt-2">
              Make your next move count.
            </h3>
            <p className="text-sm text-blue-100 mt-3 leading-6 max-w-xl">
              Get practical advice on CVs, interviews, skills and building
              your career.
            </p>
          </div>

          <Link
            href="/blog"
            className="shrink-0 inline-block bg-white text-blue-700 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Explore Career Advice
          </Link>
        </div>
      </section>

      {/* LATEST OPPORTUNITIES + SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* MAIN JOBS */}
          <div className="lg:col-span-8">

            <div className="flex items-end justify-between mb-5">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Latest opportunities
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Recently added opportunities on BEmployed
                </p>
              </div>

              <Link
                href="/jobs"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>

            </div>

            {jobs.length === 0 ? (

              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                <div className="text-4xl mb-4">
                  🔎
                </div>

                <h3 className="font-semibold text-slate-900">
                  No opportunities found
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Try another search or check back soon for new opportunities.
                </p>

              </div>

            ) : (

              <div className="flex flex-col gap-4">

                {jobs.slice(0, 6).map((job, index) => (

                  <div
                    key={job.id}
                    className="flex flex-col gap-4"
                  >

                    <JobCard job={job} />

                    {index === 1 && (
                      <AdSlot slotId="1111111111" />
                    )}

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4 space-y-5">

            {/* FEATURED ARTICLES */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">

              <p className="text-sm font-semibold text-blue-600">
                FEATURED ARTICLES
              </p>

              <div className="mt-4 space-y-4">
                {posts.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    New articles coming soon.
                  </p>
                ) : (
                  posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(post.createdAt).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </Link>
                  ))
                )}
              </div>

              <Link
                href="/blog"
                className="inline-block mt-5 font-semibold text-blue-600 hover:text-blue-700"
              >
                All articles →
              </Link>

            </div>

            {/* QUICK LINKS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">

              <h3 className="font-bold text-lg text-slate-900">
                Quick links
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <Link
                  href="/about"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  About BEmployed
                </Link>

                <Link
                  href="/contact"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  Contact us
                </Link>

                <Link
                  href="/blog"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  Career advice
                </Link>

                <Link
                  href="/bursaries"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  Bursaries
                </Link>

              </div>

            </div>

          </aside>

        </div>
      </section>

    </main>
  );
}