import { useEffect, useState } from 'react';
import data from 'virtual:daily';

/** The two daily newspapers. Content lives in src/content/daily/<paper>/. */
export type PaperId = 'math' | 'softeng';

export type Paper = {
  id: PaperId;
  name: string;
  subject: string;
  tagline: string;
  art: 'spiro-dark' | 'lattice-light';
};

export const papers: Paper[] = [
  {
    id: 'math',
    name: 'The Daily Theorem',
    subject: 'Mathematics',
    tagline:
      'Two years of mathematics, one day at a time — from the scientific high school programme to the last year of a software engineering degree.',
    art: 'spiro-dark',
  },
  {
    id: 'softeng',
    name: 'The Daily Commit',
    subject: 'Software engineering',
    tagline:
      'Two years of a software engineering degree, one day at a time — the engineering subjects only, from the first program to distributed systems.',
    art: 'lattice-light',
  },
];

export const paperById = (id: string | undefined) => papers.find((p) => p.id === id);

export type Issue = {
  paper: PaperId;
  date: string;
  number: number;
  week: number;
  kind: 'daily' | 'review';
  title: string;
  summary: string;
  topics: string[];
  /** True only in `npm run dev`, for issues dated after today. */
  scheduled: boolean;
  /** Rendered HTML: present during pre-rendering, null in the browser bundle. */
  html: string | null;
  prevSolutions: { date: string; title: string; html: string | null } | null;
};

export type IssueContent = {
  html: string;
  prevSolutions: { date: string; title: string; html: string } | null;
};

const contentCache = new Map<string, IssueContent>();

function fromDom(issue: Issue, key: string): IssueContent | null {
  if (typeof document === 'undefined') return null;
  const body = document.querySelector(`[data-daily-body="${key}"]`);
  if (!body) return null;
  const sol = document.querySelector(`[data-daily-solutions="${key}"]`);
  return {
    html: body.innerHTML,
    prevSolutions: issue.prevSolutions && sol ? { ...issue.prevSolutions, html: sol.innerHTML } : null,
  };
}

/**
 * The rendered HTML of an issue. Pre-rendering has it inline; in the browser
 * it's read back from the pre-rendered page on first load, or fetched from
 * daily/data/<paper>/<date>.json when navigating. Use with key={date}.
 */
export function useIssueContent(issue: Issue): IssueContent | null {
  const key = `${issue.paper}/${issue.date}`;
  const [content, setContent] = useState<IssueContent | null>(() => {
    if (issue.html !== null) {
      const p = issue.prevSolutions;
      return { html: issue.html, prevSolutions: p && p.html !== null ? { ...p, html: p.html } : null };
    }
    const known = contentCache.get(key) ?? fromDom(issue, key);
    if (known) contentCache.set(key, known);
    return known;
  });
  useEffect(() => {
    if (content) return;
    let live = true;
    fetch(`${import.meta.env.BASE_URL}daily/data/${key}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<IssueContent>) : Promise.reject(new Error(String(r.status)))))
      .then((c) => {
        contentCache.set(key, c);
        if (live) setContent(c);
      })
      .catch(() => {
        if (live) setContent({ html: '<p class="muted">This issue could not be loaded. Try reloading the page.</p>', prevSolutions: null });
      });
    return () => {
      live = false;
    };
  }, [key, content]);
  return content;
}

export type SyllabusWeek = {
  week: number;
  start: string;
  theme: string;
  phase: string;
  days: { day: string; topic: string }[];
};

export type Syllabus = { title: string; intro: string; phases: string[]; weeks: SyllabusWeek[] };

const all = data.issues as Issue[];

/** Issues of a paper, newest first. */
export function issuesOf(paper: PaperId): Issue[] {
  return all.filter((i) => i.paper === paper).sort((a, b) => b.date.localeCompare(a.date));
}

/** The latest issue that is already out (ignores scheduled ones in dev). */
export function latestIssue(paper: PaperId): Issue | undefined {
  return issuesOf(paper).find((i) => !i.scheduled);
}

export function syllabusOf(paper: PaperId): Syllabus | null {
  return (data.syllabi as Record<string, Syllabus | null>)[paper] ?? null;
}

export const publishCutoff: string = data.cutoff;

export function pdfUrl(issue: Pick<Issue, 'paper' | 'date'>): string {
  return `${import.meta.env.BASE_URL}daily/${issue.paper}/${issue.date}.pdf`;
}

export function longDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
