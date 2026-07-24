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
        const varName = label
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .toLowerCase()
        map[key] = { varName: varName || 'element', locator: s.locator, locatorType: s.locatorType || 'Accessibility ID' }
      }
    }
  })
  return Object.values(map)
}

function actionCode(step, platform) {
  const loc = step.locator ? formatAppiumLocator('Java', step.locatorType || 'Accessibility ID', step.locator, platform) : null
  const val = step.value || ''
  const desc = step.description ? `  // ${step.description}` : ''
  let code = ''
  switch (step.action) {
    case 'Launch App':
      code = `  driver.launchApp();`
      break
    case 'Close App':
      code = `  driver.closeApp();`
      break
    case 'Install App':
      code = `  driver.installApp(${q(val)});`
      break
    case 'Remove App':
      code = `  driver.removeApp(${q(val)});`
      break
    case 'Background App':
      code = `  driver.runAppInBackground(Duration.ofSeconds(${val || 5}));`
      break
    case 'Activate App':
      code = `  driver.activateApp(${q(val)});`
      break
    case 'Terminate App':
      code = `  driver.terminateApp(${q(val)});`
      break
    case 'Reset App':
      code = `  driver.resetApp();`
      break
    case 'Get Device Time':
      code = `  String deviceTime = driver.getDeviceTime();`
      break
    case 'Lock Device':
      code = `  driver.lockDevice();`
      break
    case 'Unlock Device':
      code = `  driver.unlockDevice();`
      break
    case 'Rotate Device':
      code = `  driver.rotate(ScreenOrientation.${(val || 'PORTRAIT').toUpperCase()});`
      break
    case 'Set Orientation':
      code = `  driver.rotate(ScreenOrientation.${(val || 'PORTRAIT').toUpperCase()});`
      break
    case 'Open URL':
      code = `  driver.get(${q(val || '/')});`
      break
    case 'Go Back':
      code = `  driver.navigate().back();`
      break
    case 'Reload':
      code = `  driver.navigate().refresh();`
      break
    case 'Click':
      code = `  ${loc}.click();`
      break
    case 'Double Click':
      code = `  new TouchAction(driver).press(${loc}).release().perform();\n  new TouchAction(driver).press(${loc}).release().perform();`
      break
    case 'Long Press':
      code = `  new TouchAction(driver).longPress(${loc}).release().perform();`
      break
    case 'Tap':
      code = `  new TouchAction(driver).tap(${loc}).perform();`
      break
    case 'Swipe':
      code = `  JavascriptExecutor js = (JavascriptExecutor) driver;\n  HashMap<String, String> scrollArgs = new HashMap<>();\n  scrollArgs.put("direction", "${val || 'down'}");\n  js.executeScript("mobile: swipe", scrollArgs);`
      break
    case 'Scroll':
      code = `  JavascriptExecutor js = (JavascriptExecutor) driver;\n  HashMap<String, String> scrollArgs = new HashMap<>();\n  scrollArgs.put("direction", "${val || 'down'}");\n  js.executeScript("mobile: scroll", scrollArgs);`
      break
    case 'Drag':
      code = `  new TouchAction(driver).longPress(${loc}).moveTo(${q(val || 'target')}).release().perform();`
      break
    case 'Drop':
      code = `  // Drop action completed via drag`
      break
    case 'Pinch':
      code = `  JavascriptExecutor js = (JavascriptExecutor) driver;\n  HashMap<String, String> pinchArgs = new HashMap<>();\n  pinchArgs.put("scale", "0.5");\n  js.executeScript("mobile: pinch", pinchArgs);`
      break
    case 'Zoom':
      code = `  JavascriptExecutor js = (JavascriptExecutor) driver;\n  HashMap<String, String> zoomArgs = new HashMap<>();\n  zoomArgs.put("scale", "2.0");\n  js.executeScript("mobile: pinchOpen", zoomArgs);`
      break
    case 'Fill':
    case 'Type':
      code = `  ${loc}.sendKeys(${q(val)});`
      break
    case 'Clear':
      code = `  ${loc}.clear();`
      break
    case 'Press Key':
      code = `  ${loc}.sendKeys(Keys.${(val || 'ENTER').toUpperCase()});`
      break
    case 'Hide Keyboard':
      code = `  driver.hideKeyboard();`
      break
    case 'Check':
      code = `  if (!${loc}.isSelected()) { ${loc}.click(); }`
      break
    case 'Uncheck':
      code = `  if (${loc}.isSelected()) { ${loc}.click(); }`
      break
    case 'Select Dropdown':
      code = `  Select dropdown = new Select(${loc});\n  dropdown.selectByVisibleText(${q(val)});`
      break
    case 'Wait':
      code = `  ${loc}.isDisplayed();`
      break
    case 'Wait For Element':
      code = `  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));\n  wait.until(ExpectedConditions.visibilityOfElementLocated(${loc}));`
      break
    case 'Switch Frame':
      code = loc ? `  driver.switchTo().frame(${loc});` : `  // Switch to frame`
      break
    case 'Exit Frame':
      code = `  driver.switchTo().defaultContent();`
      break
    case 'Take Screenshot':
      code = `  File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);\n  FileUtils.copyFile(src, new File(${q(val || 'screenshot.png')}));`
      break
    case 'Upload File':
      code = `  ${loc}.sendKeys(${q(val)});`
      break
    case 'Push File':
      code = `  driver.pushFile(${q(val)}, new File(${q(val)}));`
      break
    case 'Pull File':
      code = `  byte[] fileData = driver.pullFile(${q(val)});`
      break
    case 'API Request':
      code = `  // API Request - use OkHttp or similar library`
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
  const loc = a.locator ? formatAppiumLocator('Java', a.locatorType || 'Accessibility ID', a.locator, platform) : null
  const val = a.value || ''
  switch (a.type) {
    case 'Visible':
    case 'Displayed':
      return `  Assert.assertTrue(${loc}.isDisplayed());`
    case 'Not Displayed':
      return `  Assert.assertFalse(${loc}.isDisplayed());`
    case 'Exists':
      return `  Assert.assertNotNull(${loc});`
    case 'Not Exists':
      return `  Assert.assertNull(${loc});`
    case 'Hidden':
      return `  Assert.assertFalse(${loc}.isDisplayed());`
    case 'Enabled':
      return `  Assert.assertTrue(${loc}.isEnabled());`
    case 'Disabled':
      return `  Assert.assertFalse(${loc}.isEnabled());`
    case 'Checked':
    case 'Selected':
      return `  Assert.assertTrue(${loc}.isSelected());`
    case 'Text Equals':
      return `  Assert.assertEquals(${q(val)}, ${loc}.getText());`
    case 'Text Contains':
      return `  Assert.assertTrue(${loc}.getText().contains(${q(val)}));`
    case 'Attribute':
      return `  Assert.assertEquals(${q(val)}, ${loc}.getAttribute(${q(a.attribute || 'value')}));`
    case 'Input Value':
      return `  Assert.assertEquals(${q(val)}, ${loc}.getText());`
    case 'Count':
      return `  Assert.assertEquals(${Number(val) || 0}, driver.findElements(${loc}).size());`
    default:
      return ''
  }
}

function generateSimpleScript(model) {
  const { project, steps, assertions } = model
  const title = project.testTitle || 'Untitled Test'
  const platform = project.platform || 'Android'
  const lines = []
  lines.push(`import io.appium.java_client.AppiumDriver;`)
  lines.push(`import io.appium.java_client.MobileBy;`)
  lines.push(`import io.appium.java_client.TouchAction;`)
  lines.push(`import io.appium.java_client.android.AndroidDriver;`)
  lines.push(`import io.appium.java_client.ios.IOSDriver;`)
  lines.push(`import org.openqa.selenium.By;`)
  lines.push(`import org.openqa.selenium.WebElement;`)
  lines.push(`import org.openqa.selenium.support.ui.WebDriverWait;`)
  lines.push(`import org.openqa.selenium.support.ui.ExpectedConditions;`)
  lines.push(`import org.openqa.selenium.support.ui.Select;`)
  lines.push(`import org.openqa.selenium.JavascriptExecutor;`)
  lines.push(`import org.openqa.selenium.Keys;`)
  lines.push(`import org.openqa.selenium.OutputType;`)
  lines.push(`import org.openqa.selenium.TakesScreenshot;`)
  lines.push(`import org.openqa.selenium.ScreenOrientation;`)
  lines.push(`import org.apache.commons.io.FileUtils;`)
  lines.push(`import java.io.File;`)
  lines.push(`import java.net.MalformedURLException;`)
  lines.push(`import java.net.URL;`)
  lines.push(`import java.time.Duration;`)
  lines.push(`import java.util.HashMap;`)
  lines.push(`import org.testng.Assert;`)
  lines.push(`import org.testng.annotations.*;`)
  lines.push(``)
  lines.push(`public class ${sanitizeName(title)} {`)
  lines.push(`  private AppiumDriver driver;`)
  lines.push(``)
  lines.push(`  @BeforeMethod`)
  lines.push(`  public void setUp() throws MalformedURLException {`)
  lines.push(`    UiMobileOptions capabilities = new UiMobileOptions();`)
  lines.push(`    capabilities.setPlatformName("${platform}");`)
  lines.push(`    capabilities.setDeviceName("${project.deviceName || 'emulator'}");`)
  lines.push(`    capabilities.setAppPackage("${project.appPackage || 'com.example.app'}");`)
  lines.push(`    capabilities.setAppActivity("${project.appActivity || '.MainActivity'}");`)
  lines.push(`    capabilities.setAutomationName("${project.automationName || 'UiAutomator2'}");`)
  lines.push(`    driver = new AndroidDriver(new URL("${project.appiumUrl || 'http://127.0.0.1:4723'}/wd/hub"), capabilities);`)
  lines.push(`    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));`)
  lines.push(`  }`)
  lines.push(``)
  lines.push(`  @Test`)
  lines.push(`  public void ${sanitizeName(title.replace(/\s+/g, ''))}() {`)
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
  lines.push(`  }`)
  lines.push(``)
  lines.push(`  @AfterMethod`)
  lines.push(`  public void tearDown() {`)
  lines.push(`    if (driver != null) {`)
  lines.push(`      driver.quit();`)
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
  files.push({ name: `tests/${project.testTitle || 'test'}.java`, content: generateSimpleScript(model) })
  const pageLines = []
  pageLines.push(`import io.appium.java_client.AppiumDriver;`)
  pageLines.push(`import io.appium.java_client.MobileBy;`)
  pageLines.push(`import org.openqa.selenium.By;`)
  pageLines.push(`import org.openqa.selenium.WebElement;`)
  pageLines.push(`import org.openqa.selenium.support.FindBy;`)
  pageLines.push(`import org.openqa.selenium.support.PageFactory;`)
  pageLines.push(``)
  pageLines.push(`public class ${name} {`)
  pageLines.push(`  private AppiumDriver driver;`)
  pageLines.push(``)
  locators.forEach((loc) => {
    pageLines.push(`  @FindBy(how = How.${loc.locatorType.toUpperCase().replace(' ', '_')}, using = ${q(loc.locator)})`)
    pageLines.push(`  private WebElement ${loc.varName};`)
  })
  pageLines.push(``)
  pageLines.push(`  public ${name}(AppiumDriver driver) {`)
  pageLines.push(`    this.driver = driver;`)
  pageLines.push(`    PageFactory.initElements(driver, this);`)
  pageLines.push(`  }`)
  pageLines.push(``)
  const seenActions = new Set()
  steps.forEach((step) => {
    if (['Launch App', 'Close App', 'Open URL', 'Go Back', 'Reload', 'Take Screenshot',
      'Get Device Time', 'Lock Device', 'Unlock Device', 'Rotate Device',
      'Switch Frame', 'Exit Frame', 'Wait', 'Hide Keyboard',
    ].includes(step.action)) return
    const descKey = step.description || `${step.action}_${step.locator || ''}`
    if (seenActions.has(descKey)) return
    seenActions.add(descKey)
    const methodName = descKey.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (c) => c.toLowerCase()) || 'doAction'
    pageLines.push(`  public void ${methodName}() {`)
    if (step.description) pageLines.push(`    // ${step.description}`)
    pageLines.push(`    ${locators.find((l) => l.locator === step.locator)?.varName || 'element'}.click();`)
    pageLines.push(`  }`)
    pageLines.push(``)
  })
  pageLines.push(`}`)
  files.push({ name: `pages/${name}.java`, content: pageLines.join('\n') })
  const baseLines = [
    `import io.appium.java_client.AppiumDriver;`,
    `import org.openqa.selenium.remote.DesiredCapabilities;`,
    `import java.net.URL;`,
    `import java.time.Duration;`,
    ``,
    `public class BaseTest {`,
    `  protected AppiumDriver driver;`,
    ``,
    `  public void setUp(String platform) throws Exception {`,
    `    DesiredCapabilities caps = new DesiredCapabilities();`,
    `    caps.setCapability("platformName", platform);`,
    `    caps.setCapability("deviceName", "${project.deviceName || 'emulator'}");`,
    `    caps.setCapability("appPackage", "${project.appPackage || 'com.example.app'}");`,
    `    caps.setCapability("appActivity", "${project.appActivity || '.MainActivity'}");`,
    `    caps.setCapability("automationName", "${project.automationName || 'UiAutomator2'}");`,
    `    driver = new AndroidDriver(new URL("${project.appiumUrl || 'http://127.0.0.1:4723'}/wd/hub"), caps);`,
    `    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));`,
    `  }`,
    ``,
    `  public void tearDown() {`,
    `    if (driver != null) driver.quit();`,
    `  }`,
    `}`,
  ]
  files.push({ name: `base/BaseTest.java`, content: baseLines.join('\n') })
  const configLines = [
    `# Appium Configuration`,
    `appium.server.url=${project.appiumUrl || 'http://127.0.0.1:4723'}`,
    `appium.platform=${platform}`,
    `appium.device=${project.deviceName || 'emulator'}`,
    `appium.automation=${project.automationName || 'UiAutomator2'}`,
    `appium.appPackage=${project.appPackage || 'com.example.app'}`,
    `appium.appActivity=${project.appActivity || '.MainActivity'}`,
  ]
  files.push({ name: `config/config.properties`, content: configLines.join('\n') })
  const dataLines = [
    `public class TestData {`,
    ...(model.variables || []).map((v) => `  public static final String ${v.name.toUpperCase()} = ${q(v.value)};`),
    `}`,
  ]
  files.push({ name: `data/TestData.java`, content: dataLines.join('\n') })
  const utilsLines = [
    `import io.appium.java_client.AppiumDriver;`,
    `import org.openqa.selenium.support.ui.WebDriverWait;`,
    `import org.openqa.selenium.support.ui.ExpectedConditions;`,
    `import org.openqa.selenium.By;`,
    `import java.time.Duration;`,
    ``,
    `public class WaitHelper {`,
    `  public static void waitForElement(AppiumDriver driver, By locator, int timeout) {`,
    `    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeout));`,
    `    wait.until(ExpectedConditions.visibilityOfElementLocated(locator));`,
    `  }`,
    ``,
    `  public static void waitForElementClickable(AppiumDriver driver, By locator, int timeout) {`,
    `    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeout));`,
    `    wait.until(ExpectedConditions.elementToBeClickable(locator));`,
    `  }`,
    `}`,
  ]
  files.push({ name: `utils/WaitHelper.java`, content: utilsLines.join('\n') })
  const gestureLines = [
    `import io.appium.java_client.AppiumDriver;`,
    `import io.appium.java_client.TouchAction;`,
    `import io.appium.java_client.touch.WaitOptions;`,
    `import io.appium.java_client.touch.offset.PointOption;`,
    `import java.time.Duration;`,
    ``,
    `public class GestureHelper {`,
    `  public static void swipe(AppiumDriver driver, int startX, int startY, int endX, int endY) {`,
    `    new TouchAction(driver)`,
    `      .press(PointOption.point(startX, startY))`,
    `      .waitAction(WaitOptions.waitOptions(Duration.ofMillis(500)))`,
    `      .moveTo(PointOption.point(endX, endY))`,
    `      .release()`,
    `      .perform();`,
    `  }`,
    ``,
    `  public static void scrollDown(AppiumDriver driver) {`,
    `    swipe(driver, 500, 1500, 500, 500);`,
    `  }`,
    `}`,
  ]
  files.push({ name: `utils/GestureHelper.java`, content: gestureLines.join('\n') })
  return files
}

