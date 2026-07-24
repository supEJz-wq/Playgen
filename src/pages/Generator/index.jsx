import { useState, useCallback } from 'react'
import ProjectInfo from '../../components/ProjectInfo'
import TestStepBuilder from '../../components/TestStepBuilder'
import AssertionBuilder from '../../components/AssertionBuilder'
import TestData from '../../components/TestData'
import TemplateSelector from '../../components/TemplateSelector'
import FrameworkSelector from '../../components/FrameworkSelector'
import LanguageSelector from '../../components/LanguageSelector'
import ArchitectureSelector from '../../components/ArchitectureSelector'
import CodePreview from '../../components/CodePreview'
import Statistics from '../../components/Statistics'
import { frameworkColors, architectureDetails } from '../../constants/frameworks'
import { generateTestCode, generateExplanation, generateChecklist, generateBestPractices, getFileExtension } from '../../generators'
import { toTestModel } from '../../models/testModel'

const locatorTypeMap = {
  'CSS': 'CSS Selector',
  'Class': 'Class Name',
  'Test ID': 'Test ID',
  'ID': 'ID',
  'Name': 'Name',
  'XPath': 'XPath',
  'Role': 'Role',
  'Text': 'Text',
  'Placeholder': 'Placeholder',
  'Label': 'Label',
  'Alt Text': 'Alt Text',
}

function mapLocatorType(lt) {
  return locatorTypeMap[lt] || lt || 'CSS Selector'
}

const emptyCode = '// Build your test, select a framework and language, then click Generate.'

