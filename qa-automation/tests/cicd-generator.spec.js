import { test, expect } from '@playwright/test';
import { CICDGeneratorPage } from '../pages/CICDGeneratorPage.js';

test.describe('CI/CD Generator', () => {
  test.beforeEach(async ({ page }) => {
    const cicdPage = new CICDGeneratorPage(page);
    await cicdPage.open();
  });

  test('should load CI/CD Generator page', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('CI/CD Pipeline Generator');
  });

  test('should display all 3 framework options', async ({ page }) => {
    await expect(page.locator('button:has-text("Playwright")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Selenium")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Appium")').first()).toBeVisible();
  });
});
