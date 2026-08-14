import { test, expect } from '@playwright/test';
import { AppiumGeneratorPage } from '../pages/AppiumGeneratorPage.js';

test.describe('Appium Generator', () => {
  test('should load Appium Generator page', async ({ page }) => {
    const appPage = new AppiumGeneratorPage(page);
    await appPage.open();
    await expect(page.locator('h1')).toHaveText('Appium Mobile Generator');
  });

  test('should display all 4 language options when Language tab is active', async ({ page }) => {
    const appPage = new AppiumGeneratorPage(page);
    await appPage.open();
    await page.getByRole('button', { name: '2. Language' }).click();
    await expect(page.locator('button:has-text("Java")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Python")').first()).toBeVisible();
    await expect(page.locator('button:has-text("JavaScript")').first()).toBeVisible();
    await expect(page.locator('button:has-text("C#")').first()).toBeVisible();
  });
});
