export const metadata = {
  title: "Privacy Policy | BEmployed",
  description: "How BEmployed collects, uses, and protects your information.",
};

// Update this whenever the policy changes
const LAST_UPDATED = "9 September 2026";
const CONTACT_EMAIL = "hello@bemployed.co";
const SITE_NAME = "BEmployed";
const SITE_URL = "bemployed.co";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <p>
              This Privacy Policy explains how {SITE_NAME} ("we," "us," or
              "our") collects, uses, and protects information when you visit{" "}
              {SITE_URL}
              (the "Site"). By using the Site, you agree to the practices
              described here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              1. Information We Collect
            </h2>
            <p className="mt-3">
              We may collect the following types of information:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <span className="font-medium text-slate-900">
                  Usage data:
                </span>{" "}
                pages visited, time spent on the Site, browser type, device
                type, and general location (via IP address).
              </li>
              <li>
                <span className="font-medium text-slate-900">
                  Contact information:
                </span>{" "}
                if you email us or submit a form, we collect what you provide
                (e.g., name, email address, message content).
              </li>
              <li>
                <span className="font-medium text-slate-900">
                  Cookies and similar technologies:
                </span>{" "}
                used to remember preferences and to serve relevant
                advertising, as described below.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              2. Advertising and Third-Party Cookies
            </h2>
            <p className="mt-3">
              We use Google AdSense to display advertising on the Site.
              Google, as a third-party vendor, uses cookies to serve ads
              based on your prior visits to this and other websites. Google's
              use of advertising cookies enables it and its partners to serve
              ads based on your visit to this Site and/or other sites on the
              internet.
            </p>
            <p className="mt-3">
              You may opt out of personalized advertising by visiting Google's{" "}
              <a
                href="https://adssettings.google.com"
                className="underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ads Settings
              </a>
              . You can also opt out of some third-party vendors' use of
              cookies for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info"
                className="underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.aboutads.info
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              3. How We Use Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>To operate, maintain, and improve the Site</li>
              <li>To respond to inquiries sent through our Contact page</li>
              <li>To understand how visitors use the Site</li>
              <li>To display relevant advertising through Google AdSense</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              4. Data Sharing
            </h2>
            <p className="mt-3">
              We do not sell your personal information. We may share
              information with service providers who help us operate the
              Site (such as hosting and analytics providers) and with Google
              for the purpose of serving advertising, as described above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              5. Your Rights
            </h2>
            <p className="mt-3">
              Depending on your location, you may have rights to access,
              correct, or request deletion of your personal information,
              including under South Africa's Protection of Personal
              Information Act (POPIA) and, where applicable, the EU General
              Data Protection Regulation (GDPR). To exercise these rights,
              contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              6. Children's Privacy
            </h2>
            <p className="mt-3">
              The Site is not directed at individuals under 18, and we do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              7. Changes to This Policy
            </h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. Changes
              will be posted on this page with an updated "Last updated"
              date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              8. Contact Us
            </h2>
            <p className="mt-3">
              Questions about this policy? Email us at{" "}
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