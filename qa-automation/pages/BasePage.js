import { page } from '@playwright/test';

export class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://example.com';
  }

  async navigate(path = '/') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  async getTitle() {
    return await this.page.title();
  }

  async getHeading() {
    return await this.page.locator('h1').first().innerText();
  }
}
