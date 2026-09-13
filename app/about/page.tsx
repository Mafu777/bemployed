export const metadata = {
  title: "About BEmployed | South Africa's Job & Bursary Listings Site",
  description:
    "Learn about BEmployed, a South African platform connecting job seekers and students with real job listings, remote opportunities and bursaries.",
  alternates: {
    canonical: "https://bemployed.co.za/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <p className="text-sm font-medium text-slate-500">About BEmployed</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Finding a job shouldn't feel like a second job.
        </h1>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-slate-700">
          <p>
            BEmployed started with a simple frustration: job listings scattered
            across dozens of sites, half of them outdated, most missing the
            details you actually need before you apply. We built BEmployed to
            fix that — one place, real openings, full details, and a direct
            link to apply.
          </p>

          <p>
            Every listing on BEmployed is added by our team after being
            sourced directly from employers. We don't scrape, and we don't
            duplicate stale posts from other boards. If it's on BEmployed,
            it's current and it's real.
          </p>

          <p>
            We're just getting started, and we're building this for job
            seekers first. If there's something that would make your search
            easier, we want to hear about it.
          </p>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            What we stand for
          </h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            <li>
              <span className="font-medium text-slate-900">
                No dead links.
              </span>{" "}
              We check listings and remove ones that have expired.
            </li>
            <li>
              <span className="font-medium text-slate-900">
                No noise.
              </span>{" "}
              Every listing has the details you need to decide if it's worth
              your time.
            </li>
            <li>
              <span className="font-medium text-slate-900">
                No cost to job seekers.
              </span>{" "}
              BEmployed is, and always will be, free to browse and apply.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}