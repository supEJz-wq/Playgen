import { BasePage } from './BasePage.js';

export class CICDGeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    this.frameworkButtons = page.locator('button:has-text("Playwright"), button:has-text("Selenium"), button:has-text("Appium")');
    this.platformButtons = page.locator('button:has-text("GitHub Actions"), button:has-text("GitLab CI"), button:has-text("Jenkins"), button:has-text("Azure DevOps")');
    this.generateBtn = page.getByRole('button', { name: 'Generate Pipeline' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
    this.pipelineOutput = page.locator('.monaco-editor .view-lines, [data-testid="generated-pipeline"]');
  }

  async open() {
    await this.navigate('/cicd-generator');
  }

  async selectFramework(fw) {
    await this.frameworkButtons.filter({ hasText: fw }).first().click();
  }

  async selectPlatform(platform) {
    await this.platformButtons.filter({ hasText: platform }).first().click();
  }

  async generatePipeline() {
    await this.generateBtn.click();
  }

  async resetForm() {
    await this.resetBtn.click();
  }

  async getGeneratedPipeline() {
    return await this.pipelineOutput.innerText();
  }
}
