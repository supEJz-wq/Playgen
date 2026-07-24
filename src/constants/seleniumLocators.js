export const seleniumLocatorTypes = [
  { label: 'ID', value: 'ID', example: 'username' },
  { label: 'Name', value: 'Name', example: 'email' },
  { label: 'Class Name', value: 'Class Name', example: 'btn-primary' },
  { label: 'CSS Selector', value: 'CSS Selector', example: '#button-id' },
  { label: 'XPath', value: 'XPath', example: '//button[@id="submit"]' },
  { label: 'Link Text', value: 'Link Text', example: 'Sign In' },
  { label: 'Partial Link Text', value: 'Partial Link Text', example: 'Sign' },
  { label: 'Tag Name', value: 'Tag Name', example: 'button' },
  { label: 'Accessibility ID', value: 'Accessibility ID', example: 'login-button' },
]

export function formatSeleniumLocator(locatorType, locator, language) {
  if (!locator) return ''
  const escaped = locator.replace(/"/g, '\\"')
  switch (language) {
    case 'Java':
    case 'C#': {
      const q = `"${escaped}"`
      switch (locatorType) {
        case 'ID': return `By.id(${q})`
        case 'Name': return `By.name(${q})`
        case 'Class Name': return `By.className(${q})`
        case 'CSS Selector': return `By.cssSelector(${q})`
        case 'XPath': return `By.xpath(${q})`
        case 'Link Text': return `By.linkText(${q})`
        case 'Partial Link Text': return `By.partialLinkText(${q})`
        case 'Tag Name': return `By.tagName(${q})`
        default: return `By.cssSelector(${q})`
      }
    }
    case 'Python': {
      const q = `"${escaped}"`
      switch (locatorType) {
        case 'ID': return `By.ID, ${q}`
        case 'Name': return `By.NAME, ${q}`
        case 'Class Name': return `By.CLASS_NAME, ${q}`
        case 'CSS Selector': return `By.CSS_SELECTOR, ${q}`
        case 'XPath': return `By.XPATH, ${q}`
        case 'Link Text': return `By.LINK_TEXT, ${q}`
        case 'Partial Link Text': return `By.PARTIAL_LINK_TEXT, ${q}`
        case 'Tag Name': return `By.TAG_NAME, ${q}`
        default: return `By.CSS_SELECTOR, ${q}`
      }
    }
    case 'JavaScript': {
      const q = `"${escaped}"`
      switch (locatorType) {
        case 'ID': return `By.id(${q})`
        case 'Name': return `By.name(${q})`
        case 'Class Name': return `By.className(${q})`
        case 'CSS Selector': return `By.cssSelector(${q})`
        case 'XPath': return `By.xpath(${q})`
        case 'Link Text': return `By.linkText(${q})`
        case 'Partial Link Text': return `By.partialLinkText(${q})`
        case 'Tag Name': return `By.tagName(${q})`
        default: return `By.cssSelector(${q})`
      }
    }
    default:
      return locator
  }
}
