import { formatAppiumLocator } from '../constants/appiumLocators'

const q = (val) => `'${String(val).replace(/'/g, "\\'")}'`

function sanitizeName(name) {
  return (name || 'test')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase()
}

function pageName(title) {
  const cleaned = sanitizeName(title)
  return cleaned.endsWith('_page') ? cleaned : `${cleaned}_page`
}

function extractUniqueLocators(steps) {
  const map = {}
  ;(steps || []).forEach((s) => {
    if (s.locator) {
      const key = s.locator + '|' + (s.locatorType || 'Accessibility ID')
      if (!map[key]) {
        const label = s.description
          ? s.description.replace(/^(enter|click|type|select|check|uncheck|hover|tap)\s+/i, '').trim()
          : s.action + '_' + (s.locatorType || 'Accessibility ID')
        const varName = label.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_').toLowerCase()
        map[key] = { varName: varName || 'element', locator: s.locator, locatorType: s.locatorType || 'Accessibility ID' }
      }
    }
  })
  return Object.values(map)
}

function actionCode(step, platform) {
  const loc = step.locator ? formatAppiumLocator('JavaScript', step.locatorType || 'Accessibility ID', step.locator, platform) : null
  const val = step.value || ''
  const desc = step.description ? `  // ${step.description}` : ''
  let code = ''
  switch (step.action) {
    case 'Launch App':
      code = `  await driver.launchApp();`
      break
    case 'Close App':
      code = `  await driver.closeApp();`
      break
    case 'Install App':
      code = `  await driver.installApp(${q(val)});`
      break
    case 'Remove App':
      code = `  await driver.removeApp(${q(val)});`
      break
    case 'Background App':
      code = `  await driver.backgroundApp(${val || 5});`
      break
    case 'Activate App':
      code = `  await driver.activateApp(${q(val)});`
      break
    case 'Terminate App':
      code = `  await driver.terminateApp(${q(val)});`
      break
    case 'Reset App':
      code = `  await driver.resetApp();`
      break
    case 'Get Device Time':
      code = `  const deviceTime = await driver.getDeviceTime();`
      break
    case 'Lock Device':
      code = `  await driver.lockDevice();`
      break
    case 'Unlock Device':
      code = `  await driver.unlockDevice();`
      break
    case 'Rotate Device':
    case 'Set Orientation':
      code = `  await driver.setOrientation(${q(val || 'PORTRAIT')});`
      break
    case 'Open URL':
      code = `  await driver.get(${q(val || '/')});`
      break
    case 'Go Back':
      code = `  await driver.back();`
      break
    case 'Reload':
      code = `  await driver.refresh();`
      break
    case 'Click':
      code = `  await ${loc}.click();`
      break
    case 'Double Click':
      code = `  await ${loc}.click();\n  await ${loc}.click();`
      break
    case 'Long Press':
      code = `  await driver.longPressKeyCode(${loc});`
      break
    case 'Tap':
      code = `  await driver.tap(1, ${loc}, 100);`
      break
    case 'Swipe':
      code = `  await driver.swipe(${val || '500, 1500, 500, 500'});`
      break
    case 'Scroll':
      code = `  await driver.scroll(${loc}, ${q(val || 'down')});`
      break
    case 'Drag':
      code = `  await driver.performTouchAction([\n    { action: 'press', element: ${loc} },\n    { action: 'moveTo', element: ${q(val || 'target')} },\n    { action: 'release' }\n  ]);`
      break
    case 'Pinch':
      code = `  await driver.pinch(${loc});`
      break
    case 'Zoom':
      code = `  await driver.zoom(${loc});`
      break
    case 'Fill':
    case 'Type':
      code = `  await ${loc}.sendKeys(${q(val)});`
      break
    case 'Clear':
      code = `  await ${loc}.clear();`
      break
    case 'Press Key':
      code = `  await ${loc}.sendKeys(${q(val || 'Enter')});`
      break
    case 'Hide Keyboard':
      code = `  await driver.hideKeyboard();`
      break
    case 'Check':
      code = `  const checked = await ${loc}.isSelected();\n  if (!checked) await ${loc}.click();`
      break
    case 'Uncheck':
      code = `  const checked = await ${loc}.isSelected();\n  if (checked) await ${loc}.click();`
      break
    case 'Select Dropdown':
      code = `  const select = new Select(${loc});\n  await select.selectByVisibleText(${q(val)});`
      break
    case 'Wait':
      code = `  await ${loc}.isDisplayed();`
      break
    case 'Wait For Element':
      code = `  await driver.waitUntil(async () => ${loc}.isDisplayed(), { timeout: 10000 });`
      break
    case 'Switch Frame':
      code = loc ? `  await driver.switchToFrame(${loc});` : `  // Switch to frame`
      break
    case 'Exit Frame':
      code = `  await driver.switchToParentFrame();`
      break
    case 'Take Screenshot':
      code = `  await driver.saveScreenshot(${q(val || 'screenshot.png')});`
      break
    case 'Upload File':
      code = `  await ${loc}.sendKeys(${q(val)});`
      break
    case 'Push File':
      code = `  await driver.pushFile(${q(val)}, Buffer.from('file content'));`
      break
    case 'Pull File':
      code = `  const fileData = await driver.pullFile(${q(val)});`
      break
    case 'API Request':
      code = `  // API Request - use axios or fetch`
      break
    case 'Assert':
      code = `  // Add assertion here`
      break
    default:
      code = `  // ${step.action} - ${step.description || ''}`
  }
  return desc ? `${desc}\n${code}` : code
}

