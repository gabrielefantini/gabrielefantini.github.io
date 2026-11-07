// GitHub Pages has no server-side rewrites. Serving a copy of index.html as
// 404.html lets client-side routes like /blog/my-post load on a hard refresh.
import { copyFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
console.log('Wrote dist/404.html (SPA fallback)');
