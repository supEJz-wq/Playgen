import { generateSeleniumScript } from './seleniumGenerator'
import { formatSeleniumLocator } from '../constants/seleniumLocators'

function sanitizeName(name) {
  return (name || 'Test')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

function extractUniqueLocators(steps) {
  const map = {}
  ;(steps || []).forEach((s) => {
    if (s.locator) {
      const key = s.locator + '|' + (s.locatorType || 'CSS Selector')
      if (!map[key]) {
        const label = s.description
          ? s.description.replace(/^(enter|click|type|select|check|uncheck|hover)\s+/i, '').trim()
          : s.action + '_' + (s.locatorType || 'CSS')
        const varName = label
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .toLowerCase()
        map[key] = { varName: varName || 'element', locator: s.locator, locatorType: s.locatorType || 'CSS Selector' }
      }
    }
  })
  return Object.values(map)
}

function langExtension(language) {
  switch (language) {
    case 'Java': return '.java'
    case 'JavaScript': return '.js'
    case 'Python': return '.py'
    case 'C#': return '.cs'
    default: return '.java'
  }
}

function generateJavaPageObject(config) {
  const { projectInfo, steps, settings } = config
  const ext = langExtension(settings?.language || 'Java')
  const name = sanitizeName(projectInfo?.testTitle || 'Test') + 'Page'
  const locators = extractUniqueLocators(steps)
  const pkg = projectInfo?.projectName
    ? projectInfo.projectName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'seleniumtest'

  const lines = []
  lines.push(`package ${pkg}.pages;`)
  lines.push('')
  lines.push('import org.openqa.selenium.*;')
  lines.push('import org.openqa.selenium.support.*;')
  lines.push('import org.openqa.selenium.support.ui.*;')
  lines.push('import org.openqa.selenium.interactions.Actions;')
  lines.push('import java.time.Duration;')
  lines.push('')

  lines.push(`public class ${name} {`)
  lines.push('')
  lines.push('    private WebDriver driver;')
  lines.push('    private WebDriverWait wait;')
  lines.push('')

  lines.push('    public ' + name + '(WebDriver driver) {')
  lines.push('        this.driver = driver;')
  lines.push('        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));')
  lines.push('        PageFactory.initElements(driver, this);')
  lines.push('    }')
  lines.push('')

  locators.forEach((loc) => {
    const byCode = formatSeleniumLocator(loc.locatorType, loc.locator, 'Java')
    lines.push(`    private By ${loc.varName}Locator = ${byCode};`)
  })
  lines.push('')

  const seenActions = new Set()
  ;(steps || []).forEach((step) => {
    if (['Open URL', 'Refresh', 'Back', 'Forward', 'Close Browser', 'Quit Driver',
      'Take Screenshot', 'Full Page Screenshot',
      'HTTP GET', 'HTTP POST', 'HTTP PUT', 'HTTP DELETE',
      'Open New Window', 'Switch Window', 'Close Window',
      'Default Content', 'Parent Frame',
    ].includes(step.action)) return

    const desc = step.description || `${step.action}_${step.locator || ''}`
    if (seenActions.has(desc)) return
    seenActions.add(desc)

    const methodName = desc
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (c) => c.toLowerCase()) || 'doAction'

    const comment = step.description ? `    // ${step.description}` : ''

    lines.push(comment)
    switch (step.action) {
      case 'Click':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        driver.findElement(${methodName}Locator).click();`)
        lines.push('    }')
        break
      case 'Type Text':
        lines.push(`    public void ${methodName}(String value) {`)
        lines.push(`        driver.findElement(${methodName}Locator).sendKeys(value);`)
        lines.push('    }')
        break
      case 'Clear':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        driver.findElement(${methodName}Locator).clear();`)
        lines.push('    }')
        break
      case 'Get Text':
        lines.push(`    public String ${methodName}() {`)
        lines.push(`        return driver.findElement(${methodName}Locator).getText();`)
        lines.push('    }')
        break
      case 'Hover':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        new Actions(driver).moveToElement(driver.findElement(${methodName}Locator)).perform();`)
        lines.push('    }')
        break
      case 'Select By Text':
        lines.push(`    public void ${methodName}(String value) {`)
        lines.push(`        new Select(driver.findElement(${methodName}Locator)).selectByVisibleText(value);`)
        lines.push('    }')
        break
      case 'Select By Value':
        lines.push(`    public void ${methodName}(String value) {`)
        lines.push(`        new Select(driver.findElement(${methodName}Locator)).selectByValue(value);`)
        lines.push('    }')
        break
      case 'Select By Index':
        lines.push(`    public void ${methodName}(int index) {`)
        lines.push(`        new Select(driver.findElement(${methodName}Locator)).selectByIndex(index);`)
        lines.push('    }')
        break
      case 'Check':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        if (!driver.findElement(${methodName}Locator).isSelected()) {`)
        lines.push(`            driver.findElement(${methodName}Locator).click();`)
        lines.push('        }')
        lines.push('    }')
        break
      case 'Uncheck':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        if (driver.findElement(${methodName}Locator).isSelected()) {`)
        lines.push(`            driver.findElement(${methodName}Locator).click();`)
        lines.push('        }')
        lines.push('    }')
        break
      case 'Double Click':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        new Actions(driver).doubleClick(driver.findElement(${methodName}Locator)).perform();`)
        lines.push('    }')
        break
      case 'Right Click':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        new Actions(driver).contextClick(driver.findElement(${methodName}Locator)).perform();`)
        lines.push('    }')
        break
      case 'Wait Until Visible':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        wait.until(ExpectedConditions.visibilityOfElementLocated(${methodName}Locator));`)
        lines.push('    }')
        break
      case 'Wait Until Clickable':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        wait.until(ExpectedConditions.elementToBeClickable(${methodName}Locator));`)
        lines.push('    }')
        break
      case 'Wait Until Present':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        wait.until(ExpectedConditions.presenceOfElementLocated(${methodName}Locator));`)
        lines.push('    }')
        break
      case 'Scroll To Element':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(${methodName}Locator));`)
        lines.push('    }')
        break
      case 'Click Using JavaScript':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(${methodName}Locator));`)
        lines.push('    }')
        break
      case 'Highlight Element':
        lines.push(`    public void ${methodName}() {`)
        lines.push(`        ((JavascriptExecutor) driver).executeScript("arguments[0].style.border='3px solid red'", driver.findElement(${methodName}Locator));`)
        lines.push('    }')
        break
      default:
        lines.push(`    // TODO: implement ${step.action} for ${step.description || step.locator}`)
    }
    lines.push('')
  })

  lines.push('}')
  lines.push('')

  return { name, code: lines.join('\n'), ext }
}

