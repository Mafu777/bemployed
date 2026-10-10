/**
 * scrape-dischem-careers24.js
 *
 * Scrapes Dis-Chem Pharmacies' employer page on Careers24 for full job
 * listing details (title, location, job type, reference, description,
 * requirements, closing date, apply link).
 *
 * Each listing's raw text is cleaned up into proper HTML (paragraphs,
 * bold section headers, bullet lists) by sending it to Claude. If no
 * API key is set, it falls back to a simpler pattern-based formatter.
 *
 * Usage:
 *   npm install playwright
 *   npx playwright install chromium
 *   (optional but recommended) set ANTHROPIC_API_KEY in your .env
 *   node scrape-dischem-careers24.js
 *
 * Output:
 *   dischem-jobs.json  — array of job objects, ready to feed into your
 *                         BEmployed admin review queue / Prisma seed.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Loads ANTHROPIC_API_KEY from a .env file next to this script, if present.
// If you don't have the `dotenv` package installed, run: npm install dotenv
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch {
  // dotenv not installed — that's fine, we'll just rely on process.env directly
}

const EMPLOYER_URL = 'https://www.careers24.com/now-hiring/35784-dis-chem-pharmacies';
// Always write next to this script, regardless of which folder you run `node` from
const OUTPUT_FILE = path.join(__dirname, 'dischem-jobs.json');
const REQUEST_DELAY_MS = 1500; // be polite, avoid rate-limit/IP-ban
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

// Text that shows up after the real vacancy content on Careers24 pages
// (related jobs, footer, company boilerplate) — cut everything from the
// first match of any of these onward.
const JUNK_MARKERS = [
  'Apply More Jobs',
  'About Careers24.com',
  'View All (',
  'Create an Alert',
  'My Saved Jobs',
  'Never miss another job opportunity',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function trimJunk(text) {
  let earliest = text.length;
  for (const marker of JUNK_MARKERS) {
    const idx = text.indexOf(marker);
    if (idx !== -1 && idx < earliest) earliest = idx;
  }
  return text.slice(0, earliest).trim();
}

// ---- Fallback formatter (used if no ANTHROPIC_API_KEY is set, or the API call fails) ----

const SECTION_HEADERS = [
  'Minimum Requirements',
  'Advantageous',
  'Job Specification',
  'Job Description',
  'Key Responsibilities',
  'Responsibilities',
  'Duties',
  'Requirements',
  'Qualifications',
];

// Sections that get dropped entirely (heading + content) — "Essential" tends
// to run straight into trailing footer/junk text on Careers24 pages, so it's
// safer to cut the whole thing than to try to clean it up.
const EXCLUDED_HEADERS = ['Essential'];

function splitIntoSentences(text) {
  return text
    .split(/(?<=[a-z0-9)%.])\.\s+(?=[A-Z])/)
    .map((s) => s.trim().replace(/\.$/, '').trim())
    .filter(Boolean);
}

function htmlFromFlatText(rawText) {
  let text = rawText.replace(/\u2026/g, ':').replace(/\s+/g, ' ').trim();
  if (!text) return null;

  const allHeaders = [...SECTION_HEADERS, ...EXCLUDED_HEADERS];
  const headerPattern = new RegExp(`\\b(${allHeaders.join('|')})\\s*:?`, 'g');
  text = text.replace(headerPattern, '\n\u0000$1\n');

  const blocks = text.split('\u0000').map((b) => b.trim()).filter(Boolean);
  const html = [];
  const seenHeaders = new Set();

  blocks.forEach((block) => {
    const excluded = EXCLUDED_HEADERS.find((h) =>
      block.toLowerCase().startsWith(h.toLowerCase())
    );
    if (excluded) {
      // Drop this section (heading + all its content) entirely
      return;
    }

    const header = SECTION_HEADERS.find((h) =>
      block.toLowerCase().startsWith(h.toLowerCase())
    );
    if (header) {
      const key = header.toLowerCase();
      if (seenHeaders.has(key)) {
        // A repeated section — drop it and its content, keep only the first.
        return;
      }
      seenHeaders.add(key);

      const rest = block.slice(header.length).replace(/^:\s*/, '').trim();
      html.push(`<p><strong>${header}:</strong></p>`);
      if (rest) {
        const items = splitIntoSentences(rest);
        if (items.length > 1) {
          html.push('<ul>' + items.map((s) => `<li>${s}</li>`).join('') + '</ul>');
        } else {
          html.push(`<p>${rest}</p>`);
        }
      }
    } else if (block) {
      html.push(`<p>${block}</p>`);
    }
  });

  return html.join('') || null;
}

// ---- AI cleanup (preferred, when ANTHROPIC_API_KEY is available) ----

