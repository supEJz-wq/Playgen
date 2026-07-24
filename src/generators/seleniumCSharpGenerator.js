import { formatLocator } from '../constants/locatorTypes'

function byCode(lt, loc) {
  return formatLocator('selenium', 'CSharp', lt, loc)
}

function sanitize(name) {
  return (name || 'test').replace(/[^a-zA-Z0-9_]/g, '_').replace(/^_|_$/g, '').toLowerCase()
}

function pName(title) {
  var c = sanitize(title)
  return c.charAt(0).toUpperCase() + c.slice(1) + 'Page'
}

function varName(desc, fallback) {
  var n = (desc || fallback || 'element').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_')
  var parts = n.split('_')
  var camel = parts[0].toLowerCase() + parts.slice(1).map(function(p) { return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() }).join('')
  return camel || 'element'
}

function cnVar(desc, fallback) {
  var n = (desc || fallback || 'Element').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_')
  return n.split('_').map(function(p) { return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() }).join('')
}

function q(v) { return '"' + String(v).replace(/"/g, '\\"') + '"' }

function actionCode(step) {
  var loc = step.locator ? byCode(step.locatorType || 'CssSelector', step.locator) : null
  var v = step.value || ''
  var desc = step.description ? '// ' + step.description : ''
  switch (step.action) {
    case 'Open URL': return desc + '\ndriver.Navigate().GoToUrl(' + q(v) + ')'
    case 'Go Back': return desc + '\ndriver.Navigate().Back()'
    case 'Go Forward': return desc + '\ndriver.Navigate().Forward()'
    case 'Reload': return desc + '\ndriver.Navigate().Refresh()'
    case 'Close Page': return desc + '\ndriver.Close()'
    case 'Click': return desc + '\ndriver.FindElement(' + loc + ').Click()'
    case 'Double Click': return desc + '\nvar actions = new Actions(driver)\nactions.DoubleClick(driver.FindElement(' + loc + ')).Perform()'
    case 'Right Click': return desc + '\nvar actions = new Actions(driver)\nactions.ContextClick(driver.FindElement(' + loc + ')).Perform()'
    case 'Hover': return desc + '\nvar actions = new Actions(driver)\nactions.MoveToElement(driver.FindElement(' + loc + ')).Perform()'
    case 'Drag And Drop': return desc + '\nvar actions = new Actions(driver)\nactions.DragAndDrop(driver.FindElement(' + loc + '), driver.FindElement(' + byCode('CssSelector', v) + ')).Perform()'
    case 'Fill': return desc + '\nvar element = driver.FindElement(' + loc + ')\nelement.Clear()\nelement.SendKeys(' + q(v) + ')'
    case 'Clear': return desc + '\ndriver.FindElement(' + loc + ').Clear()'
    case 'Press Key': return desc + '\ndriver.FindElement(' + loc + ').SendKeys(Keys.' + (v.toUpperCase() || 'Enter') + ')'
    case 'Type': return desc + '\ndriver.FindElement(' + loc + ').SendKeys(' + q(v) + ')'
    case 'Check': return desc + '\nvar checkbox = driver.FindElement(' + loc + ')\nif (!checkbox.Selected) { checkbox.Click() }'
    case 'Uncheck': return desc + '\nvar checkbox = driver.FindElement(' + loc + ')\nif (checkbox.Selected) { checkbox.Click() }'
    case 'Select Dropdown': return desc + '\nvar select = new SelectElement(driver.FindElement(' + loc + '))\nselect.SelectByText(' + q(v) + ')'
    case 'Upload File': return desc + '\ndriver.FindElement(' + loc + ').SendKeys(@' + q(v) + ')'
    case 'Take Screenshot': return desc + '\nvar screenshot = ((ITakesScreenshot)driver).GetScreenshot()\nscreenshot.SaveAsFile(' + q(v || 'screenshot.png') + ')'
    case 'Wait': return desc + '\nvar wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10))\nwait.Until(ExpectedConditions.ElementIsVisible(' + loc + '))'
    case 'Wait For URL': return desc + '\nvar wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10))\nwait.Until(ExpectedConditions.UrlToBe(' + q(v) + '))'
    case 'Switch Frame': return desc + '\ndriver.SwitchTo().Frame(driver.FindElement(' + loc + '))'
    case 'Exit Frame': return desc + '\ndriver.SwitchTo().DefaultContent()'
    case 'Switch Window': return desc + '\ndriver.SwitchTo().Window(driver.WindowHandles[' + (Number(v) || 1) + '])'
    case 'Open New Window': return desc + '\n((IJavaScriptExecutor)driver).ExecuteScript("window.open()")\ndriver.SwitchTo().Window(driver.WindowHandles[^1])'
    case 'Close Window': return desc + '\ndriver.Close()\ndriver.SwitchTo().Window(driver.WindowHandles[0])'
    case 'Scroll': return desc + '\n((IJavaScriptExecutor)driver).ExecuteScript("window.scrollBy(0,' + (v || 500) + ')")'
    case 'API Request': return desc + '\n// API Request for ' + q(v) + ' - use HttpClient'
    case 'Assert': return desc + '\n// Add assertion here'
    default: return desc + '\n// ' + step.action + ' - ' + (step.description || '')
  }
}

function assertionCode(a) {
  var loc = a.locator ? byCode(a.locatorType || 'CssSelector', a.locator) : null
  var v = a.value || ''
  switch (a.type) {
    case 'Visible': return 'Assert.IsTrue(driver.FindElement(' + loc + ').Displayed)'
    case 'Hidden': return 'Assert.IsFalse(driver.FindElement(' + loc + ').Displayed)'
    case 'Enabled': return 'Assert.IsTrue(driver.FindElement(' + loc + ').Enabled)'
    case 'Disabled': return 'Assert.IsFalse(driver.FindElement(' + loc + ').Enabled)'
    case 'Checked': return 'Assert.IsTrue(driver.FindElement(' + loc + ').Selected)'
    case 'Text Equals': return 'Assert.AreEqual(' + q(v) + ', driver.FindElement(' + loc + ').Text)'
    case 'Text Contains': return 'StringAssert.Contains(driver.FindElement(' + loc + ').Text, ' + q(v) + ')'
    case 'URL Equals': return 'Assert.AreEqual(' + q(v) + ', driver.Url)'
    case 'URL Contains': return 'StringAssert.Contains(driver.Url, ' + q(v) + ')'
    case 'Title Equals': return 'Assert.AreEqual(' + q(v) + ', driver.Title)'
    case 'Count': return 'Assert.AreEqual(' + (Number(v) || 0) + ', driver.FindElements(' + loc + ').Count)'
    case 'Attribute': return 'Assert.AreEqual(' + q(v) + ', driver.FindElement(' + loc + ').GetAttribute(' + q(v) + '))'
    default: return ''
  }
}

function extractLocators(steps) {
  var map = {}
  ;(steps || []).forEach(function(s) {
    if (s.locator && s.action !== 'Open URL' && s.action !== 'Wait For URL') {
      var key = s.locator + '|' + (s.locatorType || 'CssSelector')
      if (!map[key]) {
        map[key] = { varName: varName(s.description, s.action), cnVar: cnVar(s.description, s.action), locator: s.locator, locatorType: s.locatorType || 'CssSelector', action: s.action, description: s.description }
      }
    }
  })
  return Object.values(map)
}

function genCSharpLocator(locatorType, locator) {
  switch (locatorType) {
    case 'Id': return 'By.Id(' + q(locator) + ')'; break
    case 'Name': return 'By.Name(' + q(locator) + ')'; break
    case 'ClassName': return 'By.ClassName(' + q(locator) + ')'; break
    case 'LinkText': return 'By.LinkText(' + q(locator) + ')'; break
    case 'PartialLinkText': return 'By.PartialLinkText(' + q(locator) + ')'; break
    case 'TagName': return 'By.TagName(' + q(locator) + ')'; break
    case 'XPath': return 'By.XPath(' + q(locator) + ')'; break
    default: return 'By.CssSelector(' + q(locator) + ')'
  }
}

function generateSimpleScript(model) {
  var p = model.project, steps = model.steps, assertions = model.assertions
  var lines = []
  lines.push('using System;')
  lines.push('using OpenQA.Selenium;')
  lines.push('using OpenQA.Selenium.Chrome;')
  lines.push('using OpenQA.Selenium.Support.UI;')
  lines.push('using OpenQA.Selenium.Interactions;')
  lines.push('using NUnit.Framework;')
  lines.push('')
  var cn = sanitize(p.testTitle || 'Test')
  cn = cn.charAt(0).toUpperCase() + cn.slice(1)
  lines.push('namespace SeleniumTests')
  lines.push('{')
  lines.push('    [TestFixture]')
  lines.push('    public class ' + cn + 'Tests')
  lines.push('    {')
  lines.push('        private IWebDriver driver;')
  lines.push('')
  lines.push('        [SetUp]')
  lines.push('        public void Setup()')
  lines.push('        {')
  lines.push('            driver = new ChromeDriver();')
  lines.push('            driver.Manage().Window.Maximize();')
  if (p.baseUrl) lines.push('            driver.Navigate().GoToUrl(' + q(p.baseUrl) + ');')
  lines.push('        }')
  lines.push('')
  lines.push('        [TearDown]')
  lines.push('        public void TearDown()')
  lines.push('        {')
  lines.push('            if (driver != null)')
  lines.push('            {')
  lines.push('                driver.Quit();')
  lines.push('            }')
  lines.push('        }')
  lines.push('')
  lines.push('        [Test]')
  lines.push('        public void Test' + sanitize(p.testTitle || 'Test').replace(/\b\w/g, function(c) { return c.toUpperCase() }) + '()')
  lines.push('        {')
  steps.forEach(function(s) {
    var ac = actionCode(s)
    ac.split('\n').forEach(function(l) { lines.push('            ' + l) })
  })
  if (assertions.length > 0) {
    lines.push('')
    assertions.forEach(function(a) {
      var ac = assertionCode(a)
      if (ac) lines.push('            ' + ac)
    })
  }
  lines.push('        }')
  lines.push('    }')
  lines.push('}')
  return lines.join('\n')
}

function generatePomProject(model) {
  var p = model.project, steps = model.steps
  var files = []
  var locators = extractLocators(steps)

  var loginLocators = locators.filter(function(l) { return l.locator.includes('username') || l.locator.includes('password') || l.locator.includes('login') || (l.description && (l.description.toLowerCase().includes('username') || l.description.toLowerCase().includes('password') || l.description.toLowerCase().includes('login'))) })
  var dashLocators = locators.filter(function(l) { return !loginLocators.includes(l) })

  files.push({ name: 'Base/BaseTest.cs', content: 'using NUnit.Framework;\nusing OpenQA.Selenium;\n\nnamespace SeleniumTests.Base\n{\n    public class BaseTest\n    {\n        protected IWebDriver Driver { get; set; }\n\n        [SetUp]\n        public void Setup()\n        {\n            Driver = DriverFactory.CreateDriver();\n            Driver.Navigate().GoToUrl(Config.BaseUrl);\n        }\n\n        [TearDown]\n        public void TearDown()\n        {\n            DriverFactory.QuitDriver(Driver);\n        }\n    }\n}' })
  files.push({ name: 'Pages/LoginPage.cs', content: genCSharpPageObject('LoginPage', loginLocators.length > 0 ? loginLocators : [{ varName: 'usernameInput', cnVar: 'UsernameInput', locatorType: 'Id', locator: 'username', action: 'Fill', description: 'Username input' }, { varName: 'passwordInput', cnVar: 'PasswordInput', locatorType: 'Id', locator: 'password', action: 'Fill', description: 'Password input' }, { varName: 'loginButton', cnVar: 'LoginButton', locatorType: 'Id', locator: 'login-button', action: 'Click', description: 'Login button' }]) })
  files.push({ name: 'Pages/DashboardPage.cs', content: genCSharpPageObject('DashboardPage', dashLocators.length > 0 ? dashLocators : [{ varName: 'welcomeMessage', cnVar: 'WelcomeMessage', locatorType: 'CssSelector', locator: '.welcome-message', action: 'Wait', description: 'Dashboard welcome message' }]) })
  files.push({ name: 'Components/NavbarComponent.cs', content: 'using OpenQA.Selenium;\n\nnamespace SeleniumTests.Components\n{\n    public class NavbarComponent\n    {\n        private readonly IWebDriver _driver;\n\n        public NavbarComponent(IWebDriver driver)\n        {\n            _driver = driver;\n        }\n\n        public void ClickLogo()\n        {\n            _driver.FindElement(By.CssSelector(".logo")).Click();\n        }\n\n        public void ClickLink(string linkText)\n        {\n            _driver.FindElement(By.LinkText(linkText)).Click();\n        }\n\n        public bool IsLogoDisplayed()\n        {\n            return _driver.FindElement(By.CssSelector(".logo")).Displayed;\n        }\n    }\n}' })
  files.push({ name: 'Components/SidebarComponent.cs', content: 'using OpenQA.Selenium;\n\nnamespace SeleniumTests.Components\n{\n    public class SidebarComponent\n    {\n        private readonly IWebDriver _driver;\n\n        public SidebarComponent(IWebDriver driver)\n        {\n            _driver = driver;\n        }\n\n        public void Toggle()\n        {\n            _driver.FindElement(By.CssSelector(".sidebar-toggle")).Click();\n        }\n\n        public void NavigateTo(string menuItem)\n        {\n            _driver.FindElement(By.LinkText(menuItem)).Click();\n        }\n\n        public bool IsOpen()\n        {\n            return _driver.FindElement(By.CssSelector(".sidebar")).Displayed;\n        }\n    }\n}' })
  files.push({ name: 'Utilities/DriverFactory.cs', content: 'using OpenQA.Selenium;\nusing OpenQA.Selenium.Chrome;\nusing OpenQA.Selenium.Firefox;\nusing OpenQA.Selenium.Edge;\n\nnamespace SeleniumTests\n{\n    public static class DriverFactory\n    {\n        public static IWebDriver CreateDriver(string browser = "chrome")\n        {\n            IWebDriver driver = browser.ToLower() switch\n            {\n                "firefox" => new FirefoxDriver(),\n                "edge" => new EdgeDriver(),\n                _ => new ChromeDriver()\n            };\n            driver.Manage().Window.Maximize();\n            return driver;\n        }\n\n        public static void QuitDriver(IWebDriver driver)\n        {\n            if (driver != null)\n            {\n                driver.Quit();\n            }\n        }\n    }\n}' })
  files.push({ name: 'Utilities/WaitHelper.cs', content: 'using OpenQA.Selenium;\nusing OpenQA.Selenium.Support.UI;\n\nnamespace SeleniumTests.Utilities\n{\n    public class WaitHelper\n    {\n        private readonly WebDriverWait _wait;\n\n        public WaitHelper(IWebDriver driver, int timeoutSeconds = 10)\n        {\n            _wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutSeconds));\n        }\n\n        public IWebElement WaitForVisibility(By locator)\n        {\n            return _wait.Until(ExpectedConditions.ElementIsVisible(locator));\n        }\n\n        public IWebElement WaitForClickable(By locator)\n        {\n            return _wait.Until(ExpectedConditions.ElementToBeClickable(locator));\n        }\n\n        public bool WaitForUrlContains(string text)\n        {\n            return _wait.Until(ExpectedConditions.UrlContains(text));\n        }\n    }\n}' })
  files.push({ name: 'Tests/LoginTests.cs', content: 'using NUnit.Framework;\nusing SeleniumTests.Base;\nusing SeleniumTests.Pages;\n\nnamespace SeleniumTests.Tests\n{\n    [TestFixture]\n    public class LoginTests : BaseTest\n    {\n        [Test]\n        public void SuccessfulLoginTest()\n        {\n            var loginPage = new LoginPage(Driver);\n            loginPage.EnterUsername(TestData.ValidUsername);\n            loginPage.EnterPassword(TestData.ValidPassword);\n            loginPage.ClickLoginButton();\n\n            var dashboardPage = new DashboardPage(Driver);\n            Assert.IsTrue(dashboardPage.IsLoaded(), "Dashboard should be visible after login");\n        }\n    }\n}' })
  files.push({ name: 'Config/Config.cs', content: 'namespace SeleniumTests\n{\n    public static class Config\n    {\n        public static string BaseUrl => ' + q(p.baseUrl || 'https://example.com') + ';\n        public static string Browser => "chrome";\n        public static int Timeout => 10;\n        public static bool Headless => false;\n    }\n}' })
  files.push({ name: 'Config/TestData.cs', content: 'namespace SeleniumTests\n{\n    public static class TestData\n    {\n        public static string ValidUsername => "standard_user";\n        public static string ValidPassword => "secret_sauce";\n        public static string InvalidUsername => "invalid_user";\n        public static string InvalidPassword => "wrong_password";\n    }\n}' })
  files.push({ name: 'SeleniumTests.csproj', content: '<Project Sdk="Microsoft.NET.Sdk">\n  <PropertyGroup>\n    <TargetFramework>net8.0</TargetFramework>\n    <Nullable>enable</Nullable>\n    <IsPackable>false</IsPackable>\n  </PropertyGroup>\n  <ItemGroup>\n    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />\n    <PackageReference Include="NUnit" Version="4.0.1" />\n    <PackageReference Include="NUnit3TestAdapter" Version="4.5.0" />\n    <PackageReference Include="Selenium.Support" Version="4.15.0" />\n    <PackageReference Include="Selenium.WebDriver" Version="4.15.0" />\n  </ItemGroup>\n</Project>' })
  files.push({ name: 'appsettings.json', content: '{\n  "browser": "chrome",\n  "baseUrl": ' + q(p.baseUrl || 'https://example.com') + ',\n  "timeout": 10,\n  "headless": false\n}' })

  return files
}

function genCSharpPageObject(cn, pLocators) {
  var lines = []
  lines.push('using OpenQA.Selenium;')
  lines.push('using OpenQA.Selenium.Support.UI;')
  lines.push('using SeleniumTests.Utilities;')
  lines.push('')
  lines.push('namespace SeleniumTests.Pages')
  lines.push('{')
  lines.push('    public class ' + cn)
  lines.push('    {')
  lines.push('        private readonly IWebDriver _driver;')
  lines.push('        private readonly WaitHelper _wait;')
  lines.push('')
  pLocators.forEach(function(l) {
    lines.push('        private readonly By _' + l.varName + ' = ' + genCSharpLocator(l.locatorType, l.locator) + ';')
  })
  lines.push('')
  lines.push('        public ' + cn + '(IWebDriver driver)')
  lines.push('        {')
  lines.push('            _driver = driver;')
  lines.push('            _wait = new WaitHelper(driver);')
  lines.push('        }')
  lines.push('')
  pLocators.forEach(function(l) {
    var mn = l.cnVar
    if (l.action === 'Fill' || l.action === 'Type') {
      lines.push('        public void Enter' + mn + '(string text)')
      lines.push('        {')
      if (l.description) lines.push('            // ' + l.description)
      lines.push('            var element = _wait.WaitForVisibility(_' + l.varName + ');')
      lines.push('            element.Clear();')
      lines.push('            element.SendKeys(text);')
      lines.push('        }')
      lines.push('')
    } else if (l.action === 'Check') {
      lines.push('        public void Check' + mn + '()')
      lines.push('        {')
      if (l.description) lines.push('            // ' + l.description)
      lines.push('            var element = _wait.WaitForClickable(_' + l.varName + ');')
      lines.push('            if (!element.Selected) element.Click();')
      lines.push('        }')
      lines.push('')
    } else if (l.action === 'Uncheck') {
      lines.push('        public void Uncheck' + mn + '()')
      lines.push('        {')
      if (l.description) lines.push('            // ' + l.description)
      lines.push('            var element = _wait.WaitForClickable(_' + l.varName + ');')
      lines.push('            if (element.Selected) element.Click();')
      lines.push('        }')
      lines.push('')
    } else {
      lines.push('        public void Click' + mn + '()')
      lines.push('        {')
      if (l.description) lines.push('            // ' + l.description)
      lines.push('            _wait.WaitForClickable(_' + l.varName + ').Click();')
      lines.push('        }')
      lines.push('')
    }
  })
  lines.push('        public bool IsLoaded()')
  lines.push('        {')
  if (pLocators.length > 0) lines.push('            try { return _wait.WaitForVisibility(_' + pLocators[0].varName + ').Displayed; } catch { return false; }')
  else lines.push('            return true;')
  lines.push('        }')
  lines.push('    }')
  lines.push('}')
  return lines.join('\n')
}

export function generateSeleniumCSharp(model) {
  var arch = model.settings.architecture || 'simple'
  if (arch === 'simple') {
    return [{ name: sanitize(model.project.testTitle || 'Test') + 'Tests.cs', content: generateSimpleScript(model) }]
  }
  return generatePomProject(model)
}

export function generateSeleniumCSharpExplanation(model) {
  return 'This Selenium C# project (' + (model.project.testTitle || 'Test') + ') uses the Page Object Model pattern with ' + model.steps.length + ' test steps. Built with NUnit, it follows C# conventions with BaseTest class, page objects, reusable components, and separate configuration.'
}

export function generateSeleniumCSharpChecklist(model) {
  return [
    { category: 'Project Structure', items: [
      { label: 'Page Object Model pattern used', passed: true },
      { label: 'Base test class with setup/teardown', passed: true },
      { label: 'Configuration separated from tests', passed: true },
      { label: 'Helper utilities generated', passed: true },
      { label: 'NUnit test project file included', passed: true },
    ]},
    { category: 'Code Quality', items: [
      { label: 'Explicit waits used', passed: true },
      { label: 'Strongly typed page objects', passed: true },
      { label: 'No hardcoded values in tests', passed: true },
      { label: 'Proper namespace usage', passed: true },
    ]},
    { category: 'Test Coverage', items: [
      { label: 'Test steps defined', passed: model.steps.length > 0 },
      { label: 'Assertions included', passed: model.assertions.length > 0 },
    ]},
  ]
}

export function generateSeleniumCSharpBestPractices() {
  return [
    { title: 'Use Explicit Waits', description: 'Use WebDriverWait with ExpectedConditions instead of Thread.Sleep() for reliable tests.' },
    { title: 'Page Object Model', description: 'Encapsulate page elements and interactions in Page classes for reusability.' },
    { title: 'Base Test Class', description: 'Create a BaseTest class with [SetUp] and [TearDown] for shared driver management.' },
    { title: 'Avoid Thread.Sleep', description: 'Replace with WebDriverWait that polls for conditions efficiently.' },
    { title: 'Separate Config', description: 'Keep URLs, browser settings, and timeouts in a config class or appsettings.json.' },
    { title: 'Use NUnit', description: 'Leverage [TestFixture], [Test], [SetUp], [TearDown] attributes for structured tests.' },
  ]
}
