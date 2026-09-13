import BlogForm from "@/components/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-lg font-medium mb-4">New article</h1>
      <BlogForm />
    </div>
  );
}