import { formatAppiumLocator } from '../constants/appiumLocators'

const q = (val) => `"${String(val).replace(/"/g, '\\"')}"`

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
  const loc = step.locator ? formatAppiumLocator('Python', step.locatorType || 'Accessibility ID', step.locator, platform) : null
  const val = step.value || ''
  const desc = step.description ? `  # ${step.description}` : ''
  let code = ''
  switch (step.action) {
    case 'Launch App':
      code = `  driver.launch_app()`
      break
    case 'Close App':
      code = `  driver.close_app()`
      break
    case 'Install App':
      code = `  driver.install_app(${q(val)})`
      break
    case 'Remove App':
      code = `  driver.remove_app(${q(val)})`
      break
    case 'Background App':
      code = `  driver.background_app(${val || 5})`
      break
    case 'Activate App':
      code = `  driver.activate_app(${q(val)})`
      break
    case 'Terminate App':
      code = `  driver.terminate_app(${q(val)})`
      break
    case 'Reset App':
      code = `  driver.reset_app()`
      break
    case 'Get Device Time':
      code = `  device_time = driver.device_time`
      break
    case 'Lock Device':
      code = `  driver.lock_device()`
      break
    case 'Unlock Device':
      code = `  driver.unlock_device()`
      break
    case 'Rotate Device':
    case 'Set Orientation':
      code = `  driver.orientation = ${q(val || 'PORTRAIT')}`
      break
    case 'Open URL':
      code = `  driver.get(${q(val || '/')})`
      break
    case 'Go Back':
      code = `  driver.back()`
      break
    case 'Reload':
      code = `  driver.refresh()`
      break
    case 'Click':
      code = `  ${loc}.click()`
      break
    case 'Double Click':
      code = `  TouchAction(driver).double_tap(${loc}).perform()`
      break
    case 'Long Press':
      code = `  TouchAction(driver).long_press(${loc}).perform()`
      break
    case 'Tap':
      code = `  TouchAction(driver).tap(${loc}).perform()`
      break
    case 'Swipe':
      code = `  driver.swipe(${val || '500, 1500, 500, 500'})`
      break
    case 'Scroll':
      code = `  driver.scroll(${loc}, ${q(val || 'visible')})`
      break
    case 'Drag':
      code = `  TouchAction(driver).long_press(${loc}).move_to(${q(val || 'target')}).release().perform()`
      break
    case 'Drop':
      code = `  # Drop action`
      break
    case 'Pinch':
      code = `  driver.pinch(element=${loc}, scale=0.5)`
      break
    case 'Zoom':
      code = `  driver.zoom(element=${loc}, scale=2.0)`
      break
    case 'Fill':
    case 'Type':
      code = `  ${loc}.send_keys(${q(val)})`
      break
    case 'Clear':
      code = `  ${loc}.clear()`
      break
    case 'Press Key':
      code = `  ${loc}.send_keys(Keys.${(val || 'ENTER').toUpperCase()})`
      break
    case 'Hide Keyboard':
      code = `  driver.hide_keyboard()`
      break
    case 'Check':
      code = `  if not ${loc}.is_selected(): ${loc}.click()`
      break
    case 'Uncheck':
      code = `  if ${loc}.is_selected(): ${loc}.click()`
      break
    case 'Select Dropdown':
      code = `  Select(${loc}).select_by_visible_text(${q(val)})`
      break
    case 'Wait':
      code = `  ${loc}.is_displayed()`
      break
    case 'Wait For Element':
      code = `  WebDriverWait(driver, 10).until(EC.visibility_of_element_located((${loc})))`
      break
    case 'Switch Frame':
      code = loc ? `  driver.switch_to.frame(${loc})` : `  # Switch to frame`
      break
    case 'Exit Frame':
      code = `  driver.switch_to.default_content()`
      break
    case 'Take Screenshot':
      code = `  driver.save_screenshot(${q(val || 'screenshot.png')})`
      break
    case 'Upload File':
      code = `  ${loc}.send_keys(${q(val)})`
      break
    case 'Push File':
      code = `  driver.push_file(${q(val)}, open(${q(val)}, 'rb').read())`
      break
    case 'Pull File':
      code = `  file_data = driver.pull_file(${q(val)})`
      break
    case 'API Request':
      code = `  # API Request - use requests library`
      break
    case 'Assert':
      code = `  # Add assertion here`
      break
    default:
      code = `  # ${step.action} - ${step.description || ''}`
  }
  return desc ? `${desc}\n${code}` : code
}

