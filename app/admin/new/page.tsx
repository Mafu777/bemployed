import JobForm from "@/components/JobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-lg font-medium mb-4">Post a new job</h1>
      <JobForm />
    </div>
  );
}
