import { test, expect } from '@playwright/test';
import { SeleniumGeneratorPage } from '../pages/SeleniumGeneratorPage.js';

test.describe('Selenium Generator', () => {
  test('should load Selenium Generator page', async ({ page }) => {
    const selPage = new SeleniumGeneratorPage(page);
    await selPage.open();
    await expect(page.locator('h1')).toHaveText('Selenium Project Generator');
  });

  test('should display all 4 language options when Language tab is active', async ({ page }) => {
    const selPage = new SeleniumGeneratorPage(page);
    await selPage.open();
    await page.getByRole('button', { name: '2. Language' }).click();
    await expect(page.locator('button:has-text("Java")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Python")').first()).toBeVisible();
    await expect(page.locator('button:has-text("JavaScript")').first()).toBeVisible();
    await expect(page.locator('button:has-text("C#")').first()).toBeVisible();
  });
});
