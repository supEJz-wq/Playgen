export const actionCategories = [
  {
    category: 'Navigation',
    actions: ['Open URL', 'Go Back', 'Go Forward', 'Reload', 'Close Page'],
  },
  {
    category: 'Mouse',
    actions: ['Click', 'Double Click', 'Right Click', 'Hover', 'Drag And Drop'],
  },
  {
    category: 'Keyboard / Input',
    actions: ['Fill', 'Clear', 'Press Key', 'Type'],
  },
  {
    category: 'Checkbox / Radio',
    actions: ['Check', 'Uncheck'],
  },
  {
    category: 'Dropdown',
    actions: ['Select Dropdown'],
  },
  {
    category: 'Waits',
    actions: ['Wait', 'Wait For URL'],
  },
  {
    category: 'Frames',
    actions: ['Switch Frame', 'Exit Frame'],
  },
  {
    category: 'Windows / Tabs',
    actions: ['Switch Window', 'Open New Window', 'Close Window'],
  },
  {
    category: 'Scroll',
    actions: ['Scroll'],
  },
  {
    category: 'Screenshot',
    actions: ['Take Screenshot'],
  },
  {
    category: 'File Upload',
    actions: ['Upload File'],
  },
  {
    category: 'API',
    actions: ['API Request'],
  },
  {
    category: 'Assertions',
    actions: ['Assert'],
  },
]

export const allActions = actionCategories.flatMap((c) => c.actions)

export const actionsRequiringLocator = [
  'Click', 'Double Click', 'Right Click', 'Hover',
  'Fill', 'Clear', 'Press Key', 'Type',
  'Check', 'Uncheck', 'Select Dropdown',
  'Wait', 'Drag And Drop', 'Scroll',
  'Assert',
]

export const actionsRequiringValue = [
  'Open URL', 'Fill', 'Press Key', 'Type',
  'Select Dropdown', 'Wait For URL',
  'API Request', 'Drag And Drop', 'Upload File',
  'Scroll',
]

export const actionsWithNoLocator = [
  'Open URL', 'Go Back', 'Go Forward', 'Reload', 'Close Page',
  'Take Screenshot',
  'Switch Frame', 'Exit Frame',
  'Switch Window', 'Open New Window', 'Close Window',
  'Wait', 'Wait For URL',
  'API Request',
  'Upload File',
]
