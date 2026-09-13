import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Career Blog | BEmployed",
  description: "Career advice, job search tips, and workplace insights.",
};

async function getPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="bg-gray-50 border-b px-4 pt-5 pb-4">
        <p className="text-lg font-medium mb-1">Career Blog</p>
        <p className="text-sm text-gray-500">
          Advice and insights to help your job search.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">
            No articles yet. Check back soon.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block bg-white border rounded-xl overflow-hidden hover:border-brand-400 transition-colors"
              >
                {post.coverImageUrl && (
                  <div className="w-full aspect-[16/9] relative bg-gray-100">
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-medium">{post.title}</p>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(post.createdAt).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}