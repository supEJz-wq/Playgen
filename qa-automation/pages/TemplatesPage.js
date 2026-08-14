import { test } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class TemplatesPage extends BasePage {
  constructor(page) {
    super(page);
    this.templateCards = page.locator('button:has-text("Login"), button:has-text("Registration")');
  }

  async open() {
    await this.navigate('/templates');
  }

  async clickTemplate(name) {
    await this.page.locator(`button:has-text("${name}")`).first().click();
  }

  async getTemplateCount() {
    return await this.templateCards.count();
  }
}
