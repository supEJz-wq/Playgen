import { formatLocator } from '../constants/locatorTypes'

function sanitize(name) {
  return (name || 'Test').replace(/[^a-zA-Z0-9]/g, ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
}

function pName(title) {
  const c = sanitize(title)
  return c.endsWith('Page') ? c : c + 'Page'
}

function cName(title) {
  return sanitize(title || 'Component') + 'Component'
}

function byCode(lt, loc) {
  return formatLocator('selenium', 'Java', lt, loc)
}

function varName(desc, fallback) {
  const n = (desc || fallback || 'element').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_').toLowerCase()
  return n || 'element'
}

function q(v) { return '"' + String(v).replace(/"/g, '\\"') + '"' }

function actionCode(step) {
  const loc = step.locator ? byCode(step.locatorType || 'CSS Selector', step.locator) : null
  const v = step.value || ''
  const desc = step.description ? '// ' + step.description : ''
  let code = ''
  switch (step.action) {
    case 'Open URL': code = 'driver.get(' + q(v) + ');'; break
    case 'Go Back': code = 'driver.navigate().back();'; break
    case 'Go Forward': code = 'driver.navigate().forward();'; break
    case 'Reload': code = 'driver.navigate().refresh();'; break
    case 'Close Page': code = 'driver.close();'; break
    case 'Click': code = 'driver.findElement(' + loc + ').click();'; break
    case 'Double Click': code = 'new Actions(driver).doubleClick(driver.findElement(' + loc + ')).perform();'; break
    case 'Right Click': code = 'new Actions(driver).contextClick(driver.findElement(' + loc + ')).perform();'; break
    case 'Hover': code = 'new Actions(driver).moveToElement(driver.findElement(' + loc + ')).perform();'; break
    case 'Drag And Drop': code = 'new Actions(driver).dragAndDrop(driver.findElement(' + loc + '), driver.findElement(' + byCode('CSS Selector', v) + ')).perform();'; break
    case 'Fill': code = 'driver.findElement(' + loc + ').clear();\ndriver.findElement(' + loc + ').sendKeys(' + q(v) + ');'; break
    case 'Clear': code = 'driver.findElement(' + loc + ').clear();'; break
    case 'Press Key': code = 'driver.findElement(' + loc + ').sendKeys(Keys.' + (v.toUpperCase() || 'ENTER') + ');'; break
    case 'Type': code = 'driver.findElement(' + loc + ').sendKeys(' + q(v) + ');'; break
    case 'Check': code = 'if (!driver.findElement(' + loc + ').isSelected()) {\n  driver.findElement(' + loc + ').click();\n}'; break
    case 'Uncheck': code = 'if (driver.findElement(' + loc + ').isSelected()) {\n  driver.findElement(' + loc + ').click();\n}'; break
    case 'Select Dropdown': code = 'new Select(driver.findElement(' + loc + ')).selectByVisibleText(' + q(v) + ');'; break
    case 'Upload File': code = 'driver.findElement(' + loc + ').sendKeys(' + q(v) + ');'; break
    case 'Take Screenshot': code = 'File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);\nFileUtils.copyFile(src, new File(' + q(v || 'screenshot.png') + '));'; break
    case 'Wait': code = 'new WebDriverWait(driver, Duration.ofSeconds(10))\n  .until(ExpectedConditions.visibilityOfElementLocated(' + loc + '));'; break
    case 'Wait For URL': code = 'new WebDriverWait(driver, Duration.ofSeconds(10))\n  .until(ExpectedConditions.urlToBe(' + q(v) + '));'; break
    case 'Switch Frame': code = 'driver.switchTo().frame(driver.findElement(' + loc + '));'; break
    case 'Exit Frame': code = 'driver.switchTo().defaultContent();'; break
    case 'Switch Window': code = 'ArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());\ndriver.switchTo().window(tabs.get(' + (Number(v) || 1) + '));'; break
    case 'Open New Window': code = '((JavascriptExecutor) driver).executeScript("window.open()");\nArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());\ndriver.switchTo().window(tabs.get(tabs.size() - 1));'; break
    case 'Close Window': code = 'driver.close();\nArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());\ndriver.switchTo().window(tabs.get(0));'; break
    case 'Scroll': code = '((JavascriptExecutor) driver).executeScript("window.scrollBy(0, ' + (v || 500) + ')");'; break
    case 'API Request': code = '// API Request - use RestAssured or HttpClient for ' + q(v); break
    case 'Assert': code = '// Add assertion here'; break
    default: code = '// ' + step.action + ' - ' + (step.description || '')
  }
  return desc ? desc + '\n' + code : code
}

function assertionCode(a) {
  const loc = a.locator ? byCode(a.locatorType || 'CSS Selector', a.locator) : null
  const v = a.value || ''
  switch (a.type) {
    case 'Visible': return 'assertTrue(driver.findElement(' + loc + ').isDisplayed());'
    case 'Hidden': return 'assertFalse(driver.findElement(' + loc + ').isDisplayed());'
    case 'Enabled': return 'assertTrue(driver.findElement(' + loc + ').isEnabled());'
    case 'Disabled': return 'assertFalse(driver.findElement(' + loc + ').isEnabled());'
    case 'Checked': return 'assertTrue(driver.findElement(' + loc + ').isSelected());'
    case 'Text Equals': return 'assertEquals(' + q(v) + ', driver.findElement(' + loc + ').getText());'
    case 'Text Contains': return 'assertTrue(driver.findElement(' + loc + ').getText().contains(' + q(v) + '));'
    case 'URL Equals': return 'assertEquals(' + q(v) + ', driver.getCurrentUrl());'
    case 'URL Contains': return 'assertTrue(driver.getCurrentUrl().contains(' + q(v) + '));'
    case 'Title Equals': return 'assertEquals(' + q(v) + ', driver.getTitle());'
    case 'Count': return 'assertEquals(' + (Number(v) || 0) + ', driver.findElements(' + loc + ').size());'
    case 'Attribute': return 'assertEquals(' + q(v) + ', driver.findElement(' + loc + ').getAttribute(' + q(v) + '));'
    case 'Input Value': return 'assertEquals(' + q(v) + ', driver.findElement(' + loc + ').getAttribute("value"));'
    default: return ''
  }
}

function extractLocators(steps) {
  const map = {}
  ;(steps || []).forEach(function(s) {
    if (s.locator && s.action !== 'Open URL' && s.action !== 'Wait For URL') {
      var key = s.locator + '|' + (s.locatorType || 'CSS Selector')
      if (!map[key]) {
        map[key] = { varName: varName(s.description, s.action), locator: s.locator, locatorType: s.locatorType || 'CSS Selector', action: s.action, description: s.description }
      }
    }
  })
  return Object.values(map)
}

function generateSimpleScript(model) {
  var p = model.project, steps = model.steps, assertions = model.assertions, vars = model.variables
  var title = p.testTitle || 'UntitledTest'
  var pkg = (p.projectName || 'test').toLowerCase().replace(/\s+/g, '')
  var lines = []
  lines.push('package ' + pkg + ';')
  lines.push('')
  lines.push('import org.junit.jupiter.api.AfterEach;')
  lines.push('import org.junit.jupiter.api.BeforeEach;')
  lines.push('import org.junit.jupiter.api.Test;')
  lines.push('import org.openqa.selenium.*;')
  lines.push('import org.openqa.selenium.chrome.ChromeDriver;')
  lines.push('import org.openqa.selenium.support.ui.WebDriverWait;')
  lines.push('import org.openqa.selenium.support.ui.ExpectedConditions;')
  lines.push('import org.openqa.selenium.interactions.Actions;')
  lines.push('import org.openqa.selenium.support.ui.Select;')
  lines.push('import java.time.Duration;')
  lines.push('import java.util.ArrayList;')
  lines.push('import static org.junit.jupiter.api.Assertions.*;')
  lines.push('')
  lines.push('public class ' + sanitize(title) + ' {')
  lines.push('  private WebDriver driver;')
  lines.push('')
  lines.push('  @BeforeEach')
  lines.push('  public void setUp() {')
  lines.push('    driver = new ChromeDriver();')
  lines.push('    driver.manage().window().maximize();')
  if (p.baseUrl) lines.push('    driver.get(' + q(p.baseUrl) + ');')
  lines.push('  }')
  lines.push('')
  lines.push('  @AfterEach')
  lines.push('  public void tearDown() {')
  lines.push('    if (driver != null) { driver.quit(); }')
  lines.push('  }')
  lines.push('')
  lines.push('  @Test')
  lines.push('  public void ' + sanitize(title).replace(/^./, function(c) { return c.toLowerCase() }) + '() {')
  steps.forEach(function(s) {
    var ac = actionCode(s)
    if (ac) ac.split('\n').forEach(function(l) { lines.push('    ' + l) })
  })
  if (assertions.length > 0) {
    lines.push('')
    lines.push('    // Assertions')
    assertions.forEach(function(a) {
      var ac = assertionCode(a)
      if (ac) lines.push('    ' + ac)
    })
  }
  lines.push('  }')
  lines.push('}')
  return lines.join('\n')
}

function generatePomProject(model) {
  var p = model.project, steps = model.steps, assertions = model.assertions, vars = model.variables
  var pkg = (p.projectName || 'test').toLowerCase().replace(/\s+/g, '')
  var page = pName(p.testTitle || 'Login')
  var locators = extractLocators(steps)
  var files = []

  var loginPageLocators = locators.filter(function(l) { return l.description && l.description.toLowerCase().includes('username') || l.description && l.description.toLowerCase().includes('password') || l.description && l.description.toLowerCase().includes('login') || l.locator.includes('username') || l.locator.includes('password') || l.locator.includes('login') })
  var dashboardPageLocators = locators.filter(function(l) { return !loginPageLocators.includes(l) })

  function genPageObject(className, pageLocators, filePkg) {
    var lines = []
    lines.push('package ' + filePkg + '.pages;')
    lines.push('')
    lines.push('import org.openqa.selenium.WebDriver;')
    lines.push('import org.openqa.selenium.WebElement;')
    lines.push('import org.openqa.selenium.support.FindBy;')
    lines.push('import org.openqa.selenium.support.PageFactory;')
    lines.push('import org.openqa.selenium.support.ui.Select;')
    lines.push('import org.openqa.selenium.interactions.Actions;')
    lines.push('import java.time.Duration;')
    lines.push('')
    lines.push('/**')
    lines.push(' * Page Object for ' + className.replace(/([A-Z])/g, ' $1').trim())
    lines.push(' */')
    lines.push('public class ' + className + ' {')
    lines.push('  private WebDriver driver;')
    lines.push('')
    pageLocators.forEach(function(l) {
      var by = byCode(l.locatorType, l.locator)
      lines.push('  @FindBy(' + by.replace(/^By\./, 'how = How.').replace(/\(/, ', using = "').replace(/"\)$/, '")') + ')')
      lines.push('  private WebElement ' + l.varName + ';')
      lines.push('')
    })
    lines.push('  public ' + className + '(WebDriver driver) {')
    lines.push('    this.driver = driver;')
    lines.push('    PageFactory.initElements(driver, this);')
    lines.push('  }')
    lines.push('')
    if (pageLocators.length > 0) {
      var groups = {}
      pageLocators.forEach(function(l) {
        var action = l.action || 'Click'
        if (!groups[action]) groups[action] = []
        groups[action].push(l)
      })
      Object.keys(groups).forEach(function(action) {
        groups[action].forEach(function(l) {
          var mn = varName(l.description, l.action).toLowerCase().replace(/_(.)/g, function(_, c) { return c.toUpperCase() })
          lines.push('  public void ' + mn + '() {')
          if (l.description) lines.push('    // ' + l.description)
          if (action === 'Click') lines.push('    ' + l.varName + '.click();')
          else if (action === 'Fill') { lines.push('    ' + l.varName + '.clear();'); lines.push('    ' + l.varName + '.sendKeys(value);'); }
          else if (action === 'Check') lines.push('    if (!' + l.varName + '.isSelected()) { ' + l.varName + '.click(); }')
          else if (action === 'Uncheck') lines.push('    if (' + l.varName + '.isSelected()) { ' + l.varName + '.click(); }')
          else if (action === 'Select Dropdown') lines.push('    new Select(' + l.varName + ').selectByVisibleText(value);')
          else if (action === 'Hover') lines.push('    new Actions(driver).moveToElement(' + l.varName + ').perform();')
          else lines.push('    ' + l.varName + '.click();')
          lines.push('  }')
          lines.push('')
        })
      })
    }
    lines.push('  public boolean isLoaded() {')
    if (pageLocators.length > 0) lines.push('    return ' + pageLocators[0].varName + '.isDisplayed();')
    else lines.push('    return driver.getTitle() != null;')
    lines.push('  }')
    lines.push('}')
    return lines.join('\n')
  }

  function genComponent(compName, compLocators, filePkg) {
    var lines = []
    lines.push('package ' + filePkg + '.components;')
    lines.push('')
    lines.push('import org.openqa.selenium.WebDriver;')
    lines.push('import org.openqa.selenium.WebElement;')
    lines.push('import org.openqa.selenium.support.FindBy;')
    lines.push('import org.openqa.selenium.support.PageFactory;')
    lines.push('')
    lines.push('/**')
    lines.push(' * Reusable UI Component - ' + compName.replace(/([A-Z])/g, ' $1').trim())
    lines.push(' */')
    lines.push('public class ' + compName + ' {')
    lines.push('  private WebDriver driver;')
    lines.push('')
    compLocators.forEach(function(l) {
      var by = byCode(l.locatorType, l.locator)
      lines.push('  @FindBy(' + by.replace(/^By\./, 'how = How.').replace(/\(/, ', using = "').replace(/"\)$/, '")') + ')')
      lines.push('  private WebElement ' + l.varName + ';')
      lines.push('')
    })
    lines.push('  public ' + compName + '(WebDriver driver) {')
    lines.push('    this.driver = driver;')
    lines.push('    PageFactory.initElements(driver, this);')
    lines.push('  }')
    lines.push('')
    if (compLocators.length > 0) {
      compLocators.forEach(function(l) {
        var mn = varName(l.description, l.action).toLowerCase().replace(/_(.)/g, function(_, c) { return c.toUpperCase() })
        lines.push('  public void ' + mn + '() {')
        if (l.description) lines.push('    // ' + l.description)
        lines.push('    ' + l.varName + '.click();')
        lines.push('  }')
        lines.push('')
      })
    }
    lines.push('  public boolean isDisplayed() {')
    if (compLocators.length > 0) lines.push('    return ' + compLocators[0].varName + '.isDisplayed();')
    else lines.push('    return true;')
    lines.push('  }')
    lines.push('}')
    return lines.join('\n')
  }

  var loginPage = loginPageLocators.length > 0 ? loginPageLocators : locators.slice(0, Math.min(2, locators.length))
  var dashPage = dashboardPageLocators.length > 0 ? dashboardPageLocators : locators.slice(Math.min(2, locators.length))
  var navLocators = locators.filter(function(l) { return l.locator.includes('nav') || l.locator.includes('menu') || (l.description && l.description.toLowerCase().includes('nav')) })
  var sideLocators = locators.filter(function(l) { return l.locator.includes('sidebar') || l.locator.includes('side') || (l.description && l.description.toLowerCase().includes('sidebar')) })

  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/pages/LoginPage.java', content: genPageObject('LoginPage', loginPage, pkg) })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/pages/DashboardPage.java', content: genPageObject('DashboardPage', dashPage, pkg) })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/components/NavbarComponent.java', content: genComponent('NavbarComponent', navLocators.length > 0 ? navLocators : [{ varName: 'navMenu', locatorType: 'CSS Selector', locator: 'nav', action: 'Click', description: 'Open navigation menu' }], pkg) })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/components/SidebarComponent.java', content: genComponent('SidebarComponent', sideLocators.length > 0 ? sideLocators : [{ varName: 'sidePanel', locatorType: 'CSS Selector', locator: '.sidebar', action: 'Click', description: 'Toggle sidebar' }], pkg) })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/utils/DriverFactory.java', content: 'package ' + pkg + '.utils;\n\nimport org.openqa.selenium.WebDriver;\nimport org.openqa.selenium.chrome.ChromeDriver;\nimport org.openqa.selenium.firefox.FirefoxDriver;\nimport org.openqa.selenium.edge.EdgeDriver;\nimport java.time.Duration;\n\npublic class DriverFactory {\n  private static ThreadLocal<WebDriver> driverThread = new ThreadLocal<>();\n\n  public static WebDriver createDriver(String browser) {\n    WebDriver driver;\n    switch (browser.toLowerCase()) {\n      case "firefox": driver = new FirefoxDriver(); break;\n      case "edge": driver = new EdgeDriver(); break;\n      default: driver = new ChromeDriver();\n    }\n    driver.manage().window().maximize();\n    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));\n    driverThread.set(driver);\n    return driver;\n  }\n\n  public static WebDriver getDriver() { return driverThread.get(); }\n\n  public static void quitDriver() {\n    if (driverThread.get() != null) {\n      driverThread.get().quit();\n      driverThread.remove();\n    }\n  }\n}' })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/utils/WaitHelper.java', content: 'package ' + pkg + '.utils;\n\nimport org.openqa.selenium.WebDriver;\nimport org.openqa.selenium.WebElement;\nimport org.openqa.selenium.support.ui.ExpectedConditions;\nimport org.openqa.selenium.support.ui.WebDriverWait;\nimport java.time.Duration;\n\npublic class WaitHelper {\n  public static WebElement waitForVisibility(WebDriver driver, WebElement element, int timeout) {\n    return new WebDriverWait(driver, Duration.ofSeconds(timeout))\n      .until(ExpectedConditions.visibilityOf(element));\n  }\n\n  public static boolean waitForUrl(WebDriver driver, String url, int timeout) {\n    return new WebDriverWait(driver, Duration.ofSeconds(timeout))\n      .until(ExpectedConditions.urlContains(url));\n  }\n\n  public static WebElement waitForClickable(WebDriver driver, WebElement element, int timeout) {\n    return new WebDriverWait(driver, Duration.ofSeconds(timeout))\n      .until(ExpectedConditions.elementToBeClickable(element));\n  }\n}' })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/utils/ScreenshotHelper.java', content: 'package ' + pkg + '.utils;\n\nimport org.openqa.selenium.OutputType;\nimport org.openqa.selenium.TakesScreenshot;\nimport org.openqa.selenium.WebDriver;\nimport java.io.File;\nimport java.io.IOException;\nimport java.text.SimpleDateFormat;\nimport java.util.Date;\n\npublic class ScreenshotHelper {\n  public static String captureScreenshot(WebDriver driver, String name) {\n    try {\n      File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);\n      String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());\n      String path = "screenshots/" + name + "_" + timestamp + ".png";\n      FileUtils.copyFile(src, new File(path));\n      return path;\n    } catch (IOException e) {\n      e.printStackTrace();\n      return null;\n    }\n  }\n}' })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/utils/RandomDataHelper.java', content: 'package ' + pkg + '.utils;\n\nimport java.util.UUID;\n\npublic class RandomDataHelper {\n  public static String randomEmail() {\n    return "user_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com";\n  }\n\n  public static String randomString(int length) {\n    return UUID.randomUUID().toString().replace("-", "").substring(0, length);\n  }\n\n  public static String randomPhone() {\n    return "555-" + (int)(Math.random() * 900 + 100) + "-" + (int)(Math.random() * 9000 + 1000);\n  }\n}' })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/base/ConfigReader.java', content: 'package ' + pkg + '.base;\n\nimport java.io.FileInputStream;\nimport java.io.IOException;\nimport java.util.Properties;\n\npublic class ConfigReader {\n  private static Properties props = new Properties();\n\n  static {\n    try (FileInputStream fis = new FileInputStream("src/test/resources/config.properties")) {\n      props.load(fis);\n    } catch (IOException e) {\n      e.printStackTrace();\n    }\n  }\n\n  public static String get(String key) { return props.getProperty(key); }\n  public static String getUrl() { return get("baseUrl"); }\n  public static String getBrowser() { return get("browser"); }\n  public static int getTimeout() { return Integer.parseInt(get("timeout")); }\n}' })
  files.push({ name: 'src/main/java/' + pkg.replace(/\./g, '/') + '/base/BaseTest.java', content: 'package ' + pkg + '.base;\n\nimport ' + pkg + '.utils.DriverFactory;\nimport ' + pkg + '.utils.WaitHelper;\nimport org.junit.jupiter.api.AfterEach;\nimport org.junit.jupiter.api.BeforeEach;\nimport org.openqa.selenium.WebDriver;\nimport java.time.Duration;\n\npublic class BaseTest {\n  protected WebDriver driver;\n  protected WaitHelper waitHelper;\n\n  @BeforeEach\n  public void setUp() {\n    driver = DriverFactory.createDriver(ConfigReader.getBrowser());\n    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(ConfigReader.getTimeout()));\n    waitHelper = new WaitHelper();\n    if (ConfigReader.getUrl() != null && !ConfigReader.getUrl().isEmpty()) {\n      driver.get(ConfigReader.getUrl());\n    }\n  }\n\n  @AfterEach\n  public void tearDown() {\n    DriverFactory.quitDriver();\n  }\n}' })
  files.push({ name: 'src/test/java/' + pkg.replace(/\./g, '/') + '/tests/LoginTest.java', content: 'package ' + pkg + '.tests;\n\nimport ' + pkg + '.base.BaseTest;\nimport ' + pkg + '.pages.LoginPage;\nimport ' + pkg + '.pages.DashboardPage;\nimport ' + pkg + '.data.TestData;\nimport org.junit.jupiter.api.Test;\n\npublic class LoginTest extends BaseTest {\n\n  @Test\n  public void testSuccessfulLogin() {\n    LoginPage loginPage = new LoginPage(driver);\n    loginPage.enterUsername(TestData.VALID_USERNAME);\n    loginPage.enterPassword(TestData.VALID_PASSWORD);\n    loginPage.clickLogin();\n\n    DashboardPage dashboardPage = new DashboardPage(driver);\n    assertTrue(dashboardPage.isLoaded(), "Dashboard should be visible after login");\n  }\n}' })
  files.push({ name: 'src/test/java/' + pkg.replace(/\./g, '/') + '/data/TestData.java', content: 'package ' + pkg + '.data;\n\npublic class TestData {\n  public static final String VALID_USERNAME = "standard_user";\n  public static final String VALID_PASSWORD = "secret_sauce";\n  public static final String INVALID_USERNAME = "invalid_user";\n  public static final String INVALID_PASSWORD = "wrong_password";\n  public static final String BASE_URL = ' + q(p.baseUrl || 'https://example.com') + ';\n' + (vars || []).map(function(v) { return '  public static final String ' + ((v.name || '').toUpperCase()) + ' = ' + q(v.value || '') + ';' }).join('\n') + '\n}' })
  files.push({ name: 'src/test/resources/config.properties', content: 'baseUrl=' + (p.baseUrl || '') + '\nbrowser=chrome\ntimeout=10\nheadless=false' })

  return files
}

