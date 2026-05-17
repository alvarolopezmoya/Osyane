import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // For GitHub Pages project sites (https://user.github.io/Osyane/) use base: '/Osyane/'.
  // Set with: VITE_BASE=/Osyane/ npm run build  (or hard-code below).
  base: process.env.VITE_BASE || './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/uta-logo.jpg'],
      manifest: {
        name: 'Osyane — Gamificación FISEI-UTA',
        short_name: 'Osyane',
        description:
          'Sistema de Gamificación y Ranking Académico · FISEI · Universidad Técnica de Ambato',
        theme_color: '#060912',
        background_color: '#060912',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        scope: './',
        categories: ['education', 'productivity'],
        icons: [
          { src: 'assets/uta-logo.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: 'assets/uta-logo.jpg', sizes: '512x512', type: 'image/jpeg' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,woff2}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.{js,jsx}'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          charts: ['recharts'],
          xlsx: ['xlsx'],
        },
      },
    },
  },
});
