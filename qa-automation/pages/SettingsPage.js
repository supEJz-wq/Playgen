import { BasePage } from './BasePage.js';

export class SettingsPage extends BasePage {
  constructor(page) {
    super(page);
    this.frameworkSelect = page.locator('select').first();
    this.saveBtn = page.locator('button:has-text("Save Settings")');
    this.resetBtn = page.locator('button:has-text("Reset to Defaults")');
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

  async resetToDefaults() {
    await this.resetBtn.click();
  }

  async getSelectedFramework() {
    return await this.frameworkSelect.inputValue();
  }
}
