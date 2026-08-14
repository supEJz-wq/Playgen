import { test, expect } from '@playwright/test';
import { AppiumGeneratorPage } from '../pages/AppiumGeneratorPage.js';

test.describe('Appium Generator', () => {
  let appiumPage;

  test.beforeEach(async ({ page }) => {
    appiumPage = new AppiumGeneratorPage(page);
    await appiumPage.open();
  });

  test('should load Appium generator page', async () => {
    await expect(appiumPage.page.locator('h1')).toHaveText('Appium Mobile Generator');
  });

  test('should generate Java project from Login template', async () => {
    await appiumPage.selectTemplate('Login');
    await appiumPage.selectLanguage('Java');
    await appiumPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await appiumPage.generateProject();
    const code = await appiumPage.page.locator('.monaco-editor .view-lines').innerText();
    expect(code).toContain('io.appium');
  });

  test('should generate Python project from Login template', async () => {
    await appiumPage.selectTemplate('Login');
    await appiumPage.selectLanguage('Python');
    await appiumPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await appiumPage.generateProject();
    const code = await appiumPage.page.locator('.monaco-editor .view-lines').innerText();
    expect(code.length).toBeGreaterThan(0);
  });

  test('should generate JavaScript project from Login template', async () => {
    await appiumPage.selectTemplate('Login');
    await appiumPage.selectLanguage('JavaScript');
    await appiumPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await appiumPage.generateProject();
    const code = await appiumPage.page.locator('.monaco-editor .view-lines').innerText();
    expect(code.length).toBeGreaterThan(0);
  });

  test('should generate C# project from Login template', async () => {
    await appiumPage.selectTemplate('Login');
    await appiumPage.selectLanguage('C#');
    await appiumPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await appiumPage.generateProject();
    const code = await appiumPage.page.locator('.monaco-editor .view-lines').innerText();
    expect(code.length).toBeGreaterThan(0);
  });

  test('should reset form', async () => {
    await appiumPage.selectTemplate('Login');
    await appiumPage.resetForm();
    const generateBtn = appiumPage.page.locator('button:has-text("Generate Project")');
    await expect(generateBtn).toBeDisabled();
  });
});
