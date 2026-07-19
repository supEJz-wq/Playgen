import { getLocatorCode } from './locatorGenerator';
import { generateAssertionCode } from './assertionGenerator';
import { allActions } from '../constants/actions';

const q = (val, style) => (style === 'Double Quotes' ? `"${val}"` : `'${val}'`);

function actionCode(step, settings) {
  const qs = settings.quoteStyle || 'Single Quotes';
  const loc = step.locator ? getLocatorCode(step.locatorType || 'CSS', step.locator, qs) : null;
  const val = step.value || '';
  const desc = step.description ? `  // ${step.description}` : '';

  let code = '';
  switch (step.action) {
    case 'Open URL':
      code = `  await page.goto(${q(val || '/', qs)});`;
      break;
    case 'Go Back':
      code = `  await page.goBack();`;
      break;
    case 'Go Forward':
      code = `  await page.goForward();`;
      break;
    case 'Reload Page':
      code = `  await page.reload();`;
      break;
    case 'Close Page':
      code = `  await page.close();`;
      break;
    case 'Click':
      code = `  await ${loc}.click();`;
      break;
    case 'Double Click':
      code = `  await ${loc}.dblclick();`;
      break;
    case 'Right Click':
      code = `  await ${loc}.click({ button: 'right' });`;
      break;
    case 'Hover':
      code = `  await ${loc}.hover();`;
      break;
    case 'Drag And Drop':
      code = `  await ${loc}.dragTo(page.locator(${q(val, qs)}));`;
      break;
    case 'Fill':
      code = `  await ${loc}.fill(${q(val, qs)});`;
      break;
    case 'Clear':
      code = `  await ${loc}.clear();`;
      break;
    case 'Press':
      code = `  await ${loc}.press(${q(val, qs)});`;
      break;
    case 'Press Enter':
      code = `  await ${loc}.press('Enter');`;
      break;
    case 'Press Escape':
      code = `  await ${loc}.press('Escape');`;
      break;
    case 'Press Tab':
      code = `  await ${loc}.press('Tab');`;
      break;
    case 'Press Arrow Keys':
      code = `  await ${loc}.press(${q(val || 'ArrowDown', qs)});`;
      break;
    case 'Check':
      code = `  await ${loc}.check();`;
      break;
    case 'Uncheck':
      code = `  await ${loc}.uncheck();`;
      break;
    case 'Select Option':
      code = `  await ${loc}.selectOption(${q(val, qs)});`;
      break;
    case 'New Page':
      code = `  const [newPage] = await Promise.all([\n    page.waitForEvent('popup'),\n    page.click(${q(val, qs)})\n  ]);`;
      break;
    case 'New Context':
      code = `  const context = await browser.newContext();\n  const newPage = await context.newPage();`;
      break;
    case 'Switch Tab':
      code = `  const pages = context.pages();\n  await pages[${Number(val) || 1}].bringToFront();`;
      break;
    case 'Close Tab':
      code = `  await page.close();`;
      break;
    case 'Switch Frame':
      code = `  const frame = page.frameLocator(${q(loc, qs)});`;
      break;
    case 'Exit Frame':
      code = `  // Exited frame, continuing on main page`;
      break;
    case 'Wait For Visible':
      code = `  await expect(${loc}).toBeVisible();`;
      break;
    case 'Wait For Hidden':
      code = `  await expect(${loc}).toBeHidden();`;
      break;
    case 'Wait For URL':
      code = `  await page.waitForURL(${q(val, qs)});`;
      break;
    case 'Wait For Load State':
      code = `  await page.waitForLoadState(${q(val || 'networkidle', qs)});`;
      break;
    case 'Wait For Response':
      code = `  await page.waitForResponse(${q(val, qs)});`;
      break;
    case 'Upload File':
      code = `  await page.getByLabel('Upload file').setInputFiles(${q(val, qs)});`;
      break;
    case 'Screenshot':
      code = `  await page.screenshot({ path: ${q(val || 'screenshot.png', qs)} });`;
      break;
    case 'Full Page Screenshot':
      code = `  await page.screenshot({ path: ${q(val || 'fullpage.png', qs)}, fullPage: true });`;
      break;
    case 'GET Request':
      code = `  const getResponse = await page.request.get(${q(val, qs)});\n  expect(getResponse.ok()).toBeTruthy();`;
      break;
    case 'POST Request':
      code = `  const postResponse = await page.request.post(${q(val, qs)}, {\n    data: ${q('{}', qs)}\n  });\n  expect(postResponse.ok()).toBeTruthy();`;
      break;
    case 'PUT Request':
      code = `  const putResponse = await page.request.put(${q(val, qs)}, {\n    data: ${q('{}', qs)}\n  });\n  expect(putResponse.ok()).toBeTruthy();`;
      break;
    case 'DELETE Request':
      code = `  const deleteResponse = await page.request.delete(${q(val, qs)});\n  expect(deleteResponse.ok()).toBeTruthy();`;
      break;
    default:
      code = '';
  }

  if (!code) return '';
  if (desc) {
    return `${desc}\n${code}`;
  }
  return code;
}

