import { BasePage } from './BasePage.js';

export class PlaywrightGeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    this.sectionTabs = page.locator('button:has-text("Templates"), button:has-text("Language"), button:has-text("Architecture"), button:has-text("Project Info"), button:has-text("Steps"), button:has-text("Assertions"), button:has-text("Test Data")');
    this.templateButtons = page.locator('button:has-text("Login"), button:has-text("Registration"), button:has-text("Checkout")');
    this.languageButtons = page.locator('button:has-text("TypeScript"), button:has-text("JavaScript")');
    this.architectureButtons = page.locator('button:has-text("Page Object Model"), button:has-text("Simple Script")');
    this.projectNameInput = page.locator('input[aria-label*="Project Name"], input[name*="projectName"], label:has-text("Project Name") >> input').first();
    this.generateBtn = page.getByRole('button', { name: 'Generate Project' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
    this.codeOutput = page.locator('.monaco-editor .view-lines, [data-testid="generated-code"]');
  }

  async open() {
    await this.navigate('/generator');
  }

  async selectTemplate(name) {
    await this.page.getByRole('button', { name: new RegExp(`^${name}`) }).first().click();
    await this.page.waitForTimeout(500);
  }

  async selectLanguage(lang) {
    await this.page.getByRole('button', { name: '2. Language' }).click();
    await this.page.waitForTimeout(300);
    await this.languageButtons.filter({ hasText: lang }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectArchitecture(arch) {
    await this.page.getByRole('button', { name: '3. Architecture' }).click();
    await this.page.waitForTimeout(300);
    await this.architectureButtons.filter({ hasText: arch }).first().click();
    await this.page.waitForTimeout(300);
  }

  async fillProjectInfo(data) {
    await this.page.getByRole('button', { name: '4. Project Info' }).click();
    await this.page.waitForTimeout(300);
    if (data.projectName) {
      await this.projectNameInput.fill(data.projectName);
    }
  }

  async addStep() {
    await this.page.getByRole('button', { name: '5. Steps' }).click();
    await this.page.waitForTimeout(300);
    await this.page.getByRole('button', { name: 'Add Step' }).first().click();
    await this.page.waitForTimeout(300);
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
