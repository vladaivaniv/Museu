import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Museu/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