function assertionCode(a, platform) {
  const loc = a.locator ? formatAppiumLocator('Python', a.locatorType || 'Accessibility ID', a.locator, platform) : null
  const val = a.value || ''
  switch (a.type) {
    case 'Visible':
    case 'Displayed':
      return `  assert ${loc}.is_displayed()`
    case 'Not Displayed':
      return `  assert not ${loc}.is_displayed()`
    case 'Exists':
      return `  assert ${loc} is not None`
    case 'Not Exists':
      return `  assert ${loc} is None`
    case 'Hidden':
      return `  assert not ${loc}.is_displayed()`
    case 'Enabled':
      return `  assert ${loc}.is_enabled()`
    case 'Disabled':
      return `  assert not ${loc}.is_enabled()`
    case 'Checked':
    case 'Selected':
      return `  assert ${loc}.is_selected()`
    case 'Text Equals':
      return `  assert ${loc}.text == ${q(val)}`
    case 'Text Contains':
      return `  assert ${q(val)} in ${loc}.text`
    case 'Attribute':
      return `  assert ${loc}.get_attribute(${q(a.attribute || 'value')}) == ${q(val)}`
    case 'Input Value':
      return `  assert ${loc}.text == ${q(val)}`
    case 'Count':
      return `  assert len(driver.find_elements(${loc})) == ${Number(val) || 0}`
    default:
      return ''
  }
}

function generateSimpleScript(model) {
  const { project, steps, assertions } = model
  const platform = project.platform || 'Android'
  const title = project.testTitle || 'test'
  const lines = []
  lines.push(`import pytest`)
  lines.push(`from appium import webdriver`)
  lines.push(`from appium.webdriver.common.mobileby import MobileBy`)
  lines.push(`from appium.webdriver.common.touch_action import TouchAction`)
  lines.push(`from selenium.webdriver.common.by import By`)
  lines.push(`from selenium.webdriver.support.ui import WebDriverWait`)
  lines.push(`from selenium.webdriver.support import expected_conditions as EC`)
  lines.push(`from selenium.webdriver.support.ui import Select`)
  lines.push(`from selenium.webdriver.common.keys import Keys`)
  lines.push(`import os`)
  lines.push(``)
  lines.push(`class Test${sanitizeName(title).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/ /g, '')}:`)
  lines.push(``)
  lines.push(`  def setup_method(self):`)
  lines.push(`    caps = {`)
  lines.push(`      "platformName": "${platform}",`)
  lines.push(`      "deviceName": "${project.deviceName || 'emulator'}",`)
  lines.push(`      "appPackage": "${project.appPackage || 'com.example.app'}",`)
  lines.push(`      "appActivity": "${project.appActivity || '.MainActivity'}",`)
  lines.push(`      "automationName": "${project.automationName || 'UiAutomator2'}",`)
  lines.push(`    }`)
  lines.push(`    self.driver = webdriver.Remote("${project.appiumUrl || 'http://127.0.0.1:4723'}/wd/hub", caps)`)
  lines.push(`    self.driver.implicitly_wait(10)`)
  lines.push(``)
  lines.push(`  def test_${sanitizeName(title)}(self):`)
  steps.forEach((step) => {
    const code = actionCode(step, platform)
    if (code) lines.push(code)
  })
  if (assertions.length > 0) {
    lines.push(``)
    lines.push(`    # Assertions`)
    assertions.forEach((a) => {
      const ac = assertionCode(a, platform)
      if (ac) lines.push(`    ${ac}`)
    })
  }
  lines.push(``)
  lines.push(`  def teardown_method(self):`)
  lines.push(`    if self.driver:`)
  lines.push(`      self.driver.quit()`)
  return lines.join('\n')
}

