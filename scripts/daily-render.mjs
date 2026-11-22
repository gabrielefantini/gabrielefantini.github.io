// Markdown → HTML for the daily newspapers, at build time.
// GFM tables, LaTeX math rendered by KaTeX, and raw HTML for inline SVG figures.
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeKatex, { throwOnError: true, strict: 'ignore' })
  .use(rehypeStringify);

/** Render one Markdown document. Throws on invalid LaTeX so the build fails loudly. */
export function renderMarkdown(md, where = '') {
  try {
    let html = String(processor.processSync(md));
    // External links open in a new tab.
    html = html.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noreferrer"');
    return html;
  } catch (err) {
    throw new Error(`Daily: cannot render ${where}: ${err.message}`);
  }
}
