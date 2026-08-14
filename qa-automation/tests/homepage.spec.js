import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

test.describe('Homepage', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate('/');
  });

  test('should load homepage with correct title', async () => {
    await expect(homePage.page.locator('h1')).toBeVisible();
  });

  test('should display all navigation links', async () => {
    const navLinks = Object.values(homePage.navLinks);
    for (const link of navLinks) {
      await expect(link).toBeVisible();
    }
  });

  test('should have functional dark mode toggle', async ({ page }) => {
    const toggleBtn = page.locator('button:has-text("Toggle dark mode")');
    await toggleBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should display feature cards', async () => {
    const featureCards = homePage.page.locator('h3:has-text("Playwright"), h3:has-text("Selenium"), h3:has-text("Appium")');
    await expect(featureCards.first()).toBeVisible();
  });

  test('should have footer visible', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const footer = page.locator('text=Built for QA Engineers');
    await expect(footer).toBeVisible();
  });
});
