// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e-tests", // Directory for your E2E tests
  timeout: 30000, // Set a global timeout for tests (in ms)
  retries: 0, // Retry failed tests
  reporter: [["dot"], ["html", { open: "never" }]], // Reporting format
  use: {
    headless: true, // Run tests in headless mode (you can set it to false for debugging)
    actionTimeout: 0, // Disable individual action timeouts
    baseURL: "http://localhost:5173", // URL to run the app on
    video: "on-first-retry", // Record video on first retry
  },
  projects: [
    {
      name: "Desktop",
      use: { ...devices["Desktop Chrome"] }, // Test on Desktop Chrome
    },
  ],
});
