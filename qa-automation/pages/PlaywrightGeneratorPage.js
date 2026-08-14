import { BasePage } from './BasePage.js';

export class PlaywrightGeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    this.templateButtons = page.locator('button:has-text("Login"), button:has-text("Registration"), button:has-text("Logout")');
    this.generateBtn = page.locator('button:has-text("Generate Project")');
    this.resetBtn = page.locator('button:has-text("Reset")');
    this.copyCodeBtn = page.locator('button:has-text("Copy Code")');
    this.downloadBtn = page.locator('button:has-text("Download")');
  }

  async open() {
    await this.navigate('/generator');
  }

  async selectTemplate(name) {
    await this.page.locator(`button:has-text("${name}")`).first().click();
  }

  async selectLanguage(lang) {
    await this.page.locator(`button:has-text("🟧 ${lang}"), button:has-text("🟨 ${lang}"), button:has-text("🟩 ${lang}"), button:has-text("🟦 ${lang}")`).first().click();
  }

  async selectArchitecture(arch) {
    await this.page.locator(`button:has-text("🟧 ${arch}"), button:has-text("🟨 ${arch}"), button:has-text("🟩 ${arch}"), button:has-text("🟦 ${arch}")`).first().click();
  }

  async fillProjectInfo(data) {
    for (const [field, value] of Object.entries(data)) {
      const input = this.page.locator(`input[aria-label*="${field}"], input[name*="${field}"], label:has-text("${field}") + input, label:has-text("${field}") >> input`).first();
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }
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

  async copyCode() {
    await this.copyCodeBtn.click();
  }

  async downloadCode() {
    await this.downloadBtn.click();
  }
}
