export const metadata = {
  title: "Remote Jobs | BEmployed",
  description:
    "Find remote and work-from-home job opportunities in South Africa and around the world.",
};

export default function RemoteJobsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            BEmployed Remote Jobs
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Work from anywhere.
          </h1>

          <p className="text-lg text-slate-300 mt-5 max-w-2xl mx-auto">
            Discover remote and work-from-home opportunities that give you the
            flexibility to build your career from wherever you are.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Remote opportunities
          </h2>

          <p className="text-slate-600 mt-3 leading-7">
            Browse BEmployed job opportunities and look for roles that offer
            remote or work-from-home flexibility.
          </p>

          <a
            href="/jobs?type=Remote"
            className="inline-block mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-500 transition"
          >
            Browse Remote Jobs →
          </a>
        </div>
      </section>
    </main>
  );
}