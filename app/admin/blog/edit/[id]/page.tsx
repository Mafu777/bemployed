import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-lg font-medium mb-4">Edit article</h1>
      <BlogForm
        postId={post.id}
        initialValues={{
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content,
          coverImageUrl: post.coverImageUrl || "",
          published: post.published,
        }}
      />
    </div>
  );
}