function generateDriverFactory(config) {
  const lang = config?.settings?.language || 'Java'
  const browser = config?.settings?.browser || 'Chrome'
  const mode = config?.settings?.execution || 'Local'

  switch (lang) {
    case 'Java': {
      const lines = []
      lines.push('package driver;')
      lines.push('')
      lines.push('import org.openqa.selenium.WebDriver;')
      lines.push('import org.openqa.selenium.chrome.ChromeDriver;')
      lines.push('import org.openqa.selenium.chrome.ChromeOptions;')
      lines.push('import org.openqa.selenium.firefox.FirefoxDriver;')
      lines.push('import org.openqa.selenium.firefox.FirefoxOptions;')
      lines.push('import org.openqa.selenium.edge.EdgeDriver;')
      lines.push('import org.openqa.selenium.edge.EdgeOptions;')
      lines.push('import io.github.bonigarcia.wdm.WebDriverManager;')
      lines.push('import java.time.Duration;')
      lines.push('')

      lines.push('public class DriverFactory {')
      lines.push('')
      lines.push('    private static WebDriver driver;')
      lines.push('')
      lines.push('    public static WebDriver getDriver() {')
      lines.push('        if (driver == null) {')
      lines.push(`            driver = createDriver("${browser}");`)
      lines.push('        }')
      lines.push('        return driver;')
      lines.push('    }')
      lines.push('')
      lines.push('    public static WebDriver createDriver(String browser) {')
      lines.push('        switch (browser.toLowerCase()) {')
      lines.push('            case "chrome":')
      lines.push('                WebDriverManager.chromedriver().setup();')
      lines.push('                ChromeOptions chromeOptions = new ChromeOptions();')
      if (mode === 'Headless') lines.push('                chromeOptions.addArguments("--headless");')
      lines.push('                driver = new ChromeDriver(chromeOptions);')
      lines.push('                break;')
      lines.push('            case "firefox":')
      lines.push('                WebDriverManager.firefoxdriver().setup();')
      lines.push('                FirefoxOptions firefoxOptions = new FirefoxOptions();')
      lines.push('                driver = new FirefoxDriver(firefoxOptions);')
      lines.push('                break;')
      lines.push('            case "edge":')
      lines.push('                WebDriverManager.edgedriver().setup();')
      lines.push('                EdgeOptions edgeOptions = new EdgeOptions();')
      lines.push('                driver = new EdgeDriver(edgeOptions);')
      lines.push('                break;')
      lines.push('            default:')
      lines.push('                throw new IllegalArgumentException("Browser not supported: " + browser);')
      lines.push('        }')
      lines.push('        driver.manage().window().maximize();')
      lines.push('        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));')
      lines.push('        return driver;')
      lines.push('    }')
      lines.push('')
      lines.push('    public static void quitDriver() {')
      lines.push('        if (driver != null) {')
      lines.push('            driver.quit();')
      lines.push('            driver = null;')
      lines.push('        }')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return { name: 'DriverFactory.java', path: 'base/DriverFactory.java', content: lines.join('\n') }
    }
    case 'JavaScript': {
      const lines = []
      lines.push('const { Builder } = require("selenium-webdriver");')
      lines.push('')
      lines.push('class DriverFactory {')
      lines.push('  constructor() {')
      lines.push('    this.driver = null;')
      lines.push('  }')
      lines.push('')
      lines.push(`  async createDriver(browser = "${browser.toLowerCase()}") {`)
      lines.push('    this.driver = await new Builder().forBrowser(browser).build();')
      lines.push('    await this.driver.manage().window().maximize();')
      lines.push('    return this.driver;')
      lines.push('  }')
      lines.push('')
      lines.push('  async quitDriver() {')
      lines.push('    if (this.driver) {')
      lines.push('      await this.driver.quit();')
      lines.push('      this.driver = null;')
      lines.push('    }')
      lines.push('  }')
      lines.push('}')
      lines.push('')
      lines.push('module.exports = { DriverFactory };')
      lines.push('')

      return { name: 'DriverFactory.js', path: 'utils/DriverFactory.js', content: lines.join('\n') }
    }
    case 'Python': {
      const lines = []
      lines.push('from selenium import webdriver')
      lines.push('')
      lines.push('class DriverFactory:')
      lines.push('    _driver = None')
      lines.push('')
      lines.push('    @classmethod')
      lines.push('    def get_driver(cls, browser="chrome"):')
      lines.push('        if cls._driver is None:')
      lines.push('            cls._driver = cls.create_driver(browser)')
      lines.push('        return cls._driver')
      lines.push('')
      lines.push('    @classmethod')
      lines.push('    def create_driver(cls, browser="chrome"):')
      lines.push('        if browser == "chrome":')
      lines.push('            options = webdriver.ChromeOptions()')
      if (mode === 'Headless') lines.push('            options.add_argument("--headless")')
      lines.push('            driver = webdriver.Chrome(options=options)')
      lines.push('        elif browser == "firefox":')
      lines.push('            driver = webdriver.Firefox()')
      lines.push('        elif browser == "edge":')
      lines.push('            driver = webdriver.Edge()')
      lines.push('        else:')
      lines.push('            raise ValueError(f"Browser not supported: {browser}")')
      lines.push('        driver.maximize_window()')
      lines.push('        return driver')
      lines.push('')
      lines.push('    @classmethod')
      lines.push('    def quit_driver(cls):')
      lines.push('        if cls._driver:')
      lines.push('            cls._driver.quit()')
      lines.push('            cls._driver = None')
      lines.push('')
      lines.push('')

      return { name: 'driver_factory.py', path: 'utils/driver_factory.py', content: lines.join('\n') }
    }
    case 'C#': {
      const lines = []
      lines.push('using OpenQA.Selenium;')
      lines.push('using OpenQA.Selenium.Chrome;')
      lines.push('using OpenQA.Selenium.Firefox;')
      lines.push('using OpenQA.Selenium.Edge;')
      lines.push('using System;')
      lines.push('')

      lines.push('namespace Driver')
      lines.push('{')
      lines.push('    public static class DriverFactory')
      lines.push('    {')
      lines.push('        private static IWebDriver driver;')
      lines.push('')
      lines.push('        public static IWebDriver GetDriver()')
      lines.push('        {')
      lines.push('            if (driver == null)')
      lines.push('            {')
      lines.push(`                driver = CreateDriver("${browser}");`)
      lines.push('            }')
      lines.push('            return driver;')
      lines.push('        }')
      lines.push('')
      lines.push('        public static IWebDriver CreateDriver(string browser)')
      lines.push('        {')
      lines.push('            switch (browser.ToLower())')
      lines.push('            {')
      lines.push('                case "chrome":')
      lines.push('                    driver = new ChromeDriver();')
      lines.push('                    break;')
      lines.push('                case "firefox":')
      lines.push('                    driver = new FirefoxDriver();')
      lines.push('                    break;')
      lines.push('                case "edge":')
      lines.push('                    driver = new EdgeDriver();')
      lines.push('                    break;')
      lines.push('                default:')
      lines.push('                    throw new ArgumentException($"Browser not supported: {browser}");')
      lines.push('            }')
      lines.push('            driver.Manage().Window.Maximize();')
      lines.push('            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);')
      lines.push('            return driver;')
      lines.push('        }')
      lines.push('')
      lines.push('        public static void QuitDriver()')
      lines.push('        {')
      lines.push('            if (driver != null)')
      lines.push('            {')
      lines.push('                driver.Quit();')
      lines.push('                driver = null;')
      lines.push('            }')
      lines.push('        }')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return { name: 'DriverFactory.cs', path: 'base/DriverFactory.cs', content: lines.join('\n') }
    }
    default:
      return { name: 'DriverFactory.java', path: 'base/DriverFactory.java', content: '' }
  }
}

