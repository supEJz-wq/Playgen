import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test.describe('Homepage', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate('/');
  });

  test('should load homepage', async () => {
    await expect(homePage.page.locator('h1')).toContainText('PlayGen');
  });

  test('should navigate to dashboard', async () => {
    await homePage.navigateTo('dashboard');
    await expect(homePage.page.locator('h1')).toContainText('QA Automation Toolkit');
  });
});
