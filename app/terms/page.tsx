export const metadata = {
  title: "Terms & Conditions | BEmployed",
  description: "The terms that govern your use of BEmployed.",
};

const LAST_UPDATED = "9 September 2026";
const CONTACT_EMAIL = "hello@bemployed.co";
const SITE_NAME = "BEmployed";
const SITE_URL = "bemployed.co";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <p>
              These Terms & Conditions ("Terms") govern your use of {SITE_URL}
              (the "Site"), operated by {SITE_NAME}. By accessing or using
              the Site, you agree to these Terms. If you do not agree, please
              do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              1. What We Provide
            </h2>
            <p className="mt-3">
              {SITE_NAME} publishes job listings sourced from employers,
              along with a link to apply directly with that employer. We are
              not a recruitment agency, and we are not a party to any
              employment relationship, application, or hiring decision made
              between you and a listed employer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              2. No Guarantee of Listings
            </h2>
            <p className="mt-3">
              We aim to keep listings accurate and current, but we do not
              guarantee that any listing is active, accurate, or leads to a
              successful application. Employers may close, change, or fill
              positions without notifying us. If you find an outdated
              listing, please let us know via our{" "}
              <a href="/contact" className="underline underline-offset-4">
                Contact page
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              3. Third-Party Links
            </h2>
            <p className="mt-3">
              The Site contains links to third-party employer websites and
              application pages. We are not responsible for the content,
              policies, or practices of any third-party site. Applying to a
              job through an external link is done at your own discretion and
              subject to that third party's terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              4. Acceptable Use
            </h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Scrape, copy, or republish listings from the Site in bulk</li>
              <li>
                Use automated tools to access the Site in a way that disrupts
                its operation
              </li>
              <li>
                Submit false, misleading, or fraudulent information through
                any contact form
              </li>
              <li>Use the Site for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              5. Advertising
            </h2>
            <p className="mt-3">
              The Site displays advertising, including through Google
              AdSense. We are not responsible for the content of
              advertisements shown on the Site or for products or services
              offered by advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              6. Limitation of Liability
            </h2>
            <p className="mt-3">
              The Site is provided "as is" without warranties of any kind. To
              the fullest extent permitted by law, {SITE_NAME} is not liable
              for any damages arising from your use of the Site, including
              reliance on any listing published here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              7. Changes to These Terms
            </h2>
            <p className="mt-3">
              We may update these Terms from time to time. Continued use of
              the Site after changes are posted means you accept the updated
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              8. Contact Us
            </h2>
            <p className="mt-3">
              Questions about these Terms? Email us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}