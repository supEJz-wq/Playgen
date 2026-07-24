import { formatAppiumLocator } from '../constants/appiumLocators'

const q = (val) => `"${String(val).replace(/"/g, '\\"')}"`

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
  const loc = step.locator ? formatAppiumLocator('C#', step.locatorType || 'Accessibility ID', step.locator, platform) : null
  const val = step.value || ''
  const desc = step.description ? `  // ${step.description}` : ''
  let code = ''
  switch (step.action) {
    case 'Launch App':
      code = `  driver.LaunchApp();`
      break
    case 'Close App':
      code = `  driver.CloseApp();`
      break
    case 'Install App':
      code = `  driver.InstallApp(${q(val)});`
      break
    case 'Remove App':
      code = `  driver.RemoveApp(${q(val)});`
      break
    case 'Background App':
      code = `  driver.BackgroundApp(TimeSpan.FromSeconds(${val || 5}));`
      break
    case 'Activate App':
      code = `  driver.ActivateApp(${q(val)});`
      break
    case 'Terminate App':
      code = `  driver.TerminateApp(${q(val)});`
      break
    case 'Reset App':
      code = `  driver.ResetApp();`
      break
    case 'Get Device Time':
      code = `  string deviceTime = driver.DeviceTime;`
      break
    case 'Lock Device':
      code = `  driver.LockDevice();`
      break
    case 'Unlock Device':
      code = `  driver.UnlockDevice();`
      break
    case 'Rotate Device':
    case 'Set Orientation':
      code = `  driver.Orientation = ScreenOrientation.${((val || 'Portrait').toUpperCase())};`
      break
    case 'Open URL':
      code = `  driver.Navigate().GoToUrl(${q(val || '/')});`
      break
    case 'Go Back':
      code = `  driver.Navigate().Back();`
      break
    case 'Reload':
      code = `  driver.Navigate().Refresh();`
      break
    case 'Click':
      code = `  ${loc}.Click();`
      break
    case 'Double Click':
      code = `  ${loc}.Click();\n  ${loc}.Click();`
      break
    case 'Long Press':
      code = `  TouchAction action = new TouchAction(driver);\n  action.LongPress(${loc}).Release().Perform();`
      break
    case 'Tap':
      code = `  TouchAction action = new TouchAction(driver);\n  action.Tap(${loc}).Perform();`
      break
    case 'Swipe':
      code = `  driver.Swipe(${val || '500, 1500, 500, 500'});`
      break
    case 'Scroll':
      code = `  driver.Scroll(${loc}, ${q(val || 'down')});`
      break
    case 'Drag':
      code = `  TouchAction action = new TouchAction(driver);\n  action.LongPress(${loc}).MoveTo(${q(val || 'target')}).Release().Perform();`
      break
    case 'Pinch':
      code = `  driver.Pinch(${loc});`
      break
    case 'Zoom':
      code = `  driver.Zoom(${loc});`
      break
    case 'Fill':
    case 'Type':
      code = `  ${loc}.SendKeys(${q(val)});`
      break
    case 'Clear':
      code = `  ${loc}.Clear();`
      break
    case 'Press Key':
      code = `  ${loc}.SendKeys(${q(val || 'Enter')});`
      break
    case 'Hide Keyboard':
      code = `  driver.HideKeyboard();`
      break
    case 'Check':
      code = `  if (!${loc}.Selected) { ${loc}.Click(); }`
      break
    case 'Uncheck':
      code = `  if (${loc}.Selected) { ${loc}.Click(); }`
      break
    case 'Select Dropdown':
      code = `  SelectElement select = new SelectElement(${loc});\n  select.SelectByText(${q(val)});`
      break
    case 'Wait':
      code = `  ${loc}.Displayed.Wait();`
      break
    case 'Wait For Element':
      code = `  WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));\n  wait.Until(ExpectedConditions.ElementIsVisible(${loc}));`
      break
    case 'Switch Frame':
      code = loc ? `  driver.SwitchTo().Frame(${loc});` : `  // Switch to frame`
      break
    case 'Exit Frame':
      code = `  driver.SwitchTo().DefaultContent();`
      break
    case 'Take Screenshot':
      code = `  Screenshot screenshot = ((ITakesScreenshot)driver).GetScreenshot();\n  screenshot.SaveAsFile(${q(val || 'screenshot.png')}, ScreenshotImageFormat.Png);`
      break
    case 'Upload File':
      code = `  ${loc}.SendKeys(${q(val)});`
      break
    case 'Push File':
      code = `  driver.PushFile(${q(val)}, File.ReadAllBytes(${q(val)}));`
      break
    case 'Pull File':
      code = `  byte[] fileData = driver.PullFile(${q(val)});`
      break
    case 'API Request':
      code = `  // API Request - use HttpClient`
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
  const loc = a.locator ? formatAppiumLocator('C#', a.locatorType || 'Accessibility ID', a.locator, platform) : null
  const val = a.value || ''
  switch (a.type) {
    case 'Visible':
    case 'Displayed':
      return `  Assert.IsTrue(${loc}.Displayed);`
    case 'Not Displayed':
      return `  Assert.IsFalse(${loc}.Displayed);`
    case 'Exists':
      return `  Assert.IsNotNull(${loc});`
    case 'Not Exists':
      return `  Assert.IsNull(${loc});`
    case 'Hidden':
      return `  Assert.IsFalse(${loc}.Displayed);`
    case 'Enabled':
      return `  Assert.IsTrue(${loc}.Enabled);`
    case 'Disabled':
      return `  Assert.IsFalse(${loc}.Enabled);`
    case 'Checked':
    case 'Selected':
      return `  Assert.IsTrue(${loc}.Selected);`
    case 'Text Equals':
      return `  Assert.AreEqual(${q(val)}, ${loc}.Text);`
    case 'Text Contains':
      return `  StringAssert.Contains(${q(val)}, ${loc}.Text);`
    case 'Attribute':
      return `  Assert.AreEqual(${q(val)}, ${loc}.GetAttribute(${q(a.attribute || 'value')}));`
    case 'Input Value':
      return `  Assert.AreEqual(${q(val)}, ${loc}.Text);`
    case 'Count':
      return `  Assert.AreEqual(${Number(val) || 0}, driver.FindElements(${loc}).Count);`
    default:
      return ''
  }
}

