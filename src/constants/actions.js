export const actionCategories = [
  {
    category: 'Navigation',
    actions: ['Open URL', 'Go Back', 'Go Forward', 'Reload Page', 'Close Page'],
  },
  {
    category: 'Mouse',
    actions: ['Click', 'Double Click', 'Right Click', 'Hover', 'Drag And Drop'],
  },
  {
    category: 'Keyboard',
    actions: ['Fill', 'Clear', 'Press', 'Press Enter', 'Press Escape', 'Press Tab', 'Press Arrow Keys'],
  },
  {
    category: 'Checkbox',
    actions: ['Check', 'Uncheck'],
  },
  {
    category: 'Dropdown',
    actions: ['Select Option'],
  },
  {
    category: 'Browser',
    actions: ['New Page', 'New Context', 'Switch Tab', 'Close Tab'],
  },
  {
    category: 'Frames',
    actions: ['Switch Frame', 'Exit Frame'],
  },
  {
    category: 'Waits',
    actions: ['Wait For Visible', 'Wait For Hidden', 'Wait For URL', 'Wait For Load State', 'Wait For Response'],
  },
  {
    category: 'File Upload',
    actions: ['Upload File'],
  },
  {
    category: 'Screenshots',
    actions: ['Screenshot', 'Full Page Screenshot'],
  },
  {
    category: 'API',
    actions: ['GET Request', 'POST Request', 'PUT Request', 'DELETE Request'],
  },
];

export const allActions = actionCategories.flatMap((c) => c.actions);

export const actionsRequiringLocator = [
  'Click', 'Double Click', 'Right Click', 'Hover',
  'Fill', 'Clear', 'Press', 'Press Enter', 'Press Escape', 'Press Tab', 'Press Arrow Keys',
  'Check', 'Uncheck', 'Select Option',
  'Wait For Visible', 'Wait For Hidden',
  'Drag And Drop',
];

export const actionsRequiringValue = [
  'Open URL', 'Fill', 'Press', 'Select Option',
  'Wait For URL', 'Wait For Response',
  'GET Request', 'POST Request', 'PUT Request', 'DELETE Request',
  'Drag And Drop', 'Upload File',
];

export const actionsWithNoLocator = [
  'Open URL', 'Go Back', 'Go Forward', 'Reload Page', 'Close Page',
  'New Page', 'New Context', 'Switch Tab', 'Close Tab',
  'Exit Frame',
  'Wait For Load State',
  'Screenshot', 'Full Page Screenshot',
  'GET Request', 'POST Request', 'PUT Request', 'DELETE Request',
  'Upload File',
];
