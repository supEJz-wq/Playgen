import { test, expect } from '@playwright/test';
import { SQLValidationPage } from '../pages/SQLValidationPage.js';

test.describe('SQL Validation Studio', () => {
  test.beforeEach(async ({ page }) => {
    const sqlPage = new SQLValidationPage(page);
    await sqlPage.open();
  });

  test('should load SQL Validation Studio page', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('SQL Validation Studio');
  });

  test('should have validation type dropdown and generate button', async ({ page }) => {
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate SQL' })).toBeVisible();
  });
});