function generateSimpleScript(model) {
  const { project, steps, assertions } = model
  const platform = project.platform || 'Android'
  const title = project.testTitle || 'Test'
  const lines = []
  lines.push(`using System;`)
  lines.push(`using NUnit.Framework;`)
  lines.push(`using OpenQA.Selenium.Appium;`)
  lines.push(`using OpenQA.Selenium.Appium.Android;`)
  lines.push(`using OpenQA.Selenium.Appium.iOS;`)
  lines.push(`using OpenQA.Selenium.Appium.Enums;`)
  lines.push(`using OpenQA.Selenium.Appium.Interfaces;`)
  lines.push(`using OpenQA.Selenium.Appium.MobileBy;`)
  lines.push(`using OpenQA.Selenium.Appium.Touch;`)
  lines.push(`using OpenQA.Selenium.Interactions;`)
  lines.push(`using OpenQA.Selenium.Support.UI;`)
  lines.push(`using OpenQA.Selenium;`)
  lines.push(``)
  lines.push(`namespace AppiumTests`)
  lines.push(`{`)
  lines.push(`  [TestFixture]`)
  lines.push(`  public class ${sanitizeName(title)}Tests`)
  lines.push(`  {`)
  lines.push(`    private AppiumDriver<AppiumWebElement> driver;`)
  lines.push(``)
  lines.push(`    [SetUp]`)
  lines.push(`    public void SetUp()`)
  lines.push(`    {`)
  lines.push(`      var caps = new AppiumOptions();`)
  lines.push(`      caps.PlatformName = ${q(platform)};`)
  lines.push(`      caps.AddAdditionalAppiumOption("deviceName", ${q(project.deviceName || 'emulator')});`)
  lines.push(`      caps.AddAdditionalAppiumOption("appPackage", ${q(project.appPackage || 'com.example.app')});`)
  lines.push(`      caps.AddAdditionalAppiumOption("appActivity", ${q(project.appActivity || '.MainActivity')});`)
  lines.push(`      caps.AddAdditionalAppiumOption("automationName", ${q(project.automationName || 'UiAutomator2')});`)
  lines.push(`      driver = new AndroidDriver<AppiumWebElement>(new Uri(${q(project.appiumUrl || 'http://127.0.0.1:4723')}), caps);`)
  lines.push(`      driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    [Test]`)
  lines.push(`    public void ${sanitizeName(title)}_Test()`)
  lines.push(`    {`)
  steps.forEach((step) => {
    const code = actionCode(step, platform)
    if (code) lines.push(`      ${code}`)
  })
  if (assertions.length > 0) {
    lines.push(``)
    lines.push(`      // Assertions`)
    assertions.forEach((a) => {
      const ac = assertionCode(a, platform)
      if (ac) lines.push(`      ${ac}`)
    })
  }
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    [TearDown]`)
  lines.push(`    public void TearDown()`)
  lines.push(`    {`)
  lines.push(`      driver?.Quit();`)
  lines.push(`    }`)
  lines.push(`  }`)
  lines.push(`}`)
  return lines.join('\n')
}

function generatePomProject(model) {
  const { project, steps } = model
  const name = pageName(project.testTitle || 'Test')
  const platform = project.platform || 'Android'
  const locators = extractUniqueLocators(steps)
  const files = []
  files.push({ name: `tests/${project.testTitle || 'Test'}.cs`, content: generateSimpleScript(model) })
  const pageLines = [
    `using OpenQA.Selenium.Appium;`,
    `using OpenQA.Selenium.Appium.MobileBy;`,
    `using OpenQA.Selenium;`,
    `using OpenQA.Selenium.Support.PageObjects;`,
    ``,
    `namespace AppiumTests.Pages`,
    `{`,
    `  public class ${name}`,
    `  {`,
    `    private AppiumDriver<AppiumWebElement> driver;`,
    ``,
    ...locators.map((loc) => `    [FindsBy(How = How.${loc.locatorType.toUpperCase().replace(/ /g, '_')}, Using = ${q(loc.locator)})]\n    private AppiumWebElement ${loc.varName};`),
    ``,
    `    public ${name}(AppiumDriver<AppiumWebElement> driver)`,
    `    {`,
    `      this.driver = driver;`,
    `      PageFactory.InitElements(driver, this);`,
    `    }`,
    ``,
  ]
  const seenActions = new Set()
  steps.forEach((step) => {
    if (['Launch App', 'Close App', 'Open URL', 'Go Back', 'Reload', 'Take Screenshot',
      'Get Device Time', 'Lock Device', 'Unlock Device', 'Rotate Device',
      'Switch Frame', 'Exit Frame', 'Wait', 'Hide Keyboard',
    ].includes(step.action)) return
    const descKey = step.description || `${step.action}_${step.locator || ''}`
    if (seenActions.has(descKey)) return
    seenActions.add(descKey)
    const methodName = descKey.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (c) => c.toLowerCase()) || 'DoAction'
    pageLines.push(`    public void ${methodName}()`)
    pageLines.push(`    {`)
    if (step.description) pageLines.push(`      // ${step.description}`)
    const foundLoc = locators.find((l) => l.locator === step.locator)
    pageLines.push(`      ${foundLoc ? `this.${foundLoc.varName}` : loc}.Click();`)
    pageLines.push(`    }`)
    pageLines.push(``)
  })
  pageLines.push(`  }`)
  pageLines.push(`}`)
  files.push({ name: `pages/${name}.cs`, content: pageLines.join('\n') })
  const baseLines = [
    `using System;`,
    `using OpenQA.Selenium.Appium;`,
    `using OpenQA.Selenium.Appium.Android;`,
    `using OpenQA.Selenium.Appium.iOS;`,
    `using OpenQA.Selenium.Appium.Enums;`,
    `using NUnit.Framework;`,
    ``,
    `namespace AppiumTests`,
    `{`,
    `  public class BaseTest`,
    `  {`,
    `    protected AppiumDriver<AppiumWebElement> driver;`,
    ``,
    `    [SetUp]`,
    `    public void SetUp()`,
    `    {`,
    `      var caps = new AppiumOptions();`,
    `      caps.PlatformName = ${q(platform)};`,
    `      caps.AddAdditionalAppiumOption("deviceName", ${q(project.deviceName || 'emulator')});`,
    `      caps.AddAdditionalAppiumOption("appPackage", ${q(project.appPackage || 'com.example.app')});`,
    `      caps.AddAdditionalAppiumOption("appActivity", ${q(project.appActivity || '.MainActivity')});`,
    `      caps.AddAdditionalAppiumOption("automationName", ${q(project.automationName || 'UiAutomator2')});`,
    `      driver = new AndroidDriver<AppiumWebElement>(new Uri(${q(project.appiumUrl || 'http://127.0.0.1:4723')}), caps);`,
    `      driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);`,
    `    }`,
    ``,
    `    [TearDown]`,
    `    public void TearDown()`,
    `    {`,
    `      driver?.Quit();`,
    `    }`,
    `  }`,
    `}`,
  ]
  files.push({ name: `base/BaseTest.cs`, content: baseLines.join('\n') })
  const configLines = [
    `<!-- Appium Configuration -->`,
    `<appSettings>`,
    `  <add key="AppiumUrl" value="${project.appiumUrl || 'http://127.0.0.1:4723'}" />`,
    `  <add key="Platform" value="${platform}" />`,
    `  <add key="DeviceName" value="${project.deviceName || 'emulator'}" />`,
    `  <add key="AutomationName" value="${project.automationName || 'UiAutomator2'}" />`,
    `</appSettings>`,
  ]
  files.push({ name: `config/App.config`, content: configLines.join('\n') })
  const dataLines = [
    `namespace AppiumTests.Data`,
    `{`,
    `  public static class TestData`,
    `  {`,
    ...(model.variables || []).map((v) => `    public const string ${(v.name || '').toUpperCase()} = ${q(v.value)};`),
    `  }`,
    `}`,
  ]
  files.push({ name: `data/TestData.cs`, content: dataLines.join('\n') })
  return files
}

