import { defineConfig, devices } from '@playwright/test';

const frontendUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5173';
const apiUrl = process.env.PLAYWRIGHT_API_URL || 'http://127.0.0.1:5000/api/v1';

/**
 * Playwright configuration for LifeStream API E2E tests
 * Tests run against the running Express backend on localhost:5000
 * Frontend runs on localhost:5173
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // Run tests serially to avoid rate limit conflicts
  fullyParallel: false,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Run with 1 worker to avoid rate limit conflicts
  workers: 1,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  
  // Global test timeout
  timeout: 60000,
  expect: { timeout: 10000 },
  
  // Test projects
  projects: [
    {
      name: 'api',
      testMatch: '**/*.api.ts',
      use: {
        baseURL: apiUrl,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    },
    {
      name: 'chromium',
      testMatch: '**/*.e2e.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: frontendUrl,
      },
    },
  ],

  // Start Vite automatically for browser tests. Existing servers are reused
  // locally so this also works while `npm run dev` is already running.
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    cwd: '..',
    url: frontendUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
