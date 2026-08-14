import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { GeneratorPage } from '../pages/GeneratorPage.js';

test.describe('PlayGen Navigation', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate('/');
  });

  test('should load homepage', async () => {
    await expect(homePage.page.locator('h1')).toBeVisible();
  });

  test('should navigate to Dashboard', async ({ page }) => {
    await homePage.clickNav('dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to Playwright Generator', async ({ page }) => {
    await homePage.clickNav('playwright');
    await expect(page).toHaveURL(/.*generator/);
  });

  test('should navigate to Selenium Generator', async ({ page }) => {
    await homePage.clickNav('selenium');
    await expect(page).toHaveURL(/.*selenium-generator/);
  });

  test('should navigate to Appium Generator', async ({ page }) => {
    await homePage.clickNav('appium');
    await expect(page).toHaveURL(/.*appium-generator/);
  });

  test('should navigate to CI/CD Generator', async ({ page }) => {
    await homePage.clickNav('cicd');
    await expect(page).toHaveURL(/.*cicd-generator/);
  });

  test('should navigate to SQL Validation', async ({ page }) => {
    await homePage.clickNav('sql');
    await expect(page).toHaveURL(/.*sql-builder/);
  });

  test('should navigate to Templates', async ({ page }) => {
    await homePage.clickNav('templates');
    await expect(page).toHaveURL(/.*templates/);
  });

  test('should navigate to Settings', async ({ page }) => {
    await homePage.clickNav('settings');
    await expect(page).toHaveURL(/.*settings/);
  });
});
