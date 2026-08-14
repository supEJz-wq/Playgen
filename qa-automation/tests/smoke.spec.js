import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { TemplatesPage } from '../pages/TemplatesPage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { GeneratorPage } from '../pages/GeneratorPage.js';
import { PlaywrightGeneratorPage } from '../pages/PlaywrightGeneratorPage.js';

test.describe('Smoke', () => {
  test('homepage loads', async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate('/');
    await expect(page.locator('h1')).toContainText('PlayGen');
  });

  test('dashboard loads and shows tool cards', async ({ page }) => {
    const dash = new DashboardPage(page);
    await dash.open();
    await expect(page.locator('h1')).toHaveText('QA Automation Toolkit');
    const count = await dash.getToolCardCount();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('templates page loads and shows cards', async ({ page }) => {
    const tpl = new TemplatesPage(page);
    await tpl.open();
    await expect(page.locator('h1')).toHaveText('Test Templates');
    const count = await tpl.getTemplateCount();
    expect(count).toBeGreaterThan(0);
  });

  test('settings page loads with dropdowns and checkboxes', async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.open();
    await expect(page.locator('h1')).toHaveText('Settings');
    await expect(settings.frameworkSelect).toBeVisible();
    await expect(settings.languageSelect).toBeVisible();
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(5);
  });

  test('playwright generator page loads', async ({ page }) => {
    const gen = new PlaywrightGeneratorPage(page);
    await gen.open();
    await expect(page.locator('h1')).toHaveText('Playwright Test Generator');
  });
});
