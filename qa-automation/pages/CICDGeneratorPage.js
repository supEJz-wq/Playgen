import { test } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class CICDGeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    this.generateBtn = page.locator('button:has-text("Generate Pipeline")');
    this.resetBtn = page.locator('button:has-text("Reset")');
  }

  async open() {
    await this.navigate('/cicd-generator');
  }

  async selectFramework(fw) {
    await this.page.locator(`button:has-text("${fw}")`).first().click();
  }

  async selectLanguage(lang) {
    await this.page.locator('button:has-text("2. Language")').click();
    await this.page.locator(`button:has-text("${lang}")`).click();
  }

  async selectPlatform(platform) {
    await this.page.locator('button:has-text("3. CI/CD Platform")').click();
    await this.page.locator(`button:has-text("${platform}")`).click();
  }

  async generatePipeline() {
    await this.generateBtn.click();
  }

  async resetForm() {
    await this.resetBtn.click();
  }

  async getGeneratedPipeline() {
    const editor = this.page.locator('.monaco-editor .view-lines');
    return await editor.innerText();
  }
}
