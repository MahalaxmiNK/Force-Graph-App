import { test, expect } from "@playwright/test";

test.describe("Graph View Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/graph/grph_1"); // Navigate to a specific graph
  });

  test("should display graph visualization", async ({ page }) => {
    const graphSection = await page.locator(".graph-section");
    await expect(graphSection).toBeVisible();
  });

  test("should navigate back to graph list", async ({ page }) => {
    await page.click('button[aria-label="Back to Graph List"]');
    await expect(page).toHaveURL("/");
  });

  test("should add a new node to the graph", async ({ page }) => {
    await page.fill(
      'form input[placeholder="Enter new node name"]',
      "New Node"
    );
    await page.click('form button[type="submit"]');
    const nodeList = await page.locator(".node-list li");
    await expect(nodeList).toHaveCount(5);
    await expect(nodeList.last()).toContainText("New Node");
  });

  test("should delete a node from the graph", async ({ page }) => {
    await page.click('.delete-button[aria-label="Delete node Node 1"]');
    const nodeList = await page.locator(".node-list li");
    await expect(nodeList).toHaveCount(3);
  });

  test("should edit a node in the graph", async ({ page }) => {
    const nodeLabel = "Node 1";
    const nodeItem = page.locator(`.node-list li:has-text("${nodeLabel}")`);
    const editButton = nodeItem.locator(".edit-button");
    await editButton.click();

    const editInput = nodeItem.locator("input");
    const newLabel = "Edited Node";
    await editInput.fill(newLabel);

    const saveButton = nodeItem.locator('form button[type="submit"]');
    await saveButton.click();

    const updatedNode = page.locator(`.node-list li:has-text("${newLabel}")`);
    await expect(updatedNode).toHaveCount(1);

    const oldNode = page.locator(`.node-list li:has-text("${nodeLabel}")`);
    await expect(oldNode).toHaveCount(0);
  });

  test("should open and close the Add Edge modal", async ({ page }) => {
    // Open the Add Edge modal
    await page.click(".add-edge-modal-button");
    await expect(page.locator(".modal-title")).toHaveText("Add Edge");

    // Close the Add Edge modal
    await page.click(".close-button");
    await expect(page.locator(".modal-title")).not.toBeVisible();
  });

  test("should show error if nodes are not selected", async ({ page }) => {
    // Open the Add Edge modal
    await page.click(".add-edge-modal-button");

    // Wait for the modal to be visible
    await expect(page.locator(".modal-title")).toBeVisible();

    // Click on Add Edge button without selecting nodes
    await page.click(".add-edge-btn");

    // Verify the error message
    await expect(page.locator(".error")).toHaveText(
      "Please select both source and target nodes."
    );
  });
});
