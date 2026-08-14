import { test, expect } from '@playwright/test';
import { PlaywrightGeneratorPage } from '../pages/PlaywrightGeneratorPage.js';

test.describe('Playwright Generator', () => {
  test('should load Playwright Generator page', async ({ page }) => {
    const genPage = new PlaywrightGeneratorPage(page);
    await genPage.open();
    await expect(page.locator('h1')).toHaveText('Playwright Test Generator');
  });

  test('should display quick start templates on initial load', async ({ page }) => {
    const genPage = new PlaywrightGeneratorPage(page);
    await genPage.open();
    const templates = ['Login', 'Registration', 'Checkout', 'Payment'];
    for (const t of templates) {
      await expect(page.locator(`button:has-text("${t}")`).first()).toBeVisible();
    }
  });

  test('should have output tabs', async ({ page }) => {
    const genPage = new PlaywrightGeneratorPage(page);
    await genPage.open();
    await expect(page.locator('button:has-text("Generated Code")')).toBeVisible();
    await expect(page.locator('button:has-text("Project Structure")')).toBeVisible();
  });
});
