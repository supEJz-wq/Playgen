export const seleniumActionCategories = [
  {
    category: 'Navigation',
    actions: ['Open URL', 'Refresh', 'Back', 'Forward', 'Close Browser', 'Quit Driver'],
  },
  {
    category: 'Mouse',
    actions: ['Click', 'Double Click', 'Right Click', 'Hover', 'Drag And Drop'],
  },
  {
    category: 'Keyboard',
    actions: ['Type Text', 'Clear', 'Press Key'],
  },
  {
    category: 'Checkbox',
    actions: ['Check', 'Uncheck'],
  },
  {
    category: 'Dropdown',
    actions: ['Select By Text', 'Select By Value', 'Select By Index'],
  },
  {
    category: 'Frames',
    actions: ['Switch To Frame', 'Default Content', 'Parent Frame'],
  },
  {
    category: 'Windows',
    actions: ['Open New Window', 'Switch Window', 'Close Window'],
  },
  {
    category: 'Alerts',
    actions: ['Accept Alert', 'Dismiss Alert', 'Send Alert Text', 'Get Alert Text'],
  },
  {
    category: 'Waits',
    actions: ['Implicit Wait', 'Explicit Wait', 'Fluent Wait', 'Wait Until Visible', 'Wait Until Clickable', 'Wait Until Present'],
  },
  {
    category: 'Scrolling',
    actions: ['Scroll To Element', 'Scroll To Top', 'Scroll To Bottom'],
  },
  {
    category: 'JavaScript Executor',
    actions: ['Click Using JavaScript', 'Scroll Using JavaScript', 'Highlight Element'],
  },
  {
    category: 'Screenshot',
    actions: ['Take Screenshot', 'Full Page Screenshot'],
  },
  {
    category: 'Cookies',
    actions: ['Add Cookie', 'Delete Cookie', 'Delete All Cookies', 'Get Cookie'],
  },
  {
    category: 'Browser Storage',
    actions: ['Local Storage', 'Session Storage'],
  },
  {
    category: 'API',
    actions: ['HTTP GET', 'HTTP POST', 'HTTP PUT', 'HTTP DELETE'],
  },
]

export const seleniumAllActions = seleniumActionCategories.flatMap((c) => c.actions)

export const seleniumActionsRequiringLocator = [
  'Click', 'Double Click', 'Right Click', 'Hover', 'Drag And Drop',
  'Type Text', 'Clear', 'Press Key',
  'Check', 'Uncheck',
  'Select By Text', 'Select By Value', 'Select By Index',
  'Switch To Frame',
  'Wait Until Visible', 'Wait Until Clickable', 'Wait Until Present',
  'Scroll To Element',
  'Click Using JavaScript', 'Scroll Using JavaScript', 'Highlight Element',
  'Take Screenshot',
]

export const seleniumActionsRequiringValue = [
  'Open URL', 'Type Text', 'Press Key',
  'Select By Text', 'Select By Value', 'Select By Index',
  'Send Alert Text',
  'Implicit Wait', 'Explicit Wait', 'Fluent Wait',
  'Add Cookie',
  'HTTP GET', 'HTTP POST', 'HTTP PUT', 'HTTP DELETE',
]

export const seleniumActionsWithNoLocator = [
  'Open URL', 'Refresh', 'Back', 'Forward', 'Close Browser', 'Quit Driver',
  'Default Content', 'Parent Frame',
  'Open New Window', 'Switch Window', 'Close Window',
  'Accept Alert', 'Dismiss Alert', 'Send Alert Text', 'Get Alert Text',
  'Implicit Wait', 'Explicit Wait', 'Fluent Wait',
  'Scroll To Top', 'Scroll To Bottom',
  'Take Screenshot', 'Full Page Screenshot',
  'Local Storage', 'Session Storage',
  'HTTP GET', 'HTTP POST', 'HTTP PUT', 'HTTP DELETE',
]
