import { test, expect } from '@playwright/test';
import { TemplatesPage } from '../pages/TemplatesPage.js';

test.describe('Templates Page', () => {
  let templatesPage;

  test.beforeEach(async ({ page }) => {
    templatesPage = new TemplatesPage(page);
    await templatesPage.open();
  });

  test('should load Templates page', async () => {
    await expect(templatesPage.page.locator('h1')).toHaveText('Test Templates');
  });

  test('should display template cards', async () => {
    const count = await templatesPage.getTemplateCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to generator when template is clicked', async () => {
    await templatesPage.selectTemplate('Login');
    await expect(templatesPage.page).toHaveURL(/.*\/generator/);
  });

  test('should have valid template metadata', async () => {
    await expect(templatesPage.page.locator('button:has-text("Login")').first()).toBeVisible();
    await expect(templatesPage.page.locator('button:has-text("Registration")').first()).toBeVisible();
  });
});