function assertionCode(a, platform) {
  const loc = a.locator ? formatAppiumLocator('JavaScript', a.locatorType || 'Accessibility ID', a.locator, platform) : null
  const val = a.value || ''
  switch (a.type) {
    case 'Visible':
    case 'Displayed':
      return `  expect(await ${loc}.isDisplayed()).toBe(true);`
    case 'Not Displayed':
      return `  expect(await ${loc}.isDisplayed()).toBe(false);`
    case 'Exists':
      return `  expect(${loc}).toBeDefined();`
    case 'Not Exists':
      return `  expect(${loc}).toBeNull();`
    case 'Hidden':
      return `  expect(await ${loc}.isDisplayed()).toBe(false);`
    case 'Enabled':
      return `  expect(await ${loc}.isEnabled()).toBe(true);`
    case 'Disabled':
      return `  expect(await ${loc}.isEnabled()).toBe(false);`
    case 'Checked':
    case 'Selected':
      return `  expect(await ${loc}.isSelected()).toBe(true);`
    case 'Text Equals':
      return `  expect(await ${loc}.getText()).toBe(${q(val)});`
    case 'Text Contains':
      return `  expect(await ${loc}.getText()).toContain(${q(val)});`
    case 'Attribute':
      return `  expect(await ${loc}.getAttribute(${q(a.attribute || 'value')})).toBe(${q(val)});`
    case 'Input Value':
      return `  expect(await ${loc}.getText()).toBe(${q(val)});`
    case 'Count':
      return `  expect(await driver.findElements(${loc})).toHaveLength(${Number(val) || 0});`
    default:
      return ''
  }
}

function generateSimpleScript(model) {
  const { project, steps, assertions } = model
  const platform = project.platform || 'Android'
  const title = project.testTitle || 'Test'
  const lines = []
  lines.push(`const wdio = require('webdriverio');`)
  lines.push(`const { expect } = require('chai');`)
  lines.push(``)
  lines.push(`const opts = {`)
  lines.push(`  path: '/wd/hub',`)
  lines.push(`  port: 4723,`)
  lines.push(`  capabilities: {`)
  lines.push(`    platformName: ${q(platform)},`)
  lines.push(`    deviceName: ${q(project.deviceName || 'emulator')},`)
  lines.push(`    appPackage: ${q(project.appPackage || 'com.example.app')},`)
  lines.push(`    appActivity: ${q(project.appActivity || '.MainActivity')},`)
  lines.push(`    automationName: ${q(project.automationName || 'UiAutomator2')},`)
  lines.push(`  }`)
  lines.push(`};`)
  lines.push(``)
  lines.push(`describe(${q(title)}, () => {`)
  lines.push(`  let driver;`)
  lines.push(``)
  lines.push(`  before(async () => {`)
  lines.push(`    driver = await wdio.remote(opts);`)
  lines.push(`  });`)
  lines.push(``)
  lines.push(`  it(${q(title)}, async () => {`)
  steps.forEach((step) => {
    const code = actionCode(step, platform)
    if (code) lines.push(code)
  })
  if (assertions.length > 0) {
    lines.push(``)
    lines.push(`    // Assertions`)
    assertions.forEach((a) => {
      const ac = assertionCode(a, platform)
      if (ac) lines.push(`    ${ac}`)
    })
  }
  lines.push(`  });`)
  lines.push(``)
  lines.push(`  after(async () => {`)
  lines.push(`    await driver.deleteSession();`)
  lines.push(`  });`)
  lines.push(`});`)
  return lines.join('\n')
}

