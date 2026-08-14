import { BasePage } from './BasePage.js';

export class TemplatesPage extends BasePage {
  constructor(page) {
    super(page);
    this.templateCards = page.locator('button:has-text("Login"), button:has-text("Registration"), button:has-text("Checkout"), button:has-text("Payment")');
    this.templateTitle = page.locator('h1');
  }

  async open() {
    await this.navigate('/templates');
  }

  async getTemplateCount() {
    return await this.templateCards.count();
  }

  async selectTemplate(name) {
    await this.page.locator(`button:has-text("${name}")`).first().click();
  }
}
