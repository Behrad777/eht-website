import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        motiq: resolve(__dirname, 'src/motiq.html'),
        eht: resolve(__dirname, 'src/eht.html'),
        contact: resolve(__dirname, 'src/contact.html'),
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    open: false,
    fs: {
      allow: ['..'],
    },
  },
});
