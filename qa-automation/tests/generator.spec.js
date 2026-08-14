import { test, expect } from '@playwright/test';
import { GeneratorPage } from '../pages/GeneratorPage.js';

test.describe('Playwright Generator', () => {
  test('should load Playwright Generator page', async ({ page }) => {
    const genPage = new GeneratorPage(page);
    await genPage.open();
    await expect(page.locator('h1')).toHaveText('Playwright Test Generator');
  });

  test('should have output tabs', async ({ page }) => {
    const genPage = new GeneratorPage(page);
    await genPage.open();
    await expect(page.locator('button:has-text("Generated Code")')).toBeVisible();
    await expect(page.locator('button:has-text("Project Structure")')).toBeVisible();
  });
});
