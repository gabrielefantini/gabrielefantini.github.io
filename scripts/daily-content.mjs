// Loads the daily newspapers from src/content/daily/ for the `virtual:daily`
// Vite module (see vite.config.ts).
//
// Layout, per paper (`math`, `softeng`):
//   src/content/daily/<paper>/syllabus.md            the 2-year programme
//   src/content/daily/<paper>/issues/YYYY-MM-DD.md   topics + exercises
//   src/content/daily/<paper>/issues/YYYY-MM-DD.solutions.md
//
// Issues are written a week ahead by the Monday routine, but a production
// build only ships issues dated today or earlier (Europe/Rome). Each issue
// carries the solutions of the paper's previous issue, so a day's solutions
// appear with the next day's paper and never earlier.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderMarkdown } from './daily-render.mjs';

export const DAILY_DIR = join(process.cwd(), 'src', 'content', 'daily');
export const PAPERS = ['math', 'softeng'];

/** Today's date in Rome as YYYY-MM-DD, or the DAILY_DATE override. */
export function publishCutoff() {
  if (process.env.DAILY_DATE) return process.env.DAILY_DATE;
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
}

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const value = m[2].trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      meta[m[1]] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else {
      meta[m[1]] = value.replace(/^['"]|['"]$/g, '');
    }
  }
  return { meta, body: match[2] };
}

/**
 * Parse a syllabus.md into weeks:
 *   ## Week 1 · 2026-11-23 · Logic and sets
 *   - Mon: topic
 *   ...
 */
export function parseSyllabus(raw) {
  const { meta, body } = parseFrontmatter(raw);
  const weeks = [];
  const phases = [];
  let phase = '';
  for (const line of body.split(/\r?\n/)) {
    const p = /^#\s+(.+)$/.exec(line);
    if (p) {
      phase = p[1].trim();
      phases.push(phase);
      continue;
    }
    const w = /^##\s+Week\s+(\d+)\s*·\s*(\d{4}-\d{2}-\d{2})\s*·\s*(.+)$/.exec(line);
    if (w) {
      weeks.push({ week: Number(w[1]), start: w[2], theme: w[3].trim(), phase, days: [] });
      continue;
    }
    const d = /^-\s*(Mon|Tue|Wed|Thu|Fri|Sat):\s*(.+)$/.exec(line);
    if (d && weeks.length) weeks[weeks.length - 1].days.push({ day: d[1], topic: d[2].trim() });
  }
  return { title: meta.title || '', intro: meta.intro || '', phases, weeks };
}

const htmlCache = new Map();
function toHtml(md, where) {
  if (!md.trim()) return '';
  if (!htmlCache.has(md)) htmlCache.set(md, renderMarkdown(md, where));
  return htmlCache.get(md);
}

/**
 * Everything the site needs, already filtered by the publish cutoff.
 * Issue bodies and the previous day's solutions come as rendered HTML.
 */
export function loadDaily({ includeScheduled = false } = {}) {
  const cutoff = publishCutoff();
  const issues = [];
  const syllabi = {};
  for (const paper of PAPERS) {
    const dir = join(DAILY_DIR, paper);
    const syllabusFile = join(dir, 'syllabus.md');
    syllabi[paper] = existsSync(syllabusFile) ? parseSyllabus(readFileSync(syllabusFile, 'utf8')) : null;

    const issueDir = join(dir, 'issues');
    if (!existsSync(issueDir)) continue;
    const all = readdirSync(issueDir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()
      .map((f) => {
        const date = f.slice(0, 10);
        const { meta, body } = parseFrontmatter(readFileSync(join(issueDir, f), 'utf8'));
        const solFile = join(issueDir, `${date}.solutions.md`);
        const solutions = existsSync(solFile) ? parseFrontmatter(readFileSync(solFile, 'utf8')).body : '';
        if (meta.issue === undefined || meta.week === undefined || !meta.title) {
          throw new Error(`Daily: ${paper}/issues/${f} needs issue, week and title in its frontmatter`);
        }
        return {
          paper,
          date,
          number: Number(meta.issue) || 0,
          week: Number(meta.week) || 0,
          kind: meta.kind === 'review' ? 'review' : 'daily',
          title: meta.title || date,
          summary: meta.summary || '',
          topics: Array.isArray(meta.topics) ? meta.topics : [],
          body,
          solutions,
        };
      });

    all.forEach((issue, i) => {
      if (!includeScheduled && issue.date > cutoff) return;
      const prev = all[i - 1];
      const { solutions: _own, body, ...rest } = issue;
      const where = `${paper}/issues/${issue.date}`;
      issues.push({
        ...rest,
        scheduled: issue.date > cutoff,
        html: toHtml(body, `${where}.md`),
        prevSolutions:
          prev && prev.solutions.trim()
            ? { date: prev.date, title: prev.title, html: toHtml(prev.solutions, `${paper}/issues/${prev.date}.solutions.md`) }
            : null,
      });
    });
  }
  return { cutoff, issues, syllabi };
}
