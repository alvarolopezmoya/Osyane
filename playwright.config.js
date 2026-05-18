import { defineConfig, devices } from '@playwright/test';

// Playwright config — corre tests E2E contra el servidor de Vite.
// Local:  npm run e2e
// CI:     setea CI=true (Playwright lo detecta y ajusta reintentos/workers).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    // Forzar idioma español — Osyane detecta navigator.language en runtime y
    // sin esto el navegador headless arranca en inglés y los selectores fallan.
    locale: 'es-EC',
    timezoneId: 'America/Guayaquil',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Arranca el dev server automáticamente.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Habilita estos cuando los necesites:
    // { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    // { name: 'mobile',   use: { ...devices['Pixel 5'] } },
  ],
});
