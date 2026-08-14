import { test, expect } from '@playwright/test';
import { CICDGeneratorPage } from '../pages/CICDGeneratorPage.js';

test.describe('CI/CD Generator', () => {
  let cicdPage;

  test.beforeEach(async ({ page }) => {
    cicdPage = new CICDGeneratorPage(page);
    await cicdPage.open();
  });

  test('should load CI/CD generator page', async () => {
    await expect(cicdPage.page.locator('h1')).toHaveText('CI/CD Pipeline Generator');
  });

  test('should generate GitHub Actions pipeline for Playwright', async () => {
    await cicdPage.selectFramework('Playwright');
    await cicdPage.selectLanguage('JavaScript');
    await cicdPage.selectPlatform('GitHub Actions');
    await cicdPage.generatePipeline();
    const pipeline = await cicdPage.getGeneratedPipeline();
    expect(pipeline).toContain('GitHub Actions');
    expect(pipeline).toContain('playwright');
  });

  test('should generate GitLab CI pipeline for Selenium', async () => {
    await cicdPage.selectFramework('Selenium');
    await cicdPage.selectLanguage('Python');
    await cicdPage.selectPlatform('GitLab CI');
    await cicdPage.generatePipeline();
    const pipeline = await cicdPage.getGeneratedPipeline();
    expect(pipeline).toContain('gitlab');
  });

  test('should generate Jenkins pipeline for Selenium', async () => {
    await cicdPage.selectFramework('Selenium');
    await cicdPage.selectLanguage('Java');
    await cicdPage.selectPlatform('Jenkins');
    await cicdPage.generatePipeline();
    const pipeline = await cicdPage.getGeneratedPipeline();
    expect(pipeline.length).toBeGreaterThan(0);
  });

  test('should generate Azure DevOps pipeline for Appium', async () => {
    await cicdPage.selectFramework('Appium');
    await cicdPage.selectPlatform('Azure DevOps');
    await cicdPage.generatePipeline();
    const pipeline = await cicdPage.getGeneratedPipeline();
    expect(pipeline.length).toBeGreaterThan(0);
  });

  test('should display all 3 framework options', async () => {
    await expect(cicdPage.page.locator('button:has-text("Playwright")')).toBeVisible();
    await expect(cicdPage.page.locator('button:has-text("Selenium")')).toBeVisible();
    await expect(cicdPage.page.locator('button:has-text("Appium")')).toBeVisible();
  });

  test('should display all 4 CI/CD platforms', async () => {
    await cicdPage.selectFramework('Playwright');
    await cicdPage.selectLanguage('JavaScript');
    await expect(cicdPage.page.locator('button:has-text("GitHub Actions")')).toBeVisible();
    await expect(cicdPage.page.locator('button:has-text("GitLab CI")')).toBeVisible();
    await expect(cicdPage.page.locator('button:has-text("Jenkins")')).toBeVisible();
    await expect(cicdPage.page.locator('button:has-text("Azure DevOps")')).toBeVisible();
  });

  test('should reset form', async () => {
    await cicdPage.selectFramework('Selenium');
    await cicdPage.resetForm();
    const generateBtn = cicdPage.page.locator('button:has-text("Generate Pipeline")');
    await expect(generateBtn).toBeDisabled();
  });
});
