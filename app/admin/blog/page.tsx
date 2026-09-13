import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "../LogoutButton";
import DeleteBlogButton from "./DeleteBlogButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogDashboard() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">Manage blog</h1>
        <LogoutButton />
      </div>

      <div className="flex gap-3 mb-5">
        <Link
          href="/admin"
          className="text-sm text-gray-500 underline underline-offset-4 self-center"
        >
          Back to jobs
        </Link>
        <Link
          href="/admin/blog/new"
          className="inline-block bg-brand-600 text-white text-sm px-4 py-2 rounded-md"
        >
          + New article
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {posts.length === 0 && (
          <p className="text-sm text-gray-500">No articles posted yet.</p>
        )}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border rounded-lg p-3 flex items-center justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{post.title}</p>
              <p className="text-xs text-gray-500">
                {post.published ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex gap-3 shrink-0 text-xs">
              <Link href={`/admin/blog/edit/${post.id}`} className="text-brand-600">
                Edit
              </Link>
              <DeleteBlogButton postId={post.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}