import { BasePage } from './BasePage.js';

export class GeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    this.templateButtons = page.locator('button:has-text("Login"), button:has-text("Registration"), button:has-text("Logout")');
    this.generateBtn = page.getByRole('button', { name: 'Generate Project' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
    this.copyCodeBtn = page.getByRole('button', { name: 'Copy Code' });
    this.downloadBtn = page.getByRole('button', { name: 'Download' });
  }

  async open() {
    await this.navigate('/generator');
  }

  async selectTemplate(name) {
    await this.page.getByRole('button', { name: new RegExp(`^${name}`) }).first().click();
  }

  async generateProject() {
    await this.generateBtn.click();
  }

  async resetForm() {
    await this.resetBtn.click();
  }

  async getGeneratedCode() {
    const editor = this.page.locator('.monaco-editor .view-lines');
    return await editor.innerText();
  }
}
