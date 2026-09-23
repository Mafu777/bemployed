import Link from "next/link";

export const metadata = {
  title: "Tenders | BEmployed",
  description: "Open tenders for small businesses and suppliers in South Africa.",
  alternates: {
    canonical: "https://bemployed.co.za/tenders",
  },
};

export default function TendersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-300 mb-4">
            For entrepreneurs
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Tenders
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-300 max-w-2xl">
            Open tenders for small businesses and suppliers across South Africa.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-slate-900">
          Tender listings are coming soon
        </h2>
        <p className="text-slate-600 mt-3 leading-7">
          We&apos;re building out this section. In the meantime, browse open
          job opportunities or get in touch if you&apos;d like to be notified
          when tenders go live.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/jobs"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Browse jobs
          </Link>
          <Link
            href="/contact"
            className="inline-block font-semibold text-blue-600 hover:text-blue-700"
          >
            Contact us →
          </Link>
        </div>
      </section>
    </main>
  );
}