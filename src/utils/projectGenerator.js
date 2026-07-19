import { generatePlaywrightScript } from './playwrightGenerator';
import { getLocatorCode } from './locatorGenerator';

function q(val, style) {
  return style === 'Double Quotes' ? `"${val}"` : `'${val}'`;
}

function qs(style) {
  return style === 'Double Quotes' ? '"' : "'";
}

function sanitizeName(name) {
  return (name || 'Test')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function pageName(title) {
  const cleaned = sanitizeName(title);
  return cleaned.endsWith('Page') ? cleaned : `${cleaned}Page`;
}

function extractUniqueLocators(steps) {
  const map = {};
  (steps || []).forEach((s) => {
    if (s.locator && s.action !== 'Open URL' && s.action !== 'Wait For URL') {
      const key = s.locator + '|' + (s.locatorType || 'CSS');
      if (!map[key]) {
        const label = s.description
          ? s.description.replace(/^(enter|click|type|select|check|uncheck|hover)\s+/i, '').trim()
          : s.action + '_' + (s.locatorType || 'CSS');
        const varName = label
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .toLowerCase();
        map[key] = {
          varName: varName || 'element',
          locator: s.locator,
          locatorType: s.locatorType || 'CSS',
        };
      }
    }
  });
  return Object.values(map);
}

function generatePageObject(config) {
  const { projectInfo, steps, settings } = config;
  const s = settings || { quoteStyle: 'Single Quotes' };
  const quoteChar = qs(s.quoteStyle);
  const name = pageName(projectInfo?.testTitle || 'Test');
  const locators = extractUniqueLocators(steps);

  const lines = [];
  lines.push(`class ${name} {`);
  lines.push(`  constructor(page) {`);
  lines.push(`    this.page = page;`);
  lines.push(``);

  locators.forEach((loc) => {
    const code = getLocatorCode(loc.locatorType, loc.locator, s.quoteStyle);
    const getterCode = code.replace(/^page/, 'this.page');
    lines.push(`    this.${loc.varName} = ${getterCode};`);
  });

  lines.push(`  }`);
  lines.push(``);

  const seenActions = new Set();
  (steps || []).forEach((step) => {
    if (['Open URL', 'Go Back', 'Go Forward', 'Reload Page', 'Close Page',
      'Screenshot', 'Full Page Screenshot', 'Wait For Load State',
      'GET Request', 'POST Request', 'PUT Request', 'DELETE Request',
      'New Page', 'New Context', 'Switch Tab', 'Close Tab',
      'Exit Frame', 'Switch Frame',
    ].includes(step.action)) return;

    const desc = step.description || `${step.action}_${step.locator || ''}`;
    if (seenActions.has(desc)) return;
    seenActions.add(desc);

    const methodName = desc
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (c) => c.toLowerCase()) || 'doAction';

    const comment = step.description ? `    // ${step.description}` : '';
    lines.push(comment);

    switch (step.action) {
      case 'Click':
        lines.push(`  async ${methodName}() {`);
        lines.push(`    await this.${methodName}Locator.click();`);
        lines.push(`  }`);
        break;
      case 'Fill':
        lines.push(`  async ${methodName}(value) {`);
        lines.push(`    await this.${methodName}Locator.fill(value);`);
        lines.push(`  }`);
        break;
      case 'Press Enter':
        lines.push(`  async ${methodName}() {`);
        lines.push(`    await this.${methodName}Locator.press('Enter');`);
        lines.push(`  }`);
        break;
      case 'Select Option':
        lines.push(`  async ${methodName}(value) {`);
        lines.push(`    await this.${methodName}Locator.selectOption(value);`);
        lines.push(`  }`);
        break;
      case 'Check':
        lines.push(`  async ${methodName}() {`);
        lines.push(`    await this.${methodName}Locator.check();`);
        lines.push(`  }`);
        break;
      case 'Uncheck':
        lines.push(`  async ${methodName}() {`);
        lines.push(`    await this.${methodName}Locator.uncheck();`);
        lines.push(`  }`);
        break;
      case 'Hover':
        lines.push(`  async ${methodName}() {`);
        lines.push(`    await this.${methodName}Locator.hover();`);
        lines.push(`  }`);
        break;
      case 'Wait For Visible':
        lines.push(`  async ${methodName}() {`);
        lines.push(`    await this.${methodName}Locator.waitFor({ state: 'visible' });`);
        lines.push(`  }`);
        break;
      default:
        lines.push(`  // TODO: implement ${step.action} for ${step.description || step.locator}`);
    }
    lines.push(``);
  });

  lines.push(`}`);
  lines.push(``);
  lines.push(`module.exports = { ${name} };`);
  lines.push(``);

  return { name, code: lines.join('\n') };
}

