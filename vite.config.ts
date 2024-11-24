import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable global test functions like describe, it
    environment: "jsdom", // Use jsdom for simulating browser environment
    coverage: {
      provider: "v8", // Or 'istanbul' for coverage reporting
      reporter: ["text", "json", "html"],
    },
    setupFiles: ["./vitest.setup.ts"], // Setup file for global imports
    include: ["tests/**/*.test.tsx", "tests/**/*.test.ts"], // Test file patterns
    exclude: [...configDefaults.exclude], // Exclude default directories
  },
});
