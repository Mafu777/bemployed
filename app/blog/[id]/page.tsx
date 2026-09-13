import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPost(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return {};
  return {
    title: `${post.title} | BEmployed Career Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post || !post.published) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {post.coverImageUrl && (
        <div className="w-full aspect-[16/9] relative bg-gray-100 rounded-xl overflow-hidden mb-6">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <p className="text-xs text-gray-400 mb-2">
        {new Date(post.createdAt).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
      <h1 className="text-2xl font-semibold mb-6">{post.title}</h1>
      <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
        {post.content}
      </div>
    </div>
  );
}