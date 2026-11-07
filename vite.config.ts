import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from the root of https://gabrielefantini.github.io (a "user site"),
// so the base path is "/". If you ever move the site to a project repo
// (e.g. github.com/gabrielefantini/website) set base to '/website/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
});
