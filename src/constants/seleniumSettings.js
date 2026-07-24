export const seleniumBrowsers = [
  { label: 'Chrome', value: 'Chrome' },
  { label: 'Firefox', value: 'Firefox' },
  { label: 'Edge', value: 'Edge' },
  { label: 'Safari', value: 'Safari' },
]

export const seleniumExecutionModes = [
  { label: 'Local', value: 'Local' },
  { label: 'Remote Grid', value: 'Remote Grid' },
  { label: 'Headless', value: 'Headless' },
]

export const seleniumLanguages = [
  { label: 'Java', value: 'Java' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'Python', value: 'Python' },
  { label: 'C#', value: 'C#' },
]

export const seleniumTestFrameworks = {
  Java: ['JUnit', 'TestNG'],
  JavaScript: ['Mocha'],
  Python: ['Pytest'],
  'C#': ['NUnit'],
}

export const seleniumReportingTools = [
  { label: 'Allure', value: 'Allure' },
  { label: 'Extent Reports', value: 'Extent Reports' },
  { label: 'Built-in', value: 'Built-in' },
]
