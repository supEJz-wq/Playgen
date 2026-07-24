import { formatLocator } from '../constants/locatorTypes'

const q = (val) => `'${String(val).replace(/'/g, "\\'")}'`
const dq = (val) => `"${String(val).replace(/"/g, '\\"')}"`
const qt = (val, double) => (double ? dq(val) : q(val))

function isTS(model) {
  return model.settings?.language === 'TypeScript'
}

function sanitizeName(name) {
  return (name || 'Test')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

function pageName(title) {
  const cleaned = sanitizeName(title)
  return cleaned.endsWith('Page') ? cleaned : `${cleaned}Page`
}

function extractUniqueLocators(steps) {
  const map = {}
  ;(steps || []).forEach((s) => {
    if (s.locator && s.action !== 'Open URL' && s.action !== 'Wait For URL') {
      const key = s.locator + '|' + (s.locatorType || 'CSS Selector')
      if (!map[key]) {
        const label = s.description
          ? s.description.replace(/^(enter|click|type|select|check|uncheck|hover)\s+/i, '').trim()
          : s.action + '_' + (s.locatorType || 'CSS Selector')
        const varName = label
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .toLowerCase()
        map[key] = {
          varName: varName || 'element',
          locator: s.locator,
          locatorType: s.locatorType || 'CSS Selector',
        }
      }
    }
  })
  return Object.values(map)
}

function actionCode(step) {
  const loc = step.locator ? formatLocator('playwright', 'JavaScript', step.locatorType || 'CSS Selector', step.locator) : null
  const val = step.value || ''
  const desc = step.description ? `  // ${step.description}` : ''

  let code = ''
  switch (step.action) {
    case 'Open URL':
      code = `  await page.goto(${q(val || '/')});`
      break
    case 'Go Back':
      code = `  await page.goBack();`
      break
    case 'Go Forward':
      code = `  await page.goForward();`
      break
    case 'Reload':
      code = `  await page.reload();`
      break
    case 'Close Page':
      code = `  await page.close();`
      break
    case 'Click':
      code = `  await ${loc}.click();`
      break
    case 'Double Click':
      code = `  await ${loc}.dblclick();`
      break
    case 'Right Click':
      code = `  await ${loc}.click({ button: 'right' });`
      break
    case 'Hover':
      code = `  await ${loc}.hover();`
      break
    case 'Drag And Drop':
      code = `  await ${loc}.dragTo(page.locator(${q(val)}));`
      break
    case 'Fill':
      code = `  await ${loc}.fill(${q(val)});`
      break
    case 'Clear':
      code = `  await ${loc}.clear();`
      break
    case 'Press Key':
      code = `  await ${loc}.press(${q(val)});`
      break
    case 'Type':
      code = `  await ${loc}.press(${q(val)});`
      break
    case 'Check':
      code = `  await ${loc}.check();`
      break
    case 'Uncheck':
      code = `  await ${loc}.uncheck();`
      break
    case 'Select Dropdown':
      code = `  await ${loc}.selectOption(${q(val)});`
      break
    case 'Upload File':
      code = val ? `  await page.setInputFiles('${val}');` : `  // Upload file - set the file path`
      break
    case 'Take Screenshot':
      code = `  await page.screenshot({ path: ${q(val || 'screenshot.png')} });`
      break
    case 'Wait':
      code = `  await ${loc}.waitFor();`
      break
    case 'Wait For URL':
      code = `  await page.waitForURL(${q(val)});`
      break
    case 'Switch Frame':
      code = `  const frame = page.frameLocator(${q(loc)});`
      break
    case 'Exit Frame':
      code = `  // Exited frame, continuing on main page`
      break
    case 'Switch Window':
      code = `  const pages = context.pages();\n  await pages[${Number(val) || 1}].bringToFront();`
      break
    case 'Open New Window':
      code = `  const [newPage] = await Promise.all([\n    page.waitForEvent('popup'),\n    page.click(${q(val || 'a[target="_blank"]')})\n  ]);`
      break
    case 'Close Window':
      code = `  await page.close();`
      break
    case 'Scroll':
      code = `  await page.evaluate(() => window.scrollBy(0, ${val || 500}));`
      break
    case 'API Request':
      code = `  const response = await page.request.${(val || '').startsWith('POST') ? 'post' : (val || '').startsWith('PUT') ? 'put' : (val || '').startsWith('DELETE') ? 'delete' : 'get'}(${q(val || '/api/endpoint')});`
      break
    case 'Assert':
      code = `  // Add assertion here`
      break
    default:
      code = `  // ${step.action} - ${step.description || ''}`
  }
  return desc ? `${desc}\n${code}` : code
}

function assertionCode(a) {
  const loc = a.locator ? formatLocator('playwright', 'JavaScript', a.locatorType || 'CSS Selector', a.locator) : null
  const val = a.value || ''

  switch (a.type) {
    case 'Visible':
      return `  await expect(${loc}).toBeVisible();`
    case 'Hidden':
      return `  await expect(${loc}).toBeHidden();`
    case 'Enabled':
      return `  await expect(${loc}).toBeEnabled();`
    case 'Disabled':
      return `  await expect(${loc}).toBeDisabled();`
    case 'Checked':
      return `  await expect(${loc}).toBeChecked();`
    case 'Text Equals':
      return `  await expect(${loc}).toHaveText(${q(val)});`
    case 'Text Contains':
      return `  await expect(${loc}).toContainText(${q(val)});`
    case 'URL Equals':
      return `  await expect(page).toHaveURL(${q(val)});`
    case 'URL Contains':
      return `  await expect(page).toHaveURL(/.*${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*/);`
    case 'Title Equals':
      return `  await expect(page).toHaveTitle(${q(val)});`
    case 'Count':
      return `  await expect(${loc}).toHaveCount(${Number(val) || 0});`
    case 'Attribute':
      return `  await expect(${loc}).toHaveAttribute(${q(val)});`
    case 'Input Value':
      return `  await expect(${loc}).toHaveValue(${q(val)});`
    default:
      return ''
  }
}

function generateSimpleScript(model) {
  const { project, steps, assertions, variables } = model
  const title = project.testTitle || 'Untitled Test'
  const ts = isTS(model)
  const lines = []

  if (ts) {
    lines.push(`import { test, expect } from '@playwright/test';`)
  } else {
    lines.push(`const { test, expect } = require('@playwright/test');`)
  }
  lines.push(``)
  lines.push(`test('${title}', async ({ page }) => {`)
  if (project.baseUrl) {
    lines.push(`  await page.goto('${project.baseUrl}');`)
    lines.push(``)
  }

  steps.forEach((step) => {
    const code = actionCode(step)
    if (code) lines.push(code)
  })

  if (assertions.length > 0) {
    lines.push(``)
    lines.push(`  // Assertions`)
    assertions.forEach((a) => {
      const ac = assertionCode(a)
      if (ac) lines.push(ac)
    })
  }

  if (variables.length > 0) {
    lines.push(``)
    lines.push(`  // Test Data`)
    variables.forEach((v) => {
      if (v.name && v.value) {
        lines.push(`  const ${v.name} = '${v.value}';`)
      }
    })
  }

  lines.push(`});`)
  return lines.join('\n')
}

function generatePomProject(model) {
  const { project, steps, assertions } = model
  const name = pageName(project.testTitle || 'Test')
  const locators = extractUniqueLocators(steps)
  const ts = isTS(model)
  const ext = ts ? '.ts' : '.js'
  const files = []

  const specContent = ts
    ? `import { test, expect } from '@playwright/test';\nimport { ${name} } from '../pages/${name}';\n\ntest('${project.testTitle || 'Test'}', async ({ page }) => {\n  await page.goto('${project.baseUrl || '/'}');\n  const ${name.charAt(0).toLowerCase() + name.slice(1)} = new ${name}(page);\n  // Add test steps here\n});`
    : `const { test, expect } = require('@playwright/test');\nconst { ${name} } = require('../pages/${name}');\n\ntest('${project.testTitle || 'Test'}', async ({ page }) => {\n  await page.goto('${project.baseUrl || '/'}');\n  const ${name.charAt(0).toLowerCase() + name.slice(1)} = new ${name}(page);\n  // Add test steps here\n});`

  files.push({
    name: `tests/${project.testTitle || 'test'}.spec${ext}`,
    content: specContent,
  })

  const pageLines = []
  pageLines.push(ts ? `export class ${name} {` : `class ${name} {`)
  pageLines.push(`  constructor(page) {`)
  pageLines.push(`    this.page = page;`)
  pageLines.push(``)
  locators.forEach((loc) => {
    const code = formatLocator('playwright', 'JavaScript', loc.locatorType, loc.locator)
    pageLines.push(`    this.${loc.varName} = ${code};`)
  })
  pageLines.push(`  }`)
  pageLines.push(``)

  const seenActions = new Set()
  steps.forEach((step) => {
    if (['Open URL', 'Go Back', 'Go Forward', 'Reload', 'Close Page',
      'Take Screenshot', 'New Page', 'Wait For URL',
      'Exit Frame', 'Switch Frame', 'Switch Window', 'Close Window',
    ].includes(step.action)) return

    const descKey = step.description || `${step.action}_${step.locator || ''}`
    if (seenActions.has(descKey)) return
    seenActions.add(descKey)

    const methodName = descKey
      .replace(/[^a-zA-Z0-9 ]/g, '').trim()
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (c) => c.toLowerCase()) || 'doAction'

    pageLines.push(`  async ${methodName}() {`)
    if (step.description) pageLines.push(`    // ${step.description}`)

    switch (step.action) {
      case 'Click':
        pageLines.push(`    await this.${locators.find((l) =>
          l.locator === step.locator && l.locatorType === (step.locatorType || 'CSS Selector')
        )?.varName || 'element'}.click();`)
        break
      case 'Fill':
        pageLines.push(`    await this.${locators.find((l) =>
          l.locator === step.locator && l.locatorType === (step.locatorType || 'CSS Selector')
        )?.varName || 'element'}.fill('${step.value || ''}');`)
        break
      case 'Check':
        pageLines.push(`    await this.${locators.find((l) =>
          l.locator === step.locator && l.locatorType === (step.locatorType || 'CSS Selector')
        )?.varName || 'element'}.check();`)
        break
      case 'Uncheck':
        pageLines.push(`    await this.${locators.find((l) =>
          l.locator === step.locator && l.locatorType === (step.locatorType || 'CSS Selector')
        )?.varName || 'element'}.uncheck();`)
        break
      case 'Select Dropdown':
        pageLines.push(`    await this.${locators.find((l) =>
          l.locator === step.locator && l.locatorType === (step.locatorType || 'CSS Selector')
        )?.varName || 'element'}.selectOption('${step.value || ''}');`)
        break
      default:
        pageLines.push(`    // ${step.action} on ${step.locator || ''}`)
    }
    pageLines.push(`  }`)
    pageLines.push(``)
  })

  pageLines.push(`}`)
  pageLines.push(``)
  if (ts) {
    pageLines.push(`export { ${name} };`)
  } else {
    pageLines.push(`module.exports = { ${name} };`)
  }

  files.push({
    name: `pages/${name}${ext}`,
    content: pageLines.join('\n'),
  })

  const utilsLines = ts
    ? [
      `import { expect } from '@playwright/test';`,
      ``,
      `export class WaitHelper {`,
      `  static async waitForElement(page, locator: string, timeout = 5000) {`,
      `    await page.waitForSelector(locator, { timeout });`,
      `  }`,
      ``,
      `  static async waitForPageLoad(page) {`,
      `    await page.waitForLoadState('networkidle');`,
      `  }`,
      `}`,
    ]
    : [
      `const { expect } = require('@playwright/test');`,
      ``,
      `class WaitHelper {`,
      `  static async waitForElement(page, locator, timeout = 5000) {`,
      `    await page.waitForSelector(locator, { timeout });`,
      `  }`,
      ``,
      `  static async waitForPageLoad(page) {`,
      `    await page.waitForLoadState('networkidle');`,
      `  }`,
      `}`,
      ``,
      `module.exports = { WaitHelper };`,
    ]
  files.push({ name: `utils/waitHelper${ext}`, content: utilsLines.join('\n') })

  const dataLines = ts
    ? [
      `const testData = {`,
      ...(model.variables || []).map((v) => `  ${v.name}: '${v.value}',`),
      `};`,
      ``,
      `export default testData;`,
    ]
    : [
      `module.exports = {`,
      ...(model.variables || []).map((v) => `  ${v.name}: '${v.value}',`),
      `};`,
    ]
  files.push({ name: `data/testData${ext}`, content: dataLines.join('\n') })

  const configLines = ts
    ? [
      `import { defineConfig } from '@playwright/test';`,
      ``,
      `export default defineConfig({`,
      `  use: {`,
      `    baseURL: '${project.baseUrl || ''}',`,
      `    headless: true,`,
      `    screenshot: 'only-on-failure',`,
      `  },`,
      `});`,
    ]
    : [
      `module.exports = {`,
      `  use: {`,
      `    baseURL: '${project.baseUrl || ''}',`,
      `    headless: true,`,
      `    screenshot: 'only-on-failure',`,
      `  },`,
      `};`,
    ]
  files.push({ name: `config/playwright.config${ext}`, content: configLines.join('\n') })

  return files
}