function generateBaseTest(config) {
  const lang = config?.settings?.language || 'Java'
  const browser = config?.settings?.browser || 'Chrome'
  const mode = config?.settings?.execution || 'Local'
  const framework = config?.settings?.framework || 'JUnit'
  const baseUrl = config?.projectInfo?.baseUrl || 'https://example.com'
  const pkg = config?.projectInfo?.projectName
    ? config.projectInfo.projectName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'seleniumtest'

  switch (lang) {
    case 'Java': {
      const lines = []
      lines.push(`package ${pkg}.base;`)
      lines.push('')
      lines.push('import org.openqa.selenium.WebDriver;')
      lines.push(`import ${pkg}.driver.DriverFactory;`)
      if (framework === 'TestNG') {
        lines.push('import org.testng.annotations.AfterMethod;')
        lines.push('import org.testng.annotations.BeforeMethod;')
      } else {
        lines.push('import org.junit.After;')
        lines.push('import org.junit.Before;')
      }
      lines.push('')

      lines.push('public class BaseTest {')
      lines.push('')
      lines.push('    protected WebDriver driver;')
      lines.push('')

      if (framework === 'TestNG') {
        lines.push('    @BeforeMethod')
      } else {
        lines.push('    @Before')
      }
      lines.push('    public void setUp() {')
      lines.push(`        driver = DriverFactory.createDriver("${browser}");`)
      if (baseUrl) {
        lines.push(`        driver.get("${baseUrl}");`)
      }
      lines.push('    }')
      lines.push('')

      if (framework === 'TestNG') {
        lines.push('    @AfterMethod')
      } else {
        lines.push('    @After')
      }
      lines.push('    public void tearDown() {')
      lines.push('        DriverFactory.quitDriver();')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return { name: 'BaseTest.java', path: 'base/BaseTest.java', content: lines.join('\n') }
    }
    case 'JavaScript': {
      const lines = []
      lines.push('const { DriverFactory } = require("../utils/DriverFactory");')
      lines.push('')

      lines.push('class BaseTest {')
      lines.push('  constructor() {')
      lines.push('    this.driverFactory = new DriverFactory();')
      lines.push('    this.driver = null;')
      lines.push('  }')
      lines.push('')
      lines.push('  async before() {')
      lines.push(`    this.driver = await this.driverFactory.createDriver("${browser.toLowerCase()}");`)
      if (baseUrl) {
        lines.push(`    await this.driver.get("${baseUrl}");`)
      }
      lines.push('  }')
      lines.push('')
      lines.push('  async after() {')
      lines.push('    await this.driverFactory.quitDriver();')
      lines.push('  }')
      lines.push('}')
      lines.push('')
      lines.push('module.exports = { BaseTest };')
      lines.push('')

      return { name: 'BaseTest.js', path: 'base/BaseTest.js', content: lines.join('\n') }
    }
    case 'Python': {
      const lines = []
      lines.push('import pytest')
      lines.push('from utils.driver_factory import DriverFactory')
      lines.push('')

      lines.push('class BaseTest:')
      lines.push('    @pytest.fixture(autouse=True)')
      lines.push('    def setup_method(self):')
      lines.push(`        self.driver = DriverFactory.create_driver("${browser.toLowerCase()}")`)
      if (baseUrl) {
        lines.push(`        self.driver.get("${baseUrl}")`)
      }
      lines.push('        yield')
      lines.push('        DriverFactory.quit_driver()')
      lines.push('')

      return { name: 'base_test.py', path: 'base/base_test.py', content: lines.join('\n') }
    }
    case 'C#': {
      const lines = []
      lines.push('using NUnit.Framework;')
      lines.push('using OpenQA.Selenium;')
      lines.push('using Driver;')
      lines.push('')

      lines.push('namespace Tests.Base')
      lines.push('{')
      lines.push('    [TestFixture]')
      lines.push('    public class BaseTest')
      lines.push('    {')
      lines.push('        protected IWebDriver driver;')
      lines.push('')
      lines.push('        [SetUp]')
      lines.push('        public void SetUp()')
      lines.push('        {')
      lines.push(`            driver = DriverFactory.CreateDriver("${browser}");`)
      if (baseUrl) {
        lines.push(`            driver.Navigate().GoToUrl("${baseUrl}");`)
      }
      lines.push('        }')
      lines.push('')
      lines.push('        [TearDown]')
      lines.push('        public void TearDown()')
      lines.push('        {')
      lines.push('            DriverFactory.QuitDriver();')
      lines.push('        }')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return { name: 'BaseTest.cs', path: 'base/BaseTest.cs', content: lines.join('\n') }
    }
    default:
      return { name: 'BaseTest.java', path: 'base/BaseTest.java', content: '' }
  }
}

