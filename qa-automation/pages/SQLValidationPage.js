import { BasePage } from './BasePage.js';

export class SQLValidationPage extends BasePage {
  constructor(page) {
    super(page);
    this.validationSelect = page.locator('select').first();
    this.databaseSelect = page.locator('select').nth(1);
    this.generateBtn = page.getByRole('button', { name: 'Generate SQL' });
    this.sqlTabBtn = page.getByRole('button', { name: 'Generated SQL' });
    this.copyBtn = page.getByRole('button', { name: 'Copy SQL' });
    this.downloadBtn = page.getByRole('button', { name: 'Download' });
    this.clearBtn = page.getByRole('button', { name: 'Clear' });
    this.sqlOutput = page.locator('pre code, .generated-sql pre code').first();
  }

  async open() {
    await this.navigate('/sql-builder');
  }

  async selectValidationType(type) {
    await this.validationSelect.selectOption({ label: type });
  }

  async selectDatabase(db) {
    await this.databaseSelect.selectOption({ label: db });
  }

  async generateQuery() {
    await this.generateBtn.click();
  }

  async switchToSQLTab() {
    await this.sqlTabBtn.click();
  }

  async getGeneratedSQL() {
    return await this.sqlOutput.innerText();
  }
}
