import type { Art } from '../data/site';

/**
 * Markdown-based posts.
 *
 * Drop a `.md` file in `src/content/blog/` (work) or `src/content/life/`
 * (personal) with a small frontmatter header:
 *
 *   ---
 *   title: My post
 *   date: 2026-11-07
 *   summary: One sentence shown on cards.
 *   art: flow-dark
 *   tags: [data mesh, dpds]
 *   draft: false
 *   ---
 *
 * The file name becomes the URL slug.
 */

export type Post = {
  slug: string;
  section: 'blog' | 'life';
  title: string;
  date: string;
  summary: string;
  art: Art;
  tags: string[];
  draft: boolean;
  body: string;
  readingMinutes: number;
};

const blogFiles = import.meta.glob('./blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>;
const lifeFiles = import.meta.glob('./life/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>;

function parseFrontmatter(raw: string): { meta: Record<string, string | string[]>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string | string[]> = {};
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

function load(files: Record<string, string>, section: Post['section'], fallbackArt: Art): Post[] {
  return Object.entries(files)
    .map(([path, raw]) => {
      const slug = path.split('/').pop()!.replace(/\.md$/, '');
      const { meta, body } = parseFrontmatter(raw);
      const str = (k: string, d = '') => (typeof meta[k] === 'string' ? (meta[k] as string) : d);
      const words = body.split(/\s+/).filter(Boolean).length;
      return {
        slug,
        section,
        title: str('title', slug),
        date: str('date'),
        summary: str('summary'),
        art: (str('art') || fallbackArt) as Art,
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        draft: str('draft') === 'true',
        body,
        readingMinutes: Math.max(1, Math.round(words / 220)),
      };
    })
    .filter((p) => import.meta.env.DEV || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const blogPosts = load(blogFiles, 'blog', 'flow-dark');
export const lifePosts = load(lifeFiles, 'life', 'orbits-light');

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
