"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

type JobFormValues = {
  title: string;
  company: string;
  companyLogoUrl: string;
  location: string;
  jobType: string;
  category: string;
  description: string;
  applyLink: string;
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: string;
  closingDate: string;
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

export default function JobForm({
  initialValues,
  jobId,
}: {
  initialValues?: JobFormValues;
  jobId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>(
    initialValues || {
      title: "",
      company: "",
      companyLogoUrl: "",
      location: "",
      jobType: "Full-time",
      category: "",
      description: "",
      applyLink: "",
      salaryMin: "",
      salaryMax: "",
      salaryPeriod: "month",
      closingDate: "",
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.title || !values.company || !values.location || !values.category || !values.description || !values.applyLink) {
      setError("Fill in every field before saving.");
      return;
    }
    try {
      new URL(values.applyLink);
    } catch {
      setError("Apply link must be a full URL, e.g. https://company.com/apply");
      return;
    }

    setSaving(true);
    const res = await fetch(jobId ? `/api/jobs/${jobId}` : "/api/jobs", {
      method: jobId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        salaryMin: values.salaryMin ? Number(values.salaryMin) : null,
        salaryMax: values.salaryMax ? Number(values.salaryMax) : null,
        salaryPeriod: values.salaryPeriod || null,
        closingDate: values.closingDate || null,
      }),
    });
    setSaving(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Something went wrong saving this job. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm">
        Job title
        <input
          type="text"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Company
        <input
          type="text"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Company logo (image URL, optional)
        <input
          type="text"
          value={values.companyLogoUrl}
          onChange={(e) => update("companyLogoUrl", e.target.value)}
          placeholder="https://company.com/logo.png"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
        <span className="text-xs text-gray-400 mt-1 block">
          Paste a link to the company's logo image. Leave blank to show initials instead.
        </span>
      </label>

      <label className="text-sm">
        Location
        <input
          type="text"
          value={values.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="e.g. Johannesburg, or Remote"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      <label className="text-sm">
        Job type
        <select
          value={values.jobType}
          onChange={(e) => update("jobType", e.target.value)}
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm bg-white"
        >
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        Category
        <input
          type="text"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          placeholder="e.g. Admin, IT, Retail"
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
        Salary range (optional)
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            value={values.salaryMin}
            onChange={(e) => update("salaryMin", e.target.value)}
            placeholder="Min"
            className="w-full h-10 px-3 rounded-md border text-sm"
          />
          <input
            type="number"
            value={values.salaryMax}
            onChange={(e) => update("salaryMax", e.target.value)}
            placeholder="Max"
            className="w-full h-10 px-3 rounded-md border text-sm"
          />
          <select
            value={values.salaryPeriod}
            onChange={(e) => update("salaryPeriod", e.target.value)}
            className="h-10 px-2 rounded-md border text-sm bg-white"
          >
            <option value="month">/ month</option>
            <option value="year">/ year</option>
          </select>
        </div>
        <span className="text-xs text-gray-400 mt-1 block">
          Leave blank if you'd rather not disclose salary.
        </span>
      </label>

      <label className="text-sm">
        Closing date (optional)
        <input
          type="date"
          value={values.closingDate}
          onChange={(e) => update("closingDate", e.target.value)}
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
        <span className="text-xs text-gray-400 mt-1 block">
          Leave blank if the job doesn't have a closing date.
        </span>
      </label>

      <label className="text-sm">
        Apply link
        <input
          type="text"
          value={values.applyLink}
          onChange={(e) => update("applyLink", e.target.value)}
          placeholder="https://company.com/careers/apply"
          className="mt-1 w-full h-10 px-3 rounded-md border text-sm"
        />
      </label>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="h-10 rounded-md bg-brand-600 text-white text-sm mt-2"
      >
        {saving ? "Saving..." : jobId ? "Save changes" : "Post job"}
      </button>
    </form>
  );
}