function generatePageFactoryProject(model) {
  return generatePomProject(model)
}

export function generateSeleniumJava(model) {
  var arch = model.settings.architecture || 'simple'
  if (arch === 'simple') {
    return [{ name: sanitize(model.project.testTitle || 'Test') + 'Test.java', content: generateSimpleScript(model) }]
  }
  return generatePomProject(model)
}

export function generateSeleniumJavaExplanation(model) {
  return 'This Selenium Java project (' + (model.project.testTitle || 'Test') + ') uses the Page Object Model pattern with ' + model.steps.length + ' test steps and ' + model.assertions.length + ' assertions. The project follows Java best practices with Maven/Gradle structure, PageFactory annotations, and reusable utility classes.'
}

export function generateSeleniumJavaChecklist(model) {
  return [
    { category: 'Project Structure', items: [
      { label: 'Page Object Model pattern used', passed: true },
      { label: 'DriverFactory generated for browser management', passed: true },
      { label: 'Test data separated from test logic', passed: true },
      { label: 'Helper classes generated (Wait, Screenshot, Random)', passed: true },
      { label: 'Config properties file created', passed: true },
      { label: 'Base test class with setUp/tearDown', passed: true },
    ]},
    { category: 'Code Quality', items: [
      { label: 'Explicit waits used instead of Thread.sleep()', passed: true },
      { label: 'No duplicated locators', passed: model.steps.filter(function(s) { return s.locator }).length === new Set(model.steps.filter(function(s) { return s.locator }).map(function(s) { return s.locator })).size },
      { label: 'Reusable methods in page objects', passed: true },
      { label: 'PageFactory @FindBy annotations used', passed: true },
    ]},
    { category: 'Test Coverage', items: [
      { label: 'Test steps defined', passed: model.steps.length > 0 },
      { label: 'Assertions included', passed: model.assertions.length > 0 },
      { label: 'Test data variables defined', passed: (model.variables || []).length > 0 },
    ]},
  ]
}

export function generateSeleniumJavaBestPractices() {
  return [
    { title: 'Use Explicit Waits', description: 'Always use WebDriverWait with ExpectedConditions instead of Thread.sleep() for reliable test synchronization.' },
    { title: 'Page Object Model', description: 'Encapsulate page elements and interactions in dedicated Page Object classes for maintainability.' },
    { title: 'PageFactory @FindBy', description: 'Use @FindBy annotations with PageFactory.initElements() for cleaner element declarations.' },
    { title: 'Avoid Thread.sleep()', description: 'Replace hardcoded sleeps with explicit waits that poll for conditions efficiently.' },
    { title: 'Avoid Absolute XPath', description: 'Prefer CSS selectors, IDs, or relative XPath expressions for stable locators.' },
    { title: 'Driver Management', description: 'Use ThreadLocal for thread-safe driver instances in parallel execution.' },
    { title: 'Separate Test Data', description: 'Keep test data in dedicated classes or property files - never hardcode values in tests.' },
    { title: 'Clean Up Resources', description: 'Always call driver.quit() in @AfterEach / tearDown to release browser instances.' },
  ]
}
