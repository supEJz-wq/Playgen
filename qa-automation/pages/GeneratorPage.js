import { test } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class GeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    this.templateButtons = page.locator('button:has-text("Login"), button:has-text("Registration"), button:has-text("Logout")');
    this.generateBtn = page.locator('button:has-text("Generate Project")');
    this.resetBtn = page.locator('button:has-text("Reset")');
    this.copyCodeBtn = page.locator('button:has-text("Copy Code")');
    this.downloadBtn = page.locator('button:has-text("Download")');
  }

  async selectTemplate(name) {
    await this.page.locator(`button:has-text("${name}")`).first().click();
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