function generateComponents(config) {
  const { projectInfo, steps, settings } = config;
  const s = settings || { quoteStyle: 'Single Quotes' };
  const locators = extractUniqueLocators(steps);
  const title = sanitizeName(projectInfo?.testTitle || 'Test');

  const lines = [];
  lines.push(`// Shared UI Components for ${title}`);
  lines.push(`// Auto-generated by PlayGen`);
  lines.push(``);
  lines.push(`class ${title}Components {`);
  lines.push(`  constructor(page) {`);
  lines.push(`    this.page = page;`);

  locators.forEach((loc) => {
    const code = getLocatorCode(loc.locatorType, loc.locator, s.quoteStyle);
    const getterCode = code.replace(/^page/, 'this.page');
    lines.push(`    this.${loc.varName} = ${getterCode};`);
  });

  lines.push(`  }`);
  lines.push(``);
  lines.push(`  async navigate(url) {`);
  lines.push(`    await this.page.goto(url);`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  async waitForPageLoad() {`);
  lines.push(`    await this.page.waitForLoadState('networkidle');`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`module.exports = { ${title}Components };`);
  lines.push(``);

  return { name: `${title}Components`, code: lines.join('\n') };
}

function generateTestDataFile(config) {
  const { testData, projectInfo } = config;
  const data = testData || [];
  const lines = [];

  lines.push(`// Test Data for ${projectInfo?.testTitle || 'Untitled'}`);
  lines.push(`// Auto-generated by PlayGen`);
  lines.push(``);

  if (data.length === 0) {
    lines.push(`const testData = {};`);
  } else {
    lines.push(`const testData = {`);
    data.forEach((d, i) => {
      const comma = i < data.length - 1 ? ',' : '';
      lines.push(`  ${d.name}: ${q(d.value, 'Single Quotes')}${comma}`);
    });
    lines.push(`};`);
  }

  lines.push(``);
  lines.push(`module.exports = { testData };`);
  lines.push(``);

  return lines.join('\n');
}

function generateHelperFile(config) {
  const { projectInfo, testData } = config;
  const data = testData || [];
  const lines = [];

  lines.push(`// Helper Functions for ${projectInfo?.testTitle || 'Untitled'}`);
  lines.push(`// Auto-generated by PlayGen`);
  lines.push(``);
  lines.push(`import { expect } from '@playwright/test';`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Generate a random email for testing`);
  lines.push(` */`);
  lines.push(`export function randomEmail(prefix = 'test') {`);
  lines.push(`  const timestamp = Date.now();`);
  lines.push('  return `${prefix}+${timestamp}@example.com`;');
  lines.push(`}`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Take a screenshot with a descriptive name`);
  lines.push(` */`);
  lines.push(`export async function takeScreenshot(page, name) {`);
  lines.push(`  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');`);
  lines.push('  await page.screenshot({ path: `screenshots/${name}-${timestamp}.png`, fullPage: true });');
  lines.push(`}`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Wait for a loader/spinner to disappear`);
  lines.push(` */`);
  lines.push(`export async function waitForLoader(page, selector = '.spinner, .loader, [aria-busy="true"]') {`);
  lines.push(`  await page.waitForSelector(selector, { state: 'visible', timeout: 5000 }).catch(() => {});`);
  lines.push(`  await page.waitForSelector(selector, { state: 'hidden', timeout: 10000 }).catch(() => {});`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Scroll an element into view`);
  lines.push(` */`);
  lines.push(`export async function scrollIntoView(page, selector) {`);
  lines.push(`  await page.locator(selector).scrollIntoViewIfNeeded();`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Generate random test data`);
  lines.push(` */`);
  lines.push(`export function generateTestData() {`);
  lines.push(`  return {`);
  if (data.length > 0) {
    data.forEach((d, i) => {
      const comma = i < data.length - 1 ? ',' : '';
      lines.push(`    ${d.name}: ${q(d.value, 'Single Quotes')}${comma}`);
    });
  } else {
    lines.push(`    timestamp: Date.now(),`);
    lines.push(`    randomId: Math.random().toString(36).substring(7),`);
  }
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export { randomEmail, takeScreenshot, waitForLoader, scrollIntoView, generateTestData };`);

  return lines.join('\n');
}

function buildProjectTree(files, outputStyle) {
  const tree = []
  if (outputStyle === 'pom') {
    tree.push({ name: 'tests/', type: 'folder', children: [] })
    tree.push({ name: 'pages/', type: 'folder', children: [] })
    tree.push({ name: 'components/', type: 'folder', children: [] })
    tree.push({ name: 'data/', type: 'folder', children: [] })
    tree.push({ name: 'utils/', type: 'folder', children: [] })
  }
  files.forEach((f) => {
    if (outputStyle === 'pom') {
      if (f.name.startsWith('tests/') || f.path?.startsWith('tests/')) {
        const entry = tree.find((t) => t.name === 'tests/')
        if (entry) entry.children.push({ name: f.name.replace('tests/', ''), type: 'file' })
      } else if (f.name.startsWith('pages/') || f.path?.startsWith('pages/')) {
        const entry = tree.find((t) => t.name === 'pages/')
        if (entry) entry.children.push({ name: f.name.replace('pages/', ''), type: 'file' })
      } else {
        const folder = f.name.includes('.') ? f.name.split('/')[0] : null
        if (folder && tree.find((t) => t.name === `${folder}/`)) {
          const entry = tree.find((t) => t.name === `${folder}/`)
          if (entry) entry.children.push({ name: f.name.replace(`${folder}/`, ''), type: 'file' })
        } else {
          tree.push({ name: f.name, type: 'file' })
        }
      }
    } else {
      tree.push({ name: f.name, type: 'file' })
    }
  })
  return tree
}

export function generateProject(config, outputStyle) {
  const files = [];
  const specName = `${sanitizeName(config.projectInfo?.testTitle || 'test')}.spec.js`;

  if (outputStyle === 'simple') {
    files.push({
      name: specName,
      content: generatePlaywrightScript(config),
    });
  } else {
    files.push({
      name: `tests/${specName}`,
      path: `tests/${specName}`,
      content: generatePlaywrightScript(config),
    });

    const po = generatePageObject(config);
    files.push({
      name: `pages/${po.name}.js`,
      path: `pages/${po.name}.js`,
      content: po.code,
    });

    let filename = specName.replace('.spec.js', '');
    const comps = generateComponents(config);
    files.push({
      name: `components/${comps.name}.js`,
      path: `components/${comps.name}.js`,
      content: comps.code,
    });

    files.push({
      name: 'data/testData.js',
      path: 'data/testData.js',
      content: generateTestDataFile(config),
    });

    files.push({
      name: 'utils/helpers.js',
      path: 'utils/helpers.js',
      content: generateHelperFile(config),
    });
  }

  files._tree = buildProjectTree(files, outputStyle);
  return files;
}

export { buildProjectTree, generateHelperFile };
