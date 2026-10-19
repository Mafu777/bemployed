type JobSeoInput = {
  title: string;
  company?: string | null;
  location?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

function trim(text: string, max: number) {
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + "…";
}

export function jobSeo(job: JobSeoInput) {
  const where = job.location ? ` in ${job.location}` : "";
  const at = job.company ? ` at ${job.company}` : "";

  const autoTitle = `${job.title}${where}${at} | BEmployed`;
  const autoDescription = `${job.title} vacancy${at}${where}. See the full requirements and apply now on BEmployed.`;

  return {
    title: trim(job.metaTitle?.trim() || autoTitle, 60),
    description: trim(job.metaDescription?.trim() || autoDescription, 155),
  };
}