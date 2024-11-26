// e2e-tests/loader.spec.ts
import { test, expect } from "@playwright/test";

test("Loader component should be visible", async ({ page }) => {
  await page.goto("/");

  // Verify that the loader container is present
  const loaderContainer = await page.locator(".loader-container");
  await expect(loaderContainer).toBeVisible();

  const spinner = await page.locator(".spinner");
  await expect(spinner).toBeVisible();
});
