'use server';

import { revalidatePath } from 'next/cache';
// If your Prisma client helper lives somewhere else, update this import.
import { prisma } from '@/lib/prisma';
import { getScrapedJobByUrl, markReviewed } from '@/lib/scraped-jobs';

function parseClosingDate(raw: string | null): Date | undefined {
  if (!raw) return undefined;
  const parsed = new Date(raw);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export async function approveScrapedJob(applyUrl: string) {
  const job = getScrapedJobByUrl(applyUrl);
  if (!job) throw new Error('Scraped job not found — it may have already been reviewed.');

  await prisma.job.create({
    data: {
      title: job.title ?? 'Untitled position',
      company: job.employer,
      location: job.location ?? 'South Africa',
      jobType: job.jobType ?? 'Permanent',
      category: job.sector ?? 'Retail',
      description: job.description ?? '',
      applyLink: job.applyUrl,
      closingDate: parseClosingDate(job.closingDate),
    },
  });

  markReviewed(applyUrl, 'approved');
  revalidatePath('/admin/scraped-jobs');
}

export async function rejectScrapedJob(applyUrl: string) {
  markReviewed(applyUrl, 'rejected');
  revalidatePath('/admin/scraped-jobs');
}