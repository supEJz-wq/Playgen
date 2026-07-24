import { generatePlaywright, generatePlaywrightExplanation, generatePlaywrightChecklist, generatePlaywrightBestPractices } from './playwrightGenerator'
import { generateSeleniumJava, generateSeleniumJavaExplanation, generateSeleniumJavaChecklist, generateSeleniumJavaBestPractices } from './seleniumJavaGenerator'
import { generateSeleniumPython, generateSeleniumPythonExplanation, generateSeleniumPythonChecklist, generateSeleniumPythonBestPractices } from './seleniumPythonGenerator'
import { generateSeleniumJavaScript, generateSeleniumJavaScriptExplanation, generateSeleniumJavaScriptChecklist, generateSeleniumJavaScriptBestPractices } from './seleniumJavaScriptGenerator'
import { generateSeleniumCSharp, generateSeleniumCSharpExplanation, generateSeleniumCSharpChecklist, generateSeleniumCSharpBestPractices } from './seleniumCSharpGenerator'
import { generateAppiumJava, generateAppiumJavaExplanation, generateAppiumJavaChecklist, generateAppiumJavaBestPractices } from './appiumJavaGenerator'
import { generateAppiumPython, generateAppiumPythonExplanation, generateAppiumPythonChecklist, generateAppiumPythonBestPractices } from './appiumPythonGenerator'
import { generateAppiumJavaScript, generateAppiumJavaScriptExplanation, generateAppiumJavaScriptChecklist, generateAppiumJavaScriptBestPractices } from './appiumJavaScriptGenerator'
import { generateAppiumCSharp, generateAppiumCSharpExplanation, generateAppiumCSharpChecklist, generateAppiumCSharpBestPractices } from './appiumCSharpGenerator'
import { generateCicdGithubActions, generateCicdGithubActionsExplanation, generateCicdGithubActionsChecklist, generateCicdGithubActionsBestPractices } from './cicdGithubActionsGenerator'
import { generateCicdGitlabCi, generateCicdGitlabCiExplanation, generateCicdGitlabCiChecklist, generateCicdGitlabCiBestPractices } from './cicdGitlabCiGenerator'
import { generateCicdJenkins, generateCicdJenkinsExplanation, generateCicdJenkinsChecklist, generateCicdJenkinsBestPractices } from './cicdJenkinsGenerator'
import { generateCicdAzureDevops, generateCicdAzureDevopsExplanation, generateCicdAzureDevopsChecklist, generateCicdAzureDevopsBestPractices } from './cicdAzureDevopsGenerator'

