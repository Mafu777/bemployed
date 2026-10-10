import fs from 'fs';
import path from 'path';

export type ScrapedJob = {
  title: string | null;
  location: string | null;
  reference: string | null;
  jobType: string | null;
  sector: string | null;
  closingDate: string | null;
  description: string | null;
  employer: string;
  applyUrl: string;
  scrapedAt: string;
};

type ReviewedEntry = {
  applyUrl: string;
  status: 'approved' | 'rejected';
  reviewedAt: string;
};

// Adjust these if you move the scraper output elsewhere
const SCRAPED_JOBS_PATH = path.join(process.cwd(), 'scrapers', 'dischem-jobs.json');
const REVIEWED_PATH = path.join(process.cwd(), 'scrapers', 'reviewed.json');

function readJsonSafe<T>(filePath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Jobs that have been scraped but not yet approved or rejected. */
export function getPendingScrapedJobs(): ScrapedJob[] {
  const all = readJsonSafe<ScrapedJob[]>(SCRAPED_JOBS_PATH, []);
  const reviewed = readJsonSafe<ReviewedEntry[]>(REVIEWED_PATH, []);
  const reviewedUrls = new Set(reviewed.map((r) => r.applyUrl));
  return all.filter((job) => !reviewedUrls.has(job.applyUrl));
}

export function getScrapedJobByUrl(applyUrl: string): ScrapedJob | undefined {
  const all = readJsonSafe<ScrapedJob[]>(SCRAPED_JOBS_PATH, []);
  return all.find((job) => job.applyUrl === applyUrl);
}

/** Record that a scraped job has been approved or rejected so it won't show again. */
export function markReviewed(applyUrl: string, status: 'approved' | 'rejected') {
  const reviewed = readJsonSafe<ReviewedEntry[]>(REVIEWED_PATH, []);
  reviewed.push({ applyUrl, status, reviewedAt: new Date().toISOString() });
  fs.writeFileSync(REVIEWED_PATH, JSON.stringify(reviewed, null, 2), 'utf-8');
}