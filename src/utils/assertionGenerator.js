import { getLocatorCode } from './locatorGenerator';

export function generateAssertionCode(assertion, quoteStyle) {
  const loc = assertion.locator
    ? getLocatorCode(assertion.locatorType || 'CSS', assertion.locator, quoteStyle)
    : null;
  const val = assertion.value || '';

  switch (assertion.type) {
    case 'Visible':
      return `  await expect(${loc}).toBeVisible();`;
    case 'Hidden':
      return `  await expect(${loc}).toBeHidden();`;
    case 'Enabled':
      return `  await expect(${loc}).toBeEnabled();`;
    case 'Disabled':
      return `  await expect(${loc}).toBeDisabled();`;
    case 'Checked':
      return `  await expect(${loc}).toBeChecked();`;
    case 'Unchecked':
      return `  await expect(${loc}).not.toBeChecked();`;
    case 'Editable':
      return `  await expect(${loc}).toBeEditable();`;
    case 'Empty':
      return `  await expect(${loc}).toBeEmpty();`;
    case 'URL Equals':
      return `  await expect(page).toHaveURL(${quoteValue(val, quoteStyle)});`;
    case 'URL Contains':
      return `  await expect(page).toHaveURL(/.*${escapeRegex(val)}.*/);`;
    case 'Text Equals':
      return `  await expect(${loc}).toHaveText(${quoteValue(val, quoteStyle)});`;
    case 'Text Contains':
      return `  await expect(${loc}).toContainText(${quoteValue(val, quoteStyle)});`;
    case 'Page Title':
      return `  await expect(page).toHaveTitle(${quoteValue(val, quoteStyle)});`;
    case 'Input Value':
      return `  await expect(${loc}).toHaveValue(${quoteValue(val, quoteStyle)});`;
    case 'Attribute':
      return `  await expect(${loc}).toHaveAttribute(${quoteValue(val, quoteStyle)});`;
    case 'CSS Class':
      return `  await expect(${loc}).toHaveClass(${quoteValue(val, quoteStyle)});`;
    case 'Count':
      return `  await expect(${loc}).toHaveCount(${Number(val) || 0});`;
    default:
      return '';
  }
}

function quoteValue(val, quoteStyle) {
  const q = quoteStyle === 'Double Quotes' ? '"' : "'";
  return `${q}${val}${q}`;
}

function escapeRegex(val) {
  return val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
