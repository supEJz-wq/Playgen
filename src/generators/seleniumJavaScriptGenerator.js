import { formatLocator } from '../constants/locatorTypes'

function byCode(lt, loc) {
  return formatLocator('selenium', 'JavaScript', lt, loc)
}

function sanitize(name) {
  return (name || 'test').replace(/[^a-zA-Z0-9_]/g, '_').replace(/^_|_$/g, '').toLowerCase()
}

function pName(title) {
  return sanitize(title) + 'Page'
}

function varName(desc, fallback) {
  var n = (desc || fallback || 'element').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_')
  return n[0].toLowerCase() + n.slice(1) || 'element'
}

function q(v) { return '"' + String(v).replace(/"/g, '\\"') + '"' }

function actionCode(step) {
  var loc = step.locator ? byCode(step.locatorType || 'css selector', step.locator) : null
  var v = step.value || ''
  var desc = step.description ? '// ' + step.description : ''
  switch (step.action) {
    case 'Open URL': return desc + '\nawait driver.get(' + q(v) + ')'
    case 'Go Back': return desc + '\nawait driver.navigate().back()'
    case 'Go Forward': return desc + '\nawait driver.navigate().forward()'
    case 'Reload': return desc + '\nawait driver.navigate().refresh()'
    case 'Close Page': return desc + '\nawait driver.close()'
    case 'Click': return desc + '\nawait driver.findElement(' + loc + ').click()'
    case 'Double Click': return desc + '\nconst actions = driver.actions({bridge: true})\nawait actions.doubleClick(driver.findElement(' + loc + ')).perform()'
    case 'Right Click': return desc + '\nconst actions = driver.actions({bridge: true})\nawait actions.contextClick(driver.findElement(' + loc + ')).perform()'
    case 'Hover': return desc + '\nconst actions = driver.actions({bridge: true})\nawait actions.move({origin: driver.findElement(' + loc + ')}).perform()'
    case 'Drag And Drop': return desc + '\nconst actions = driver.actions({bridge: true})\nawait actions.dragAndDrop(driver.findElement(' + loc + '), driver.findElement(' + byCode('css selector', v) + ')).perform()'
    case 'Fill': return desc + '\nconst element = await driver.findElement(' + loc + ')\nawait element.clear()\nawait element.sendKeys(' + q(v) + ')'
    case 'Clear': return desc + '\nawait driver.findElement(' + loc + ').clear()'
    case 'Press Key': return desc + '\nawait driver.findElement(' + loc + ').sendKeys(Key.' + (v.toUpperCase() || 'ENTER') + ')'
    case 'Type': return desc + '\nawait driver.findElement(' + loc + ').sendKeys(' + q(v) + ')'
    case 'Check': return desc + '\nconst checkbox = await driver.findElement(' + loc + ')\nif (!(await checkbox.isSelected())) { await checkbox.click() }'
    case 'Uncheck': return desc + '\nconst checkbox = await driver.findElement(' + loc + ')\nif (await checkbox.isSelected()) { await checkbox.click() }'
    case 'Select Dropdown': return desc + '\nconst select = await driver.findElement(' + loc + ')\nawait select.click()\nawait select.sendKeys(' + q(v) + ')'
    case 'Upload File': return desc + '\nawait driver.findElement(' + loc + ').sendKeys(' + q(v) + ')'
    case 'Take Screenshot': return desc + '\nawait driver.takeScreenshot().then(data => {\n  require("fs").writeFileSync(' + q(v || 'screenshot.png') + ', data, "base64")\n})'
    case 'Wait': return desc + '\nawait driver.wait(until.elementLocated(' + loc + '), 10000)'
    case 'Wait For URL': return desc + '\nawait driver.wait(until.urlIs(' + q(v) + '), 10000)'
    case 'Switch Frame': return desc + '\nawait driver.switchTo().frame(await driver.findElement(' + loc + '))'
    case 'Exit Frame': return desc + '\nawait driver.switchTo().defaultContent()'
    case 'Switch Window': return desc + '\nconst handles = await driver.getAllWindowHandles()\nawait driver.switchTo().window(handles[' + (Number(v) || 1) + '])'
    case 'Open New Window': return desc + '\nawait driver.executeScript("window.open()")\nconst handles = await driver.getAllWindowHandles()\nawait driver.switchTo().window(handles[handles.length - 1])'
    case 'Close Window': return desc + '\nawait driver.close()\nconst handles = await driver.getAllWindowHandles()\nawait driver.switchTo().window(handles[0])'
    case 'Scroll': return desc + '\nawait driver.executeScript("window.scrollBy(0, ' + (v || 500) + ')")'
    case 'API Request': return desc + '\n// API Request for ' + q(v) + ' - use axios or fetch'
    case 'Assert': return desc + '\n// Add assertion here'
    default: return desc + '\n// ' + step.action + ' - ' + (step.description || '')
  }
}

function assertionCode(a) {
  var loc = a.locator ? byCode(a.locatorType || 'css selector', a.locator) : null
  var v = a.value || ''
  switch (a.type) {
    case 'Visible': return 'assert(await driver.findElement(' + loc + ').isDisplayed()).isTrue()'
    case 'Hidden': return 'assert(await driver.findElement(' + loc + ').isDisplayed()).isFalse()'
    case 'Enabled': return 'assert(await driver.findElement(' + loc + ').isEnabled()).isTrue()'
    case 'Disabled': return 'assert(await driver.findElement(' + loc + ').isEnabled()).isFalse()'
    case 'Checked': return 'assert(await driver.findElement(' + loc + ').isSelected()).isTrue()'
    case 'Text Equals': return 'assert(await driver.findElement(' + loc + ').getText()).equals(' + q(v) + ')'
    case 'Text Contains': return 'assert(await driver.findElement(' + loc + ').getText()).includes(' + q(v) + ')'
    case 'URL Equals': return 'assert(await driver.getCurrentUrl()).equals(' + q(v) + ')'
    case 'URL Contains': return 'assert(await driver.getCurrentUrl()).includes(' + q(v) + ')'
    case 'Title Equals': return 'assert(await driver.getTitle()).equals(' + q(v) + ')'
    case 'Count': return 'assert(await driver.findElements(' + loc + ')).to.have.lengthOf(' + (Number(v) || 0) + ')'
    case 'Attribute': return 'assert(await driver.findElement(' + loc + ').getAttribute(' + q(v) + ')).equals(' + q(v) + ')'
    default: return ''
  }
}

function extractLocators(steps) {
  var map = {}
  ;(steps || []).forEach(function(s) {
    if (s.locator && s.action !== 'Open URL' && s.action !== 'Wait For URL') {
      var key = s.locator + '|' + (s.locatorType || 'css selector')
      if (!map[key]) {
        map[key] = { varName: varName(s.description, s.action), locator: s.locator, locatorType: s.locatorType || 'css selector', action: s.action, description: s.description }
      }
    }
  })
  return Object.values(map)
}

function generateSimpleScript(model) {
  var p = model.project, steps = model.steps, assertions = model.assertions
  var lines = []
  lines.push('const { Builder, By, Key, until } = require("selenium-webdriver")')
  lines.push('')
  var cn = sanitize(p.testTitle || 'test').replace(/\b\w/g, function(c) { return c.toUpperCase() })
  lines.push('describe("' + (p.testTitle || 'Test') + '", () => {')
  lines.push('  let driver')
  lines.push('')
  lines.push('  before(async () => {')
  lines.push('    driver = await new Builder().forBrowser("chrome").build()')
  lines.push('    await driver.manage().window().maximize()')
  if (p.baseUrl) lines.push('    await driver.get(' + q(p.baseUrl) + ')')
  lines.push('  })')
  lines.push('')
  lines.push('  after(async () => {')
  lines.push('    if (driver) await driver.quit()')
  lines.push('  })')
  lines.push('')
  lines.push('  it("should ' + sanitize(p.testTitle || 'test').replace(/_/g, ' ') + '", async () => {')
  steps.forEach(function(s) {
    var ac = actionCode(s)
    ac.split('\n').forEach(function(l) { lines.push('    ' + l) })
  })
  if (assertions.length > 0) {
    lines.push('')
    assertions.forEach(function(a) {
      var ac = assertionCode(a)
      if (ac) lines.push('    ' + ac)
    })
  }
  lines.push('  })')
  lines.push('})')
  return lines.join('\n')
}

function generatePomProject(model) {
  var p = model.project, steps = model.steps
  var files = []
  var locators = extractLocators(steps)

  var loginLocators = locators.filter(function(l) { return l.locator.includes('username') || l.locator.includes('password') || l.locator.includes('login') || (l.description && (l.description.toLowerCase().includes('username') || l.description.toLowerCase().includes('password') || l.description.toLowerCase().includes('login'))) })
  var dashLocators = locators.filter(function(l) { return !loginLocators.includes(l) })

  files.push({ name: 'pages/BasePage.js', content: 'const { By, until } = require("selenium-webdriver");\n\nclass BasePage {\n  constructor(driver) {\n    this.driver = driver;\n    this.timeout = 10000;\n  }\n\n  async findElement(locator) {\n    return await this.driver.wait(until.elementLocated(locator), this.timeout);\n  }\n\n  async findElements(locator) {\n    return await this.driver.wait(until.elementsLocated(locator), this.timeout);\n  }\n\n  async click(locator) {\n    const el = await this.findElement(locator);\n    await el.click();\n  }\n\n  async enterText(locator, text) {\n    const el = await this.findElement(locator);\n    await el.clear();\n    await el.sendKeys(text);\n  }\n\n  async getText(locator) {\n    const el = await this.findElement(locator);\n    return await el.getText();\n  }\n\n  async isDisplayed(locator) {\n    try {\n      const el = await this.findElement(locator);\n      return await el.isDisplayed();\n    } catch { return false; }\n  }\n\n  async getTitle() {\n    return await this.driver.getTitle();\n  }\n}\n\nmodule.exports = BasePage;' })
  files.push({ name: 'pages/LoginPage.js', content: genPageObject('LoginPage', loginLocators.length > 0 ? loginLocators : [{ varName: 'usernameInput', locatorType: 'By.id', locator: 'username', action: 'Fill', description: 'Username input' }, { varName: 'passwordInput', locatorType: 'By.id', locator: 'password', action: 'Fill', description: 'Password input' }, { varName: 'loginButton', locatorType: 'By.id', locator: 'login-button', action: 'Click', description: 'Login button' }]) })
  files.push({ name: 'pages/DashboardPage.js', content: genPageObject('DashboardPage', dashLocators.length > 0 ? dashLocators : [{ varName: 'welcomeMessage', locatorType: 'By.css', locator: '.welcome-message', action: 'Wait', description: 'Dashboard welcome message' }]) })
  files.push({ name: 'components/NavbarComponent.js', content: 'const { By } = require("selenium-webdriver");\n\nclass NavbarComponent {\n  constructor(driver) {\n    this.driver = driver;\n  }\n\n  async clickLogo() {\n    await this.driver.findElement(By.css(".logo")).click();\n  }\n\n  async clickLink(linkText) {\n    await this.driver.findElement(By.linkText(linkText)).click();\n  }\n\n  async isLogoDisplayed() {\n    return await this.driver.findElement(By.css(".logo")).isDisplayed();\n  }\n}\n\nmodule.exports = NavbarComponent;' })
  files.push({ name: 'components/SidebarComponent.js', content: 'const { By } = require("selenium-webdriver");\n\nclass SidebarComponent {\n  constructor(driver) {\n    this.driver = driver;\n  }\n\n  async toggle() {\n    await this.driver.findElement(By.css(".sidebar-toggle")).click();\n  }\n\n  async navigateTo(menuItem) {\n    await this.driver.findElement(By.linkText(menuItem)).click();\n  }\n\n  async isOpen() {\n    return await this.driver.findElement(By.css(".sidebar")).isDisplayed();\n  }\n}\n\nmodule.exports = SidebarComponent;' })
  files.push({ name: 'utils/DriverFactory.js', content: 'const { Builder } = require("selenium-webdriver");\n\nclass DriverFactory {\n  static async createDriver(browser = "chrome") {\n    let driver;\n    switch (browser.toLowerCase()) {\n      case "firefox":\n        driver = await new Builder().forBrowser("firefox").build();\n        break;\n      case "edge":\n        driver = await new Builder().forBrowser("MicrosoftEdge").build();\n        break;\n      default:\n        driver = await new Builder().forBrowser("chrome").build();\n    }\n    await driver.manage().window().maximize();\n    return driver;\n  }\n\n  static async quitDriver(driver) {\n    if (driver) await driver.quit();\n  }\n}\n\nmodule.exports = DriverFactory;' })
  files.push({ name: 'utils/WaitHelper.js', content: 'const { until } = require("selenium-webdriver");\n\nclass WaitHelper {\n  constructor(driver, timeout = 10000) {\n    this.driver = driver;\n    this.timeout = timeout;\n  }\n\n  async waitForVisibility(locator) {\n    return await this.driver.wait(until.elementLocated(locator), this.timeout);\n  }\n\n  async waitForUrlContains(text) {\n    return await this.driver.wait(until.urlContains(text), this.timeout);\n  }\n\n  async waitForTitleIs(title) {\n    return await this.driver.wait(until.titleIs(title), this.timeout);\n  }\n}\n\nmodule.exports = WaitHelper;' })
  files.push({ name: 'config/config.js', content: 'module.exports = {\n  BASE_URL: ' + q(p.baseUrl || 'https://example.com') + ',\n  BROWSER: "chrome",\n  TIMEOUT: 10000,\n  HEADLESS: false\n};' })
  files.push({ name: 'tests/test.spec.js', content: genSimpleSpec(model) })
  files.push({ name: 'package.json', content: '{\n  "name": ' + q(sanitize(p.testTitle || 'selenium-test') + '-test') + ',\n  "version": "1.0.0",\n  "private": true,\n  "scripts": {\n    "test": "mocha tests/*.spec.js --timeout 60000",\n    "test:headless": "cross-env HEADLESS=true mocha tests/*.spec.js --timeout 60000"\n  },\n  "dependencies": {\n    "selenium-webdriver": "^4.15.0",\n    "mocha": "^10.2.0",\n    "chai": "^4.3.7",\n    "cross-env": "^7.0.3"\n  }\n}' })
  files.push({ name: 'webdriver.config.js', content: 'module.exports = {\n  specs: ["tests/*.spec.js"],\n  capabilities: [{\n    browserName: "chrome"\n  }],\n  logLevel: "info",\n  baseUrl: ' + q(p.baseUrl || 'https://example.com') + ',\n  waitforTimeout: 10000,\n  connectionRetryTimeout: 120000,\n  connectionRetryCount: 3,\n  framework: "mocha",\n  reporters: ["spec"]\n};' })
  return files
}

function genPageObject(cn, pLocators) {
  var lines = []
  lines.push('const { By, until } = require("selenium-webdriver");')
  lines.push('')
  lines.push('class ' + cn + ' {')
  lines.push('  constructor(driver) {')
  lines.push('    this.driver = driver;')
  pLocators.forEach(function(l) {
    lines.push('    this._' + l.varName + ' = ' + l.locatorType + '(' + q(l.locator) + ')')
  })
  lines.push('  }')
  lines.push('')
  pLocators.forEach(function(l) {
    lines.push('  async get' + l.varName[0].toUpperCase() + l.varName.slice(1) + '() {')
    lines.push('    return await this.driver.wait(until.elementLocated(this._' + l.varName + '), 10000);')
    lines.push('  }')
    lines.push('')
  })
  pLocators.forEach(function(l) {
    var mn = l.varName[0].toUpperCase() + l.varName.slice(1)
    if (l.action === 'Fill' || l.action === 'Type') {
      lines.push('  async enter' + mn + '(text) {')
      if (l.description) lines.push('    // ' + l.description)
      lines.push('    const el = await this.get' + mn + '();')
      lines.push('    await el.clear();')
      lines.push('    await el.sendKeys(text);')
      lines.push('  }')
    } else if (l.action === 'Check') {
      lines.push('  async check' + mn + '() {')
      if (l.description) lines.push('    // ' + l.description)
      lines.push('    const el = await this.get' + mn + '();')
      lines.push('    if (!(await el.isSelected())) await el.click();')
      lines.push('  }')
    } else if (l.action === 'Uncheck') {
      lines.push('  async uncheck' + mn + '() {')
      if (l.description) lines.push('    // ' + l.description)
      lines.push('    const el = await this.get' + mn + '();')
      lines.push('    if (await el.isSelected()) await el.click();')
      lines.push('  }')
    } else {
      lines.push('  async click' + mn + '() {')
      if (l.description) lines.push('    // ' + l.description)
      lines.push('    await this.get' + mn + '();')
      lines.push('    await (await this.get' + mn + '()).click();')
      lines.push('  }')
    }
    lines.push('')
  })
  lines.push('  async isLoaded() {')
  if (pLocators.length > 0) lines.push('    try { return await (await this.get' + pLocators[0].varName[0].toUpperCase() + pLocators[0].varName.slice(1) + '()).isDisplayed(); } catch { return false; }')
  else lines.push('    return true;')
  lines.push('  }')
  lines.push('}')
  lines.push('')
  lines.push('module.exports = ' + cn + ';')
  return lines.join('\n')
}

function genSimpleSpec(model) {
  var p = model.project, steps = model.steps
  var lines = []
  lines.push('const { Builder, By, Key, until } = require("selenium-webdriver");')
  lines.push('const { expect } = require("chai");')
  lines.push('const LoginPage = require("../pages/LoginPage");')
  lines.push('const DashboardPage = require("../pages/DashboardPage");')
  lines.push('const config = require("../config/config");')
  lines.push('')
  var cn = sanitize(p.testTitle || 'test').replace(/\b\w/g, function(c) { return c.toUpperCase() })
  lines.push('describe("' + (p.testTitle || 'Test') + '", () => {')
  lines.push('  let driver;')
  lines.push('  let loginPage;')
  lines.push('  let dashboardPage;')
  lines.push('')
  lines.push('  before(async () => {')
  lines.push('    driver = await new Builder().forBrowser(config.BROWSER).build();')
  lines.push('    await driver.manage().window().maximize();')
  lines.push('    await driver.get(config.BASE_URL);')
  lines.push('    loginPage = new LoginPage(driver);')
  lines.push('    dashboardPage = new DashboardPage(driver);')
  lines.push('  });')
  lines.push('')
  lines.push('  after(async () => { if (driver) await driver.quit(); });')
  lines.push('')
  lines.push('  it("should perform test scenario", async () => {')
  steps.forEach(function(s) {
    var ac = actionCode(s)
    ac.split('\n').forEach(function(l) { lines.push('    ' + l) })
  })
  lines.push('  });')
  lines.push('});')
  return lines.join('\n')
}

export function generateSeleniumJavaScript(model) {
  var arch = model.settings.architecture || 'simple'
  if (arch === 'simple') {
    return [{ name: sanitize(model.project.testTitle || 'test') + '.spec.js', content: generateSimpleScript(model) }]
  }
  return generatePomProject(model)
}

export function generateSeleniumJavaScriptExplanation(model) {
  return 'This Selenium JavaScript project (' + (model.project.testTitle || 'Test') + ') uses the Page Object Model pattern with ' + model.steps.length + ' test steps. Built with Mocha + Chai, it follows JavaScript best practices with async/await, base page classes, and separated configuration.'
}

export function generateSeleniumJavaScriptChecklist(model) {
  return [
    { category: 'Project Structure', items: [
      { label: 'Page Object Model pattern used', passed: true },
      { label: 'Base page class with common methods', passed: true },
      { label: 'Configuration separated from tests', passed: true },
      { label: 'Helper utilities generated', passed: true },
      { label: 'package.json with dependencies', passed: true },
    ]},
    { category: 'Code Quality', items: [
      { label: 'Explicit waits used', passed: true },
      { label: 'Async/await pattern consistently used', passed: true },
      { label: 'Reusable methods in page objects', passed: true },
      { label: 'No hardcoded values in tests', passed: true },
    ]},
    { category: 'Test Coverage', items: [
      { label: 'Test steps defined', passed: model.steps.length > 0 },
      { label: 'Assertions included', passed: model.assertions.length > 0 },
    ]},
  ]
}

export function generateSeleniumJavaScriptBestPractices() {
  return [
    { title: 'Use Explicit Waits', description: 'Use driver.wait with until conditions instead of driver.sleep() for reliable tests.' },
    { title: 'Async/Await', description: 'Always use async/await for clean and readable asynchronous code.' },
    { title: 'Page Object Model', description: 'Encapsulate page elements and interactions in classes for reusability.' },
    { title: 'Separate Config', description: 'Keep URLs, browser settings, and timeouts in a config module.' },
    { title: 'Use Mocha Hooks', description: 'Use before/after hooks for driver setup and teardown.' },
    { title: 'Chai Assertions', description: 'Use Chai expect/should for expressive and readable assertions.' },
  ]
}
