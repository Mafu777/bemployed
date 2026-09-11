import Link from "next/link";

export const metadata = {
  title: "Contact Us | BEmployed",
  description: "Get in touch with the BEmployed team.",
};

// Replace with your real contact email
const CONTACT_EMAIL = "hello@bemployed.co";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="text-sm font-medium text-slate-500">Get in touch</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Contact Us
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-slate-700">
          Whether you're an employer who wants a job posted, a job seeker with
          feedback, or you spotted a listing that's no longer live — send us a
          message and we'll get back to you.
        </p>

        <div className="mt-10 rounded-lg border border-slate-200 p-6">
          <h2 className="font-medium text-slate-900">Email us directly</h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-2 inline-block text-lg text-blue-700 underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900">Employers</h3>
            <p className="mt-2 text-slate-600">
              Want a role listed on BEmployed? Email us the job details and
              apply link.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900">Job seekers</h3>
            <p className="mt-2 text-slate-600">
              Found a broken link or outdated listing? Let us know which one
              and we'll remove it.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          Read our{" "}
          <Link href="/privacy-policy" className="underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="underline underline-offset-4">
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </div>
    </main>
  );
}