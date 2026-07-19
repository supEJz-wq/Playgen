export const locatorTypes = [
  { label: 'CSS', value: 'CSS', example: '#button-id' },
  { label: 'XPath', value: 'XPath', example: '//button[@id="submit"]' },
  { label: 'ID', value: 'ID', example: 'username' },
  { label: 'Name', value: 'Name', example: 'email' },
  { label: 'Class', value: 'Class', example: 'btn-primary' },
  { label: 'Role', value: 'Role', example: 'button' },
  { label: 'Text', value: 'Text', example: 'Sign In' },
  { label: 'Placeholder', value: 'Placeholder', example: 'Enter your email' },
  { label: 'Label', value: 'Label', example: 'Password' },
  { label: 'Alt Text', value: 'Alt Text', example: 'Product image' },
  { label: 'Test ID', value: 'Test ID', example: 'login-button' },
];

export function formatLocator(locatorType, locator) {
  if (!locator) return '';
  switch (locatorType) {
    case 'CSS':
      return `page.locator('${locator}')`;
    case 'XPath':
      return `page.locator('${locator}')`;
    case 'ID':
      return `page.locator('#${locator}')`;
    case 'Name':
      return `page.locator('[name="${locator}"]')`;
    case 'Class':
      return `page.locator('.${locator}')`;
    case 'Role':
      return `page.getByRole('${locator}')`;
    case 'Text':
      return `page.getByText('${locator}')`;
    case 'Placeholder':
      return `page.getByPlaceholder('${locator}')`;
    case 'Label':
      return `page.getByLabel('${locator}')`;
    case 'Alt Text':
      return `page.getByAltText('${locator}')`;
    case 'Test ID':
      return `page.getByTestId('${locator}')`;
    default:
      return `page.locator('${locator}')`;
  }
}
