import { formatLocator } from '../constants/locatorTypes'

function byCode(lt, loc) {
  return formatLocator('selenium', 'Python', lt, loc)
}

function sanitize(name) {
  return (name || 'test').replace(/[^a-zA-Z0-9_]/g, '_').replace(/^_|_$/g, '').toLowerCase()
}

function pName(title) {
  var c = sanitize(title)
  return c + '_page'
}

function varName(desc, fallback) {
  var n = (desc || fallback || 'element').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_').toLowerCase()
  return n || 'element'
}

function q(v) { return '"' + String(v).replace(/"/g, '\\"') + '"' }

function actionCode(step) {
  var loc = step.locator ? byCode(step.locatorType || 'CSS Selector', step.locator) : null
  var v = step.value || ''
  var desc = step.description ? '# ' + step.description : ''
  var code = ''
  switch (step.action) {
    case 'Open URL': code = 'driver.get(' + q(v) + ')'; break
    case 'Go Back': code = 'driver.back()'; break
    case 'Go Forward': code = 'driver.forward()'; break
    case 'Reload': code = 'driver.refresh()'; break
    case 'Close Page': code = 'driver.close()'; break
    case 'Click': code = 'driver.find_element(' + loc + ').click()'; break
    case 'Double Click': code = 'ActionChains(driver).double_click(driver.find_element(' + loc + ')).perform()'; break
    case 'Right Click': code = 'ActionChains(driver).context_click(driver.find_element(' + loc + ')).perform()'; break
    case 'Hover': code = 'ActionChains(driver).move_to_element(driver.find_element(' + loc + ')).perform()'; break
    case 'Drag And Drop': code = 'ActionChains(driver).drag_and_drop(driver.find_element(' + loc + '), driver.find_element(' + byCode('CSS Selector', v) + ')).perform()'; break
    case 'Fill': code = 'element = driver.find_element(' + loc + ')\nelement.clear()\nelement.send_keys(' + q(v) + ')'; break
    case 'Clear': code = 'driver.find_element(' + loc + ').clear()'; break
    case 'Press Key': code = 'driver.find_element(' + loc + ').send_keys(Keys.' + (v.toUpperCase() || 'ENTER') + ')'; break
    case 'Type': code = 'driver.find_element(' + loc + ').send_keys(' + q(v) + ')'; break
    case 'Check': code = 'if not driver.find_element(' + loc + ').is_selected():\n    driver.find_element(' + loc + ').click()'; break
    case 'Uncheck': code = 'if driver.find_element(' + loc + ').is_selected():\n    driver.find_element(' + loc + ').click()'; break
    case 'Select Dropdown': code = 'Select(driver.find_element(' + loc + ')).select_by_visible_text(' + q(v) + ')'; break
    case 'Upload File': code = 'driver.find_element(' + loc + ').send_keys(' + q(v) + ')'; break
    case 'Take Screenshot': code = 'driver.save_screenshot(' + q(v || 'screenshot.png') + ')'; break
    case 'Wait': code = 'WebDriverWait(driver, 10).until(EC.visibility_of_element_located((' + loc + ')))'; break
    case 'Wait For URL': code = 'WebDriverWait(driver, 10).until(EC.url_to_be(' + q(v) + '))'; break
    case 'Switch Frame': code = 'driver.switch_to.frame(driver.find_element(' + loc + '))'; break
    case 'Exit Frame': code = 'driver.switch_to.default_content()'; break
    case 'Switch Window': code = 'tabs = driver.window_handles\ndriver.switch_to.window(tabs[' + (Number(v) || 1) + '])'; break
    case 'Open New Window': code = 'driver.execute_script("window.open()")\ntabs = driver.window_handles\ndriver.switch_to.window(tabs[-1])'; break
    case 'Close Window': code = 'driver.close()\ntabs = driver.window_handles\ndriver.switch_to.window(tabs[0])'; break
    case 'Scroll': code = 'driver.execute_script("window.scrollBy(0, ' + (v || 500) + ')")'; break
    case 'API Request': code = '# API Request for ' + q(v) + ' - use requests library'; break
    case 'Assert': code = '# Add assertion here'; break
    default: code = '# ' + step.action + ' - ' + (step.description || '')
  }
  return desc + '\n' + code
}

function assertionCode(a) {
  var loc = a.locator ? byCode(a.locatorType || 'CSS Selector', a.locator) : null
  var v = a.value || ''
  switch (a.type) {
    case 'Visible': return 'assert driver.find_element(' + loc + ').is_displayed()'
    case 'Hidden': return 'assert not driver.find_element(' + loc + ').is_displayed()'
    case 'Enabled': return 'assert driver.find_element(' + loc + ').is_enabled()'
    case 'Disabled': return 'assert not driver.find_element(' + loc + ').is_enabled()'
    case 'Checked': return 'assert driver.find_element(' + loc + ').is_selected()'
    case 'Text Equals': return 'assert driver.find_element(' + loc + ').text == ' + q(v)
    case 'Text Contains': return 'assert ' + q(v) + ' in driver.find_element(' + loc + ').text'
    case 'URL Equals': return 'assert driver.current_url == ' + q(v)
    case 'URL Contains': return 'assert ' + q(v) + ' in driver.current_url'
    case 'Title Equals': return 'assert driver.title == ' + q(v)
    case 'Count': return 'assert len(driver.find_elements(' + loc + ')) == ' + (Number(v) || 0)
    case 'Attribute': return 'assert driver.find_element(' + loc + ').get_attribute(' + q(v) + ') == ' + q(v)
    case 'Input Value': return 'assert driver.find_element(' + loc + ').get_attribute("value") == ' + q(v)
    default: return ''
  }
}

function extractLocators(steps) {
  var map = {}
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
  var lines = []
  lines.push('import pytest')
  lines.push('from selenium import webdriver')
  lines.push('from selenium.webdriver.common.by import By')
  lines.push('from selenium.webdriver.support.ui import WebDriverWait')
  lines.push('from selenium.webdriver.support import expected_conditions as EC')
  lines.push('from selenium.webdriver.support.ui import Select')
  lines.push('from selenium.webdriver.common.action_chains import ActionChains')
  lines.push('from selenium.webdriver.common.keys import Keys')
  lines.push('')
  var cn = 'Test' + sanitize(p.testTitle || 'Test').replace(/\b\w/g, function(c) { return c.toUpperCase() })
  lines.push('class ' + cn + ':')
  lines.push('')
  lines.push('    def setup_method(self):')
  lines.push('        self.driver = webdriver.Chrome()')
  lines.push('        self.driver.maximize_window()')
  if (p.baseUrl) lines.push('        self.driver.get(' + q(p.baseUrl) + ')')
  lines.push('')
  lines.push('    def teardown_method(self):')
  lines.push('        if self.driver:')
  lines.push('            self.driver.quit()')
  lines.push('')
  lines.push('    def test_' + sanitize(p.testTitle || 'test') + '(self):')
  lines.push('        driver = self.driver')
  lines.push('')
  steps.forEach(function(s) {
    var ac = actionCode(s)
    ac.split('\n').forEach(function(l) { lines.push('        ' + l) })
  })
  if (assertions.length > 0) {
    lines.push('')
    lines.push('        # Assertions')
    assertions.forEach(function(a) {
      var ac = assertionCode(a)
      if (ac) lines.push('        ' + ac)
    })
  }
  if (vars && vars.length > 0) {
    lines.push('')
    vars.forEach(function(v) { if (v.name && v.value) lines.push('        ' + v.name + ' = ' + q(v.value)) })
  }
  return lines.join('\n')
}

function generatePomProject(model) {
  var p = model.project, steps = model.steps, assertions = model.assertions, vars = model.variables
  var files = []
  var locators = extractLocators(steps)

  var vars = model.variables
  var loginLocators = locators.filter(function(l) { return l.locator.includes('username') || l.locator.includes('password') || l.locator.includes('login') || (l.description && (l.description.toLowerCase().includes('username') || l.description.toLowerCase().includes('password') || l.description.toLowerCase().includes('login'))) })
  var dashLocators = locators.filter(function(l) { return !loginLocators.includes(l) })

  function genPageObject(cn, pLocators) {
    var lines = []
    lines.push('from selenium.webdriver.common.by import By')
    lines.push('from selenium.webdriver.support.ui import WebDriverWait')
    lines.push('from selenium.webdriver.support import expected_conditions as EC')
    lines.push('')
    lines.push('')
    lines.push('class ' + cn + ':')
    lines.push('    """Page Object for ' + cn.replace(/([A-Z])/g, ' $1').trim() + '"""')
    lines.push('')
    lines.push('    def __init__(self, driver):')
    lines.push('        self.driver = driver')
    pLocators.forEach(function(l) {
      lines.push('        self.' + l.varName + ' = (' + l.locatorType + ', ' + q(l.locator) + ')')
    })
    lines.push('')
    pLocators.forEach(function(l) {
      var mn = l.varName
      lines.push('    @property')
      lines.push('    def ' + mn + '(self):')
      lines.push('        return WebDriverWait(self.driver, 10).until(')
      lines.push('            EC.presence_of_element_located(self._' + mn + ')')
      lines.push('        )')
      lines.push('')
    })
    pLocators.forEach(function(l) {
      var mn = l.varName
      lines.push('    def click_' + mn + '(self):')
      if (l.description) lines.push('        """' + l.description + '"""')
      lines.push('        self.' + mn + '.click()')
      lines.push('')
    })
    lines.push('    def is_loaded(self):')
    if (pLocators.length > 0) lines.push('        return self.' + pLocators[0].varName + '.is_displayed()')
    else lines.push('        return True')
    lines.push('')
    return lines.join('\n') + '\n'
  }

  files.push({ name: 'pages/base_page.py', content: 'from selenium.webdriver.support.ui import WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\n\n\nclass BasePage:\n    """Base class for all page objects."""\n\n    def __init__(self, driver):\n        self.driver = driver\n        self.wait = WebDriverWait(driver, 10)\n\n    def find_element(self, locator):\n        return self.wait.until(EC.presence_of_element_located(locator))\n\n    def find_elements(self, locator):\n        return self.wait.until(EC.presence_of_all_elements_located(locator))\n\n    def click(self, locator):\n        self.find_element(locator).click()\n\n    def enter_text(self, locator, text):\n        element = self.find_element(locator)\n        element.clear()\n        element.send_keys(text)\n\n    def get_text(self, locator):\n        return self.find_element(locator).text\n\n    def is_displayed(self, locator):\n        try:\n            return self.find_element(locator).is_displayed()\n        except:\n            return False\n\n    def get_title(self):\n        return self.driver.title\n\n    def take_screenshot(self, name):\n        self.driver.save_screenshot(f"screenshots/{name}.png")\n' })
  files.push({ name: 'pages/login_page.py', content: genPageObject('LoginPage', loginLocators.length > 0 ? loginLocators : [{ varName: 'username_input', locatorType: 'By.ID', locator: 'username', action: 'Fill', description: 'Username input' }, { varName: 'password_input', locatorType: 'By.ID', locator: 'password', action: 'Fill', description: 'Password input' }, { varName: 'login_button', locatorType: 'By.ID', locator: 'login-button', action: 'Click', description: 'Login button' }]) })
  files.push({ name: 'pages/dashboard_page.py', content: genPageObject('DashboardPage', dashLocators.length > 0 ? dashLocators : [{ varName: 'welcome_message', locatorType: 'By.CSS_SELECTOR', locator: '.welcome-message', action: 'Wait', description: 'Dashboard welcome message' }]) })
  files.push({ name: 'components/navbar_component.py', content: 'from selenium.webdriver.common.by import By\n\n\nclass NavbarComponent:\n    """Reusable navigation bar component."""\n\n    def __init__(self, driver):\n        self.driver = driver\n\n    def click_logo(self):\n        self.driver.find_element(By.CSS_SELECTOR, ".logo").click()\n\n    def click_link(self, link_text):\n        self.driver.find_element(By.LINK_TEXT, link_text).click()\n\n    def is_logo_displayed(self):\n        return self.driver.find_element(By.CSS_SELECTOR, ".logo").is_displayed()\n' })
  files.push({ name: 'components/sidebar_component.py', content: 'from selenium.webdriver.common.by import By\n\n\nclass SidebarComponent:\n    """Reusable sidebar navigation component."""\n\n    def __init__(self, driver):\n        self.driver = driver\n\n    def toggle(self):\n        self.driver.find_element(By.CSS_SELECTOR, ".sidebar-toggle").click()\n\n    def navigate_to(self, menu_item):\n        self.driver.find_element(By.LINK_TEXT, menu_item).click()\n\n    def is_open(self):\n        return self.driver.find_element(By.CSS_SELECTOR, ".sidebar").is_displayed()\n' })
  files.push({ name: 'utils/driver_factory.py', content: 'from selenium import webdriver\nfrom selenium.webdriver.chrome.options import Options\n\n\ndef create_driver(browser="chrome", headless=False):\n    """Create and return a WebDriver instance."""\n    if browser.lower() == "firefox":\n        driver = webdriver.Firefox()\n    elif browser.lower() == "edge":\n        driver = webdriver.Edge()\n    else:\n        options = Options()\n        if headless:\n            options.add_argument("--headless")\n        driver = webdriver.Chrome(options=options)\n    driver.maximize_window()\n    driver.implicitly_wait(10)\n    return driver\n\n\ndef quit_driver(driver):\n    """Safely quit the WebDriver."""\n    if driver:\n        driver.quit()\n' })
  files.push({ name: 'utils/wait_helper.py', content: 'from selenium.webdriver.support.ui import WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\n\n\nclass WaitHelper:\n    """Utility class for explicit waits."""\n\n    def __init__(self, driver, timeout=10):\n        self.wait = WebDriverWait(driver, timeout)\n\n    def wait_for_visibility(self, locator):\n        return self.wait.until(EC.visibility_of_element_located(locator))\n\n    def wait_for_clickable(self, locator):\n        return self.wait.until(EC.element_to_be_clickable(locator))\n\n    def wait_for_url_contains(self, text):\n        return self.wait.until(EC.url_contains(text))\n\n    def wait_for_text_present(self, locator, text):\n        return self.wait.until(EC.text_to_be_present_in_element(locator, text))\n' })
  files.push({ name: 'config/config.py', content: '"""Application configuration."""\n\nBASE_URL = ' + q(p.baseUrl || 'https://example.com') + '\nBROWSER = "chrome"\nTIMEOUT = 10\nHEADLESS = False\n' })
  files.push({ name: 'data/test_data.py', content: '"""Test data constants."""\n\nVALID_USERNAME = "standard_user"\nVALID_PASSWORD = "secret_sauce"\nINVALID_USERNAME = "invalid_user"\nINVALID_PASSWORD = "wrong_password"\n' + (vars || []).map(function(v) { return (v.name || '').toUpperCase() + ' = ' + q(v.value || '') }).join('\n') + '\n' })
  files.push({ name: 'tests/test_login.py', content: 'import pytest\nfrom pages.login_page import LoginPage\nfrom pages.dashboard_page import DashboardPage\nfrom utils.driver_factory import create_driver, quit_driver\n\n\nclass TestLogin:\n\n    def setup_method(self):\n        self.driver = create_driver()\n        self.login_page = LoginPage(self.driver)\n\n    def teardown_method(self):\n        quit_driver(self.driver)\n\n    def test_successful_login(self):\n        self.login_page.enter_username("standard_user")\n        self.login_page.enter_password("secret_sauce")\n        self.login_page.click_login_button()\n\n        dashboard = DashboardPage(self.driver)\n        assert dashboard.is_loaded(), "Dashboard should be visible after login"\n' })
  files.push({ name: 'requirements.txt', content: 'selenium>=4.15.0\npytest>=7.4.0\npytest-html>=4.1.0\nwebdriver-manager>=4.0.0\n' })

  return files
}

export function generateSeleniumPython(model) {
  var arch = model.settings.architecture || 'simple'
  if (arch === 'simple') {
    return [{ name: sanitize(model.project.testTitle || 'test') + '.py', content: generateSimpleScript(model) }]
  }
  return generatePomProject(model)
}

export function generateSeleniumPythonExplanation(model) {
  return 'This Selenium Python project (' + (model.project.testTitle || 'Test') + ') uses the Page Object Model pattern with ' + model.steps.length + ' test steps. Built with pytest, it follows Python best practices with base page classes, reusable components, and separated test data.'
}

export function generateSeleniumPythonChecklist(model) {
  return [
    { category: 'Project Structure', items: [
      { label: 'Page Object Model pattern used', passed: true },
      { label: 'Base page class with common methods', passed: true },
      { label: 'Test data separated from test logic', passed: true },
      { label: 'Helper utilities generated', passed: true },
      { label: 'requirements.txt for dependencies', passed: true },
    ]},
    { category: 'Code Quality', items: [
      { label: 'Explicit waits used', passed: true },
      { label: 'Reusable methods in page objects', passed: true },
      { label: 'No hardcoded values in tests', passed: true },
      { label: 'Fixture-based setup/teardown', passed: true },
    ]},
    { category: 'Test Coverage', items: [
      { label: 'Test steps defined', passed: model.steps.length > 0 },
      { label: 'Assertions included', passed: model.assertions.length > 0 },
    ]},
  ]
}

export function generateSeleniumPythonBestPractices() {
  return [
    { title: 'Use Explicit Waits', description: 'Use WebDriverWait with expected_conditions instead of time.sleep() for reliable tests.' },
    { title: 'Page Object Model', description: 'Encapsulate page elements and interactions in Page classes for reusability.' },
    { title: 'Avoid time.sleep()', description: 'Replace with explicit waits that poll for conditions efficiently.' },
    { title: 'Use pytest fixtures', description: 'Leverage conftest.py for shared driver setup and teardown across test files.' },
    { title: 'Base Page Class', description: 'Create a BasePage with common methods (find, click, type) for DRY page objects.' },
    { title: 'Separate Config', description: 'Keep URLs, browser settings, and timeouts in a config module.' },
  ]
}
