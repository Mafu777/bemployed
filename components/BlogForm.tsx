"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

type BlogFormValues = {
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  published: boolean;
};

export default function BlogForm({
  initialValues,
  postId,
}: {
  initialValues?: BlogFormValues;
  postId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>(
    initialValues || {
      title: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      published: false,
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.title || !values.content) {
      setError("Fill in every required field before saving.");
      return;
    }

    setSaving(true);
    const res = await fetch(postId ? `/api/blog/${postId}` : "/api/blog", {
      method: postId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        excerpt: values.excerpt || null,
        coverImageUrl: values.coverImageUrl || null,
      }),
    });
    setSaving(false);

    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      setError("Something went wrong saving this article. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm">
        Title
        <input
          type="text"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. How to Write a Winning CV"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Excerpt (optional)
        <textarea
          value={values.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          rows={2}
          placeholder="Short summary shown on the blog listing page"
          className="mt-1 w-full px-3 py-2 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Cover image (image URL, optional)
        <input
          type="text"
          value={values.coverImageUrl}
          onChange={(e) => update("coverImageUrl", e.target.value)}
          placeholder="https://example.com/cover.jpg"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Content
        <div className="mt-1">
          <RichTextEditor
            value={values.content}
            onChange={(html) => update("content", html)}
          />
        </div>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) => update("published", e.target.checked)}
        />
        Published
      </label>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="h-10 rounded-md bg-brand-600 text-white text-sm mt-2"
      >
        {saving ? "Saving..." : postId ? "Save changes" : "Publish article"}
      </button>
    </form>
  );
}