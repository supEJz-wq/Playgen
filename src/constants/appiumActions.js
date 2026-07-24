export const appiumActionCategories = [
  {
    category: 'App Actions',
    actions: ['Launch App', 'Close App', 'Install App', 'Remove App', 'Background App', 'Activate App', 'Terminate App', 'Reset App'],
  },
  {
    category: 'Device',
    actions: ['Get Device Time', 'Lock Device', 'Unlock Device', 'Rotate Device', 'Set Orientation'],
  },
  {
    category: 'Navigation',
    actions: ['Open URL', 'Go Back', 'Reload'],
  },
  {
    category: 'Touch / Gesture',
    actions: ['Click', 'Double Click', 'Long Press', 'Tap', 'Swipe', 'Scroll', 'Drag', 'Drop', 'Pinch', 'Zoom'],
  },
  {
    category: 'Input',
    actions: ['Fill', 'Clear', 'Type', 'Press Key', 'Hide Keyboard'],
  },
  {
    category: 'Checkbox',
    actions: ['Check', 'Uncheck'],
  },
  {
    category: 'Select',
    actions: ['Select Dropdown'],
  },
  {
    category: 'Wait',
    actions: ['Wait', 'Wait For Element'],
  },
  {
    category: 'Frame',
    actions: ['Switch Frame', 'Exit Frame'],
  },
  {
    category: 'Screenshot',
    actions: ['Take Screenshot'],
  },
  {
    category: 'File',
    actions: ['Upload File', 'Push File', 'Pull File'],
  },
  {
    category: 'Network',
    actions: ['API Request'],
  },
  {
    category: 'Assertions',
    actions: ['Assert'],
  },
]

export const allAppiumActions = appiumActionCategories.flatMap((c) => c.actions)

export const appiumActionsRequiringLocator = [
  'Click', 'Double Click', 'Long Press', 'Tap',
  'Fill', 'Clear', 'Type', 'Press Key',
  'Check', 'Uncheck', 'Select Dropdown',
  'Wait', 'Wait For Element', 'Swipe', 'Scroll',
  'Drag', 'Drop', 'Assert',
]

export const appiumActionsRequiringValue = [
  'Open URL', 'Fill', 'Type', 'Press Key',
  'Select Dropdown', 'Swipe', 'Scroll',
  'API Request', 'Upload File', 'Push File', 'Pull File',
  'Install App', 'Remove App', 'Background App', 'Activate App',
]

export const appiumActionsWithNoLocator = [
  'Launch App', 'Close App', 'Install App', 'Remove App',
  'Background App', 'Activate App', 'Terminate App', 'Reset App',
  'Open URL', 'Go Back', 'Reload',
  'Get Device Time', 'Lock Device', 'Unlock Device', 'Rotate Device', 'Set Orientation',
  'Take Screenshot', 'Hide Keyboard',
  'Switch Frame', 'Exit Frame',
  'API Request', 'Upload File', 'Push File', 'Pull File',
  'Wait', 'Swipe', 'Pinch', 'Zoom',
]
