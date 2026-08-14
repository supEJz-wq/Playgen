import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage.js';
import { TemplatesPage } from '../pages/TemplatesPage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { PlaywrightGeneratorPage } from '../pages/PlaywrightGeneratorPage.js';

test.describe('Dashboard', () => {
  test('should load dashboard page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    await expect(page.locator('h1')).toHaveText('QA Automation Toolkit');
  });

  test('should navigate to Playwright Generator from dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    const genPage = new PlaywrightGeneratorPage(page);
    await genPage.open();
    await expect(page.locator('h1')).toHaveText('Playwright Test Generator');
  });

  test('should navigate to Templates from dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    const tplPage = new TemplatesPage(page);
    await tplPage.open();
    await expect(page.locator('h1')).toHaveText('Test Templates');
  });

  test('should navigate to Settings from dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    const settingsPage = new SettingsPage(page);
    await settingsPage.open();
    await expect(page.locator('h1')).toHaveText('Settings');
  });
});
