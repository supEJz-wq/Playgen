import { test, expect } from '@playwright/test';
import { GeneratorPage } from '../pages/GeneratorPage.js';

test.describe('Playwright Generator', () => {
  let generatorPage;

  test.beforeEach(async ({ page }) => {
    generatorPage = new GeneratorPage(page);
    await generatorPage.navigate('/generator');
  });

  test('should load generator page', async () => {
    await expect(generatorPage.page.locator('h1')).toHaveText('Playwright Test Generator');
  });

  test('should generate project from Login template', async () => {
    await generatorPage.selectTemplate('Login');
    await generatorPage.page.locator('select').first().selectOption('Development');
    await generatorPage.page.locator('input[aria-label*="name"], input[name*="name"], label:has-text("Author") >> input').first().fill('QA Tester');
    await generatorPage.generateProject();
    const code = await generatorPage.getGeneratedCode();
    expect(code).toContain('@playwright/test');
  });
});
