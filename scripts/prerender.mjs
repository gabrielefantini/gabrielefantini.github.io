// Build-time pre-rendering (static site generation).
//
// After `vite build` (client) and `vite build --ssr` (server entry), this
// renders every route to real HTML with its own <title>, meta tags and JSON-LD,
// so search engines and link previews get full content with HTTP 200 instead
// of an empty SPA shell. Also writes 404.html, sitemap.xml and robots.txt.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = 'dist';
const server = await import(pathToFileURL(join(process.cwd(), 'dist-ssr', 'entry-server.js')).href);
const { render, getRouteMeta, listRoutes, renderHead, SITE_URL } = server;

const template = readFileSync(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--seo:start-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html is missing the <!--seo:start--> markers or the empty #root');
}

function page(url, metaPath = url) {
  const head = renderHead(getRouteMeta(metaPath));
  return template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, head)
    .replace('<div id="root"></div>', `<div id="root">${render(url)}</div>`);
}

function write(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

const routes = listRoutes();
for (const { path } of routes) {
  write(path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html'), page(path));
}

// Unknown URLs: GitHub Pages serves 404.html (noindex, renders the NotFound page).
write(join(dist, '404.html'), page('/404/'));

// Old /sponsoring URL → /lab.
write(
  join(dist, 'sponsoring', 'index.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved to Lab</title>` +
    `<link rel="canonical" href="${SITE_URL}/lab/"><meta name="robots" content="noindex">` +
    `<meta http-equiv="refresh" content="0; url=/lab/"></head>` +
    `<body><a href="/lab/">This page moved to the Lab.</a></body></html>`,
);

const today = new Date().toISOString().slice(0, 10);
write(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes
      .map(
        ({ path, lastmod }) =>
          `  <url><loc>${SITE_URL}${path}</loc><lastmod>${lastmod || today}</lastmod>` +
          `<priority>${path === '/' ? '1.0' : path === '/about/' ? '0.9' : '0.7'}</priority></url>`,
      )
      .join('\n') +
    `\n</urlset>\n`,
);
write(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

rmSync('dist-ssr', { recursive: true, force: true });
console.log(`Pre-rendered ${routes.length} pages + 404, sitemap.xml and robots.txt`);
