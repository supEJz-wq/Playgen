export const locatorTypes = [
  { label: 'CSS Selector', value: 'CSS Selector', example: '#button-id' },
  { label: 'XPath', value: 'XPath', example: '//button[@id="submit"]' },
  { label: 'ID', value: 'ID', example: 'username' },
  { label: 'Name', value: 'Name', example: 'email' },
  { label: 'Class Name', value: 'Class Name', example: 'btn-primary' },
  { label: 'Role', value: 'Role', example: 'button' },
  { label: 'Text', value: 'Text', example: 'Sign In' },
  { label: 'Placeholder', value: 'Placeholder', example: 'Enter email' },
  { label: 'Label', value: 'Label', example: 'Password' },
  { label: 'Alt Text', value: 'Alt Text', example: 'Product image' },
  { label: 'Test ID', value: 'Test ID', example: 'login-button' },
]

export function formatLocator(framework, language, locatorType, locator) {
  if (!locator) return ''

  if (framework === 'playwright') {
    return formatPlaywrightLocator(locatorType, locator)
  }

  if (framework === 'selenium') {
    return formatSeleniumLocator(language, locatorType, locator)
  }

  return locator
}

function formatPlaywrightLocator(locatorType, locator) {
  switch (locatorType) {
    case 'CSS Selector':
      return `page.locator('${locator}')`
    case 'XPath':
      return `page.locator('${locator}')`
    case 'ID':
      return `page.locator('#${locator}')`
    case 'Name':
      return `page.locator('[name="${locator}"]')`
    case 'Class Name':
      return `page.locator('.${locator}')`
    case 'Role':
      return `page.getByRole('${locator}')`
    case 'Text':
      return `page.getByText('${locator}')`
    case 'Placeholder':
      return `page.getByPlaceholder('${locator}')`
    case 'Label':
      return `page.getByLabel('${locator}')`
    case 'Alt Text':
      return `page.getByAltText('${locator}')`
    case 'Test ID':
      return `page.getByTestId('${locator}')`
    default:
      return `page.locator('${locator}')`
  }
}

function formatSeleniumLocator(language, locatorType, locator) {
  const b = (v) => {
    if (language === 'Java') return `"${v}"`
    if (language === 'Python') return `"${v}"`
    if (language === 'JavaScript') return `'${v}'`
    if (language === 'C#') return `"${v}"`
    return `"${v}"`
  }

  switch (locatorType) {
    case 'ID':
      if (language === 'Java') return `By.id(${b(locator)})`
      if (language === 'Python') return `By.ID, ${b(locator)}`
      if (language === 'JavaScript') return `By.id(${b(locator)})`
      if (language === 'C#') return `By.Id(${b(locator)})`
    case 'Name':
      if (language === 'Java') return `By.name(${b(locator)})`
      if (language === 'Python') return `By.NAME, ${b(locator)}`
      if (language === 'JavaScript') return `By.name(${b(locator)})`
      if (language === 'C#') return `By.Name(${b(locator)})`
    case 'Class Name':
      if (language === 'Java') return `By.className(${b(locator)})`
      if (language === 'Python') return `By.CLASS_NAME, ${b(locator)}`
      if (language === 'JavaScript') return `By.className(${b(locator)})`
      if (language === 'C#') return `By.ClassName(${b(locator)})`
    case 'CSS Selector':
      if (language === 'Java') return `By.cssSelector(${b(locator)})`
      if (language === 'Python') return `By.CSS_SELECTOR, ${b(locator)}`
      if (language === 'JavaScript') return `By.css(${b(locator)})`
      if (language === 'C#') return `By.CssSelector(${b(locator)})`
    case 'XPath':
      if (language === 'Java') return `By.xpath(${b(locator)})`
      if (language === 'Python') return `By.XPATH, ${b(locator)}`
      if (language === 'JavaScript') return `By.xpath(${b(locator)})`
      if (language === 'C#') return `By.XPath(${b(locator)})`
    case 'Text':
      if (language === 'Java') return `By.linkText(${b(locator)})`
      if (language === 'Python') return `By.LINK_TEXT, ${b(locator)}`
      if (language === 'JavaScript') return `By.linkText(${b(locator)})`
      if (language === 'C#') return `By.LinkText(${b(locator)})`
    case 'Placeholder':
      if (language === 'Java') return `By.cssSelector(${b(`[placeholder='${locator}']`)})`
      if (language === 'Python') return `By.CSS_SELECTOR, ${b(`[placeholder='${locator}']`)}`
      if (language === 'JavaScript') return `By.css(${b(`[placeholder='${locator}']`)})`
      if (language === 'C#') return `By.CssSelector(${b(`[placeholder='${locator}']`)})`
    case 'Label':
      if (language === 'Java') return `By.xpath(${b(`//label[text()='${locator}']/following-sibling::input`)})`
      if (language === 'Python') return `By.XPATH, ${b(`//label[text()='${locator}']/following-sibling::input`)}`
      if (language === 'JavaScript') return `By.xpath(${b(`//label[text()='${locator}']/following-sibling::input`)})`
      if (language === 'C#') return `By.XPath(${b(`//label[text()='${locator}']/following-sibling::input`)})`
    case 'Alt Text':
      if (language === 'Java') return `By.cssSelector(${b(`img[alt='${locator}']`)})`
      if (language === 'Python') return `By.CSS_SELECTOR, ${b(`img[alt='${locator}']`)}`
      if (language === 'JavaScript') return `By.css(${b(`img[alt='${locator}']`)})`
      if (language === 'C#') return `By.CssSelector(${b(`img[alt='${locator}']`)})`
    case 'Test ID':
      if (language === 'Java') return `By.cssSelector(${b(`[data-testid='${locator}']`)})`
      if (language === 'Python') return `By.CSS_SELECTOR, ${b(`[data-testid='${locator}']`)}`
      if (language === 'JavaScript') return `By.css(${b(`[data-testid='${locator}']`)})`
      if (language === 'C#') return `By.CssSelector(${b(`[data-testid='${locator}']`)})`
    default:
      if (language === 'Java') return `By.cssSelector(${b(locator)})`
      if (language === 'Python') return `By.CSS_SELECTOR, ${b(locator)}`
      if (language === 'JavaScript') return `By.css(${b(locator)})`
      if (language === 'C#') return `By.CssSelector(${b(locator)})`
  }
}
