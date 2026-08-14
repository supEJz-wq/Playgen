import { test, expect } from '@playwright/test';
import { PlaywrightGeneratorPage } from '../pages/PlaywrightGeneratorPage.js';

test.describe('Playwright Generator', () => {
  let generatorPage;

  test.beforeEach(async ({ page }) => {
    generatorPage = new PlaywrightGeneratorPage(page);
    await generatorPage.open();
  });

  test('should load generator page', async () => {
    await expect(generatorPage.page.locator('h1')).toHaveText('Playwright Test Generator');
  });

  test('should display 12 quick-start templates', async () => {
    const templates = ['Login', 'Registration', 'Logout', 'Forgot Password', 'Search', 'Checkout', 'Shopping Cart', 'CRUD Operations', 'Profile Update', 'Mobile Login (Appium)', 'Mobile Checkout (Appium)', 'Payment'];
    for (const tpl of templates) {
      await expect(generatorPage.page.locator(`button:has-text("${tpl}")`).first()).toBeVisible();
    }
  });

  test('should generate project from Login template', async () => {
    await generatorPage.selectTemplate('Login');
    await generatorPage.page.locator('select').selectOption('Development');
    await generatorPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await generatorPage.generateProject();
    const code = await generatorPage.getGeneratedCode();
    expect(code).toContain('@playwright/test');
  });

  test('should reset form when Reset is clicked', async () => {
    await generatorPage.selectTemplate('Login');
    await generatorPage.resetForm();
    const generateBtn = generatorPage.page.locator('button:has-text("Generate Project")');
    await expect(generateBtn).toBeDisabled();
  });

  test('should show all output tabs after generation', async () => {
    await generatorPage.selectTemplate('Login');
    await generatorPage.generateProject();
    await expect(generatorPage.page.locator('button:has-text("Generated Code")')).toBeVisible();
    await expect(generatorPage.page.locator('button:has-text("Project Structure")')).toBeVisible();
    await expect(generatorPage.page.locator('button:has-text("Explanation")')).toBeVisible();
    await expect(generatorPage.page.locator('button:has-text("QA Checklist")')).toBeVisible();
    await expect(generatorPage.page.locator('button:has-text("Best Practices")')).toBeVisible();
  });

  test('should select TypeScript language', async () => {
    await generatorPage.selectLanguage('TypeScript');
    await expect(generatorPage.page.locator('button:has-text("TypeScript")')).toHaveClass(/bg-pink/);
  });

  test('should select Page Object Model architecture', async () => {
    await generatorPage.selectLanguage('JavaScript');
    await generatorPage.selectArchitecture('Page Object Model');
    await expect(generatorPage.page.locator('button:has-text("Page Object Model")')).toHaveClass(/bg-pink/);
  });
});