export default function Generator() {
  const [projectInfo, setProjectInfo] = useState({
    projectName: '', environment: '', feature: '', module: '', baseUrl: '',
    testTitle: '', author: '', priority: 'Medium', tags: [], description: '',
  })
  const [steps, setSteps] = useState([])
  const [assertions, setAssertions] = useState([])
  const [testData, setTestData] = useState([])
  const [framework, setFramework] = useState('playwright')
  const [language, setLanguage] = useState('JavaScript')
  const [architecture, setArchitecture] = useState('simple')
  const [files, setFiles] = useState(null)
  const [checks, setChecks] = useState([])
  const [bestPractices, setBestPractices] = useState([])
  const [activeSection, setActiveSection] = useState('template')

  const hasContent = files !== null && files.length > 0
  const colors = frameworkColors[framework] || frameworkColors.playwright

  const handleGenerate = useCallback(() => {
    const model = toTestModel(projectInfo, { framework, language, architecture }, steps, assertions, testData)
    const generatedFiles = generateTestCode(model)
    setFiles(generatedFiles)
    const checklist = generateChecklist(model)
    setChecks(checklist)
    const practices = generateBestPractices(model)
    setBestPractices(practices)
    setActiveSection('output')
  }, [projectInfo, framework, language, architecture, steps, assertions, testData])

  const handleReset = useCallback(() => {
    setProjectInfo({ projectName: '', environment: '', feature: '', module: '', baseUrl: '', testTitle: '', author: '', priority: 'Medium', tags: [], description: '' })
    setSteps([])
    setAssertions([])
    setTestData([])
    setFramework('playwright')
    setLanguage('JavaScript')
    setArchitecture('simple')
    setFiles(null)
    setChecks([])
    setBestPractices([])
    setActiveSection('template')
  }, [])

  const handleClear = useCallback(() => {
    setFiles(null)
    setChecks([])
    setBestPractices([])
  }, [])

  const handleTemplateSelect = useCallback((template) => {
    setProjectInfo({
      projectName: template.projectInfo.projectName || '',
      environment: template.projectInfo.environment || '',
      feature: template.projectInfo.feature || '',
      module: template.projectInfo.module || '',
      baseUrl: template.projectInfo.baseUrl || '',
      testTitle: template.projectInfo.testTitle || '',
      author: template.projectInfo.author || '',
      priority: template.projectInfo.priority || 'Medium',
      tags: template.projectInfo.tags || [],
      description: template.projectInfo.description || '',
    })
    setSteps(template.steps.map((s) => ({
      action: s.action,
      locatorType: mapLocatorType(s.locatorType),
      locator: s.locator || '',
      value: s.value || '',
      description: s.description || '',
      expectedValue: s.expectedValue || '',
      notes: s.notes || '',
    })))
    setAssertions(template.assertions.map((a) => ({
      type: a.type,
      locatorType: mapLocatorType(a.locatorType),
      locator: a.locator || '',
      value: a.value || '',
    })))
    setTestData(template.testData.map((d) => ({ name: d.name, value: d.value })))
    setFramework(template.settings?.framework || 'playwright')
    setLanguage(template.settings?.language || 'JavaScript')
    setArchitecture(template.settings?.architecture || 'simple')
    setActiveSection('project')
  }, [])

  const handleFrameworkChange = useCallback((fw) => {
    setFramework(fw)
    const langMap = { playwright: 'JavaScript', selenium: 'Java' }
    setLanguage(langMap[fw] || 'JavaScript')
    const archMap = { playwright: 'simple', selenium: 'simple' }
    setArchitecture(archMap[fw] || 'simple')
  }, [])

  const handleLangChange = useCallback((lang) => {
    setLanguage(lang)
    if (framework === 'selenium' && lang !== 'Java') {
      setArchitecture('simple')
    }
  }, [framework])

  const sections = [
    { id: 'template', label: 'Templates' },
    { id: 'framework', label: 'Framework' },
    { id: 'language', label: 'Language' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'project', label: 'Project Info' },
    { id: 'steps', label: 'Steps' },
    { id: 'assertions', label: 'Assertions' },
    { id: 'testData', label: 'Test Data' },
  ]

  const singleCode = files && files.length > 0 ? files[0].content : emptyCode

  const frameworkLabel = framework.charAt(0).toUpperCase() + framework.slice(1)
  const frameworkIcon = framework === 'playwright' ? '🎭' : framework === 'selenium' ? '🌍' : '📱'

  return (
    <div className={'min-h-screen bg-gradient-to-b from-white via-' + colors.bg + '-50/30 to-white dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A]'}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Test Automation Generator
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Build once, generate for any framework. Currently: {frameworkIcon} {frameworkLabel} + {language}
            </p>
          </div>
          <Statistics steps={steps} assertions={assertions} code={singleCode} colors={colors} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {sections.map((sec, i) => (
                <div key={sec.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveSection(sec.id)}
                    className={'px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap ' + (activeSection === sec.id ? 'bg-' + colors.primary + '-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700')}
                  >
                    {i + 1}. {sec.label}
                  </button>
                  {i < sections.length - 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-slate-300 dark:text-slate-600">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-6 shadow-sm">
              {activeSection === 'template' && (
                <TemplateSelector onSelect={handleTemplateSelect} />
              )}
              {activeSection === 'framework' && (
                <FrameworkSelector value={framework} onChange={handleFrameworkChange} />
              )}
              {activeSection === 'language' && (
                <LanguageSelector framework={framework} value={language} onChange={handleLangChange} colors={colors} />
              )}
              {activeSection === 'architecture' && (
                <ArchitectureSelector framework={framework} language={language} value={architecture} onChange={setArchitecture} />
              )}
              {activeSection === 'project' && (
                <ProjectInfo projectInfo={projectInfo} onChange={setProjectInfo} colors={colors} />
              )}
              {activeSection === 'steps' && (
                <TestStepBuilder steps={steps} setSteps={setSteps} colors={colors} />
              )}
              {activeSection === 'assertions' && (
                <AssertionBuilder assertions={assertions} setAssertions={setAssertions} colors={colors} />
              )}
              {activeSection === 'testData' && (
                <TestData testData={testData} setTestData={setTestData} colors={colors} />
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={steps.length === 0}
                className={'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ' + colors.gradient + ' px-5 py-2.5 text-sm font-semibold text-white shadow-lg ' + colors.shadow + ' hover:' + colors.hoverShadow + ' disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Generate Project
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                </svg>
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col" style={{ minHeight: '700px' }}>
            <CodePreview
              code={singleCode}
              files={files}
              steps={steps}
              assertions={assertions}
              checks={checks}
              bestPractices={bestPractices}
              hasContent={hasContent}
              onClear={handleClear}
              colors={colors}
              framework={framework}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
