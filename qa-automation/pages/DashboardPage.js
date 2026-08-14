import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.toolCards = page.locator('a:has-text("Web Generator (Playwright)"), a:has-text("Mobile Generator (Appium)"), a:has-text("CI/CD Pipeline Generator"), a:has-text("SQL Validation Studio"), a:has-text("Pre-built Templates")');
    this.navLinks = {
      dashboard: page.locator('nav a:has-text("Dashboard")'),
      generator: page.locator('nav a:has-text("Web (Playwright)")'),
      selenium: page.locator('nav a:has-text("Web (Selenium)")'),
      appium: page.locator('nav a:has-text("Mobile (Appium)")'),
      cicd: page.locator('nav a:has-text("CI/CD Generator")'),
      sql: page.locator('nav a:has-text("SQL Validation")'),
      templates: page.locator('nav a:has-text("Templates")'),
      settings: page.locator('nav a:has-text("Settings")'),
    };
  }

  async open() {
    await this.navigate('/dashboard');
  }

  async navigateTo(route) {
    await this.navLinks[route].click();
  }

  async getToolCardCount() {
    return await this.toolCards.count();
  }
}
