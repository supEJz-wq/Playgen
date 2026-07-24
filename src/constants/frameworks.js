export const frameworks = [
  {
    id: 'playwright',
    label: 'Playwright',
    icon: '🎭',
    description: 'Modern end-to-end testing by Microsoft',
    languages: ['JavaScript', 'TypeScript'],
    colors: { primary: 'pink', bg: 'pink' },
  },
  {
    id: 'selenium',
    label: 'Selenium',
    icon: '🌍',
    description: 'Browser automation for enterprise teams',
    languages: ['Java', 'Python', 'JavaScript', 'C#'],
    colors: { primary: 'orange', bg: 'orange' },
  },
  {
    id: 'appium',
    label: 'Appium',
    icon: '📱',
    description: 'Mobile app automation for Android & iOS',
    languages: ['Java', 'Python', 'JavaScript', 'C#'],
    colors: { primary: 'emerald', bg: 'emerald' },
  },
]

export const architectures = {
  playwright: ['simple', 'pom'],
  selenium: ['simple', 'pom', 'page-factory'],
  appium: ['simple', 'pom'],
}

export const architectureDetails = {
  simple: {
    label: 'Simple Script',
    description: 'Single test file - perfect for beginners',
    files: '1 file',
  },
  pom: {
    label: 'Page Object Model',
    description: 'Full project with page objects, utils, config',
    files: '8+ files',
  },
  'page-factory': {
    label: 'Page Factory',
    description: '@FindBy annotations with PageFactory.initElements()',
    files: '8+ files',
    frameworks: ['selenium'],
    languages: ['Java'],
  },
}

export const cicdPlatforms = [
  { id: 'github-actions', label: 'GitHub Actions', icon: '🐙', description: 'GitHub-native CI/CD with Actions workflows' },
  { id: 'gitlab-ci', label: 'GitLab CI/CD', icon: '🦊', description: 'GitLab integrated CI/CD pipelines' },
  { id: 'jenkins', label: 'Jenkins', icon: '🔧', description: 'Self-hosted automation server' },
  { id: 'azure-devops', label: 'Azure DevOps', icon: '☁️', description: 'Microsoft Azure Pipelines' },
  { id: 'circleci', label: 'CircleCI', icon: '🔵', description: 'Cloud-native CI/CD platform' },
]

export const cicdLanguageMap = {
  playwright: ['JavaScript', 'TypeScript'],
  selenium: ['Java', 'Python', 'JavaScript', 'C#'],
  appium: ['Java', 'Python', 'JavaScript', 'C#'],
}

export const cicdSettings = {
  osOptions: ['Ubuntu', 'Windows', 'macOS'],
  triggers: ['Push', 'Pull Request', 'Manual Dispatch', 'Scheduled Run'],
  executionModes: ['Headless', 'Headed'],
  browsers: ['Chrome', 'Firefox', 'Edge'],
  reportOptions: ['HTML Report', 'Allure Report', 'JUnit XML'],
  artifactOptions: ['Test Reports', 'Screenshots', 'Videos', 'Logs'],
}

export const frameworkColors = {
  playwright: {
    primary: 'pink',
    bg: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-500/25',
    hoverShadow: 'shadow-pink-500/40',
    light: 'pink-50',
    dark: 'pink-900/20',
    text: 'pink-600',
    darkText: 'pink-400',
    border: 'pink-200',
    darkBorder: 'pink-800',
    ring: 'pink-200',
    darkRing: 'pink-800',
    focus: 'pink-500',
  },
  selenium: {
    primary: 'orange',
    bg: 'orange',
    gradient: 'from-orange-500 to-red-500',
    shadow: 'shadow-orange-500/25',
    hoverShadow: 'shadow-orange-500/40',
    light: 'orange-50',
    dark: 'orange-900/20',
    text: 'orange-600',
    darkText: 'orange-400',
    border: 'orange-200',
    darkBorder: 'orange-800',
    ring: 'orange-200',
    darkRing: 'orange-800',
    focus: 'orange-500',
  },
  appium: {
    primary: 'emerald',
    bg: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/25',
    hoverShadow: 'shadow-emerald-500/40',
    light: 'emerald-50',
    dark: 'emerald-900/20',
    text: 'emerald-600',
    darkText: 'emerald-400',
    border: 'emerald-200',
    darkBorder: 'emerald-800',
    ring: 'emerald-200',
    darkRing: 'emerald-800',
    focus: 'emerald-500',
  },
  cicd: {
    primary: 'indigo',
    bg: 'indigo',
    gradient: 'from-indigo-500 to-violet-500',
    shadow: 'shadow-indigo-500/25',
    hoverShadow: 'shadow-indigo-500/40',
    light: 'indigo-50',
    dark: 'indigo-900/20',
    text: 'indigo-600',
    darkText: 'indigo-400',
    border: 'indigo-200',
    darkBorder: 'indigo-800',
    ring: 'indigo-200',
    darkRing: 'indigo-800',
    focus: 'indigo-500',
  },
}