function generatePomProject(model) {
  const { project, steps } = model
  const name = pageName(project.testTitle || 'Test')
  const platform = project.platform || 'Android'
  const locators = extractUniqueLocators(steps)
  const files = []
  files.push({ name: `tests/${project.testTitle || 'test'}.spec.js`, content: generateSimpleScript(model) })
  const pageLines = [
    `class ${sanitizeName(project.testTitle || 'Test').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/\s/g, '')}Page {`,
    `  constructor(driver) {`,
    `    this.driver = driver;`,
    ...locators.map((loc) => `    this.${loc.varName} = ${formatAppiumLocator('JavaScript', loc.locatorType, loc.locator, platform)};`),
    `  }`,
    ``,
  ]
  const seenActions = new Set()
  steps.forEach((step) => {
    if (['Launch App', 'Close App', 'Open URL', 'Go Back', 'Reload', 'Take Screenshot'].includes(step.action)) return
    const descKey = step.description || `${step.action}_${step.locator || ''}`
    if (seenActions.has(descKey)) return
    seenActions.add(descKey)
    const methodName = descKey.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (c) => c.toLowerCase()) || 'doAction'
    pageLines.push(`  async ${methodName}() {`)
    if (step.description) pageLines.push(`    // ${step.description}`)
    const foundLoc = locators.find((l) => l.locator === step.locator)
    if (foundLoc) pageLines.push(`    await this.${foundLoc.varName}.click();`)
    pageLines.push(`  }`)
    pageLines.push(``)
  })
  pageLines.push(`}`)
  pageLines.push(`module.exports = { ${name} };`)
  files.push({ name: `pages/${name}.js`, content: pageLines.join('\n') })
  const baseLines = [
    `const wdio = require('webdriverio');`,
    ``,
    `class BaseDriver {`,
    `  constructor() {`,
    `    this.driver = null;`,
    `  }`,
    ``,
    `  async startDriver(platform) {`,
    `    const opts = {`,
    `      path: '/wd/hub',`,
    `      port: 4723,`,
    `      capabilities: {`,
    `        platformName: platform,`,
    `        deviceName: ${q(project.deviceName || 'emulator')},`,
    `        appPackage: ${q(project.appPackage || 'com.example.app')},`,
    `        appActivity: ${q(project.appActivity || '.MainActivity')},`,
    `        automationName: ${q(project.automationName || 'UiAutomator2')},`,
    `      }`,
    `    };`,
    `    this.driver = await wdio.remote(opts);`,
    `    return this.driver;`,
    `  }`,
    ``,
    `  async stopDriver() {`,
    `    if (this.driver) {`,
    `      await this.driver.deleteSession();`,
    `    }`,
    `  }`,
    `}`,
    `module.exports = { BaseDriver };`,
  ]
  files.push({ name: `base/BaseDriver.js`, content: baseLines.join('\n') })
  const dataLines = [
    `module.exports = {`,
    ...(model.variables || []).map((v) => `  ${v.name}: ${q(v.value)},`),
    `}`,
  ]
  files.push({ name: `data/testData.js`, content: dataLines.join('\n') })
  const utilsLines = [
    `class GestureHelper {`,
    `  static async swipe(driver, startX, startY, endX, endY) {`,
    `    await driver.touchAction([`,
    `      { action: 'press', x: startX, y: startY },`,
    `      { action: 'wait', ms: 500 },`,
    `      { action: 'moveTo', x: endX, y: endY },`,
    `      { action: 'release' }`,
    `    ]);`,
    `  }`,
    ``,
    `  static async scrollDown(driver) {`,
    `    const size = await driver.getWindowSize();`,
    `    await GestureHelper.swipe(driver, size.width / 2, size.height * 0.75, size.width / 2, size.height * 0.25);`,
    `  }`,
    `}`,
    `module.exports = { GestureHelper };`,
  ]
  files.push({ name: `utils/gestureHelper.js`, content: utilsLines.join('\n') })
  return files
}

export function generateAppiumJavaScript(model) {
  const architecture = model.settings.architecture || 'simple'
  if (architecture === 'simple') {
    return [{ name: `${(model.project.testTitle || 'test').replace(/\s+/g, '-').toLowerCase()}.spec.js`, content: generateSimpleScript(model) }]
  }
  if (architecture === 'pom') {
    return generatePomProject(model)
  }
  return [{ name: 'appium-test.spec.js', content: generateSimpleScript(model) }]
}

export function generateAppiumJavaScriptExplanation(model) {
  const { project, steps, assertions } = model
  return `This Appium WebDriverIO test (${project.testTitle || 'Test'}) automates ${steps.length} steps with ${assertions.length} assertions for ${project.platform || 'Android'}. Uses WebDriverIO with Appium.`
}

export function generateAppiumJavaScriptChecklist(model) {
  const { project, steps, assertions } = model
  return [
    { category: 'Configuration', items: [
      { label: 'WebDriverIO configured', passed: true },
      { label: 'Platform and device set', passed: !!project.platform && !!project.deviceName },
    ]},
    { category: 'Test Steps', items: [
      { label: 'Steps defined', passed: steps.length > 0 },
    ]},
    { category: 'Assertions', items: [
      { label: 'Assertions defined', passed: assertions.length > 0 },
    ]},
  ]
}

export function generateAppiumJavaScriptBestPractices() {
  return [
    { title: 'Use WebDriverIO', description: 'WebDriverIO provides a robust API for Appium mobile automation.' },
    { title: 'Use Touch Actions', description: 'Encapsulate gestures in reusable action helpers.' },
    { title: 'Prefer WDIO Allure Reporter', description: 'Use Allure for rich test reporting and screenshots on failure.' },
    { title: 'Use Page Objects', description: 'Organize mobile interactions in reusable classes.' },
  ]
}
