import { getPendingScrapedJobs } from '@/lib/scraped-jobs';
import { approveScrapedJob, rejectScrapedJob } from './actions';

export default async function ScrapedJobsPage() {
  const jobs = getPendingScrapedJobs();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-1">Scraped Jobs — Pending Review</h1>
      <p className="text-sm text-gray-500 mb-6">{jobs.length} awaiting approval</p>

      {jobs.length === 0 && (
        <p className="text-gray-500">No pending jobs. Run the scraper to fetch more.</p>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.applyUrl} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium">{job.title ?? 'Untitled'}</h2>
            <p className="text-sm text-gray-600">{job.employer}</p>

            <div className="grid grid-cols-2 gap-x-4 text-sm mt-2 text-gray-700">
              <p><span className="font-medium">Location:</span> {job.location ?? '—'}</p>
              <p><span className="font-medium">Job Type:</span> {job.jobType ?? '—'}</p>
              <p><span className="font-medium">Sector:</span> {job.sector ?? '—'}</p>
              <p><span className="font-medium">Closing:</span> {job.closingDate ?? '—'}</p>
            </div>

            <p className="text-sm mt-3 whitespace-pre-wrap text-gray-800">
              {job.description ? job.description.slice(0, 500) : 'No description scraped.'}
              {job.description && job.description.length > 500 ? '…' : ''}
            </p>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 underline mt-2 inline-block"
            >
              View original listing
            </a>

            <div className="flex gap-2 mt-4">
              <form action={approveScrapedJob.bind(null, job.applyUrl)}>
                <button
                  type="submit"
                  className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </form>
              <form action={rejectScrapedJob.bind(null, job.applyUrl)}>
                <button
                  type="submit"
                  className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}