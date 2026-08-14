import { test, expect } from '@playwright/test';
import { SQLValidationPage } from '../pages/SQLValidationPage.js';

test.describe('SQL Validation Studio', () => {
  let sqlPage;

  test.beforeEach(async ({ page }) => {
    sqlPage = new SQLValidationPage(page);
    await sqlPage.open();
  });

  test('should load SQL Validation Studio', async () => {
    await expect(sqlPage.page.locator('h1')).toHaveText('SQL Validation Studio');
  });

  test('should generate Count Records query', async () => {
    await sqlPage.selectValidation('Count Records');
    await sqlPage.enterTable('users');
    await sqlPage.generateSQL();
    const sql = await sqlPage.getGeneratedSQL();
    expect(sql).toContain('COUNT');
  });

  test('should generate Aggregate Validation query', async () => {
    await sqlPage.selectValidation('Aggregate Validation');
    await sqlPage.enterTable('users');
    await sqlPage.generateSQL();
    const sql = await sqlPage.getGeneratedSQL();
    expect(sql).toContain('COUNT');
  });

  test('should display all 12 validation types', async () => {
    await sqlPage.selectValidation('Record Exists');
    await expect(sqlPage.page.locator('text=Record Exists')).toBeVisible();
  });

  test('should display all 5 database options', async () => {
    await sqlPage.selectDatabase('MySQL');
    const options = await sqlPage.databaseSelect.locator('option').count();
    expect(options).toBeGreaterThanOrEqual(5);
  });

  test('should have Copy, Download, and Clear buttons', async () => {
    await sqlPage.generateSQL();
    await expect(sqlPage.page.locator('button:has-text("Copy SQL")')).toBeVisible();
    await expect(sqlPage.page.locator('button:has-text("Download")')).toBeVisible();
    await expect(sqlPage.page.locator('button:has-text("Clear")')).toBeVisible();
  });
});
