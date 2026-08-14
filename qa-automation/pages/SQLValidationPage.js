import { BasePage } from './BasePage.js';

export class SQLValidationPage extends BasePage {
  constructor(page) {
    super(page);
    this.validationSelect = page.locator('select').first();
    this.databaseSelect = page.locator('select').nth(1);
    this.tableInput = page.locator('input[placeholder*="e.g., users"]');
    this.generateBtn = page.locator('button:has-text("Generate SQL")');
  }

  async open() {
    await this.navigate('/sql-builder');
  }

  async selectValidation(type) {
    await this.validationSelect.selectOption(type);
  }

  async selectDatabase(db) {
    await this.databaseSelect.selectOption(db);
  }

  async enterTable(name) {
    await this.tableInput.fill(name);
  }

  async generateSQL() {
    await this.generateBtn.click();
  }

  async getGeneratedSQL() {
    const editor = this.page.locator('.monaco-editor .view-lines');
    return await editor.innerText();
  }
}