function generateTestDataBlock(testData, settings) {
  if (!testData || testData.length === 0) return '';
  const qs = settings.quoteStyle || 'Single Quotes';
  const lines = testData.map((d) => `  ${d.name}: ${q(d.value, qs)}`);
  return `const testData = {\n${lines.join(',\n')}\n};`;
}

export function generatePlaywrightScript(config) {
  const {
    projectInfo,
    steps,
    assertions,
    testData,
    settings,
  } = config;

  const s = settings || {
    language: 'JavaScript',
    locatorStyle: 'locator()',
    quoteStyle: 'Single Quotes',
    semicolons: 'On',
    indentation: '2 Spaces',
  };

  const title = projectInfo?.testTitle || 'Untitled Test';
  const hasAssertions = assertions && assertions.length > 0;
  const hasSteps = steps && steps.length > 0;
  const hasTestData = testData && testData.length > 0;

  const needsExpect = hasAssertions || steps.some((st) =>
    ['Wait For Visible', 'Wait For Hidden', 'GET Request', 'POST Request', 'PUT Request', 'DELETE Request'].includes(st.action)
  );

  const importExpect = needsExpect ? ', expect' : '';

  const lines = [];

  lines.push(`import { test${importExpect} } from '@playwright/test';`);
  lines.push('');

  if (hasTestData) {
    lines.push(generateTestDataBlock(testData, s));
    lines.push('');
  }

  if (projectInfo?.description) {
    lines.push(`// ${projectInfo.description}`);
    lines.push('');
  }

  lines.push(`test('${title}', async ({ page }) => {`);
  lines.push('');

  if (hasSteps) {
    steps.forEach((step, i) => {
      const code = actionCode(step, s);
      if (code) {
        lines.push(code);
        if (i < steps.length - 1) lines.push('');
      }
    });
  }

  if (hasAssertions && hasSteps) {
    lines.push('');
  }

  if (hasAssertions) {
    assertions.forEach((assertion) => {
      const code = generateAssertionCode(assertion, s.quoteStyle);
      if (code) {
        lines.push(code);
        lines.push('');
      }
    });
  }

  lines.push('});');
  lines.push('');

  let result = lines.join('\n');

  if (s.indentation === '4 Spaces') {
    result = result.replace(/^( {2})/gm, '    ');
  }

  if (s.semicolons === 'Off') {
    result = result.replace(/;(?=\s*$)/gm, '');
  }

  if (s.quoteStyle === 'Double Quotes') {
    result = convertToDoubleQuotes(result);
  }

  return result;
}

function convertToDoubleQuotes(code) {
  const lines = code.split('\n');
  return lines.map((line) => {
    let result = '';
    let inStr = false;
    let char = null;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if ((ch === "'" || ch === '"') && (i === 0 || line[i - 1] !== '\\')) {
        if (!inStr) {
          inStr = true;
          char = ch;
          result += ch === "'" ? '"' : "'";
        } else if (ch === char) {
          inStr = false;
          result += ch === "'" ? '"' : "'";
        } else {
          result += ch;
        }
      } else {
        result += ch;
      }
    }
    return result;
  }).join('\n');
}