function generatePomProject(model) {
  const { project, steps } = model
  const name = pageName(project.testTitle || 'Test')
  const platform = project.platform || 'Android'
  const locators = extractUniqueLocators(steps)
  const files = []
  files.push({ name: `tests/${project.testTitle || 'test'}.py`, content: generateSimpleScript(model) })
  const pageLines = [
    `from appium.webdriver.common.mobileby import MobileBy`,
    `from selenium.webdriver.common.by import By`,
    ``,
    `class ${sanitizeName(project.testTitle || 'Test').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/ /g, '')}Page:`,
    `  def __init__(self, driver):`,
    `    self.driver = driver`,
    ...locators.map((loc) => `    self.${loc.varName} = (${formatAppiumLocator('Python', loc.locatorType, loc.locator, platform)})`),
    ``,
    `  @property`,
    ...locators.map((loc) => `  def ${loc.varName}_el(self):\n    return self.driver.find_element(*self.${loc.varName})`),
    `  }`,
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
    const methodName = descKey.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_').toLowerCase() || 'do_action'
    pageLines.push(`  def ${methodName}(self):`)
    if (step.description) pageLines.push(`    # ${step.description}`)
    pageLines.push(`    self.${methodName}_el.click()`)
    pageLines.push(``)
  })
  files.push({ name: `pages/${name}.py`, content: pageLines.join('\n') })
  const baseLines = [
    `from appium import webdriver`,
    ``,
    `class BaseDriver:`,
    `  def __init__(self):`,
    `    self.driver = None`,
    ``,
    `  def start_driver(self, platform):`,
    `    caps = {`,
    `      "platformName": platform,`,
    `      "deviceName": "${project.deviceName || 'emulator'}",`,
    `      "appPackage": "${project.appPackage || 'com.example.app'}",`,
    `      "appActivity": "${project.appActivity || '.MainActivity'}",`,
    `      "automationName": "${project.automationName || 'UiAutomator2'}",`,
    `    }`,
    `    self.driver = webdriver.Remote("${project.appiumUrl || 'http://127.0.0.1:4723'}/wd/hub", caps)`,
    `    self.driver.implicitly_wait(10)`,
    `    return self.driver`,
    ``,
    `  def stop_driver(self):`,
    `    if self.driver:`,
    `      self.driver.quit()`,
  ]
  files.push({ name: `base/base_driver.py`, content: baseLines.join('\n') })
  const configLines = [
    `[appium]`,
    `server_url = ${project.appiumUrl || 'http://127.0.0.1:4723'}`,
    `platform = ${platform}`,
    `device = ${project.deviceName || 'emulator'}`,
    `automation = ${project.automationName || 'UiAutomator2'}`,
    `app_package = ${project.appPackage || 'com.example.app'}`,
    `app_activity = ${project.appActivity || '.MainActivity'}`,
  ]
  files.push({ name: `config/config.ini`, content: configLines.join('\n') })
  const dataLines = [
    `# Test Data`,
    ...(model.variables || []).map((v) => `${v.name} = ${q(v.value)}`),
  ]
  files.push({ name: `data/test_data.py`, content: dataLines.join('\n') })
  const utilsLines = [
    `from appium.webdriver.common.touch_action import TouchAction`,
    `from selenium.webdriver.support.ui import WebDriverWait`,
    `from selenium.webdriver.support import expected_conditions as EC`,
    ``,
    `class GestureHelper:`,
    `  @staticmethod`,
    `  def swipe(driver, start_x, start_y, end_x, end_y):`,
    `    TouchAction(driver).press(x=start_x, y=start_y).wait(500).move_to(x=end_x, y=end_y).release().perform()`,
    ``,
    `  @staticmethod`,
    `  def scroll_down(driver):`,
    `    size = driver.get_window_size()`,
    `    start_x = size['width'] // 2`,
    `    start_y = size['height'] * 3 // 4`,
    `    end_y = size['height'] // 4`,
    `    GestureHelper.swipe(driver, start_x, start_y, start_x, end_y)`,
    ``,
    `class WaitHelper:`,
    `  @staticmethod`,
    `  def wait_for_element(driver, locator, timeout=10):`,
    `    WebDriverWait(driver, timeout).until(EC.visibility_of_element_located(locator))`,
  ]
  files.push({ name: `utils/helpers.py`, content: utilsLines.join('\n') })
  return files
}

export function generateAppiumPython(model) {
  const architecture = model.settings.architecture || 'simple'
  if (architecture === 'simple') {
    return [{ name: `${(model.project.testTitle || 'test').replace(/\s+/g, '_').toLowerCase()}.py`, content: generateSimpleScript(model) }]
  }
  if (architecture === 'pom') {
    return generatePomProject(model)
  }
  return [{ name: 'appium_test.py', content: generateSimpleScript(model) }]
}

export function generateAppiumPythonExplanation(model) {
  const { project, steps, assertions } = model
  return `This Appium Python test (${project.testTitle || 'Test'}) automates ${steps.length} steps with ${assertions.length} assertions for ${project.platform || 'Android'}. Uses pytest and Appium-Python-Client.`
}

export function generateAppiumPythonChecklist(model) {
  const { project, steps, assertions } = model
  return [
    { category: 'Configuration', items: [
      { label: 'Appium server URL configured', passed: !!project.appiumUrl },
      { label: 'Platform name set', passed: !!project.platform },
      { label: 'Device name configured', passed: !!project.deviceName },
    ]},
    { category: 'Test Steps', items: [
      { label: 'At least one step defined', passed: steps.length > 0 },
      { label: 'Mobile locators configured', passed: steps.some((s) => s.locator) },
    ]},
    { category: 'Assertions', items: [
      { label: 'Assertions defined', passed: assertions.length > 0 },
    ]},
  ]
}

export function generateAppiumPythonBestPractices() {
  return [
    { title: 'Use Appium-Python-Client', description: 'Use the official Appium Python client for full API support.' },
    { title: 'Prefer Accessibility ID', description: 'Use Accessibility ID locators for cross-platform test compatibility.' },
    { title: 'Use Conftest Fixtures', description: 'Structure setup/teardown in conftest.py using pytest fixtures.' },
    { title: 'Handle Timeouts Gracefully', description: 'Use WebDriverWait with ExpectedConditions instead of time.sleep().' },
    { title: 'Organize with POM', description: 'Use Page Object Model for maintainable mobile test automation.' },
  ]
}
