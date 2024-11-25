import { test, expect } from "@playwright/test";

test.describe("Graph List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the list of graphs", async ({ page }) => {
    const graphCards = await page.locator(".graph-card");
    await expect(graphCards).toHaveCount(3); // Assuming mock data has 3 graphs
  });

  test("should filter graphs by name", async ({ page }) => {
    await page.fill(".filter-input", "Graph 1");
    const visibleGraphs = await page.locator(".graph-card");
    await expect(visibleGraphs).toHaveCount(1);
    await expect(visibleGraphs.first()).toContainText("Graph 1");
  });

  test("should add a new graph", async ({ page }) => {
    await page.fill('form input[placeholder="New Graph Name"]', "New Graph");
    await page.click('form button[type="submit"]');
    const graphCards = await page.locator(".graph-card");
    await expect(graphCards).toHaveCount(4);
    await expect(graphCards.last()).toContainText("New Graph");
  });

  test("should delete a graph", async ({ page }) => {
    await page.click('button[aria-label="Delete graph Graph 2"]');
    const graphCards = await page.locator(".graph-card");
    const firstGraphCard = graphCards.first();
    await expect(graphCards).toHaveCount(2);
    await expect(firstGraphCard).not.toContainText("Graph 2");
  });
});
