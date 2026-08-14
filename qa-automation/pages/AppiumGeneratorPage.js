import { test } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class AppiumGeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    this.generateBtn = page.locator('button:has-text("Generate Project")');
    this.resetBtn = page.locator('button:has-text("Reset")');
  }

  async open() {
    await this.navigate('/appium-generator');
  }

  async selectTemplate(name) {
    await this.page.locator(`button:has-text("${name}")`).first().click();
  }

  async selectLanguage(lang) {
    await this.page.locator(`button:has-text("🟧 ${lang}"), button:has-text("🟨 ${lang}"), button:has-text("🟩 ${lang}"), button:has-text("🟦 ${lang}")`).first().click();
  }

  async generateProject() {
    await this.generateBtn.click();
  }

  async resetForm() {
    await this.resetBtn.click();
  }
}
