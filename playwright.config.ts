/**
 * @file playwright.config.ts
 * @description Global Playwright test configuration for the automation framework.
 *
 * Key settings:
 *  - testDir      : All tests live under ./tests
 *  - timeout      : 30 seconds per test
 *  - retries      : 2 retries in CI, 0 locally
 *  - workers      : 1 worker in CI (sequential), auto in local (parallel)
 *  - reporters    : list (console), HTML, JUnit XML, Custom HTML, Allure
 *  - browser      : Chromium (Desktop Chrome) by default; Firefox & WebKit commented out
 *  - grep         : Only runs tests tagged with @master by default
 *
 * To run a different tag: npx playwright test --grep @sanity
 * To run a specific browser: npx playwright test --project=firefox
 */

import { defineConfig, devices } from "@playwright/test";

// Generate a unique timestamped log file for this execution run (e.g. execution_YYYY-MM-DD_HH-mm-ss.log)
if (!process.env.EXECUTION_LOG_FILE) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  process.env.EXECUTION_LOG_FILE = `execution_${timestamp}.log`;
}

export default defineConfig({
  timeout: 30 * 1000, // 30000 ms (30 seconds) per test
  testDir: "./tests",
  fullyParallel: true, // Run tests in parallel within each file
  retries: process.env.CI ? 2 : 0, // Retry failed tests twice in CI only
  workers: process.env.CI ? 1 : undefined, // Sequential in CI, auto-parallel locally
  reporter: [
    ["list"], // Detailed console output — shows each test name and result
    //['line'],                         // One-line progress output
    //['dot'],                          // Minimal console output (dot per test)
    ["html", { open: "never", outputFolder: "reports" }], // Static HTML report saved to reports/
    //['json', { outputFile: 'reports/results.json' }], // JSON Report (optional)
    ["junit", { outputFile: "reports/results.xml" }], // JUnit XML for CI integration
    ["./utils/CustomReporter.ts"], // Custom HTML reporter with screenshots & video
    ["allure-playwright", { outputFolder: "allure-results" }], // Allure report data
    ["./utils/loggerReporter.ts"], // Logger reporter — writes full test lifecycle to logs/
  ],
  use: {
    trace: "on-first-retry",         // Capture trace only on the first retry
    screenshot: "only-on-failure",   // Capture screenshot when a test fails
    video: "retain-on-failure",      // Retain video recording only for failed tests
    headless: false,                 // Run in headed mode locally (set true for CI via env)
    viewport: { width: 1280, height: 720 }, // Standard desktop viewport
    ignoreHTTPSErrors: true,         // Ignore SSL certificate errors
    permissions: ["geolocation"],    // Grant geolocation permission for location-based tests
  },
  grep: /@master/, // Default: only run tests tagged with @master
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }, // Use Chrome with standard desktop settings
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
    */
  ],
});
