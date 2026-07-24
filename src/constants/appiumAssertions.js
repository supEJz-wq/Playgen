export const appiumAssertionTypes = [
  { label: 'Visible', value: 'Visible', needsLocator: true, needsValue: false },
  { label: 'Hidden', value: 'Hidden', needsLocator: true, needsValue: false },
  { label: 'Enabled', value: 'Enabled', needsLocator: true, needsValue: false },
  { label: 'Disabled', value: 'Disabled', needsLocator: true, needsValue: false },
  { label: 'Checked', value: 'Checked', needsLocator: true, needsValue: false },
  { label: 'Selected', value: 'Selected', needsLocator: true, needsValue: false },
  { label: 'Text Equals', value: 'Text Equals', needsLocator: true, needsValue: true },
  { label: 'Text Contains', value: 'Text Contains', needsLocator: true, needsValue: true },
  { label: 'Attribute', value: 'Attribute', needsLocator: true, needsValue: true },
  { label: 'Input Value', value: 'Input Value', needsLocator: true, needsValue: true },
  { label: 'Count', value: 'Count', needsLocator: true, needsValue: true },
  { label: 'Displayed', value: 'Displayed', needsLocator: true, needsValue: false },
  { label: 'Not Displayed', value: 'Not Displayed', needsLocator: true, needsValue: false },
  { label: 'Exists', value: 'Exists', needsLocator: true, needsValue: false },
  { label: 'Not Exists', value: 'Not Exists', needsLocator: true, needsValue: false },
]

export const appiumLocatorTypeForAssertions = [
  'Accessibility ID', 'Class Name', 'CSS Selector', 'ID',
  'Name', 'XPath', 'Android UIAutomator', 'iOS Predicate String',
  'iOS Class Chain', '-Android View Tag',
]
