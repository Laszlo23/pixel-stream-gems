import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests against production Next build (`next start`).
 * Run after `npm run build -w web`, or use `npm run test:e2e` (builds first).
 * Set PLAYWRIGHT_WEB_PORT (e.g. 3333) if 127.0.0.1:3000 is already in use locally.
 */
const webPort = process.env.PLAYWRIGHT_WEB_PORT ?? "3000";
const baseURL = `http://127.0.0.1:${webPort}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start -w web",
    url: baseURL,
    env: { ...process.env, PORT: webPort },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
