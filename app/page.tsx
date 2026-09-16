import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import AdSlot from "@/components/AdSlot";

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

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const jobs = await getJobs(searchParams.q, searchParams.type);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">

          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">
              Welcome to BEmployed
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Your next opportunity
              <span className="text-blue-400"> starts here.</span>
            </h1>

            <p className="mt-5 text-lg md:text-xl text-slate-300 max-w-2xl">
              Find jobs, remote work, internships, learnerships, bursaries
              and career opportunities — all in one place.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-8 bg-white rounded-2xl p-2 shadow-xl">
            <Suspense fallback={null}>
              <SearchFilterBar />
            </Suspense>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="text-slate-400">Popular:</span>

            <Link
              href="/jobs?q=Admin"
              className="hover:text-blue-300 transition"
            >
              Admin
            </Link>

            <span className="text-slate-600">•</span>

            <Link
              href="/jobs?q=Driver"
              className="hover:text-blue-300 transition"
            >
              Driver
            </Link>

            <span className="text-slate-600">•</span>

            <Link
              href="/jobs?q=Sales"
              className="hover:text-blue-300 transition"
            >
              Sales
            </Link>

            <span className="text-slate-600">•</span>

            <Link
              href="/jobs?q=Retail"
              className="hover:text-blue-300 transition"
            >
              Retail
            </Link>

            <span className="text-slate-600">•</span>

            <Link
              href="/jobs?q=IT"
              className="hover:text-blue-300 transition"
            >
              IT
            </Link>
          </div>
        </div>
      </section>

      {/* EXPLORE OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Explore opportunities
          </h2>

          <p className="mt-2 text-slate-600">
            More than just jobs. Discover different ways to move your career
            forward.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {/* JOBS */}
          <Link
            href="/jobs"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-3">💼</div>

            <h3 className="font-bold text-slate-900">
              Jobs
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Find your next role
            </p>
          </Link>

          {/* REMOTE JOBS */}
          <Link
            href="/remote-jobs"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-3">🏠</div>

            <h3 className="font-bold text-slate-900">
              Remote Jobs
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Work from anywhere
            </p>
          </Link>

          {/* WORK ABROAD */}
          <Link
            href="/work-abroad"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-3">✈️</div>

            <h3 className="font-bold text-slate-900">
              Work Abroad
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Explore international work
            </p>
          </Link>

          {/* BURSARIES */}
          <Link
            href="/bursaries"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-3">🎓</div>

            <h3 className="font-bold text-slate-900">
              Bursaries
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Find funding opportunities
            </p>
          </Link>

          {/* INTERNSHIPS + LEARNERSHIPS → BURSARIES */}
          <Link
            href="/bursaries"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-3">🚀</div>

            <h3 className="font-bold text-slate-900">
              Internships
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Gain experience and grow
            </p>
          </Link>

          <Link
            href="/bursaries"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-3">📚</div>

            <h3 className="font-bold text-slate-900">
              Learnerships
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Learn while you grow
            </p>
          </Link>

        </div>
      </section>

      {/* JOBS + SIDEBARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-3 space-y-5">

            <div className="bg-white rounded-2xl border border-slate-200 p-6">

              <h3 className="font-bold text-lg text-slate-900">
                Browse opportunities
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <Link
                  href="/jobs?type=Full-time"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  → Full-time jobs
                </Link>

                <Link
                  href="/jobs?type=Part-time"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  → Part-time jobs
                </Link>

                <Link
                  href="/jobs?type=Contract"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  → Contract jobs
                </Link>

                <Link
                  href="/jobs?type=Remote"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  → Remote jobs
                </Link>

                <Link
                  href="/work-abroad"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  → Work abroad
                </Link>

                <Link
                  href="/bursaries"
                  className="block text-slate-600 hover:text-blue-600"
                >
                  → Bursaries
                </Link>

              </div>
            </div>

            {/* CAREER ADVICE */}
            <div className="bg-blue-600 text-white rounded-2xl p-6">

              <p className="text-sm font-semibold text-blue-100">
                CAREER SUPPORT
              </p>

              <h3 className="text-xl font-bold mt-2">
                Make your next move count.
              </h3>

              <p className="text-sm text-blue-100 mt-3 leading-6">
                Get practical advice on CVs, interviews, skills and building
                your career.
              </p>

              <Link
                href="/blog"
                className="inline-block mt-5 bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Explore Career Advice
              </Link>

            </div>

          </aside>

          {/* MAIN JOBS */}
          <div className="lg:col-span-6">

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
          <aside className="lg:col-span-3 space-y-5">

            {/* START HERE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">

              <p className="text-sm font-semibold text-blue-600">
                START HERE
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-2">
                New to job hunting?
              </h3>

              <p className="text-sm text-slate-600 mt-3 leading-6">
                Learn how to position yourself, improve your CV and approach
                interviews with confidence.
              </p>

              <Link
                href="/blog"
                className="inline-block mt-5 font-semibold text-blue-600 hover:text-blue-700"
              >
                Get career advice →
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

      {/* CAREER DEVELOPMENT */}
      <section className="bg-white border-y border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

          <div className="max-w-2xl mb-8">

            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Career development
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              More than finding a job.
              <br />
              Build your career.
            </h2>

            <p className="text-slate-600 mt-4 leading-7">
              The right opportunity is only part of the journey. Learn how to
              present yourself, develop valuable skills and prepare for your
              next career move.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            {/* CV → BLOG */}
            <Link
              href="/blog"
              className="group rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition"
            >

              <div className="text-3xl">
                📄
              </div>

              <h3 className="font-bold text-xl text-slate-900 mt-4">
                Build a better CV
              </h3>

              <p className="text-slate-600 text-sm mt-2 leading-6">
                Learn how to present your experience, skills and achievements
                effectively.
              </p>

              <span className="inline-block mt-5 text-blue-600 font-semibold text-sm">
                CV advice →
              </span>

            </Link>

            {/* INTERVIEW → BLOG */}
            <Link
              href="/blog"
              className="group rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition"
            >

              <div className="text-3xl">
                🎤
              </div>

              <h3 className="font-bold text-xl text-slate-900 mt-4">
                Ace your interview
              </h3>

              <p className="text-slate-600 text-sm mt-2 leading-6">
                Prepare for common interview questions and learn how to
                communicate your value.
              </p>

              <span className="inline-block mt-5 text-blue-600 font-semibold text-sm">
                Interview advice →
              </span>

            </Link>

            {/* SKILLS → BLOG */}
            <Link
              href="/blog"
              className="group rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition"
            >

              <div className="text-3xl">
                📈
              </div>

              <h3 className="font-bold text-xl text-slate-900 mt-4">
                Develop your skills
              </h3>

              <p className="text-slate-600 text-sm mt-2 leading-6">
                Discover practical skills and knowledge that can strengthen
                your career prospects.
              </p>

              <span className="inline-block mt-5 text-blue-600 font-semibold text-sm">
                Explore skills →
              </span>

            </Link>

          </div>

        </div>
      </section>

      {/* EMPLOYER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        <div className="rounded-3xl bg-slate-900 text-white px-6 md:px-12 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">
              For employers
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Looking for your next hire?
            </h2>

            <p className="text-slate-300 mt-3 leading-7">
              Connect your opportunities with people actively looking to build
              their careers.
            </p>

          </div>

          <Link
            href="/contact"
            className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            For Employers →
          </Link>

        </div>

      </section>

    </main>
  );
}