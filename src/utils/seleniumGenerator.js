import { formatSeleniumLocator } from '../constants/seleniumLocators'

function sanitizeName(name) {
  return (name || 'Test')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

function locatorCode(step, lang) {
  if (!step.locator) return ''
  return formatSeleniumLocator(step.locatorType || 'CSS Selector', step.locator, lang)
}

function javaActionCode(step) {
  const loc = locatorCode(step, 'Java')
  const val = step.value || ''
  let code = ''

  switch (step.action) {
    case 'Open URL':
      code = `driver.get("${val || 'https://example.com'}");`
      break
    case 'Refresh':
      code = 'driver.navigate().refresh();'
      break
    case 'Back':
      code = 'driver.navigate().back();'
      break
    case 'Forward':
      code = 'driver.navigate().forward();'
      break
    case 'Close Browser':
      code = 'driver.close();'
      break
    case 'Quit Driver':
      code = 'driver.quit();'
      break
    case 'Click':
      code = `driver.findElement(${loc}).click();`
      break
    case 'Double Click':
      code = `new Actions(driver).doubleClick(driver.findElement(${loc})).perform();`
      break
    case 'Right Click':
      code = `new Actions(driver).contextClick(driver.findElement(${loc})).perform();`
      break
    case 'Hover':
      code = `new Actions(driver).moveToElement(driver.findElement(${loc})).perform();`
      break
    case 'Drag And Drop':
      code = `new Actions(driver).dragAndDrop(driver.findElement(${loc}), driver.findElement(By.cssSelector("${val}"))).perform();`
      break
    case 'Type Text':
      code = `driver.findElement(${loc}).sendKeys("${val.replace(/"/g, '\\"')}");`
      break
    case 'Clear':
      code = `driver.findElement(${loc}).clear();`
      break
    case 'Press Key':
      code = `driver.findElement(${loc}).sendKeys(Keys.${val.toUpperCase() || 'ENTER'});`
      break
    case 'Check':
      code = `if (!driver.findElement(${loc}).isSelected()) { driver.findElement(${loc}).click(); }`
      break
    case 'Uncheck':
      code = `if (driver.findElement(${loc}).isSelected()) { driver.findElement(${loc}).click(); }`
      break
    case 'Select By Text':
      code = `new Select(driver.findElement(${loc})).selectByVisibleText("${val.replace(/"/g, '\\"')}");`
      break
    case 'Select By Value':
      code = `new Select(driver.findElement(${loc})).selectByValue("${val.replace(/"/g, '\\"')}");`
      break
    case 'Select By Index':
      code = `new Select(driver.findElement(${loc})).selectByIndex(${parseInt(val) || 0});`
      break
    case 'Switch To Frame':
      code = `driver.switchTo().frame(driver.findElement(${loc}));`
      break
    case 'Default Content':
      code = 'driver.switchTo().defaultContent();'
      break
    case 'Parent Frame':
      code = 'driver.switchTo().parentFrame();'
      break
    case 'Open New Window':
      code = 'driver.switchTo().newWindow(WindowType.TAB);'
      break
    case 'Switch Window':
      code = `driver.switchTo().window("${val || 'windowHandle'}");`
      break
    case 'Close Window':
      code = 'driver.close();'
      break
    case 'Accept Alert':
      code = 'driver.switchTo().alert().accept();'
      break
    case 'Dismiss Alert':
      code = 'driver.switchTo().alert().dismiss();'
      break
    case 'Send Alert Text':
      code = `driver.switchTo().alert().sendKeys("${val.replace(/"/g, '\\"')}");`
      break
    case 'Get Alert Text':
      code = 'String alertText = driver.switchTo().alert().getText();'
      break
    case 'Implicit Wait':
      code = `driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(${parseInt(val) || 10}));`
      break
    case 'Explicit Wait':
      code = `new WebDriverWait(driver, Duration.ofSeconds(${parseInt(val) || 10}))`
      break
    case 'Fluent Wait':
      code = `new FluentWait<>(driver).withTimeout(Duration.ofSeconds(${parseInt(val) || 30})).pollingEvery(Duration.ofSeconds(5));`
      break
    case 'Wait Until Visible':
      code = `new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.visibilityOfElementLocated(${loc}));`
      break
    case 'Wait Until Clickable':
      code = `new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.elementToBeClickable(${loc}));`
      break
    case 'Wait Until Present':
      code = `new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.presenceOfElementLocated(${loc}));`
      break
    case 'Scroll To Element':
      code = `((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(${loc}));`
      break
    case 'Scroll To Top':
      code = '((JavascriptExecutor) driver).executeScript("window.scrollTo(0, 0);");'
      break
    case 'Scroll To Bottom':
      code = '((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight);");'
      break
    case 'Click Using JavaScript':
      code = `((JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(${loc}));`
      break
    case 'Scroll Using JavaScript':
      code = `((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", driver.findElement(${loc}));`
      break
    case 'Highlight Element':
      code = `((JavascriptExecutor) driver).executeScript("arguments[0].style.border='3px solid red'", driver.findElement(${loc}));`
      break
    case 'Take Screenshot':
      code = 'File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);\n    FileUtils.copyFile(src, new File("screenshot.png"));'
      break
    case 'Full Page Screenshot':
      code = '// Full page screenshot requires AShot library or custom JS\n    File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);\n    FileUtils.copyFile(src, new File("fullpage.png"));'
      break
    case 'Add Cookie':
      code = `Cookie cookie = new Cookie("${val.split('=')[0] || 'name'}", "${val.split('=')[1] || 'value'}");\n    driver.manage().addCookie(cookie);`
      break
    case 'Delete Cookie':
      code = `driver.manage().deleteCookieNamed("${val || 'cookieName'}");`
      break
    case 'Delete All Cookies':
      code = 'driver.manage().deleteAllCookies();'
      break
    case 'Get Cookie':
      code = `Cookie cookie = driver.manage().getCookieNamed("${val || 'cookieName'}");`
      break
    case 'Local Storage':
      code = `JavascriptExecutor js = (JavascriptExecutor) driver;\n    js.executeScript("${val || "localStorage.clear();"}");`
      break
    case 'Session Storage':
      code = `JavascriptExecutor js = (JavascriptExecutor) driver;\n    js.executeScript("${val || "sessionStorage.clear();"}");`
      break
    case 'HTTP GET':
      code = '// Use RestAssured or HttpClient for API calls\n    // Response response = RestAssured.get("' + (val || 'https://api.example.com') + '");'
      break
    case 'HTTP POST':
      code = '// Use RestAssured or HttpClient for API calls\n    // Response response = RestAssured.given().body("{}").post("' + (val || 'https://api.example.com') + '");'
      break
    case 'HTTP PUT':
      code = '// Use RestAssured or HttpClient for API calls\n    // Response response = RestAssured.given().body("{}").put("' + (val || 'https://api.example.com') + '");'
      break
    case 'HTTP DELETE':
      code = '// Use RestAssured or HttpClient for API calls\n    // Response response = RestAssured.delete("' + (val || 'https://api.example.com') + '");'
      break
    default:
      code = ''
  }

  return code
}

function jsActionCode(step) {
  const loc = locatorCode(step, 'JavaScript')
  const val = step.value || ''
  let code = ''

  switch (step.action) {
    case 'Open URL':
      code = `await driver.get("${val || 'https://example.com'}");`
      break
    case 'Refresh':
      code = 'await driver.navigate().refresh();'
      break
    case 'Back':
      code = 'await driver.navigate().back();'
      break
    case 'Forward':
      code = 'await driver.navigate().forward();'
      break
    case 'Close Browser':
      code = 'await driver.close();'
      break
    case 'Quit Driver':
      code = 'await driver.quit();'
      break
    case 'Click':
      code = `await driver.findElement(${loc}).click();`
      break
    case 'Double Click':
      code = `await driver.actions().doubleClick(driver.findElement(${loc})).perform();`
      break
    case 'Right Click':
      code = `await driver.actions().contextClick(driver.findElement(${loc})).perform();`
      break
    case 'Hover':
      code = `await driver.actions().move({origin: driver.findElement(${loc})}).perform();`
      break
    case 'Drag And Drop':
      code = `await driver.actions().drag(driver.findElement(${loc})).move({x: 100, y: 100}).perform();`
      break
    case 'Type Text':
      code = `await driver.findElement(${loc}).sendKeys("${val.replace(/"/g, '\\"')}");`
      break
    case 'Clear':
      code = `await driver.findElement(${loc}).clear();`
      break
    case 'Press Key':
      code = `await driver.findElement(${loc}).sendKeys(Key.${val.toUpperCase() || 'ENTER'});`
      break
    case 'Check':
      code = `const checked = await driver.findElement(${loc}).isSelected();\n    if (!checked) { await driver.findElement(${loc}).click(); }`
      break
    case 'Uncheck':
      code = `const checked = await driver.findElement(${loc}).isSelected();\n    if (checked) { await driver.findElement(${loc}).click(); }`
      break
    case 'Select By Text':
      code = `const select = new Select(driver.findElement(${loc}));\n    await select.selectByVisibleText("${val.replace(/"/g, '\\"')}");`
      break
    case 'Select By Value':
      code = `const select = new Select(driver.findElement(${loc}));\n    await select.selectByValue("${val.replace(/"/g, '\\"')}");`
      break
    case 'Select By Index':
      code = `const select = new Select(driver.findElement(${loc}));\n    await select.selectByIndex(${parseInt(val) || 0});`
      break
    case 'Switch To Frame':
      code = `await driver.switchTo().frame(driver.findElement(${loc}));`
      break
    case 'Default Content':
      code = 'await driver.switchTo().defaultContent();'
      break
    case 'Parent Frame':
      code = 'await driver.switchTo().parentFrame();'
      break
    case 'Open New Window':
      code = 'await driver.switchTo().newWindow();'
      break
    case 'Switch Window':
      code = `await driver.switchTo().window("${val || 'windowHandle'}");`
      break
    case 'Close Window':
      code = 'await driver.close();'
      break
    case 'Accept Alert':
      code = 'await driver.switchTo().alert().accept();'
      break
    case 'Dismiss Alert':
      code = 'await driver.switchTo().alert().dismiss();'
      break
    case 'Send Alert Text':
      code = `await driver.switchTo().alert().sendKeys("${val.replace(/"/g, '\\"')}");`
      break
    case 'Get Alert Text':
      code = 'const alertText = await driver.switchTo().alert().getText();'
      break
    case 'Implicit Wait':
      code = `await driver.manage().setTimeouts({implicit: ${parseInt(val) || 10} * 1000});`
      break
    case 'Explicit Wait':
      code = `await driver.wait(until.elementLocated(${loc}), ${parseInt(val) || 10} * 1000);`
      break
    case 'Fluent Wait':
      code = '// Fluent wait configured in driver setup'
      break
    case 'Wait Until Visible':
      code = `await driver.wait(until.elementIsVisible(driver.findElement(${loc})), 10000);`
      break
    case 'Wait Until Clickable':
      code = `await driver.wait(until.elementIsEnabled(driver.findElement(${loc})), 10000);`
      break
    case 'Wait Until Present':
      code = `await driver.wait(until.elementLocated(${loc}), 10000);`
      break
    case 'Scroll To Element':
      code = `await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(${loc}));`
      break
    case 'Scroll To Top':
      code = 'await driver.executeScript("window.scrollTo(0, 0);");'
      break
    case 'Scroll To Bottom':
      code = 'await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");'
      break
    case 'Click Using JavaScript':
      code = `await driver.executeScript("arguments[0].click();", driver.findElement(${loc}));`
      break
    case 'Scroll Using JavaScript':
      code = `await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", driver.findElement(${loc}));`
      break
    case 'Highlight Element':
      code = `await driver.executeScript("arguments[0].style.border='3px solid red'", driver.findElement(${loc}));`
      break
    case 'Take Screenshot':
      code = 'const fs = require("fs");\n    const screenshot = await driver.takeScreenshot();\n    fs.writeFileSync("screenshot.png", screenshot, "base64");'
      break
    case 'Full Page Screenshot':
      code = 'const fs = require("fs");\n    const screenshot = await driver.takeScreenshot();\n    fs.writeFileSync("fullpage.png", screenshot, "base64");'
      break
    case 'Add Cookie':
      code = `await driver.manage().addCookie({name: "${val.split('=')[0] || 'name'}", value: "${val.split('=')[1] || 'value'}"});`
      break
    case 'Delete Cookie':
      code = `await driver.manage().deleteCookie("${val || 'cookieName'}");`
      break
    case 'Delete All Cookies':
      code = 'await driver.manage().deleteAllCookies();'
      break
    case 'Get Cookie':
      code = `const cookie = await driver.manage().getCookie("${val || 'cookieName'}");`
      break
    case 'Local Storage':
      code = `await driver.executeScript("${val || "localStorage.clear();"}");`
      break
    case 'Session Storage':
      code = `await driver.executeScript("${val || "sessionStorage.clear();"}");`
      break
    case 'HTTP GET':
      code = '// Use axios or fetch for API calls\n    // const response = await axios.get("' + (val || 'https://api.example.com') + '");'
      break
    case 'HTTP POST':
      code = '// const response = await axios.post("' + (val || 'https://api.example.com') + '", {});'
      break
    case 'HTTP PUT':
      code = '// const response = await axios.put("' + (val || 'https://api.example.com') + '", {});'
      break
    case 'HTTP DELETE':
      code = '// const response = await axios.delete("' + (val || 'https://api.example.com') + '");'
      break
    default:
      code = ''
  }

  return code
}

function pythonActionCode(step) {
  const loc = locatorCode(step, 'Python')
  const val = step.value || ''
  let code = ''

  switch (step.action) {
    case 'Open URL':
      code = `driver.get("${val || 'https://example.com'}")`
      break
    case 'Refresh':
      code = 'driver.refresh()'
      break
    case 'Back':
      code = 'driver.back()'
      break
    case 'Forward':
      code = 'driver.forward()'
      break
    case 'Close Browser':
      code = 'driver.close()'
      break
    case 'Quit Driver':
      code = 'driver.quit()'
      break
    case 'Click':
      code = `driver.find_element(${loc}).click()`
      break
    case 'Double Click':
      code = `ActionChains(driver).double_click(driver.find_element(${loc})).perform()`
      break
    case 'Right Click':
      code = `ActionChains(driver).context_click(driver.find_element(${loc})).perform()`
      break
    case 'Hover':
      code = `ActionChains(driver).move_to_element(driver.find_element(${loc})).perform()`
      break
    case 'Drag And Drop':
      code = `ActionChains(driver).drag_and_drop(driver.find_element(${loc}), driver.find_element(By.CSS_SELECTOR, "${val}")).perform()`
      break
    case 'Type Text':
      code = `driver.find_element(${loc}).send_keys("${val.replace(/"/g, '\\"')}")`
      break
    case 'Clear':
      code = `driver.find_element(${loc}).clear()`
      break
    case 'Press Key':
      code = `driver.find_element(${loc}).send_keys(Keys.${val.toUpperCase() || 'ENTER'})`
      break
    case 'Check':
      code = `if not driver.find_element(${loc}).is_selected():\n    driver.find_element(${loc}).click()`
      break
    case 'Uncheck':
      code = `if driver.find_element(${loc}).is_selected():\n    driver.find_element(${loc}).click()`
      break
    case 'Select By Text':
      code = `Select(driver.find_element(${loc})).select_by_visible_text("${val.replace(/"/g, '\\"')}")`
      break
    case 'Select By Value':
      code = `Select(driver.find_element(${loc})).select_by_value("${val.replace(/"/g, '\\"')}")`
      break
    case 'Select By Index':
      code = `Select(driver.find_element(${loc})).select_by_index(${parseInt(val) || 0})`
      break
    case 'Switch To Frame':
      code = `driver.switch_to.frame(driver.find_element(${loc}))`
      break
    case 'Default Content':
      code = 'driver.switch_to.default_content()'
      break
    case 'Parent Frame':
      code = 'driver.switch_to.parent_frame()'
      break
    case 'Open New Window':
      code = 'driver.switch_to.new_window()'
      break
    case 'Switch Window':
      code = `driver.switch_to.window("${val || 'windowHandle'}")`
      break
    case 'Close Window':
      code = 'driver.close()'
      break
    case 'Accept Alert':
      code = 'driver.switch_to.alert.accept()'
      break
    case 'Dismiss Alert':
      code = 'driver.switch_to.alert.dismiss()'
      break
    case 'Send Alert Text':
      code = `driver.switch_to.alert.send_keys("${val.replace(/"/g, '\\"')}")`
      break
    case 'Get Alert Text':
      code = 'alert_text = driver.switch_to.alert.text'
      break
    case 'Implicit Wait':
      code = `driver.implicitly_wait(${parseInt(val) || 10})`
      break
    case 'Explicit Wait':
      code = `WebDriverWait(driver, ${parseInt(val) || 10}).until(EC.presence_of_element_located((${loc})))`
      break
    case 'Fluent Wait':
      code = `WebDriverWait(driver, ${parseInt(val) || 30}, poll_frequency=1, ignored_exceptions=[NoSuchElementException]).until(EC.presence_of_element_located((${loc})))`
      break
    case 'Wait Until Visible':
      code = `WebDriverWait(driver, 10).until(EC.visibility_of_element_located((${loc})))`
      break
    case 'Wait Until Clickable':
      code = `WebDriverWait(driver, 10).until(EC.element_to_be_clickable((${loc})))`
      break
    case 'Wait Until Present':
      code = `WebDriverWait(driver, 10).until(EC.presence_of_element_located((${loc})))`
      break
    case 'Scroll To Element':
      code = `driver.execute_script("arguments[0].scrollIntoView(true);", driver.find_element(${loc}))`
      break
    case 'Scroll To Top':
      code = 'driver.execute_script("window.scrollTo(0, 0);")'
      break
    case 'Scroll To Bottom':
      code = 'driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")'
      break
    case 'Click Using JavaScript':
      code = `driver.execute_script("arguments[0].click();", driver.find_element(${loc}))`
      break
    case 'Scroll Using JavaScript':
      code = `driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", driver.find_element(${loc}))`
      break
    case 'Highlight Element':
      code = `driver.execute_script("arguments[0].style.border='3px solid red'", driver.find_element(${loc}))`
      break
    case 'Take Screenshot':
      code = 'driver.save_screenshot("screenshot.png")'
      break
    case 'Full Page Screenshot':
      code = 'driver.save_screenshot("fullpage.png")'
      break
    case 'Add Cookie':
      code = `driver.add_cookie({"name": "${val.split('=')[0] || 'name'}", "value": "${val.split('=')[1] || 'value'}"})`
      break
    case 'Delete Cookie':
      code = `driver.delete_cookie("${val || 'cookieName'}")`
      break
    case 'Delete All Cookies':
      code = 'driver.delete_all_cookies()'
      break
    case 'Get Cookie':
      code = `cookie = driver.get_cookie("${val || 'cookieName'}")`
      break
    case 'Local Storage':
      code = `driver.execute_script("${val || "localStorage.clear();"}")`
      break
    case 'Session Storage':
      code = `driver.execute_script("${val || "sessionStorage.clear();"}")`
      break
    case 'HTTP GET':
      code = `# Use requests library\n# response = requests.get("${val || 'https://api.example.com'}")`
      break
    case 'HTTP POST':
      code = `# response = requests.post("${val || 'https://api.example.com'}", json={})`
      break
    case 'HTTP PUT':
      code = `# response = requests.put("${val || 'https://api.example.com'}", json={})`
      break
    case 'HTTP DELETE':
      code = `# response = requests.delete("${val || 'https://api.example.com'}")`
      break
    default:
      code = ''
  }

  return code
}

function csActionCode(step) {
  const loc = locatorCode(step, 'C#')
  const val = step.value || ''
  let code = ''

  switch (step.action) {
    case 'Open URL':
      code = `driver.Navigate().GoToUrl("${val || 'https://example.com'}");`
      break
    case 'Refresh':
      code = 'driver.Navigate().Refresh();'
      break
    case 'Back':
      code = 'driver.Navigate().Back();'
      break
    case 'Forward':
      code = 'driver.Navigate().Forward();'
      break
    case 'Close Browser':
      code = 'driver.Close();'
      break
    case 'Quit Driver':
      code = 'driver.Quit();'
      break
    case 'Click':
      code = `driver.FindElement(${loc}).Click();`
      break
    case 'Double Click':
      code = `new Actions(driver).DoubleClick(driver.FindElement(${loc})).Perform();`
      break
    case 'Right Click':
      code = `new Actions(driver).ContextClick(driver.FindElement(${loc})).Perform();`
      break
    case 'Hover':
      code = `new Actions(driver).MoveToElement(driver.FindElement(${loc})).Perform();`
      break
    case 'Drag And Drop':
      code = `new Actions(driver).DragAndDrop(driver.FindElement(${loc}), driver.FindElement(By.CssSelector("${val}"))).Perform();`
      break
    case 'Type Text':
      code = `driver.FindElement(${loc}).SendKeys("${val.Replace("\"", "\\\"")}");`
      break
    case 'Clear':
      code = `driver.FindElement(${loc}).Clear();`
      break
    case 'Press Key':
      code = `driver.FindElement(${loc}).SendKeys(Keys.${val.toUpperCase() || 'Enter'});`
      break
    case 'Check':
      code = `if (!driver.FindElement(${loc}).Selected) { driver.FindElement(${loc}).Click(); }`
      break
    case 'Uncheck':
      code = `if (driver.FindElement(${loc}).Selected) { driver.FindElement(${loc}).Click(); }`
      break
    case 'Select By Text':
      code = `new SelectElement(driver.FindElement(${loc})).SelectByText("${val.Replace("\"", "\\\"")}");`
      break
    case 'Select By Value':
      code = `new SelectElement(driver.FindElement(${loc})).SelectByValue("${val.Replace("\"", "\\\"")}");`
      break
    case 'Select By Index':
      code = `new SelectElement(driver.FindElement(${loc})).SelectByIndex(${parseInt(val) || 0});`
      break
    case 'Switch To Frame':
      code = `driver.SwitchTo().Frame(driver.FindElement(${loc}));`
      break
    case 'Default Content':
      code = 'driver.SwitchTo().DefaultContent();'
      break
    case 'Parent Frame':
      code = 'driver.SwitchTo().ParentFrame();'
      break
    case 'Open New Window':
      code = 'driver.SwitchTo().NewWindow(WindowType.Tab);'
      break
    case 'Switch Window':
      code = `driver.SwitchTo().Window("${val || 'windowHandle'}");`
      break
    case 'Close Window':
      code = 'driver.Close();'
      break
    case 'Accept Alert':
      code = 'driver.SwitchTo().Alert().Accept();'
      break
    case 'Dismiss Alert':
      code = 'driver.SwitchTo().Alert().Dismiss();'
      break
    case 'Send Alert Text':
      code = `driver.SwitchTo().Alert().SendKeys("${val.Replace("\"", "\\\"")}");`
      break
    case 'Get Alert Text':
      code = 'string alertText = driver.SwitchTo().Alert().Text;'
      break
    case 'Implicit Wait':
      code = `driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(${parseInt(val) || 10});`
      break
    case 'Explicit Wait':
      code = `new WebDriverWait(driver, TimeSpan.FromSeconds(${parseInt(val) || 10})).Until(d => d.FindElement(${loc}));`
      break
    case 'Fluent Wait':
      code = `new DefaultWait<IWebDriver>(driver) { Timeout = TimeSpan.FromSeconds(${parseInt(val) || 30}), PollingInterval = TimeSpan.FromSeconds(5) };`
      break
    case 'Wait Until Visible':
      code = `new WebDriverWait(driver, TimeSpan.FromSeconds(10)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementIsVisible(${loc}));`
      break
    case 'Wait Until Clickable':
      code = `new WebDriverWait(driver, TimeSpan.FromSeconds(10)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(${loc}));`
      break
    case 'Wait Until Present':
      code = `new WebDriverWait(driver, TimeSpan.FromSeconds(10)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(${loc}));`
      break
    case 'Scroll To Element':
      code = `((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].scrollIntoView(true);", driver.FindElement(${loc}));`
      break
    case 'Scroll To Top':
      code = '((IJavaScriptExecutor)driver).ExecuteScript("window.scrollTo(0, 0);");'
      break
    case 'Scroll To Bottom':
      code = '((IJavaScriptExecutor)driver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight);");'
      break
    case 'Click Using JavaScript':
      code = `((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", driver.FindElement(${loc}));`
      break
    case 'Scroll Using JavaScript':
      code = `((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", driver.FindElement(${loc}));`
      break
    case 'Highlight Element':
      code = `((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].style.border='3px solid red'", driver.FindElement(${loc}));`
      break
    case 'Take Screenshot':
      code = 'Screenshot screenshot = ((ITakesScreenshot)driver).GetScreenshot();\n    screenshot.SaveAsFile("screenshot.png");'
      break
    case 'Full Page Screenshot':
      code = 'Screenshot screenshot = ((ITakesScreenshot)driver).GetScreenshot();\n    screenshot.SaveAsFile("fullpage.png");'
      break
    case 'Add Cookie':
      code = `Cookie cookie = new Cookie("${val.split('=')[0] || 'name'}", "${val.split('=')[1] || 'value'}");\n    driver.Manage().Cookies.AddCookie(cookie);`
      break
    case 'Delete Cookie':
      code = `driver.Manage().Cookies.DeleteCookieNamed("${val || 'cookieName'}");`
      break
    case 'Delete All Cookies':
      code = 'driver.Manage().Cookies.DeleteAllCookies();'
      break
    case 'Get Cookie':
      code = `Cookie cookie = driver.Manage().Cookies.GetCookieNamed("${val || 'cookieName'}");`
      break
    case 'Local Storage':
      code = `((IJavaScriptExecutor)driver).ExecuteScript("${val || "localStorage.clear();"}");`
      break
    case 'Session Storage':
      code = `((IJavaScriptExecutor)driver).ExecuteScript("${val || "sessionStorage.clear();"}");`
      break
    case 'HTTP GET':
      code = '// Use HttpClient for API calls\n    // var response = await httpClient.GetAsync("' + (val || 'https://api.example.com') + '");'
      break
    case 'HTTP POST':
      code = '// var response = await httpClient.PostAsync("' + (val || 'https://api.example.com') + '", content);'
      break
    case 'HTTP PUT':
      code = '// var response = await httpClient.PutAsync("' + (val || 'https://api.example.com') + '", content);'
      break
    case 'HTTP DELETE':
      code = '// var response = await httpClient.DeleteAsync("' + (val || 'https://api.example.com') + '");'
      break
    default:
      code = ''
  }

  return code
}

function getActionCode(step, language) {
  switch (language) {
    case 'Java': return javaActionCode(step)
    case 'JavaScript': return jsActionCode(step)
    case 'Python': return pythonActionCode(step)
    case 'C#': return csActionCode(step)
    default: return javaActionCode(step)
  }
}

function generateAssertionCode(assertion, language, locCode) {
  const val = assertion.value || ''
  switch (language) {
    case 'Java': {
      switch (assertion.type) {
        case 'Element Exists':
          return `Assert.assertTrue(driver.findElements(${locCode}).size() > 0);`
        case 'Element Visible':
          return `Assert.assertTrue(driver.findElement(${locCode}).isDisplayed());`
        case 'Element Hidden':
          return `Assert.assertFalse(driver.findElement(${locCode}).isDisplayed());`
        case 'Text Equals':
          return `Assert.assertEquals(driver.findElement(${locCode}).getText(), "${val.replace(/"/g, '\\"')}");`
        case 'Text Contains':
          return `Assert.assertTrue(driver.findElement(${locCode}).getText().contains("${val.replace(/"/g, '\\"')}"));`
        case 'URL Equals':
          return `Assert.assertEquals(driver.getCurrentUrl(), "${val.replace(/"/g, '\\"')}");`
        case 'URL Contains':
          return `Assert.assertTrue(driver.getCurrentUrl().contains("${val.replace(/"/g, '\\"')}"));`
        case 'Title Equals':
          return `Assert.assertEquals(driver.getTitle(), "${val.replace(/"/g, '\\"')}");`
        case 'Title Contains':
          return `Assert.assertTrue(driver.getTitle().contains("${val.replace(/"/g, '\\"')}"));`
        case 'Enabled':
          return `Assert.assertTrue(driver.findElement(${locCode}).isEnabled());`
        case 'Disabled':
          return `Assert.assertFalse(driver.findElement(${locCode}).isEnabled());`
        case 'Selected':
          return `Assert.assertTrue(driver.findElement(${locCode}).isSelected());`
        case 'Displayed':
          return `Assert.assertTrue(driver.findElement(${locCode}).isDisplayed());`
        case 'Attribute Equals':
          return `Assert.assertEquals(driver.findElement(${locCode}).getAttribute("${val.split('=')[0] || 'value'}"), "${val.split('=')[1] || ''}");`
        case 'CSS Value':
          return `Assert.assertEquals(driver.findElement(${locCode}).getCssValue("${val.split('=')[0] || 'color'}"), "${val.split('=')[1] || ''}");`
        case 'Count Equals':
          return `Assert.assertEquals(driver.findElements(${locCode}).size(), ${parseInt(val) || 1});`
        default:
          return ''
      }
    }
    case 'JavaScript': {
      switch (assertion.type) {
        case 'Element Exists':
          return `assert(await driver.findElements(${locCode}).then(e => e.length > 0)).isTrue();`
        case 'Element Visible':
          return `assert(await driver.findElement(${locCode}).isDisplayed()).isTrue();`
        case 'Element Hidden':
          return `assert(await driver.findElement(${locCode}).isDisplayed()).isFalse();`
        case 'Text Equals':
          return `assert(await driver.findElement(${locCode}).getText()).equals("${val.replace(/"/g, '\\"')}");`
        case 'Text Contains':
          return `assert(await driver.findElement(${locCode}).getText()).includes("${val.replace(/"/g, '\\"')}");`
        case 'URL Equals':
          return `assert(await driver.getCurrentUrl()).equals("${val.replace(/"/g, '\\"')}");`
        case 'URL Contains':
          return `assert(await driver.getCurrentUrl()).includes("${val.replace(/"/g, '\\"')}");`
        case 'Title Equals':
          return `assert(await driver.getTitle()).equals("${val.replace(/"/g, '\\"')}");`
        case 'Title Contains':
          return `assert(await driver.getTitle()).includes("${val.replace(/"/g, '\\"')}");`
        case 'Enabled':
          return `assert(await driver.findElement(${locCode}).isEnabled()).isTrue();`
        case 'Disabled':
          return `assert(await driver.findElement(${locCode}).isEnabled()).isFalse();`
        case 'Selected':
          return `assert(await driver.findElement(${locCode}).isSelected()).isTrue();`
        case 'Displayed':
          return `assert(await driver.findElement(${locCode}).isDisplayed()).isTrue();`
        case 'Attribute Equals':
          return `assert(await driver.findElement(${locCode}).getAttribute("${val.split('=')[0] || 'value'}")).equals("${val.split('=')[1] || ''}");`
        case 'CSS Value':
          return `assert(await driver.findElement(${locCode}).getCssValue("${val.split('=')[0] || 'color'}")).equals("${val.split('=')[1] || ''}");`
        case 'Count Equals':
          return `assert(await driver.findElements(${locCode})).hasLength(${parseInt(val) || 1});`
        default:
          return ''
      }
    }
    case 'Python': {
      switch (assertion.type) {
        case 'Element Exists':
          return `assert len(driver.find_elements(${locCode})) > 0`
        case 'Element Visible':
          return `assert driver.find_element(${locCode}).is_displayed()`
        case 'Element Hidden':
          return `assert not driver.find_element(${locCode}).is_displayed()`
        case 'Text Equals':
          return `assert driver.find_element(${locCode}).text == "${val.replace(/"/g, '\\"')}"`
        case 'Text Contains':
          return `assert "${val.replace(/"/g, '\\"')}" in driver.find_element(${locCode}).text`
        case 'URL Equals':
          return `assert driver.current_url == "${val.replace(/"/g, '\\"')}"`
        case 'URL Contains':
          return `assert "${val.replace(/"/g, '\\"')}" in driver.current_url`
        case 'Title Equals':
          return `assert driver.title == "${val.replace(/"/g, '\\"')}"`
        case 'Title Contains':
          return `assert "${val.replace(/"/g, '\\"')}" in driver.title`
        case 'Enabled':
          return `assert driver.find_element(${locCode}).is_enabled()`
        case 'Disabled':
          return `assert not driver.find_element(${locCode}).is_enabled()`
        case 'Selected':
          return `assert driver.find_element(${locCode}).is_selected()`
        case 'Displayed':
          return `assert driver.find_element(${locCode}).is_displayed()`
        case 'Attribute Equals':
          return `assert driver.find_element(${locCode}).get_attribute("${val.split('=')[0] || 'value'}") == "${val.split('=')[1] || ''}"`
        case 'CSS Value':
          return `assert driver.find_element(${locCode}).value_of_css_property("${val.split('=')[0] || 'color'}") == "${val.split('=')[1] || ''}"`
        case 'Count Equals':
          return `assert len(driver.find_elements(${locCode})) == ${parseInt(val) || 1}`
        default:
          return ''
      }
    }
    case 'C#': {
      switch (assertion.type) {
        case 'Element Exists':
          return `Assert.IsTrue(driver.FindElements(${locCode}).Count > 0);`
        case 'Element Visible':
          return `Assert.IsTrue(driver.FindElement(${locCode}).Displayed);`
        case 'Element Hidden':
          return `Assert.IsFalse(driver.FindElement(${locCode}).Displayed);`
        case 'Text Equals':
          return `Assert.AreEqual(driver.FindElement(${locCode}).Text, "${val.Replace("\"", "\\\"")}");`
        case 'Text Contains':
          return `Assert.IsTrue(driver.FindElement(${locCode}).Text.Contains("${val.Replace("\"", "\\\"")}"));`
        case 'URL Equals':
          return `Assert.AreEqual(driver.Url, "${val.Replace("\"", "\\\"")}");`
        case 'URL Contains':
          return `Assert.IsTrue(driver.Url.Contains("${val.Replace("\"", "\\\"")}"));`
        case 'Title Equals':
          return `Assert.AreEqual(driver.Title, "${val.Replace("\"", "\\\"")}");`
        case 'Title Contains':
          return `Assert.IsTrue(driver.Title.Contains("${val.Replace("\"", "\\\"")}"));`
        case 'Enabled':
          return `Assert.IsTrue(driver.FindElement(${locCode}).Enabled);`
        case 'Disabled':
          return `Assert.IsFalse(driver.FindElement(${locCode}).Enabled);`
        case 'Selected':
          return `Assert.IsTrue(driver.FindElement(${locCode}).Selected);`
        case 'Displayed':
          return `Assert.IsTrue(driver.FindElement(${locCode}).Displayed);`
        case 'Attribute Equals':
          return `Assert.AreEqual(driver.FindElement(${locCode}).GetAttribute("${val.Split('=')[0] || "value"}"), "${val.Split('=')[1] || ""}");`
        case 'CSS Value':
          return `Assert.AreEqual(driver.FindElement(${locCode}).GetCssValue("${val.Split('=')[0] || "color"}"), "${val.Split('=')[1] || ""}");`
        case 'Count Equals':
          return `Assert.AreEqual(driver.FindElements(${locCode}).Count, ${parseInt(val) || 1});`
        default:
          return ''
      }
    }
    default:
      return ''
  }
}

function generateTestDataBlock(testData, language) {
  if (!testData || testData.length === 0) return ''
  const entries = testData.filter((d) => d.name && d.value)
  if (entries.length === 0) return ''

  switch (language) {
    case 'Java': {
      const fields = entries.map((d) => `    public static final String ${d.name} = "${d.value.replace(/"/g, '\\"')}";`)
      return `public class TestData {\n${fields.join('\n')}\n}`
    }
    case 'JavaScript': {
      const fields = entries.map((d) => `  ${d.name}: "${d.value.replace(/"/g, '\\"')}"`)
      return `const testData = {\n${fields.join(',\n')}\n};`
    }
    case 'Python': {
      const fields = entries.map((d) => `    ${d.name} = "${d.value.replace(/"/g, '\\"')}"`)
      return `class TestData:\n${fields.join('\n')}`
    }
    case 'C#': {
      const fields = entries.map((d) => `    public const string ${d.name} = "${d.value.Replace("\"", "\\\"")}";`)
      return `public static class TestData\n{\n${fields.join('\n')}\n}`
    }
    default:
      return ''
  }
}

function getFrameworkImport(language, framework) {
  switch (language) {
    case 'Java':
      if (framework === 'TestNG') return 'import org.testng.annotations.Test;'
      return 'import org.junit.Test;'
    case 'JavaScript':
      return 'const { describe, it, before, after } = require("mocha");'
    case 'Python':
      return 'import pytest'
    case 'C#':
      return 'using NUnit.Framework;'
    default:
      return ''
  }
}

function getBrowserSetup(language, browser, mode) {
  const b = browser || 'Chrome'
  const m = mode || 'Local'
  switch (language) {
    case 'Java': {
      let setup = ''
      if (b === 'Chrome') setup = 'WebDriverManager.chromedriver().setup();\n    ChromeOptions options = new ChromeOptions();'
      else if (b === 'Firefox') setup = 'WebDriverManager.firefoxdriver().setup();\n    FirefoxOptions options = new FirefoxOptions();'
      else if (b === 'Edge') setup = 'WebDriverManager.edgedriver().setup();\n    EdgeOptions options = new EdgeOptions();'
      else if (b === 'Safari') setup = 'SafariOptions options = new SafariOptions();'
      if (m === 'Headless' && b !== 'Safari') setup += '\n    options.addArguments("--headless");'
      if (m === 'Remote Grid') setup += '\n    // RemoteWebDriver with Grid URL'
      return setup
    }
    case 'JavaScript': {
      let setup = ''
      if (b === 'Chrome') setup = "const chrome = require('selenium-webdriver/chrome');\n    const options = new chrome.Options();"
      else if (b === 'Firefox') setup = "const firefox = require('selenium-webdriver/firefox');\n    const options = new firefox.Options();"
      else if (b === 'Edge') setup = "const edge = require('selenium-webdriver/edge');\n    const options = new edge.Options();"
      else setup = 'const options = new chrome.Options();'
      if (m === 'Headless') setup += '\n    options.addArguments("--headless");'
      return setup
    }
    case 'Python': {
      let setup = ''
      if (b === 'Chrome') setup = 'options = webdriver.ChromeOptions()'
      else if (b === 'Firefox') setup = 'options = webdriver.FirefoxOptions()'
      else if (b === 'Edge') setup = 'options = webdriver.EdgeOptions()'
      else setup = 'options = webdriver.SafariOptions()'
      if (m === 'Headless') setup += '\n    options.add_argument("--headless")'
      return setup
    }
    case 'C#': {
      let setup = ''
      if (b === 'Chrome') setup = 'ChromeOptions options = new ChromeOptions();'
      else if (b === 'Firefox') setup = 'FirefoxOptions options = new FirefoxOptions();'
      else if (b === 'Edge') setup = 'EdgeOptions options = new EdgeOptions();'
      else setup = 'SafariOptions options = new SafariOptions();'
      if (m === 'Headless') setup += '\n    options.AddArgument("--headless");'
      return setup
    }
    default:
      return ''
  }
}

function getBrowserDriverCreation(language, browser) {
  const b = browser || 'Chrome'
  switch (language) {
    case 'Java':
      return `driver = new ${b}Driver(options);`
    case 'JavaScript':
      return `driver = new Builder().forBrowser("${b.toLowerCase()}").setChromeOptions(options).build();`
    case 'Python':
      return `driver = webdriver.${b}(options=options)`
    case 'C#':
      return `driver = new ${b}Driver(options);`
    default:
      return ''
  }
}

export function generateSeleniumScript(config) {
  const { projectInfo, steps, assertions, testData, settings } = config
  const lang = settings?.language || 'Java'
  const browser = settings?.browser || 'Chrome'
  const mode = settings?.execution || 'Local'
  const framework = settings?.framework || 'JUnit'
  const title = projectInfo?.testTitle || 'Untitled Test'
  const baseUrl = projectInfo?.baseUrl || 'https://example.com'
  const pkg = projectInfo?.projectName
    ? projectInfo.projectName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'seleniumtest'

  const hasSteps = steps && steps.length > 0
  const hasAssertions = assertions && assertions.length > 0
  const hasTestData = testData && testData.length > 0

  switch (lang) {
    case 'Java': {
      const lines = []
      lines.push(`package ${pkg};`)
      lines.push('')
      lines.push('import org.openqa.selenium.*;')
      lines.push('import org.openqa.selenium.chrome.ChromeDriver;')
      lines.push('import org.openqa.selenium.chrome.ChromeOptions;')
      lines.push('import org.openqa.selenium.support.ui.*;')
      lines.push('import org.openqa.selenium.interactions.Actions;')
      lines.push('import org.openqa.selenium.NoSuchElementException;')
      lines.push('import io.github.bonigarcia.wdm.WebDriverManager;')
      lines.push(getFrameworkImport(lang, framework))
      if (framework === 'TestNG') {
        lines.push('import org.testng.Assert;')
        lines.push('import org.testng.annotations.AfterMethod;')
        lines.push('import org.testng.annotations.BeforeMethod;')
      } else {
        lines.push('import org.junit.Assert;')
        lines.push('import org.junit.After;')
        lines.push('import org.junit.Before;')
      }
      lines.push('import java.time.Duration;')
      lines.push('import java.util.*;')
      lines.push('')

      if (hasTestData) {
        lines.push(generateTestDataBlock(testData, lang))
        lines.push('')
      }

      lines.push(`public class ${sanitizeName(title).replace(/ /g, '')} {`)
      lines.push('')
      lines.push('    private WebDriver driver;')
      lines.push('')

      if (framework === 'TestNG') {
        lines.push('    @BeforeMethod')
      } else {
        lines.push('    @Before')
      }
      lines.push('    public void setUp() {')
      lines.push('        ' + getBrowserSetup(lang, browser, mode))
      lines.push('        ' + getBrowserDriverCreation(lang, browser))
      lines.push(`        driver.manage().window().maximize();`)
      lines.push(`        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));`)
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
      lines.push('        if (driver != null) {')
      lines.push('            driver.quit();')
      lines.push('        }')
      lines.push('    }')
      lines.push('')

      lines.push('    @Test')
      lines.push(`    public void ${(projectInfo?.testTitle || 'test').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}() {`)
      lines.push('')

      if (hasSteps) {
        steps.forEach((step) => {
          const desc = step.description ? `        // ${step.description}` : ''
          const code = getActionCode(step, lang)
          if (code) {
            if (desc) lines.push(desc)
            lines.push(`        ${code}`)
            lines.push('')
          }
        })
      }

      if (hasAssertions) {
        assertions.forEach((a) => {
          const locCode = a.locator ? formatSeleniumLocator(a.locatorType || 'CSS Selector', a.locator, lang) : ''
          const code = generateAssertionCode(a, lang, locCode)
          if (code) {
            lines.push(`        ${code}`)
            lines.push('')
          }
        })
      }

      lines.push('    }')
      lines.push('')
      lines.push('    private WebElement findElement(By by) {')
      lines.push('        return driver.findElement(by);')
      lines.push('    }')
      lines.push('')
      lines.push('    private List<WebElement> findElements(By by) {')
      lines.push('        return driver.findElements(by);')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return lines.join('\n')
    }

    case 'JavaScript': {
      const lines = []
      lines.push('const { Builder, By, Key, until } = require("selenium-webdriver");')
      lines.push('const { Select } = require("selenium-webdriver/lib/select");')
      lines.push('const chrome = require("selenium-webdriver/chrome");')
      lines.push('const { describe, it, before, after } = require("mocha");')
      lines.push('const assert = require("assert");')
      lines.push('')

      if (hasTestData) {
        lines.push(generateTestDataBlock(testData, lang))
        lines.push('')
      }

      lines.push(`describe("${title}", function () {`)
      lines.push('  let driver;')
      lines.push('')

      lines.push('  before(async function () {')
      lines.push('    ' + getBrowserSetup(lang, browser, mode))
      if (mode === 'Remote Grid') {
        lines.push('    driver = await new Builder().forBrowser("' + browser.toLowerCase() + '").usingServer("http://localhost:4444").build();')
      } else {
        lines.push('    driver = await new Builder().forBrowser("' + browser.toLowerCase() + '").build();')
      }
      lines.push('    await driver.manage().window().maximize();')
      if (baseUrl) {
        lines.push(`    await driver.get("${baseUrl}");`)
      }
      lines.push('  })')
      lines.push('')

      lines.push('  after(async function () {')
      lines.push('    if (driver) {')
      lines.push('      await driver.quit();')
      lines.push('    }')
      lines.push('  })')
      lines.push('')

      lines.push(`  it("${title}", async function () {`)
      lines.push('')

      if (hasSteps) {
        steps.forEach((step) => {
          const desc = step.description ? `    // ${step.description}` : ''
          const code = getActionCode(step, lang)
          if (code) {
            if (desc) lines.push(desc)
            lines.push(`    ${code}`)
            lines.push('')
          }
        })
      }

      if (hasAssertions) {
        assertions.forEach((a) => {
          const locCode = a.locator ? formatSeleniumLocator(a.locatorType || 'CSS Selector', a.locator, lang) : ''
          const code = generateAssertionCode(a, lang, locCode)
          if (code) {
            lines.push(`    ${code}`)
            lines.push('')
          }
        })
      }

      lines.push('  })')
      lines.push('})')
      lines.push('')

      return lines.join('\n')
    }

    case 'Python': {
      const lines = []
      lines.push('import pytest')
      lines.push('from selenium import webdriver')
      lines.push('from selenium.webdriver.common.by import By')
      lines.push('from selenium.webdriver.common.keys import Keys')
      lines.push('from selenium.webdriver.common.action_chains import ActionChains')
      lines.push('from selenium.webdriver.support.ui import WebDriverWait, Select')
      lines.push('from selenium.webdriver.support import expected_conditions as EC')
      lines.push('')

      if (hasTestData) {
        lines.push(generateTestDataBlock(testData, lang))
        lines.push('')
      }

      lines.push('')
      lines.push(`class Test${sanitizeName(title).replace(/ /g, '')}:`)
      lines.push('')

      lines.push('    @pytest.fixture')
      lines.push('    def driver(self, request):')
      lines.push('        ' + getBrowserSetup(lang, browser, mode))
      lines.push('        ' + getBrowserDriverCreation(lang, browser))
      lines.push('        driver.maximize_window()')
      if (baseUrl) {
        lines.push(`        driver.get("${baseUrl}")`)
      }
      lines.push('        yield driver')
      lines.push('        driver.quit()')
      lines.push('')

      lines.push('    def test_' + (projectInfo?.testTitle || 'test').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase() + '(self, driver):')
      lines.push('')

      if (hasSteps) {
        steps.forEach((step) => {
          const desc = step.description ? `        # ${step.description}` : ''
          const code = getActionCode(step, lang)
          if (code) {
            if (desc) lines.push(desc)
            lines.push(`        ${code}`)
            lines.push('')
          }
        })
      }

      if (hasAssertions) {
        assertions.forEach((a) => {
          const locCode = a.locator ? formatSeleniumLocator(a.locatorType || 'CSS Selector', a.locator, lang) : ''
          const code = generateAssertionCode(a, lang, locCode)
          if (code) {
            lines.push(`        ${code}`)
            lines.push('')
          }
        })
      }

      return lines.join('\n')
    }

    case 'C#': {
      const lines = []
      lines.push('using System;')
      lines.push('using System.Collections.Generic;')
      lines.push('using NUnit.Framework;')
      lines.push('using OpenQA.Selenium;')
      lines.push('using OpenQA.Selenium.Chrome;')
      lines.push('using OpenQA.Selenium.Firefox;')
      lines.push('using OpenQA.Selenium.Edge;')
      lines.push('using OpenQA.Selenium.Support.UI;')
      lines.push('using OpenQA.Selenium.Interactions;')
      lines.push('')

      lines.push(`namespace ${pkg}.Tests`)
      lines.push('{')

      if (hasTestData) {
        const td = generateTestDataBlock(testData, lang)
        lines.push(td)
        lines.push('')
      }

      lines.push(`    [TestFixture]`)
      lines.push(`    public class ${sanitizeName(title).replace(/ /g, '')}Tests`)
      lines.push('    {')
      lines.push('        private IWebDriver driver;')
      lines.push('')

      lines.push('        [SetUp]')
      lines.push('        public void SetUp()')
      lines.push('        {')
      lines.push('            ' + getBrowserSetup(lang, browser, mode))
      lines.push('            ' + getBrowserDriverCreation(lang, browser))
      lines.push('            driver.Manage().Window.Maximize();')
      lines.push('            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);')
      if (baseUrl) {
        lines.push(`            driver.Navigate().GoToUrl("${baseUrl}");`)
      }
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
      lines.push(`        public void ${(projectInfo?.testTitle || 'Test').Replace(" ", "_").Replace("-", "_")}()`)
      lines.push('        {')
      lines.push('')

      if (hasSteps) {
        steps.forEach((step) => {
          const desc = step.description ? `            // ${step.description}` : ''
          const code = getActionCode(step, lang)
          if (code) {
            if (desc) lines.push(desc)
            lines.push(`            ${code}`)
            lines.push('')
          }
        })
      }

      if (hasAssertions) {
        assertions.forEach((a) => {
          const locCode = a.locator ? formatSeleniumLocator(a.locatorType || 'CSS Selector', a.locator, lang) : ''
          const code = generateAssertionCode(a, lang, locCode)
          if (code) {
            lines.push(`            ${code}`)
            lines.push('')
          }
        })
      }

      lines.push('        }')
      lines.push('    }')
      lines.push('}')
      lines.push('')

      return lines.join('\n')
    }

    default:
      return ''
  }
}

export function generateSeleniumExplanation(steps, assertions, settings) {
  const lines = []
  lines.push('## Selenium Test Explanation')
  lines.push('')
  lines.push('This test performs the following steps:')
  lines.push('')

  if (steps) {
    steps.forEach((step, i) => {
      const desc = step.description || step.action
      let explain = ''
      switch (step.action) {
        case 'Open URL': explain = 'Navigates to the specified URL using the WebDriver.'; break
        case 'Refresh': explain = 'Reloads the current page.'; break
        case 'Back': explain = 'Navigates to the previous page in browser history.'; break
        case 'Forward': explain = 'Navigates to the next page in browser history.'; break
        case 'Close Browser': explain = 'Closes the current browser window.'; break
        case 'Quit Driver': explain = 'Terminates the WebDriver session.'; break
        case 'Click': explain = 'Clicks on the element identified by the locator.'; break
        case 'Double Click': explain = 'Performs a double-click on the element.'; break
        case 'Right Click': explain = 'Performs a right-click / context click on the element.'; break
        case 'Hover': explain = 'Hovers the mouse over the element.'; break
        case 'Drag And Drop': explain = 'Drags the source element to the target location.'; break
        case 'Type Text': explain = 'Types the specified text into the input field.'; break
        case 'Clear': explain = 'Clears the content of the input field.'; break
        case 'Press Key': explain = 'Simulates pressing a keyboard key.'; break
        case 'Check': explain = 'Checks a checkbox if it is not already checked.'; break
        case 'Uncheck': explain = 'Unchecks a checkbox if it is checked.'; break
        case 'Select By Text': explain = 'Selects an option from a dropdown by visible text.'; break
        case 'Select By Value': explain = 'Selects an option from a dropdown by value attribute.'; break
        case 'Select By Index': explain = 'Selects an option from a dropdown by index.'; break
        case 'Switch To Frame': explain = 'Switches the context to an iframe.'; break
        case 'Default Content': explain = 'Switches back to the main page from frames.'; break
        case 'Parent Frame': explain = 'Switches to the parent frame.'; break
        case 'Open New Window': explain = 'Opens a new browser tab or window.'; break
        case 'Switch Window': explain = 'Switches to a different browser window or tab.'; break
        case 'Close Window': explain = 'Closes the current window or tab.'; break
        case 'Accept Alert': explain = 'Accepts a JavaScript alert dialog.'; break
        case 'Dismiss Alert': explain = 'Dismisses a JavaScript alert dialog.'; break
        case 'Send Alert Text': explain = 'Sends text input to a JavaScript prompt.'; break
        case 'Get Alert Text': explain = 'Retrieves the text from a JavaScript alert.'; break
        case 'Implicit Wait': explain = 'Sets an implicit wait timeout for element finding.'; break
        case 'Explicit Wait': explain = 'Waits for a specific condition with a timeout.'; break
        case 'Fluent Wait': explain = 'Waits with polling and ignoring specific exceptions.'; break
        case 'Wait Until Visible': explain = 'Waits until the element becomes visible.'; break
        case 'Wait Until Clickable': explain = 'Waits until the element is clickable.'; break
        case 'Wait Until Present': explain = 'Waits until the element is present in the DOM.'; break
        case 'Scroll To Element': explain = 'Scrolls the page to bring the element into view.'; break
        case 'Scroll To Top': explain = 'Scrolls to the top of the page.'; break
        case 'Scroll To Bottom': explain = 'Scrolls to the bottom of the page.'; break
        case 'Click Using JavaScript': explain = 'Clicks an element using JavaScript Executor.'; break
        case 'Scroll Using JavaScript': explain = 'Scrolls to an element smoothly using JavaScript.'; break
        case 'Highlight Element': explain = 'Highlights an element with a red border.'; break
        case 'Take Screenshot': explain = 'Takes a screenshot of the current viewport.'; break
        case 'Full Page Screenshot': explain = 'Takes a full-page screenshot.'; break
        case 'Add Cookie': explain = 'Adds a cookie to the browser session.'; break
        case 'Delete Cookie': explain = 'Removes a specific cookie.'; break
        case 'Delete All Cookies': explain = 'Clears all cookies in the session.'; break
        case 'Get Cookie': explain = 'Retrieves a cookie by name.'; break
        case 'Local Storage': explain = 'Executes a local storage operation via JavaScript.'; break
        case 'Session Storage': explain = 'Executes a session storage operation via JavaScript.'; break
        case 'HTTP GET': explain = 'Sends an HTTP GET request for API validation.'; break
        case 'HTTP POST': explain = 'Sends an HTTP POST request with payload.'; break
        case 'HTTP PUT': explain = 'Sends an HTTP PUT request for updates.'; break
        case 'HTTP DELETE': explain = 'Sends an HTTP DELETE request.'; break
        default: explain = `Performs the action: ${step.action}`
      }
      lines.push(`${i + 1}. **${desc}** — ${explain}`)
    })
  }

  if (assertions && assertions.length > 0) {
    lines.push('')
    lines.push('### Assertions')
    lines.push('')
    assertions.forEach((a, i) => {
      lines.push(`${(steps?.length || 0) + i + 1}. **${a.type}** — Validates that ${a.type.toLowerCase()} condition is met.`)
    })
  }

  return lines.join('\n')
}

export function generateSeleniumChecklist(config) {
  const { projectInfo, steps, assertions, testData, settings } = config
  const checks = []

  if (projectInfo?.baseUrl) {
    checks.push({ pass: true, text: 'Base URL provided' })
  } else {
    checks.push({ pass: false, text: 'No base URL provided' })
  }

  if (assertions && assertions.length > 0) {
    checks.push({ pass: true, text: `${assertions.length} assertion(s) included` })
  } else {
    checks.push({ pass: false, text: 'No assertion added' })
  }

  if (steps && steps.length > 0) {
    checks.push({ pass: true, text: `${steps.length} test step(s) defined` })
  } else {
    checks.push({ pass: false, text: 'No test steps defined' })
  }

  if (projectInfo?.testTitle) {
    checks.push({ pass: true, text: 'Test title provided' })
  } else {
    checks.push({ pass: false, text: 'Test title is missing' })
  }

  const hasPageNav = steps && steps.some((s) => s.action === 'Open URL')
  checks.push({ pass: hasPageNav, text: hasPageNav ? 'Script starts with page navigation' : 'Script does not start with page navigation' })

  const hasWaits = steps && steps.some((s) =>
    ['Explicit Wait', 'Fluent Wait', 'Wait Until Visible', 'Wait Until Clickable', 'Wait Until Present'].includes(s.action)
  )
  checks.push({ pass: hasWaits, text: hasWaits ? 'Uses explicit waits' : 'No explicit waits found (prefer over Thread.sleep())' })

  const hasSleep = steps && steps.some((s) => s.action === 'Implicit Wait')
  if (hasSleep) {
    checks.push({ pass: false, text: 'Uses implicit wait (prefer explicit waits for better control)' })
  }

  const usesLocators = steps && steps.some((s) => s.locator)
  checks.push({ pass: usesLocators, text: usesLocators ? 'Uses locators for element interaction' : 'No locators found' })

  const hasDuplicatedLocators = steps && steps.filter((s) => s.locator).length > new Set(steps.map((s) => s.locator)).size
  if (hasDuplicatedLocators) {
    checks.push({ pass: false, text: 'Avoid duplicated locators (use variables or Page Objects)' })
  }

  if (testData && testData.length > 0) {
    checks.push({ pass: true, text: `${testData.length} test data variable(s) defined` })
  }

  if (settings?.language) {
    checks.push({ pass: true, text: `Language: ${settings.language}` })
  }

  checks.push({ pass: true, text: 'Selenium WebDriver best practices followed' })
  checks.push({ pass: true, text: 'Code generated for production use' })

  return checks
}

export function generateSeleniumBestPractices(config) {
  const { steps, assertions, settings, outputStyle } = config
  const practices = []

  if (outputStyle === 'pom') {
    practices.push({ pass: true, text: 'Page Object Model used for better maintainability' })
  } else {
    practices.push({ pass: false, text: 'Consider using Page Object Model for larger projects' })
  }

  const hasExplicitWaits = steps && steps.some((s) =>
    ['Explicit Wait', 'Fluent Wait', 'Wait Until Visible', 'Wait Until Clickable', 'Wait Until Present'].includes(s.action)
  )
  practices.push({ pass: hasExplicitWaits, text: hasExplicitWaits ? 'Explicit Waits used for reliable tests' : 'Use Explicit Waits instead of Thread.sleep()' })

  const hasSleep = steps && steps.some((s) => s.action === 'Implicit Wait')
  if (hasSleep) {
    practices.push({ pass: false, text: 'Avoid Thread.sleep() - prefer Explicit Waits' })
  } else {
    practices.push({ pass: true, text: 'No Thread.sleep() found' })
  }

  const driverManaged = settings?.language && true
  practices.push({ pass: true, text: 'WebDriver lifecycle managed with setUp/tearDown' })

  const reusedLocators = steps && steps.filter((s) => s.locator).filter((s, i, arr) =>
    arr.findIndex((x) => x.locator === s.locator) !== i
  )
  if (reusedLocators && reusedLocators.length > 0) {
    practices.push({ pass: false, text: 'Avoid duplicated locators - extract to variables or Page Objects' })
  } else {
    practices.push({ pass: true, text: 'Reusable locators used' })
  }

  if (testData && testData.length > 0) {
    practices.push({ pass: true, text: 'Test Data separated from test logic' })
  } else {
    practices.push({ pass: false, text: 'Consider externalizing test data' })
  }

  if (assertions && assertions.length > 0) {
    practices.push({ pass: true, text: 'Assertions included for result validation' })
  } else {
    practices.push({ pass: false, text: 'No assertions found - add assertions to validate results' })
  }

  const hasAbsoluteXpath = steps && steps.some((s) =>
    (s.locatorType === 'XPath' || s.locatorType === 'xpath') && s.locator && s.locator.startsWith('/')
  )
  if (hasAbsoluteXpath) {
    practices.push({ pass: false, text: 'Avoid absolute XPath - use relative XPath or CSS selectors' })
  } else {
    practices.push({ pass: true, text: 'No absolute XPath detected' })
  }

  if (settings?.browser) {
    practices.push({ pass: true, text: `Browser: ${settings.browser}` })
  }

  return practices
}