function generateWaitHelper(config) {
  const lang = config?.settings?.language || 'Java'

  switch (lang) {
    case 'Java': {
      const lines = []
      lines.push('package utils;')
      lines.push('')
      lines.push('import org.openqa.selenium.*;')
      lines.push('import org.openqa.selenium.support.ui.*;')
      lines.push('import java.time.Duration;')
      lines.push('')

      lines.push('public class WaitHelper {')
      lines.push('')
      lines.push('    private WebDriver driver;')
      lines.push('    private WebDriverWait wait;')
      lines.push('')
      lines.push('    public WaitHelper(WebDriver driver) {')
      lines.push('        this.driver = driver;')
      lines.push('        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));')
      lines.push('    }')
      lines.push('')
      lines.push('    public void waitForElementVisible(By locator) {')
      lines.push('        wait.until(ExpectedConditions.visibilityOfElementLocated(locator));')
      lines.push('    }')
      lines.push('')
      lines.push('    public void waitForElementClickable(By locator) {')
      lines.push('        wait.until(ExpectedConditions.elementToBeClickable(locator));')
      lines.push('    }')
      lines.push('')
      lines.push('    public void waitForElementPresent(By locator) {')
      lines.push('        wait.until(ExpectedConditions.presenceOfElementLocated(locator));')
      lines.push('    }')
      lines.push('')
      lines.push('    public boolean waitForTextPresent(By locator, String text) {')
      lines.push('        return wait.until(ExpectedConditions.textToBePresentInElementLocated(locator, text));')
      lines.push('    }')
      lines.push('')
      lines.push('    public void waitForPageLoad() {')
      lines.push('        wait.until(driver -> ((JavascriptExecutor) driver)')
      lines.push('            .executeScript("return document.readyState").equals("complete"));')
      lines.push('    }')
      lines.push('}')

      return { name: 'WaitHelper.java', path: 'utils/WaitHelper.java', content: lines.join('\n') }
    }
    case 'JavaScript': {
      const lines = []
      lines.push('const { until } = require("selenium-webdriver");')
      lines.push('')
      lines.push('class WaitHelper {')
      lines.push('  constructor(driver, timeout = 10000) {')
      lines.push('    this.driver = driver;')
      lines.push('    this.timeout = timeout;')
      lines.push('  }')
      lines.push('')
      lines.push('  async waitForVisible(locator) {')
      lines.push('    await this.driver.wait(until.elementLocated(locator), this.timeout);')
      lines.push('  }')
      lines.push('')
      lines.push('  async waitForElement(locator) {')
      lines.push('    await this.driver.wait(until.elementLocated(locator), this.timeout);')
      lines.push('  }')
      lines.push('')
      lines.push('  async waitForPageLoad() {')
      lines.push('    await this.driver.executeScript("return document.readyState === \'complete\'");')
      lines.push('  }')
      lines.push('}')
      lines.push('')
      lines.push('module.exports = { WaitHelper };')

      return { name: 'WaitHelper.js', path: 'utils/WaitHelper.js', content: lines.join('\n') }
    }
    case 'Python': {
      const lines = []
      lines.push('from selenium.webdriver.support.ui import WebDriverWait')
      lines.push('from selenium.webdriver.support import expected_conditions as EC')
      lines.push('')
      lines.push('class WaitHelper:')
      lines.push('    def __init__(self, driver, timeout=10):')
      lines.push('        self.driver = driver')
      lines.push('        self.wait = WebDriverWait(driver, timeout)')
      lines.push('')
      lines.push('    def wait_for_visible(self, locator):')
      lines.push('        return self.wait.until(EC.visibility_of_element_located(locator))')
      lines.push('')
      lines.push('    def wait_for_clickable(self, locator):')
      lines.push('        return self.wait.until(EC.element_to_be_clickable(locator))')
      lines.push('')
      lines.push('    def wait_for_present(self, locator):')
      lines.push('        return self.wait.until(EC.presence_of_element_located(locator))')
      lines.push('')
      lines.push('    def wait_for_page_load(self):')
      lines.push('        self.driver.execute_script("return document.readyState === \'complete\'")')
      lines.push('')

      return { name: 'wait_helper.py', path: 'utils/wait_helper.py', content: lines.join('\n') }
    }
    case 'C#': {
      const lines = []
      lines.push('using OpenQA.Selenium;')
      lines.push('using OpenQA.Selenium.Support.UI;')
      lines.push('using SeleniumExtras.WaitHelpers;')
      lines.push('using System;')
      lines.push('')
      lines.push('namespace Utils')
      lines.push('{')
      lines.push('    public class WaitHelper')
      lines.push('    {')
      lines.push('        private readonly IWebDriver driver;')
      lines.push('        private readonly WebDriverWait wait;')
      lines.push('')
      lines.push('        public WaitHelper(IWebDriver driver)')
      lines.push('        {')
      lines.push('            this.driver = driver;')
      lines.push('            this.wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));')
      lines.push('        }')
      lines.push('')
      lines.push('        public IWebElement WaitForVisible(By locator)')
      lines.push('        {')
      lines.push('            return wait.Until(ExpectedConditions.ElementIsVisible(locator));')
      lines.push('        }')
      lines.push('')
      lines.push('        public IWebElement WaitForClickable(By locator)')
      lines.push('        {')
      lines.push('            return wait.Until(ExpectedConditions.ElementToBeClickable(locator));')
      lines.push('        }')
      lines.push('')
      lines.push('        public IWebElement WaitForExists(By locator)')
      lines.push('        {')
      lines.push('            return wait.Until(ExpectedConditions.ElementExists(locator));')
      lines.push('        }')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return { name: 'WaitHelper.cs', path: 'utils/WaitHelper.cs', content: lines.join('\n') }
    }
    default:
      return { name: 'WaitHelper.java', path: 'utils/WaitHelper.java', content: '' }
  }
}

