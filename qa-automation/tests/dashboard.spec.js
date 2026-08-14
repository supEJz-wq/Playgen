import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage.js';

test.describe('Dashboard', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
  });

  test('should load dashboard page', async () => {
    await expect(dashboardPage.page.locator('h1')).toHaveText('QA Automation Toolkit');
  });

  test('should display all 6 tool cards', async () => {
    const count = await dashboardPage.getToolCardCount();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should navigate to Playwright Generator from dashboard', async ({ page }) => {
    await dashboardPage.clickToolCard('playwright');
    await expect(page).toHaveURL(/.*generator/);
  });

  test('should navigate to Selenium Generator from dashboard', async ({ page }) => {
    await dashboardPage.clickToolCard('selenium');
    await expect(page).toHaveURL(/.*selenium-generator/);
  });

  test('should navigate to Appium Generator from dashboard', async ({ page }) => {
    await dashboardPage.clickToolCard('appium');
    await expect(page).toHaveURL(/.*appium-generator/);
  });

  test('should navigate to CI/CD Generator from dashboard', async ({ page }) => {
    await dashboardPage.clickToolCard('cicd');
    await expect(page).toHaveURL(/.*cicd-generator/);
  });

  test('should navigate to SQL Validation from dashboard', async ({ page }) => {
    await dashboardPage.clickToolCard('sql');
    await expect(page).toHaveURL(/.*sql-builder/);
  });

  test('should navigate to Templates from dashboard', async ({ page }) => {
    await dashboardPage.clickToolCard('templates');
    await expect(page).toHaveURL(/.*templates/);
  });

  test('should have no JavaScript errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.reload();
    expect(errors.filter(e => !e.includes('vite') && !e.includes('ReactDevTools')).length).toBe(0);
  });
});
