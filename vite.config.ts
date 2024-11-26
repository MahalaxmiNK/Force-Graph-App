import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: "gzip",
      threshold: 1025,
      deleteOriginFile: false,
    }),
  ],
  build: {
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: [...configDefaults.exclude],
  },
});