const generators = {
  'playwright:JavaScript': {
    generate: generatePlaywright,
    explanation: generatePlaywrightExplanation,
    checklist: generatePlaywrightChecklist,
    bestPractices: generatePlaywrightBestPractices,
  },
  'playwright:TypeScript': {
    generate: generatePlaywright,
    explanation: generatePlaywrightExplanation,
    checklist: generatePlaywrightChecklist,
    bestPractices: generatePlaywrightBestPractices,
  },
  'selenium:Java': {
    generate: generateSeleniumJava,
    explanation: generateSeleniumJavaExplanation,
    checklist: generateSeleniumJavaChecklist,
    bestPractices: generateSeleniumJavaBestPractices,
  },
  'selenium:Python': {
    generate: generateSeleniumPython,
    explanation: generateSeleniumPythonExplanation,
    checklist: generateSeleniumPythonChecklist,
    bestPractices: generateSeleniumPythonBestPractices,
  },
  'selenium:JavaScript': {
    generate: generateSeleniumJavaScript,
    explanation: generateSeleniumJavaScriptExplanation,
    checklist: generateSeleniumJavaScriptChecklist,
    bestPractices: generateSeleniumJavaScriptBestPractices,
  },
  'selenium:C#': {
    generate: generateSeleniumCSharp,
    explanation: generateSeleniumCSharpExplanation,
    checklist: generateSeleniumCSharpChecklist,
    bestPractices: generateSeleniumCSharpBestPractices,
  },
  'appium:Java': {
    generate: generateAppiumJava,
    explanation: generateAppiumJavaExplanation,
    checklist: generateAppiumJavaChecklist,
    bestPractices: generateAppiumJavaBestPractices,
  },
  'appium:Python': {
    generate: generateAppiumPython,
    explanation: generateAppiumPythonExplanation,
    checklist: generateAppiumPythonChecklist,
    bestPractices: generateAppiumPythonBestPractices,
  },
  'appium:JavaScript': {
    generate: generateAppiumJavaScript,
    explanation: generateAppiumJavaScriptExplanation,
    checklist: generateAppiumJavaScriptChecklist,
    bestPractices: generateAppiumJavaScriptBestPractices,
  },
  'appium:C#': {
    generate: generateAppiumCSharp,
    explanation: generateAppiumCSharpExplanation,
    checklist: generateAppiumCSharpChecklist,
    bestPractices: generateAppiumCSharpBestPractices,
  },
  'cicd:GitHub Actions': {
    generate: generateCicdGithubActions,
    explanation: generateCicdGithubActionsExplanation,
    checklist: generateCicdGithubActionsChecklist,
    bestPractices: generateCicdGithubActionsBestPractices,
  },
  'cicd:GitLab CI/CD': {
    generate: generateCicdGitlabCi,
    explanation: generateCicdGitlabCiExplanation,
    checklist: generateCicdGitlabCiChecklist,
    bestPractices: generateCicdGitlabCiBestPractices,
  },
  'cicd:Jenkins': {
    generate: generateCicdJenkins,
    explanation: generateCicdJenkinsExplanation,
    checklist: generateCicdJenkinsChecklist,
    bestPractices: generateCicdJenkinsBestPractices,
  },
  'cicd:Azure DevOps': {
    generate: generateCicdAzureDevops,
    explanation: generateCicdAzureDevopsExplanation,
    checklist: generateCicdAzureDevopsChecklist,
    bestPractices: generateCicdAzureDevopsBestPractices,
  },
}

const cicdKeyMap = {
  'github-actions': 'GitHub Actions',
  'gitlab-ci': 'GitLab CI/CD',
  'jenkins': 'Jenkins',
  'azure-devops': 'Azure DevOps',
}

function resolveGenerator(model) {
  if (model.pipeline) {
    const platform = cicdKeyMap[model.pipeline.ciPlatform] || model.pipeline.ciPlatform
    return generators['cicd:' + platform]
  }
  const fw = model.settings?.framework
  const lang = model.settings?.language
  return generators[fw + ':' + lang]
}

export function generateTestCode(model) {
  const gen = resolveGenerator(model)
  if (!gen) {
    const key = model.pipeline ? 'cicd:' + model.pipeline.ciPlatform : (model.settings?.framework || '?') + ':' + (model.settings?.language || '?')
    return [{ name: 'output.txt', content: 'Generator not found for ' + key }]
  }
  return gen.generate(model)
}

export function generateExplanation(model) {
  const gen = resolveGenerator(model)
  if (!gen) return ''
  return gen.explanation(model)
}

export function generateChecklist(model) {
  const gen = resolveGenerator(model)
  if (!gen) return []
  return gen.checklist(model)
}

export function generateBestPractices(model) {
  const gen = resolveGenerator(model)
  if (!gen) return []
  return gen.bestPractices(model)
}

export function buildSuiteGrep(suites) {
  const enabled = (suites || []).filter((s) => s.enabled && s.tags && s.tags.length > 0)
  if (enabled.length === 0) return ''
  const tags = [...new Set(enabled.flatMap((s) => s.tags))]
  return ` --grep "${tags.join('|')}"`
}

export function getFileExtension(model) {
  if (model.pipeline) return '.yml'
  const lang = model.settings.language
  if (model.settings.framework === 'playwright') {
    return lang === 'TypeScript' ? '.spec.ts' : '.spec.js'
  }
  switch (lang) {
    case 'Java': return '.java'
    case 'Python': return '.py'
    case 'JavaScript': return '.spec.js'
    case 'C#': return '.cs'
    default: return '.txt'
  }
}
