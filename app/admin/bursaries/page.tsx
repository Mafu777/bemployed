import BursaryForm from "@/components/BursaryForm";

export default function NewBursaryPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-lg font-medium mb-4">Post a new bursary</h1>
      <BursaryForm />
    </div>
  );
}