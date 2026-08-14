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
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('should navigate to generator when template is clicked', async ({ page }) => {
    await templatesPage.clickTemplate('Login');
    await expect(page).toHaveURL(/.*generator\?template=/);
  });

  test('should have valid template metadata', async () => {
    const card = templatesPage.page.locator('button:has-text("Login")').first();
    await expect(card).toBeVisible();
    const text = await card.innerText();
    expect(text).toContain('Login');
  });
});
