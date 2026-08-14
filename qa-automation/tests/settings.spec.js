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
    await expect(settingsPage.languageSelect).toBeVisible();
  });

  test('should save settings and persist across navigation', async () => {
    await settingsPage.selectFramework('Selenium');
    await settingsPage.saveSettings();
    await settingsPage.navigate('/dashboard');
    await settingsPage.navigate('/settings');
    const value = await settingsPage.frameworkSelect.inputValue();
    expect(value.toLowerCase()).toBe('selenium');
  });

  test('should reset to defaults', async () => {
    await settingsPage.selectFramework('Selenium');
    await settingsPage.saveSettings();
    await settingsPage.resetSettings();
    const value = await settingsPage.frameworkSelect.inputValue();
    expect(value.toLowerCase()).toBe('playwright');
  });

  test('should have generation option checkboxes', async () => {
    const checkboxes = settingsPage.page.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(5);
  });
});
