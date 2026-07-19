import { formatLocator } from '../constants/locatorTypes';

function escapeValue(val, quoteStyle) {
  const q = quoteStyle === 'Double Quotes' ? '"' : "'";
  const escaped = String(val).replace(/\\/g, '\\\\').replace(q === "'" ? /'/g : /"/g, q === "'" ? "\\'" : '\\"');
  return `${q}${escaped}${q}`;
}

function locatorString(locatorType, locator, quoteStyle) {
  if (!locator) return '';
  switch (locatorType) {
    case 'ID':
      return `page.locator('#${locator}')`;
    case 'Name':
      return `page.locator('[name=${escapeValue(locator, quoteStyle)}]')`;
    case 'Class':
      return `page.locator('.${locator}')`;
    case 'Role':
      return `page.getByRole(${escapeValue(locator, quoteStyle)})`;
    case 'Text':
      return `page.getByText(${escapeValue(locator, quoteStyle)})`;
    case 'Placeholder':
      return `page.getByPlaceholder(${escapeValue(locator, quoteStyle)})`;
    case 'Label':
      return `page.getByLabel(${escapeValue(locator, quoteStyle)})`;
    case 'Alt Text':
      return `page.getByAltText(${escapeValue(locator, quoteStyle)})`;
    case 'Test ID':
      return `page.getByTestId(${escapeValue(locator, quoteStyle)})`;
    case 'XPath':
    case 'CSS':
    default:
      return `page.locator(${escapeValue(locator, quoteStyle)})`;
  }
}

export function getLocatorCode(locatorType, locator, quoteStyle) {
  return locatorString(locatorType, locator, quoteStyle);
}
