import { test, expect } from '@playwright/test';
import { SettingsPage } from '../pages/SettingsPage.js';

test.describe('Settings', () => {
  let settingsPage;

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);
    await settingsPage.open();
  });

  test('should load Settings page', async () => {
    await expect(settingsPage.page.locator('h1')).toHaveText('Settings');
  });

  test('should have framework, language, and architecture dropdowns', async () => {
    await expect(settingsPage.frameworkSelect).toBeVisible();
    await expect(settingsPage.page.locator('select').nth(1)).toBeVisible();
    await expect(settingsPage.page.locator('select').nth(2)).toBeVisible();
  });

  test('should save settings and persist across navigation', async ({ page }) => {
    await settingsPage.selectFramework('Selenium');
    await settingsPage.saveSettings();
    await settingsPage.open();
    const selected = await settingsPage.getSelectedFramework();
    expect(selected).toBe('Selenium');
  });

  test('should reset to defaults', async () => {
    await settingsPage.selectFramework('Selenium');
    await settingsPage.saveSettings();
    await settingsPage.resetToDefaults();
    const selected = await settingsPage.getSelectedFramework();
    expect(selected).toBe('playwright');
  });

  test('should have all 5 generation option checkboxes', async () => {
    const checkboxes = settingsPage.page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBe(5);
  });
});
