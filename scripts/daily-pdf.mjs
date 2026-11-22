// Prints every pre-rendered daily issue (dist/daily/<paper>/<date>/index.html)
// to dist/daily/<paper>/<date>.pdf with headless Chromium, using the page's
// own print stylesheet. Runs after scripts/prerender.mjs.
//
// PDFs are cached in .cache/daily-pdf/ by a hash of the issue's HTML (which
// includes the hashed CSS/JS file names), so unchanged issues are not printed
// again on the daily rebuild. CI keeps that folder with actions/cache.
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const dist = 'dist';
const cacheDir = join('.cache', 'daily-pdf');
mkdirSync(cacheDir, { recursive: true });

const jobs = [];
const dailyDir = join(dist, 'daily');
if (existsSync(dailyDir)) {
  for (const paper of readdirSync(dailyDir)) {
    const paperDir = join(dailyDir, paper);
    if (!existsSync(join(paperDir, 'index.html'))) continue;
    for (const date of readdirSync(paperDir)) {
      const html = join(paperDir, date, 'index.html');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !existsSync(html)) continue;
      const hash = createHash('sha256').update(readFileSync(html)).digest('hex').slice(0, 20);
      jobs.push({ url: `/daily/${paper}/${date}/`, out: join(paperDir, `${date}.pdf`), cached: join(cacheDir, `${paper}-${date}-${hash}.pdf`) });
    }
  }
}

const todo = jobs.filter((j) => !existsSync(j.cached));
for (const j of jobs.filter((j) => existsSync(j.cached))) copyFileSync(j.cached, j.out);

if (todo.length) {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.json': 'application/json',
  };
  const server = createServer((req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(dist, path);
    if (path.endsWith('/')) file = join(file, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${server.address().port}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  // Static HTML is enough: block scripts so hydration can't change the page.
  await page.route('**/*.js', (route) => route.abort());
  for (const job of todo) {
    await page.goto(origin + job.url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: job.cached,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate:
        '<div style="width:100%;font-size:8px;color:#777;text-align:center;font-family:Georgia,serif">' +
        '<span class="title"></span> · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
    });
    copyFileSync(job.cached, job.out);
  }
  await browser.close();
  server.close();
}

console.log(`Daily PDFs: ${jobs.length} issues (${todo.length} printed, ${jobs.length - todo.length} from cache)`);
