import { test, expect } from "@playwright/test";

test.describe("Form Input Component", () => {
  test("should display error for empty input", async ({ page }) => {
    await page.goto("/");
    await page.click('form button[type="submit"]');
    const errorMessage = await page.locator(".error-message");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Graph name cannot be empty!");
  });
});
