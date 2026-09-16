"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

type BursaryFormValues = {
  title: string;
  provider: string;
  providerLogoUrl: string;
  fieldOfStudy: string;
  description: string;
  closingDate: string;
  applyLink: string;
};

export default function BursaryForm({
  initialValues,
  bursaryId,
}: {
  initialValues?: BursaryFormValues;
  bursaryId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<BursaryFormValues>(
    initialValues || {
      title: "",
      provider: "",
      providerLogoUrl: "",
      fieldOfStudy: "",
      description: "",
      closingDate: "",
      applyLink: "",
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof BursaryFormValues>(key: K, value: BursaryFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.title || !values.provider || !values.description || !values.applyLink) {
      setError("Fill in every required field before saving.");
      return;
    }
    try {
      new URL(values.applyLink);
    } catch {
      setError("Apply link must be a full URL, e.g. https://provider.com/apply");
      return;
    }

    setSaving(true);
    const res = await fetch(bursaryId ? `/api/bursaries/${bursaryId}` : "/api/bursaries", {
      method: bursaryId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        fieldOfStudy: values.fieldOfStudy || null,
        closingDate: values.closingDate || null,
      }),
    });
    setSaving(false);

    if (res.ok) {
      router.push("/admin/bursaries");
      router.refresh();
    } else {
      setError("Something went wrong saving this bursary. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm">
        Bursary title
        <input
          type="text"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. NSFAS Bursary 2027"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Provider
        <input
          type="text"
          value={values.provider}
          onChange={(e) => update("provider", e.target.value)}
          placeholder="e.g. NSFAS, Standard Bank, Sasol"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Field of study (optional)
        <input
          type="text"
          value={values.fieldOfStudy}
          onChange={(e) => update("fieldOfStudy", e.target.value)}
          placeholder="e.g. Engineering, or leave blank for Any"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Description
        <div className="mt-1">
          <RichTextEditor
            value={values.description}
            onChange={(html) => update("description", html)}
          />
        </div>
      </label>

      <label className="text-sm">
        Closing date (optional)
        <input
          type="date"
          value={values.closingDate}
          onChange={(e) => update("closingDate", e.target.value)}
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Apply link
        <input
          type="text"
          value={values.applyLink}
          onChange={(e) => update("applyLink", e.target.value)}
          placeholder="https://provider.com/apply"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="h-10 rounded-md bg-brand-600 text-white text-sm mt-2"
      >
        {saving ? "Saving..." : bursaryId ? "Save changes" : "Post bursary"}
      </button>
    </form>
  );
}