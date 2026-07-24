export const appiumPlatformOptions = ['Android', 'iOS']

export const appiumAutomationNameOptions = {
  Android: ['UiAutomator2', 'Espresso', 'UiAutomator1'],
  iOS: ['XCUITest', 'UIAutomation'],
}

export const appiumDeviceOptions = {
  Android: ['Pixel 7', 'Pixel 6', 'Galaxy S23', 'Galaxy S22', 'OnePlus 11', 'Emulator'],
  iOS: ['iPhone 15', 'iPhone 14', 'iPhone 13', 'iPad Pro', 'iPad Air', 'Simulator'],
}

export const appiumCapabilityDefaults = {
  Android: {
    platformName: 'Android',
    automationName: 'UiAutomator2',
    deviceName: 'emulator-5554',
    appPackage: 'com.example.app',
    appActivity: '.MainActivity',
    noReset: false,
    fullReset: false,
  },
  iOS: {
    platformName: 'iOS',
    automationName: 'XCUITest',
    deviceName: 'iPhone 14',
    platformVersion: '16.0',
    udid: '',
    bundleId: 'com.example.app',
    noReset: false,
    fullReset: false,
  },
}
