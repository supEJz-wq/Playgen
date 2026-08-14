import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.navLinks = {
      dashboard: page.locator('a:has-text("Dashboard")'),
      generator: page.locator('a:has-text("Web (Playwright)")'),
      selenium: page.locator('a:has-text("Web (Selenium)")'),
      appium: page.locator('a:has-text("Mobile (Appium)")'),
      cicd: page.locator('a:has-text("CI/CD Generator")'),
      sql: page.locator('a:has-text("SQL Validation")'),
      templates: page.locator('a:has-text("Templates")'),
      settings: page.locator('a:has-text("Settings")'),
    };
    this.darkModeToggle = page.locator('button:has-text("Toggle dark mode")');
  }

  async navigateTo(route) {
    await this.navLinks[route].click();
  }

  async toggleDarkMode() {
    await this.darkModeToggle.click();
  }

  async isDarkMode() {
    return await this.page.evaluate(() => document.documentElement.classList.contains('dark'));
  }
}
