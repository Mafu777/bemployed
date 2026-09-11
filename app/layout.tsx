
import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEmployed | Find your next job",
  description: "Fresh job listings from real companies, updated daily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
        {adsenseId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
      </head>
      <body>
        <header className="flex items-center justify-between px-4 py-4 border-b bg-white sticky top-0 z-10">
          <Link href="/" className="flex items-center">
           <Image src="/logo.png" alt="BEmployed" width={1168} height={242} priority style={{ height: "48px", width: "auto" }} />
          </Link>
         <nav className="text-sm text-gray-600 flex gap-4 flex-wrap">
  <Link href="/">Local Jobs</Link>
  <Link href="/?type=Remote">Remote Jobs</Link>
  <Link href="/work-abroad">Work Abroad</Link>
  <Link href="/bursaries">Bursaries</Link>
  <Link href="/about">About Us</Link>
</nav>
        </header>
        <main>{children}</main>
        <footer className="px-4 py-6 border-t text-center text-xs text-gray-400">
  <p>&copy; {new Date().getFullYear()} BEmployed</p>
  <nav className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
    <Link href="/about" className="underline">
      About
    </Link>
    <Link href="/contact" className="underline">
      Contact
    </Link>
    <Link href="/privacy-policy" className="underline">
      Privacy Policy
    </Link>
    <Link href="/terms" className="underline">
      Terms &amp; Conditions
    </Link>
    <Link href="/admin/login" className="underline">
      Admin login
    </Link>
  </nav>
</footer>
      </body>
    </html>
  );
}