function generateScreenshotHelper(config) {
  const lang = config?.settings?.language || 'Java'

  switch (lang) {
    case 'Java': {
      const lines = []
      lines.push('package utils;')
      lines.push('')
      lines.push('import org.openqa.selenium.*;')
      lines.push('import java.io.File;')
      lines.push('import org.apache.commons.io.FileUtils;')
      lines.push('import java.time.LocalDateTime;')
      lines.push('import java.time.format.DateTimeFormatter;')
      lines.push('')

      lines.push('public class ScreenshotHelper {')
      lines.push('')
      lines.push('    private WebDriver driver;')
      lines.push('')
      lines.push('    public ScreenshotHelper(WebDriver driver) {')
      lines.push('        this.driver = driver;')
      lines.push('    }')
      lines.push('')
      lines.push('    public String captureScreenshot(String testName) {')
      lines.push('        try {')
      lines.push('            File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);')
      lines.push('            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));')
      lines.push('            String path = "screenshots/" + testName + "_" + timestamp + ".png";')
      lines.push('            FileUtils.copyFile(src, new File(path));')
      lines.push('            return path;')
      lines.push('        } catch (Exception e) {')
      lines.push('            e.printStackTrace();')
      lines.push('            return null;')
      lines.push('        }')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return { name: 'ScreenshotHelper.java', path: 'utils/ScreenshotHelper.java', content: lines.join('\n') }
    }
    default: {
      return { name: 'screenshot_helper.py', path: 'utils/screenshot_helper.py', content: '# Screenshot helper\nimport os\n\ndef capture_screenshot(driver, name):\n    path = f"screenshots/{name}.png"\n    os.makedirs("screenshots", exist_ok=True)\n    driver.save_screenshot(path)\n    return path\n' }
    }
  }
}