export function generateAppiumCSharp(model) {
  const architecture = model.settings.architecture || 'simple'
  if (architecture === 'simple') {
    return [{ name: `${(model.project.testTitle || 'Test').replace(/\s+/g, '_')}.cs`, content: generateSimpleScript(model) }]
  }
  if (architecture === 'pom') {
    return generatePomProject(model)
  }
  return [{ name: 'AppiumTest.cs', content: generateSimpleScript(model) }]
}

export function generateAppiumCSharpExplanation(model) {
  const { project, steps, assertions } = model
  return `This Appium C# NUnit test (${project.testTitle || 'Test'}) automates ${steps.length} steps with ${assertions.length} assertions for ${project.platform || 'Android'}. Uses Appium.WebDriver and NUnit.`
}

export function generateAppiumCSharpChecklist(model) {
  const { project, steps, assertions } = model
  return [
    { category: 'Configuration', items: [
      { label: 'Appium URL configured', passed: !!project.appiumUrl },
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

export function generateAppiumCSharpBestPractices() {
  return [
    { title: 'Use Appium.WebDriver', description: 'Use the official Appium WebDriver NuGet package for C#.' },
    { title: 'Use NUnit or MSTest', description: 'Structure tests with NUnit for cross-platform test execution.' },
    { title: 'Use Page Object Model', description: 'Organize mobile interactions into POM classes.' },
    { title: 'Use AppiumOptions', description: 'Configure capabilities using strongly-typed AppiumOptions.' },
    { title: 'Leverage Touch Gestures', description: 'Use TouchAction for complex swipe, scroll, and gesture actions.' },
  ]
}
