import { BasePage } from './BasePage.js';

export class SettingsPage extends BasePage {
  constructor(page) {
    super(page);
    this.frameworkSelect = page.locator('select').first();
    this.languageSelect = page.locator('select').nth(1);
    this.architectureSelect = page.locator('select').nth(2);
    this.saveBtn = page.getByRole('button', { name: 'Save Settings' });
    this.resetBtn = page.getByRole('button', { name: 'Reset to Defaults' });
  }

  async open() {
    await this.navigate('/settings');
  }

  async selectFramework(fw) {
    await this.frameworkSelect.selectOption(fw);
  }

  async saveSettings() {
    await this.saveBtn.click();
  }

  async resetSettings() {
    await this.resetBtn.click();
  }
}