function generateConfigFile(config) {
  const lang = config?.settings?.language || 'Java'
  const browser = config?.settings?.browser || 'Chrome'
  const baseUrl = config?.projectInfo?.baseUrl || 'https://example.com'

  const lines = []
  lines.push('# Selenium Test Configuration')
  lines.push('# Auto-generated by PlayGen')
  lines.push('')
  lines.push(`browser=${browser}`)
  lines.push(`baseUrl=${baseUrl}`)
  lines.push('timeout=10')
  lines.push('implicitWait=10')
  lines.push('pageLoadTimeout=30')
  lines.push('headless=false')
  lines.push('remoteUrl=http://localhost:4444/wd/hub')
  lines.push('')
  lines.push('# Reporting')
  lines.push('reportFormat=allure')
  lines.push('screenshotOnFailure=true')

  return { name: 'config.properties', path: 'config/config.properties', content: lines.join('\n') }
}

function generateRandomDataHelper(config) {
  const lang = config?.settings?.language || 'Java'

  switch (lang) {
    case 'Java': {
      const lines = []
      lines.push('package utils;')
      lines.push('')
      lines.push('import java.util.UUID;')
      lines.push('')
      lines.push('public class RandomDataHelper {')
      lines.push('')
      lines.push('    public static String randomEmail() {')
      lines.push('        return "test_" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";')
      lines.push('    }')
      lines.push('')
      lines.push('    public static String randomString(int length) {')
      lines.push('        return UUID.randomUUID().toString().substring(0, Math.min(length, 36));')
      lines.push('    }')
      lines.push('')
      lines.push('    public static int randomInt(int min, int max) {')
      lines.push('        return (int) (Math.random() * (max - min + 1)) + min;')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return { name: 'RandomDataHelper.java', path: 'utils/RandomDataHelper.java', content: lines.join('\n') }
    }
    case 'JavaScript': {
      const lines = []
      lines.push('const { v4: uuidv4 } = require("uuid");')
      lines.push('')
      lines.push('function randomEmail() {')
      lines.push('  return `test_${uuidv4().slice(0, 8)}@example.com`;')
      lines.push('}')
      lines.push('')
      lines.push('function randomString(length = 10) {')
      lines.push('  return uuidv4().slice(0, length);')
      lines.push('}')
      lines.push('')
      lines.push('function randomInt(min, max) {')
      lines.push('  return Math.floor(Math.random() * (max - min + 1)) + min;')
      lines.push('}')
      lines.push('')
      lines.push('module.exports = { randomEmail, randomString, randomInt };')
      lines.push('')

      return { name: 'RandomDataHelper.js', path: 'utils/RandomDataHelper.js', content: lines.join('\n') }
    }
    case 'Python': {
      const lines = []
      lines.push('import uuid')
      lines.push('import random')
      lines.push('')
      lines.push('def random_email():')
      lines.push('    return f"test_{uuid.uuid4().hex[:8]}@example.com"')
      lines.push('')
      lines.push('def random_string(length=10):')
      lines.push('    return uuid.uuid4().hex[:length]')
      lines.push('')
      lines.push('def random_int(min_val, max_val):')
      lines.push('    return random.randint(min_val, max_val)')
      lines.push('')

      return { name: 'random_data_helper.py', path: 'utils/random_data_helper.py', content: lines.join('\n') }
    }
    case 'C#': {
      const lines = []
      lines.push('using System;')
      lines.push('')
      lines.push('namespace Utils')
      lines.push('{')
      lines.push('    public static class RandomDataHelper')
      lines.push('    {')
      lines.push('        public static string RandomEmail()')
      lines.push('        {')
      lines.push('            return $"test_{Guid.NewGuid().ToString().Substring(0, 8)}@example.com";')
      lines.push('        }')
      lines.push('')
      lines.push('        public static string RandomString(int length = 10)')
      lines.push('        {')
      lines.push('            return Guid.NewGuid().ToString().Substring(0, Math.Min(length, 36));')
      lines.push('        }')
      lines.push('')
      lines.push('        public static int RandomInt(int min, int max)')
      lines.push('        {')
      lines.push('            return new Random().Next(min, max + 1);')
      lines.push('        }')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return { name: 'RandomDataHelper.cs', path: 'utils/RandomDataHelper.cs', content: lines.join('\n') }
    }
    default:
      return { name: 'RandomDataHelper.java', path: 'utils/RandomDataHelper.java', content: '' }
  }
}