async function summarizeWithClaude(jobTitle, rawText) {
  if (!ANTHROPIC_API_KEY) return null;

  const prompt = `Reformat this scraped job listing into clean HTML for a job board.

Rules:
- Output ONLY the HTML — no explanation, no markdown code fences, no commentary.
- Use <p> for the narrative intro, <p><strong>Section Name:</strong></p> for section headers such as "Minimum Requirements" or "Job Specification", and <ul><li> for bulleted items under each section.
- Remove any leftover website content that isn't part of the actual vacancy (related job listings, "Apply More Jobs", footer/company boilerplate, navigation text).
- Do not invent, add, or embellish any information that isn't in the source text.
- Keep the original wording — reformat structure only, don't rewrite the content.

Job title: ${jobTitle || 'Unknown'}

Raw scraped text:
"""
${rawText}
"""`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error('Claude API error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const text = (data.content || [])
      .map((c) => c.text || '')
      .join('')
      .trim();

    return text || null;
  } catch (err) {
    console.error('Claude summarization failed:', err.message);
    return null;
  }
}

// ---- Scraper ----

async function getJobLinksFromEmployerPage(page) {
  await page.goto(EMPLOYER_URL, { waitUntil: 'domcontentloaded' });

  const links = await page.$$eval('a[href*="/jobs/adverts/"]', (anchors) =>
    Array.from(
      new Set(
        anchors
          .map((a) => a.href)
          .filter((href) => href.includes('/jobs/adverts/'))
      )
    )
  );

  return links;
}

async function scrapeJobDetail(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Only extract raw fields + raw text here — formatting happens in Node below,
  // so both the AI path and the fallback path share one source of truth.
  const raw = await page.evaluate(() => {
    const text = (sel) => document.querySelector(sel)?.textContent?.trim() || null;
    const title = text('h1');
    const bodyText = document.body.innerText;

    const referenceMatch = bodyText.match(/Reference:\s*(\S+)/i);
    const jobTypeMatch = bodyText.match(/Job Type:\s*([A-Za-z ]+)/i);
    const sectorMatch = bodyText.match(/Sectors?:\s*([A-Za-z ,&/]+)/i);
    const closingMatch = bodyText.match(/Apply before\s*([A-Za-z0-9 ]+?)\s*\|/i);
    const locationEl = document.querySelector('h1')?.nextElementSibling;

    let rawDescriptionText = null;
    const headings = Array.from(document.querySelectorAll('h2, h3, strong'));
    const detailsHeading = headings.find((h) =>
      /vacancy details/i.test(h.textContent || '')
    );
    if (detailsHeading) {
      const wrapper = document.createElement('div');
      let node = detailsHeading.nextElementSibling;
      while (node && !/^h[1-3]$/i.test(node.tagName)) {
        wrapper.appendChild(node.cloneNode(true));
        node = node.nextElementSibling;
      }
      rawDescriptionText = wrapper.innerText || null;
    }
    if (!rawDescriptionText) {
      const idx = bodyText.indexOf('Vacancy Details');
      if (idx !== -1) {
        rawDescriptionText = bodyText.slice(idx + 'Vacancy Details'.length, idx + 6000);
      }
    }

    return {
      title,
      location: locationEl?.textContent?.trim() || null,
      reference: referenceMatch ? referenceMatch[1] : null,
      jobType: jobTypeMatch ? jobTypeMatch[1].trim() : null,
      sector: sectorMatch ? sectorMatch[1].trim() : null,
      closingDate: closingMatch ? closingMatch[1].trim() : null,
      rawDescriptionText,
    };
  });

  const cleanedRawText = raw.rawDescriptionText ? trimJunk(raw.rawDescriptionText) : null;

  let description = null;
  if (cleanedRawText) {
    description = await summarizeWithClaude(raw.title, cleanedRawText);
    if (!description) {
      description = htmlFromFlatText(cleanedRawText);
    }
  }

  return {
    title: raw.title,
    location: raw.location,
    reference: raw.reference,
    jobType: raw.jobType,
    sector: raw.sector,
    closingDate: raw.closingDate,
    description,
    employer: 'Dis-Chem Pharmacies',
    applyUrl: url,
    scrapedAt: new Date().toISOString(),
  };
}

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.log(
      'No ANTHROPIC_API_KEY found — using the basic pattern-based formatter instead of AI cleanup.'
    );
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  });
  const page = await context.newPage();

  console.log('Fetching Dis-Chem job list from Careers24...');
  const links = await getJobLinksFromEmployerPage(page);
  console.log(`Found ${links.length} job listing(s).`);

  const jobs = [];
  for (const [i, url] of links.entries()) {
    console.log(`(${i + 1}/${links.length}) Scraping ${url}`);
    try {
      const job = await scrapeJobDetail(page, url);
      jobs.push(job);
    } catch (err) {
      console.error(`Failed to scrape ${url}:`, err.message);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jobs, null, 2), 'utf-8');
  console.log(`Saved ${jobs.length} job(s) to ${OUTPUT_FILE}`);

  await browser.close();
}

main().catch((err) => {
  console.error('Scraper failed:', err);
  process.exit(1);
});