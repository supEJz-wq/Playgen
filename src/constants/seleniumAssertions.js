export const seleniumAssertionTypes = [
  { label: 'Element Exists', value: 'Element Exists', needsLocator: true, needsValue: false },
  { label: 'Element Visible', value: 'Element Visible', needsLocator: true, needsValue: false },
  { label: 'Element Hidden', value: 'Element Hidden', needsLocator: true, needsValue: false },
  { label: 'Text Equals', value: 'Text Equals', needsLocator: true, needsValue: true },
  { label: 'Text Contains', value: 'Text Contains', needsLocator: true, needsValue: true },
  { label: 'URL Equals', value: 'URL Equals', needsLocator: false, needsValue: true },
  { label: 'URL Contains', value: 'URL Contains', needsLocator: false, needsValue: true },
  { label: 'Title Equals', value: 'Title Equals', needsLocator: false, needsValue: true },
  { label: 'Title Contains', value: 'Title Contains', needsLocator: false, needsValue: true },
  { label: 'Enabled', value: 'Enabled', needsLocator: true, needsValue: false },
  { label: 'Disabled', value: 'Disabled', needsLocator: true, needsValue: false },
  { label: 'Selected', value: 'Selected', needsLocator: true, needsValue: false },
  { label: 'Displayed', value: 'Displayed', needsLocator: true, needsValue: false },
  { label: 'Attribute Equals', value: 'Attribute Equals', needsLocator: true, needsValue: true },
  { label: 'CSS Value', value: 'CSS Value', needsLocator: true, needsValue: true },
  { label: 'Count Equals', value: 'Count Equals', needsLocator: true, needsValue: true },
]

export const seleniumLocatorTypesForAssertions = [
  'ID', 'Name', 'Class Name', 'CSS Selector', 'XPath', 'Link Text', 'Partial Link Text', 'Tag Name',
]
