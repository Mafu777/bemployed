import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_URL = "https://bemployed.co.za";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await prisma.job.findMany({
    where: { reviewStatus: "APPROVED" },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${BASE_URL}/jobs/${job.id}`,
    lastModified: job.updatedAt,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/jobs`, lastModified: new Date() },
    { url: `${BASE_URL}/bursaries`, lastModified: new Date() },
    { url: `${BASE_URL}/funding`, lastModified: new Date() },
    { url: `${BASE_URL}/tenders`, lastModified: new Date() },
    { url: `${BASE_URL}/remote-jobs`, lastModified: new Date() },
    { url: `${BASE_URL}/work-abroad`, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
  ];

  return [...staticEntries, ...jobEntries, ...blogEntries];
}