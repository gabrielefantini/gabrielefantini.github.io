import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error — plain ESM helper shared with the build scripts
import { DAILY_DIR, loadDaily } from './scripts/daily-content.mjs';

type DailyIssue = { paper: string; date: string; html: string; prevSolutions: { html: string } | null };

/**
 * `virtual:daily` — the daily newspapers, read from src/content/daily/.
 *
 * - Production builds only include issues dated today or earlier
 *   (Europe/Rome), so future issues never reach the site. `npm run dev` shows
 *   everything, with future issues marked as scheduled.
 * - Markdown is rendered to HTML (with KaTeX) here, at build time.
 * - The client bundle gets only the index (titles, dates, topics). Each
 *   issue's HTML is a separate file, daily/data/<paper>/<date>.json, fetched
 *   on client-side navigation; pre-rendered pages already contain it.
 */
function daily(): Plugin {
  const id = 'virtual:daily';
  const resolved = '\0' + id;
  let dev = false;
  let ssrBuild = false;
  const content = (issue: DailyIssue) => ({ html: issue.html, prevSolutions: issue.prevSolutions });
  const load = () => loadDaily({ includeScheduled: dev }) as { cutoff: string; issues: DailyIssue[]; syllabi: unknown };
  return {
    name: 'daily-newspapers',
    configResolved(config) {
      dev = config.command === 'serve';
      ssrBuild = !!config.build.ssr;
    },
    resolveId(source) {
      return source === id ? resolved : undefined;
    },
    load(source, options) {
      if (source !== resolved) return;
      this.addWatchFile(DAILY_DIR);
      const data = load();
      if (options?.ssr) return `export default ${JSON.stringify(data)};`;
      const index = {
        ...data,
        issues: data.issues.map(({ html: _h, prevSolutions, ...meta }) => ({
          ...meta,
          html: null,
          prevSolutions: prevSolutions ? { ...prevSolutions, html: null } : null,
        })),
      };
      return `export default ${JSON.stringify(index)};`;
    },
    generateBundle() {
      if (ssrBuild) return;
      for (const issue of load().issues) {
        this.emitFile({
          type: 'asset',
          fileName: `daily/data/${issue.paper}/${issue.date}.json`,
          source: JSON.stringify(content(issue)),
        });
      }
    },
    configureServer(server) {
      server.watcher.add(DAILY_DIR);
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(DAILY_DIR)) return;
        const mod = server.moduleGraph.getModuleById(resolved);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      });
      server.middlewares.use((req, res, next) => {
        const m = /^\/daily\/data\/([a-z]+)\/(\d{4}-\d{2}-\d{2})\.json$/.exec(req.url || '');
        if (!m) return next();
        const issue = load().issues.find((i) => i.paper === m[1] && i.date === m[2]);
        if (!issue) return next();
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(content(issue)));
      });
    },
  };
}

// Served from the root of https://gabrielefantini.github.io (a "user site"),
// so the base path is "/". If you ever move the site to a project repo
// (e.g. github.com/gabrielefantini/website) set base to '/website/'.
export default defineConfig({
  base: '/',
  plugins: [react(), daily()],
});
