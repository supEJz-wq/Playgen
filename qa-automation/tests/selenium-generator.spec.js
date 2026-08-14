import { test, expect } from '@playwright/test';
import { SeleniumGeneratorPage } from '../pages/SeleniumGeneratorPage.js';

test.describe('Selenium Generator', () => {
  let seleniumPage;

  test.beforeEach(async ({ page }) => {
    seleniumPage = new SeleniumGeneratorPage(page);
    await seleniumPage.open();
  });

  test('should load Selenium generator page', async () => {
    await expect(seleniumPage.page.locator('h1')).toHaveText('Selenium Project Generator');
  });

  test('should generate Java project from Login template', async () => {
    await seleniumPage.selectTemplate('Login');
    await seleniumPage.selectLanguage('Java');
    await seleniumPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await seleniumPage.generateProject();
    const code = await seleniumPage.page.locator('.monaco-editor .view-lines').innerText();
    expect(code).toContain('org.openqa.selenium');
  });

  test('should generate Python project from Login template', async () => {
    await seleniumPage.selectTemplate('Login');
    await seleniumPage.selectLanguage('Python');
    await seleniumPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await seleniumPage.generateProject();
    const code = await seleniumPage.page.locator('.monaco-editor .view-lines').innerText();
    expect(code).toContain('selenium');
  });

  test('should generate JavaScript project from Login template', async () => {
    await seleniumPage.selectTemplate('Login');
    await seleniumPage.selectLanguage('JavaScript');
    await seleniumPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await seleniumPage.generateProject();
    const code = await seleniumPage.page.locator('.monaco-editor .view-lines').innerText();
    expect(code.length).toBeGreaterThan(0);
  });

  test('should generate C# project from Login template', async () => {
    await seleniumPage.selectTemplate('Login');
    await seleniumPage.selectLanguage('C#');
    await seleniumPage.page.locator('input[placeholder="Your name"]').fill('QA Tester');
    await seleniumPage.generateProject();
    const code = await seleniumPage.page.locator('.monaco-editor .view-lines').innerText();
    expect(code).toContain('OpenQA.Selenium');
  });

  test('should display all 4 language options', async () => {
    await seleniumPage.selectLanguage('Java');
    await expect(seleniumPage.page.locator('button:has-text("Java")')).toBeVisible();
    await seleniumPage.selectLanguage('Python');
    await expect(seleniumPage.page.locator('button:has-text("Python")')).toBeVisible();
  });

  test('should reset form', async () => {
    await seleniumPage.selectTemplate('Login');
    await seleniumPage.resetForm();
    const generateBtn = seleniumPage.page.locator('button:has-text("Generate Project")');
    await expect(generateBtn).toBeDisabled();
  });
});
