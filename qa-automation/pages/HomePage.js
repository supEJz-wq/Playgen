import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.navLinks = {
      dashboard: page.locator('nav a:has-text("Dashboard")'),
      playwright: page.locator('nav a:has-text("Web (Playwright)")'),
      selenium: page.locator('nav a:has-text("Web (Selenium)")'),
      appium: page.locator('nav a:has-text("Mobile (Appium)")'),
      cicd: page.locator('nav a:has-text("CI/CD Generator")'),
      sql: page.locator('nav a:has-text("SQL Validation")'),
      templates: page.locator('nav a:has-text("Templates")'),
      settings: page.locator('nav a:has-text("Settings")'),
    };
  }

  async clickNav(link) {
    await this.navLinks[link].click();
  }
}
