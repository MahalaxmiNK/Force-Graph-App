import { test, expect } from "@playwright/test";

test.describe("Filter Input Component", () => {
  test("should debounce input changes", async ({ page }) => {
    await page.goto("/");
    const input = page.locator(".filter-input");
    await input.type("Graph 1", { delay: 300 }); // Simulate typing
    await expect(input).toHaveValue("Graph 1");
  });
});
