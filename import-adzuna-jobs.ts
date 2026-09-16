/**
 * import-adzuna-jobs.ts
 *
 * Pulls job listings from the Adzuna API (South Africa) and inserts new ones
 * into the BEmployed `Job` table via Prisma.
 *
 * SETUP
 * -----
 * 1. Get a free Adzuna API key: https://developer.adzuna.com/signup
 * 2. Add to your .env (or .env.local):
 *      ADZUNA_APP_ID=your_app_id
 *      ADZUNA_APP_KEY=your_app_key
 *    (DATABASE_URL should already be set for Prisma.)
 * 3. Install deps if you don't already have them:
 *      npm install dotenv
 *      npm install -D tsx
 * 4. Run:
 *      npx tsx import-adzuna-jobs.ts
 *
 *    Optional flags (env vars, so they work in cron/CI too):
 *      ADZUNA_QUERY="retail"        # keyword search, default: no keyword (all jobs)
 *      ADZUNA_CATEGORY="retail-jobs" # Adzuna category tag, optional
 *      ADZUNA_MAX_PAGES=5            # how many pages of 50 results to pull, default 3
 *      ADZUNA_RESULTS_PER_PAGE=50    # max 50 per Adzuna's API
 *
 * SCHEDULING
 * ----------
 * Run this on a schedule (e.g. daily) via:
 *   - a GitHub Action with a `schedule:` cron trigger, or
 *   - Vercel Cron Jobs (if the site is on Vercel) calling an API route that
 *     runs this same logic, or
 *   - a plain cron job on your own server: `0 6 * * * cd /path/to/app && npx tsx import-adzuna-jobs.ts`
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const COUNTRY = "za";

const QUERY = process.env.ADZUNA_QUERY || "";
const CATEGORY = process.env.ADZUNA_CATEGORY || "";
const MAX_PAGES = parseInt(process.env.ADZUNA_MAX_PAGES || "3", 10);
const RESULTS_PER_PAGE = Math.min(
  parseInt(process.env.ADZUNA_RESULTS_PER_PAGE || "50", 10),
  50
);

if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
  console.error(
    "Missing ADZUNA_APP_ID / ADZUNA_APP_KEY. Add them to your .env file."
  );
  process.exit(1);
}

// --- Types for the bits of the Adzuna response we care about ---

interface AdzunaJob {
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  contract_time?: string; // "full_time" | "part_time"
  contract_type?: string; // "permanent" | "contract"
  category: { label: string };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  created: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
}

// --- Helpers ---

/** Map Adzuna's contract fields to the simple jobType strings BEmployed uses */
function mapJobType(job: AdzunaJob): string {
  if (job.contract_time === "part_time") return "Part-time";
  if (job.contract_type === "contract") return "Contract";
  if (job.contract_time === "full_time") return "Full-time";
  return "Full-time"; // sensible default when Adzuna doesn't specify
}

/** Adzuna salaries come through as annual ZAR figures; convert to monthly to match salaryPeriod default */
function toMonthly(annual?: number): number | undefined {
  if (!annual) return undefined;
  return Math.round(annual / 12);
}

async function fetchAdzunaPage(page: number): Promise<AdzunaResponse> {
  const url = new URL(
    `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/${page}`
  );
  url.searchParams.set("app_id", ADZUNA_APP_ID!);
  url.searchParams.set("app_key", ADZUNA_APP_KEY!);
  url.searchParams.set("results_per_page", String(RESULTS_PER_PAGE));
  url.searchParams.set("content-type", "application/json");
  if (QUERY) url.searchParams.set("what", QUERY);
  if (CATEGORY) url.searchParams.set("category", CATEGORY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Adzuna API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function upsertJob(job: AdzunaJob) {
  // De-dupe on applyLink since there's no unique constraint in the schema.
  const existing = await prisma.job.findFirst({
    where: { applyLink: job.redirect_url },
    select: { id: true },
  });
  if (existing) {
    return { skipped: true };
  }

  await prisma.job.create({
    data: {
      title: job.title.trim(),
      company: job.company?.display_name?.trim() || "Unknown",
      location: job.location?.display_name?.trim() || "South Africa",
      jobType: mapJobType(job),
      category: job.category?.label || "General",
      description: job.description?.trim() || "",
      applyLink: job.redirect_url,
      salaryMin: toMonthly(job.salary_min),
      salaryMax: toMonthly(job.salary_max),
      salaryPeriod: "month",
      // closingDate: Adzuna doesn't provide this, left null
      // featured: defaults to false
    },
  });
  return { skipped: false };
}

async function main() {
  let created = 0;
  let skipped = 0;

  for (let page = 1; page <= MAX_PAGES; page++) {
    console.log(`Fetching Adzuna page ${page}...`);
    const data = await fetchAdzunaPage(page);

    if (!data.results?.length) {
      console.log("No more results, stopping.");
      break;
    }

    for (const job of data.results) {
      try {
        const result = await upsertJob(job);
        if (result.skipped) {
          skipped++;
        } else {
          created++;
          console.log(`  + Added: ${job.title} @ ${job.company.display_name}`);
        }
      } catch (err) {
        console.error(`  ! Failed to save "${job.title}":`, err);
      }
    }

    // Be polite to the API between pages
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone. Created ${created} new job(s), skipped ${skipped} duplicate(s).`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});