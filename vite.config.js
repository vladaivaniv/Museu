import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base avoids broken asset URLs when serving from root,
  // sub-paths, or opening the built files from static hosting.
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
