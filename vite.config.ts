import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Support both Vercel (domain root '/') and GitHub Pages ('/alapitvanyi_erasmus_lisszabon_2026/')
  // When deploying to Vercel, process.env.VERCEL is automatically '1'.
  // When building in GitHub Actions, process.env.GITHUB_ACTIONS is 'true'.
  // Can also be explicitly overridden by VITE_BASE_PATH.
  const isVercel = Boolean(process.env.VERCEL);
  const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);
  const customBase = process.env.VITE_BASE_PATH;

  let base = '/';
  if (customBase) {
    base = customBase;
  } else if (isVercel) {
    base = '/';
  } else if (isGitHubActions) {
    base = '/alapitvanyi_erasmus_lisszabon_2026/';
  } else {
    base = '/';
  }

  return { 
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