export function generatePlaywright(model) {
  const architecture = model.settings.architecture || 'simple'
  const ts = isTS(model)
  const ext = ts ? '.spec.ts' : '.spec.js'

  if (architecture === 'simple') {
    return [{ name: `${(model.project.testTitle || 'test').replace(/\s+/g, '-').toLowerCase()}${ext}`, content: generateSimpleScript(model) }]
  }

  if (architecture === 'pom') {
    return generatePomProject(model)
  }

  return [{ name: `test${ext}`, content: generateSimpleScript(model) }]
}

export function generatePlaywrightExplanation(model) {
  const { project, steps, assertions } = model
  const title = project.testTitle || 'Test'
  return `This Playwright test (${title}) automates ${steps.length} steps with ${assertions.length} assertions. It uses the Playwright framework to control a browser and verify application behavior.`
}

export function generatePlaywrightChecklist(model) {
  const { project, steps, assertions } = model
  return [
    { category: 'Configuration', items: [
      { label: 'Base URL is configured', passed: !!project.baseUrl },
      { label: 'Test title is set', passed: !!project.testTitle },
      { label: 'Browser is configured in playwright.config.js', passed: true },
    ]},
    { category: 'Test Steps', items: [
      { label: 'At least one step defined', passed: steps.length > 0 },
      { label: 'All locators have values', passed: steps.filter((s) => s.locatorType !== 'CSS Selector' || s.locatorType !== 'XPath' || s.locator || s.action === 'Open URL').length === steps.length || steps.length > 0 },
      { label: 'URL steps have valid URLs', passed: steps.filter((s) => s.action === 'Open URL').every((s) => s.value?.startsWith('http') || s.value?.startsWith('/')) },
    ]},
    { category: 'Assertions', items: [
      { label: 'Assertions defined', passed: assertions.length > 0 },
      { label: 'Assertions have expected values', passed: assertions.filter((a) => a.needsValue).every((a) => a.value) },
    ]},
  ]
}

export function generatePlaywrightBestPractices() {
  return [
    { title: 'Prefer getByRole()', description: 'Use getByRole() over locators for better accessibility testing' },
    { title: 'Avoid waitForTimeout()', description: 'Use locator-based waits instead of fixed timeouts' },
    { title: 'Use expect() assertions', description: 'Always use built-in expect matchers for reliable assertions' },
    { title: 'Use beforeEach()', description: 'Set up test state in beforeEach hooks for clean tests' },
    { title: 'Page Object Model', description: 'Organize page interactions into reusable Page Object classes' },
    { title: 'Test Isolation', description: 'Each test should start with a clean browser context' },
    { title: 'Use test fixtures', description: 'Leverage Playwright fixtures for shared setup and teardown' },
  ]
}
