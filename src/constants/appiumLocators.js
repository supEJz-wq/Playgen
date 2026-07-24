export const appiumLocatorTypes = [
  { label: 'Accessibility ID', value: 'Accessibility ID', example: 'login_button', platforms: ['Android', 'iOS'] },
  { label: 'Class Name', value: 'Class Name', example: 'android.widget.Button', platforms: ['Android', 'iOS'] },
  { label: 'CSS Selector', value: 'CSS Selector', example: '.button-class', platforms: ['Android'] },
  { label: 'ID', value: 'ID', example: 'com.example:id/button', platforms: ['Android', 'iOS'] },
  { label: 'Name', value: 'Name', example: 'button_name', platforms: ['Android', 'iOS'] },
  { label: 'XPath', value: 'XPath', example: '//android.widget.Button[@text="Login"]', platforms: ['Android', 'iOS'] },
  { label: 'Android UIAutomator', value: 'Android UIAutomator', example: 'new UiSelector().text("Login")', platforms: ['Android'] },
  { label: 'iOS Predicate String', value: 'iOS Predicate String', example: 'label == "Login"', platforms: ['iOS'] },
  { label: 'iOS Class Chain', value: 'iOS Class Chain', example: '**/XCUIElementTypeButton[`label == "Login"`]', platforms: ['iOS'] },
  { label: '-Android View Tag', value: '-Android View Tag', example: 'my_view_tag', platforms: ['Android'] },
  { label: 'Image', value: 'Image', example: 'login_button.png', platforms: ['Android', 'iOS'] },
]

export function formatAppiumLocator(language, locatorType, locator, _platform) {
  if (!locator) return ''

  const qt = (v) => {
    if (language === 'Java') return `"${v}"`
    if (language === 'Python') return `"${v}"`
    if (language === 'JavaScript') return `'${v}'`
    if (language === 'C#') return `"${v}"`
    return `"${v}"`
  }

  switch (locatorType) {
    case 'Accessibility ID':
      if (language === 'Java') return `MobileBy.AccessibilityId(${qt(locator)})`
      if (language === 'Python') return `MobileBy.ACCESSIBILITY_ID, ${qt(locator)}`
      if (language === 'JavaScript') return `MobileBy.accessibilityId(${qt(locator)})`
      if (language === 'C#') return `MobileBy.AccessibilityId(${qt(locator)})`
    case 'Class Name':
      if (language === 'Java') return `By.className(${qt(locator)})`
      if (language === 'Python') return `By.CLASS_NAME, ${qt(locator)}`
      if (language === 'JavaScript') return `By.className(${qt(locator)})`
      if (language === 'C#') return `By.ClassName(${qt(locator)})`
    case 'CSS Selector':
      if (language === 'Java') return `By.cssSelector(${qt(locator)})`
      if (language === 'Python') return `By.CSS_SELECTOR, ${qt(locator)}`
      if (language === 'JavaScript') return `By.css(${qt(locator)})`
      if (language === 'C#') return `By.CssSelector(${qt(locator)})`
    case 'ID':
      if (language === 'Java') return `By.id(${qt(locator)})`
      if (language === 'Python') return `By.ID, ${qt(locator)}`
      if (language === 'JavaScript') return `By.id(${qt(locator)})`
      if (language === 'C#') return `By.Id(${qt(locator)})`
    case 'Name':
      if (language === 'Java') return `By.name(${qt(locator)})`
      if (language === 'Python') return `By.NAME, ${qt(locator)}`
      if (language === 'JavaScript') return `By.name(${qt(locator)})`
      if (language === 'C#') return `By.Name(${qt(locator)})`
    case 'XPath':
      if (language === 'Java') return `By.xpath(${qt(locator)})`
      if (language === 'Python') return `By.XPATH, ${qt(locator)}`
      if (language === 'JavaScript') return `By.xpath(${qt(locator)})`
      if (language === 'C#') return `By.XPath(${qt(locator)})`
    case 'Android UIAutomator':
      if (language === 'Java') return `MobileBy.AndroidUIAutomator(${qt(locator)})`
      if (language === 'Python') return `MobileBy.ANDROID_UIAUTOMATOR, ${qt(locator)}`
      if (language === 'JavaScript') return `MobileBy.androidUIAutomator(${qt(locator)})`
      if (language === 'C#') return `MobileBy.AndroidUIAutomator(${qt(locator)})`
    case 'iOS Predicate String':
      if (language === 'Java') return `MobileBy.iOSNsPredicateString(${qt(locator)})`
      if (language === 'Python') return `MobileBy.IOS_PREDICATE, ${qt(locator)}`
      if (language === 'JavaScript') return `MobileBy.iOSNsPredicateString(${qt(locator)})`
      if (language === 'C#') return `MobileBy.IosNsPredicateString(${qt(locator)})`
    case 'iOS Class Chain':
      if (language === 'Java') return `MobileBy.iOSClassChain(${qt(locator)})`
      if (language === 'Python') return `MobileBy.IOS_CLASS_CHAIN, ${qt(locator)}`
      if (language === 'JavaScript') return `MobileBy.iOSClassChain(${qt(locator)})`
      if (language === 'C#') return `MobileBy.IosClassChain(${qt(locator)})`
    case '-Android View Tag':
      if (language === 'Java') return `MobileBy.AndroidViewTag(${qt(locator)})`
      if (language === 'Python') return `MobileBy.ANDROID_VIEW_TAG, ${qt(locator)}`
      if (language === 'JavaScript') return `MobileBy.androidViewTag(${qt(locator)})`
      if (language === 'C#') return `MobileBy.AndroidViewTag(${qt(locator)})`
    case 'Image':
      if (language === 'Java') return `MobileBy.image(${qt(locator)})`
      if (language === 'Python') return `MobileBy.IMAGE, ${qt(locator)}`
      if (language === 'JavaScript') return `MobileBy.image(${qt(locator)})`
      if (language === 'C#') return `MobileBy.Image(${qt(locator)})`
    default:
      if (language === 'Java') return `By.cssSelector(${qt(locator)})`
      if (language === 'Python') return `By.CSS_SELECTOR, ${qt(locator)}`
      if (language === 'JavaScript') return `By.css(${qt(locator)})`
      if (language === 'C#') return `By.CssSelector(${qt(locator)})`
  }
}
