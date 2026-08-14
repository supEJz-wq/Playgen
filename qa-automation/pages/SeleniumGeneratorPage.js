import { BasePage } from './BasePage.js';

export class SeleniumGeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    this.templateButtons = page.locator('button:has-text("Login"), button:has-text("Registration"), button:has-text("Checkout")');
    this.languageButtons = page.locator('button:has-text("Java"), button:has-text("Python"), button:has-text("JavaScript"), button:has-text("C#")');
    this.generateBtn = page.getByRole('button', { name: 'Generate Project' });
    this.resetBtn = page.getByRole('button', { name: 'Reset Form' });
    this.codeOutput = page.locator('.monaco-editor .view-lines, [data-testid="generated-code"]');
  }

  async open() {
    await this.navigate('/selenium-generator');
  }

  async selectTemplate(name) {
    await this.page.getByRole('button', { name: new RegExp(`^${name}`) }).first().click();
    await this.page.waitForTimeout(500);
  }

  async selectLanguage(lang) {
    await this.languageButtons.filter({ hasText: lang }).first().click();
  }

  async generateProject() {
    await this.generateBtn.click();
  }

  async resetForm() {
    await this.resetBtn.click();
  }

  async getGeneratedCode() {
    return await this.codeOutput.innerText();
  }
}
