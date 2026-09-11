import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      <body className={`${jakarta.className} antialiased`}>
        <Header />

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