export function generateAppiumJava(model) {
  const architecture = model.settings.architecture || 'simple'
  if (architecture === 'simple') {
    return [{ name: `${(model.project.testTitle || 'test').replace(/\s+/g, '_').toLowerCase()}.java`, content: generateSimpleScript(model) }]
  }
  if (architecture === 'pom') {
    return generatePomProject(model)
  }
  return [{ name: 'AppiumTest.java', content: generateSimpleScript(model) }]
}

export function generateAppiumJavaExplanation(model) {
  const { project, steps, assertions } = model
  return `This Appium test (${project.testTitle || 'Test'}) automates ${steps.length} steps with ${assertions.length} assertions for ${project.platform || 'Android'}. It uses the Appium framework to control a mobile device and verify application behavior.`
}

export function generateAppiumJavaChecklist(model) {
  const { project, steps, assertions } = model
  return [
    { category: 'Configuration', items: [
      { label: 'Appium server URL configured', passed: !!project.appiumUrl },
      { label: 'Platform name set', passed: !!project.platform },
      { label: 'Device name configured', passed: !!project.deviceName },
      { label: 'App package/activity configured', passed: !!(project.appPackage || project.bundleId) },
    ]},
    { category: 'Test Steps', items: [
      { label: 'At least one step defined', passed: steps.length > 0 },
      { label: 'Mobile locators use Appium-specific strategies', passed: steps.some((s) => ['Accessibility ID', 'Android UIAutomator', 'iOS Predicate String', 'iOS Class Chain'].includes(s.locatorType)) },
    ]},
    { category: 'Assertions', items: [
      { label: 'Assertions defined', passed: assertions.length > 0 },
      { label: 'Mobile-specific assertions used', passed: assertions.some((a) => ['Displayed', 'Not Displayed', 'Exists', 'Not Exists'].includes(a.type)) },
    ]},
    { category: 'Best Practices', items: [
      { label: 'Implicit wait configured', passed: true },
      { label: 'Driver quits in tearDown', passed: true },
      { label: 'Avoid hardcoded waits', passed: steps.filter((s) => s.action === 'Wait').length === 0 },
    ]},
  ]
}

export function generateAppiumJavaBestPractices() {
  return [
    { title: 'Use Appium-Specific Locators', description: 'Prefer Accessibility ID, Android UIAutomator, iOS Predicate String over XPath for better performance.' },
    { title: 'Avoid Thread.sleep()', description: 'Use WebDriverWait with ExpectedConditions instead of fixed sleeps.' },
    { title: 'Use Page Object Model', description: 'Organize mobile interactions into reusable Page Object classes for maintainability.' },
    { title: 'Leverage Gesture Helpers', description: 'Encapsulate swipe, scroll, and gesture actions in reusable helper classes.' },
    { title: 'Set Reasonable Timeouts', description: 'Configure implicit and explicit waits appropriate for mobile network conditions.' },
    { title: 'Test on Real Devices', description: 'Run tests on real devices or cloud providers for accurate results.' },
    { title: 'Handle App Lifecycle', description: 'Use activateApp, backgroundApp, and terminateApp for proper app state management.' },
  ]
}
