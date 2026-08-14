import { test } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.toolCards = {
      playwright: page.locator('a:has-text("Web Generator (Playwright)")'),
      selenium: page.locator('a:has-text("Web Generator (Selenium)")'),
      appium: page.locator('a:has-text("Mobile Generator (Appium)")'),
      cicd: page.locator('a:has-text("CI/CD Pipeline Generator")'),
      sql: page.locator('a:has-text("SQL Validation Studio")'),
      templates: page.locator('a:has-text("Pre-built Templates")'),
    };
  }

  async open() {
    await this.navigate('/dashboard');
  }

  async clickToolCard(tool) {
    await this.toolCards[tool].click();
  }

  async getToolCardCount() {
    return await this.page.locator('a:has-text("Web Generator"), a:has-text("Mobile Generator"), a:has-text("CI/CD Pipeline"), a:has-text("SQL Validation"), a:has-text("Pre-built Templates")').count();
  }
}
