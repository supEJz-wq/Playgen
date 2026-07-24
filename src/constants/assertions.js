export const assertionTypes = [
  { label: 'Visible', value: 'Visible', needsLocator: true, needsValue: false },
  { label: 'Hidden', value: 'Hidden', needsLocator: true, needsValue: false },
  { label: 'Enabled', value: 'Enabled', needsLocator: true, needsValue: false },
  { label: 'Disabled', value: 'Disabled', needsLocator: true, needsValue: false },
  { label: 'Checked', value: 'Checked', needsLocator: true, needsValue: false },
  { label: 'Text Equals', value: 'Text Equals', needsLocator: true, needsValue: true },
  { label: 'Text Contains', value: 'Text Contains', needsLocator: true, needsValue: true },
  { label: 'URL Equals', value: 'URL Equals', needsLocator: false, needsValue: true },
  { label: 'URL Contains', value: 'URL Contains', needsLocator: false, needsValue: true },
  { label: 'Title Equals', value: 'Title Equals', needsLocator: false, needsValue: true },
  { label: 'Count', value: 'Count', needsLocator: true, needsValue: true },
  { label: 'Attribute', value: 'Attribute', needsLocator: true, needsValue: true },
  { label: 'Input Value', value: 'Input Value', needsLocator: true, needsValue: true },
]

export const locatorTypeForAssertions = [
  'CSS Selector', 'XPath', 'ID', 'Name', 'Class Name',
  'Role', 'Text', 'Placeholder', 'Label', 'Alt Text', 'Test ID',
]