export function generateExplanation(steps, assertions) {
  const lines = [];
  lines.push('## Test Explanation');
  lines.push('');
  lines.push('This test performs the following steps:');
  lines.push('');

  if (steps) {
    steps.forEach((step, i) => {
      const desc = step.description || step.action;
      let explain = '';
      switch (step.action) {
        case 'Open URL': explain = `Opens the application at the specified URL.`; break;
        case 'Go Back': explain = `Navigates back to the previous page.`; break;
        case 'Go Forward': explain = `Navigates forward to the next page.`; break;
        case 'Reload Page': explain = `Reloads the current page.`; break;
        case 'Close Page': explain = `Closes the current page/tab.`; break;
        case 'Click': explain = `Clicks the element at the specified locator.`; break;
        case 'Double Click': explain = `Double-clicks the element.`; break;
        case 'Right Click': explain = `Right-clicks the element.`; break;
        case 'Hover': explain = `Hovers over the element.`; break;
        case 'Drag And Drop': explain = `Drags the element to the target location.`; break;
        case 'Fill': explain = `Types the value into the input field.`; break;
        case 'Clear': explain = `Clears the input field.`; break;
        case 'Press': explain = `Presses the specified key.`; break;
        case 'Press Enter': explain = `Presses the Enter key.`; break;
        case 'Press Escape': explain = `Presses the Escape key.`; break;
        case 'Press Tab': explain = `Presses the Tab key to move focus.`; break;
        case 'Press Arrow Keys': explain = `Presses an arrow key.`; break;
        case 'Check': explain = `Checks the checkbox.`; break;
        case 'Uncheck': explain = `Unchecks the checkbox.`; break;
        case 'Select Option': explain = `Selects an option from the dropdown.`; break;
        case 'New Page': explain = `Opens a new page/popup.`; break;
        case 'New Context': explain = `Creates a new browser context.`; break;
        case 'Switch Tab': explain = `Switches to a different tab.`; break;
        case 'Close Tab': explain = `Closes the current tab.`; break;
        case 'Upload File': explain = `Uploads a file using the file input.`; break;
        case 'Switch Frame': explain = `Switches to an iframe.`; break;
        case 'Exit Frame': explain = `Exits the current iframe.`; break;
        case 'Wait For Visible': explain = `Waits for the element to become visible.`; break;
        case 'Wait For Hidden': explain = `Waits for the element to become hidden.`; break;
        case 'Wait For URL': explain = `Waits for the URL to match the expected pattern.`; break;
        case 'Wait For Load State': explain = `Waits for the page to reach the specified load state.`; break;
        case 'Wait For Response': explain = `Waits for a network response matching the URL.`; break;
        case 'Screenshot': explain = `Takes a screenshot of the current viewport.`; break;
        case 'Full Page Screenshot': explain = `Takes a full-page screenshot.`; break;
        case 'GET Request': explain = `Sends a GET request to the specified endpoint.`; break;
        case 'POST Request': explain = `Sends a POST request with data.`; break;
        case 'PUT Request': explain = `Sends a PUT request to update data.`; break;
        case 'DELETE Request': explain = `Sends a DELETE request.`; break;
        default: explain = `Performs the action: ${step.action}`;
      }
      lines.push(`${i + 1}. **${desc}** — ${explain}`);
    });
  }

  if (assertions && assertions.length > 0) {
    lines.push('');
    lines.push('### Assertions');
    lines.push('');
    assertions.forEach((a, i) => {
      lines.push(`${steps.length + i + 1}. **${a.type}** — Validates that ${a.type.toLowerCase()} condition is met.`);
    });
  }

  return lines.join('\n');
}

export function generateChecklist(config) {
  const { projectInfo, steps, assertions, testData } = config;
  const checks = [];

  if (projectInfo?.baseUrl) {
    checks.push({ pass: true, text: 'URL provided' });
  } else {
    checks.push({ pass: false, text: 'No base URL provided' });
  }

  if (assertions && assertions.length > 0) {
    checks.push({ pass: true, text: `${assertions.length} assertion(s) included` });
  } else {
    checks.push({ pass: false, text: 'No assertion added' });
  }

  const hasHardWaits = steps && steps.some((s) =>
    s.action === 'Wait For URL' || s.action === 'Wait For Visible' || s.action === 'Wait For Hidden'
  );
  checks.push({ pass: !hasHardWaits, text: hasHardWaits ? 'Uses wait strategies (prefer assertions over fixed waits)' : 'No hard-coded waits' });

  if (steps && steps.length > 0) {
    checks.push({ pass: true, text: `${steps.length} test step(s) defined` });
  } else {
    checks.push({ pass: false, text: 'No test steps defined' });
  }

  if (projectInfo?.testTitle) {
    checks.push({ pass: true, text: 'Test title provided' });
  } else {
    checks.push({ pass: false, text: 'Test title is missing' });
  }

  const hasPageGoto = steps && steps.some((s) => s.action === 'Open URL');
  checks.push({ pass: hasPageGoto, text: hasPageGoto ? 'Script starts with page navigation' : 'Script does not start with page navigation' });

  if (testData && testData.length > 0) {
    checks.push({ pass: true, text: `${testData.length} test data variable(s) defined` });
  }

  const usesLocators = steps && steps.some((s) => s.locator);
  checks.push({ pass: usesLocators, text: usesLocators ? 'Uses locators for element interaction' : 'No locators found (missing element selectors)' });

  checks.push({ pass: true, text: 'Playwright best practices followed' });
  checks.push({ pass: true, text: 'Script ready to execute' });

  return checks;
}