export function generateSeleniumProject(config, outputStyle) {
  const files = []
  const lang = config?.settings?.language || 'Java'
  const ext = langExtension(lang)

  const title = sanitizeName(config.projectInfo?.testTitle || 'Test')
  const specName = `${title}_Test${ext}`

  if (outputStyle === 'simple') {
    files.push({ name: specName, content: generateSeleniumScript(config) })
  } else {
    const script = generateSeleniumScript(config)
    files.push({ name: `tests/${specName}`, path: `tests/${specName}`, content: script })

    const po = generateJavaPageObject(config)
    const pageName = `pages/${po.name}${po.ext}`
    files.push({ name: pageName, path: pageName, content: po.code })

    files.push({ name: `data/testData${ext}`, path: `data/testData${ext}`, content: `// Test Data for ${title}\n// Auto-generated by PlayGen\n` })

    const driverFactory = generateDriverFactory(config)
    files.push({ name: driverFactory.path, path: driverFactory.path, content: driverFactory.content })

    const baseTest = generateBaseTest(config)
    files.push({ name: baseTest.path, path: baseTest.path, content: baseTest.content })

    const waitHelper = generateWaitHelper(config)
    files.push({ name: waitHelper.path, path: waitHelper.path, content: waitHelper.content })

    const screenshotHelper = generateScreenshotHelper(config)
    if (screenshotHelper) {
      files.push({ name: screenshotHelper.path, path: screenshotHelper.path, content: screenshotHelper.content })
    }

    const randomDataHelper = generateRandomDataHelper(config)
    files.push({ name: randomDataHelper.path, path: randomDataHelper.path, content: randomDataHelper.content })

    const configFile = {
      name: 'config/config.properties',
      path: 'config/config.properties',
      content: `# Selenium Test Configuration\n# Auto-generated by PlayGen\nbrowser=${config?.settings?.browser || 'Chrome'}\nbaseUrl=${config?.projectInfo?.baseUrl || ''}\ntimeout=10\nimplicitWait=10\nheadless=${config?.settings?.execution === 'Headless'}\n`,
    }
    files.push(configFile)
  }

  files._tree = buildSeleniumTree(files, outputStyle)
  return files
}

function buildSeleniumTree(files, outputStyle) {
  const tree = []
  if (outputStyle === 'pom') {
    const folders = ['tests/', 'pages/', 'base/', 'utils/', 'data/', 'config/']
    folders.forEach((f) => tree.push({ name: f, type: 'folder', children: [] }))
    files.forEach((f) => {
      const name = f.path || f.name
      for (const folder of folders) {
        if (name.startsWith(folder)) {
          const entry = tree.find((t) => t.name === folder)
          if (entry) entry.children.push({ name: name.replace(folder, ''), type: 'file' })
          return
        }
      }
      tree.push({ name, type: 'file' })
    })
    return tree.filter((n) => n.type === 'folder' ? n.children.length > 0 : true)
  }
  return files.map((f) => ({ name: f.name, type: 'file' }))
}
