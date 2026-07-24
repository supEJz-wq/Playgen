import { useState, useCallback, useMemo } from 'react'
import ProjectInfo from '../../components/ProjectInfo'
import TestStepBuilder from '../../components/TestStepBuilder'
import AssertionBuilder from '../../components/AssertionBuilder'
import TestData from '../../components/TestData'
import TemplateSelector from '../../components/TemplateSelector'
import LanguageSelector from '../../components/LanguageSelector'
import ArchitectureSelector from '../../components/ArchitectureSelector'
import Statistics from '../../components/Statistics'
import { frameworkColors, architectureDetails } from '../../constants/frameworks'
import { generateTestCode, generateExplanation, generateChecklist, generateBestPractices } from '../../generators'
import { toTestModel } from '../../models/testModel'

const locatorTypeMap = {
  'CSS': 'CSS Selector',
  'ID': 'Id',
  'Name': 'Name',
  'Class': 'ClassName',
  'XPath': 'XPath',
  'Link Text': 'LinkText',
  'Partial Link Text': 'PartialLinkText',
  'Tag': 'TagName',
}

function mapLocatorType(lt) {
  return locatorTypeMap[lt] || lt || 'CSS Selector'
}

const emptyCode = '// Build your Selenium test, select a language and architecture, then click Generate.'

export default function SeleniumGenerator() {
  const [projectInfo, setProjectInfo] = useState({
    projectName: '', environment: '', feature: '', module: '', baseUrl: '',
    testTitle: '', author: '', priority: 'Medium', tags: [], description: '',
  })
  const [steps, setSteps] = useState([])
  const [assertions, setAssertions] = useState([])
  const [testData, setTestData] = useState([])
  const [language, setLanguage] = useState('Java')
  const [architecture, setArchitecture] = useState('simple')
  const [files, setFiles] = useState(null)
  const [checks, setChecks] = useState([])
  const [practices, setPractices] = useState([])
  const [activeSection, setActiveSection] = useState('template')

  const hasContent = files !== null && files.length > 0
  const colors = frameworkColors.selenium

  const handleGenerate = useCallback(() => {
    const model = toTestModel(projectInfo, { framework: 'selenium', language, architecture }, steps, assertions, testData)
    const generatedFiles = generateTestCode(model)
    setFiles(generatedFiles)
    setChecks(generateChecklist(model))
    setPractices(generateBestPractices(model))
    setActiveSection('output')
  }, [projectInfo, language, architecture, steps, assertions, testData])

  const handleReset = useCallback(() => {
    setProjectInfo({ projectName: '', environment: '', feature: '', module: '', baseUrl: '', testTitle: '', author: '', priority: 'Medium', tags: [], description: '' })
    setSteps([])
    setAssertions([])
    setTestData([])
    setLanguage('Java')
    setArchitecture('simple')
    setFiles(null)
    setChecks([])
    setPractices([])
    setActiveSection('template')
  }, [])

  const handleClear = useCallback(() => {
    setFiles(null)
    setChecks([])
    setPractices([])
  }, [])

  const handleTemplateSelect = useCallback((template) => {
    setProjectInfo({
      projectName: template.projectInfo?.projectName || '',
      environment: template.projectInfo?.environment || '',
      feature: template.projectInfo?.feature || '',
      module: template.projectInfo?.module || '',
      baseUrl: template.projectInfo?.baseUrl || '',
      testTitle: template.projectInfo?.testTitle || '',
      author: template.projectInfo?.author || '',
      priority: template.projectInfo?.priority || 'Medium',
      tags: template.projectInfo?.tags || [],
      description: template.projectInfo?.description || '',
    })
    setSteps((template.steps || []).map((s) => ({
      action: s.action,
      locatorType: s.locatorType || 'CSS',
      locator: s.locator || '',
      value: s.value || '',
      description: s.description || '',
      expectedValue: s.expectedValue || '',
      notes: s.notes || '',
    })))
    setAssertions((template.assertions || []).map((a) => ({
      type: a.type,
      locatorType: a.locatorType || 'CSS',
      locator: a.locator || '',
      value: a.value || '',
    })))
    setTestData((template.testData || []).map((d) => ({ name: d.name, value: d.value })))
    if (template.settings?.language) setLanguage(template.settings.language)
    if (template.settings?.architecture) setArchitecture(template.settings.architecture)
    setActiveSection('project')
  }, [])

  const singleCode = files && files.length > 0
    ? files[0].content
    : emptyCode

  const sections = [
    { id: 'template', label: 'Templates' },
    { id: 'language', label: 'Language' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'project', label: 'Project Info' },
    { id: 'steps', label: 'Steps' },
    { id: 'assertions', label: 'Assertions' },
    { id: 'testData', label: 'Test Data' },
    { id: 'output', label: 'Output' },
  ]

  const explanationContent = useMemo(() => {
    if (!hasContent) return ''
    const model = toTestModel(projectInfo, { framework: 'selenium', language, architecture }, steps, assertions, testData)
    return generateExplanation(model)
  }, [hasContent, projectInfo, language, architecture, steps, assertions, testData])

  function buildFileTree(filesList) {
    if (!filesList || filesList.length === 0) return []
    var tree = []
    var folders = {}
    filesList.forEach(function(f) {
      var parts = (f.name || 'unknown').split('/')
      if (parts.length > 1) {
        var folder = parts[0]
        if (!folders[folder]) {
          folders[folder] = { name: folder, type: 'folder', children: [] }
          tree.push(folders[folder])
        }
        folders[folder].children.push({ name: parts.slice(1).join('/'), type: 'file' })
      } else {
        tree.push({ name: parts[0], type: 'file' })
      }
    })
    return tree
  }

  function FileTreeNode({ node, depth }) {
    var [open, setOpen] = useState(true)
    var isFolder = node.type === 'folder'
    return (
      <div>
        <div
          className={'flex items-center gap-2 py-1 px-2 rounded-md hover:bg-orange-50 dark:hover:bg-slate-800/50 cursor-default transition-colors' + (depth > 0 ? ' ml-5' : '')}
          onClick={() => isFolder && setOpen(!open)}
        >
          {isFolder ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'h-4 w-4 shrink-0 text-orange-500 transition-transform' + (open ? ' rotate-90' : '')}>
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
              <path fillRule="evenodd" d="M5.5 3.5A1.5 1.5 0 017 2h2.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0115 6.622V16.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 015 16.5v-13z" clipRule="evenodd" />
            </svg>
          )}
          <span className={'text-xs font-medium ' + (isFolder ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400')}>{node.name}</span>
        </div>
        {isFolder && open && node.children && node.children.map(function(child, i) {
          return <FileTreeNode key={i} node={child} depth={depth + 1} />
        })}
      </div>
    )
  }

  function filterFilesByPrefix(prefix) {
    if (!files) return []
    return files.filter(function(f) { return f.name.startsWith(prefix) })
  }

  function downloadZip() {
    if (!files || files.length === 0) return
    var zipContent = []
    files.forEach(function(f, i) {
      if (i > 0) zipContent.push('\n--- ' + f.name + ' ---\n')
      zipContent.push(f.content)
    })
    var blob = new Blob([zipContent.join('')], { type: 'text/plain' })
    var url = URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.href = url
    a.download = 'selenium-pom-project.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function downloadFile(index) {
    if (!files || index >= files.length) return
    var f = files[index]
    var blob = new Blob([f.content], { type: 'text/plain' })
    var url = URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.href = url
    a.download = f.name.split('/').pop() || f.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  var fileTree = useMemo(function() { return buildFileTree(files) }, [files])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Selenium Project Generator</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Build professional Selenium automation projects with POM, reusable components, and best practices.
            </p>
          </div>
          <Statistics steps={steps} assertions={assertions} code={singleCode} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1 overflow-x-auto pb-1">
              {sections.map(function(sec, i) {
                return (
                  <div key={sec.id} className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setActiveSection(sec.id)}
                      className={'px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap ' + (activeSection === sec.id ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700')}
                    >
                      {i + 1}. {sec.label}
                    </button>
                    {i < sections.length - 1 && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-slate-300 dark:text-slate-600">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-6 shadow-sm">
              {activeSection === 'template' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Start Templates</h3>
                    <span className="text-[10px] text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">Selenium</span>
                  </div>
                  <TemplateSelector onSelect={handleTemplateSelect} />
                </div>
              )}
              {activeSection === 'language' && (
                <LanguageSelector framework="selenium" value={language} onChange={setLanguage} colors={colors} />
              )}
              {activeSection === 'architecture' && (
                <ArchitectureSelector framework="selenium" language={language} value={architecture} onChange={setArchitecture} />
              )}
              {activeSection === 'project' && <ProjectInfo projectInfo={projectInfo} onChange={setProjectInfo} />}
              {activeSection === 'steps' && (
                <TestStepBuilder
                  framework="selenium"
                  language={language}
                  steps={steps}
                  setSteps={setSteps}
                />
              )}
              {activeSection === 'assertions' && (
                <AssertionBuilder
                  framework="selenium"
                  language={language}
                  assertions={assertions}
                  setAssertions={setAssertions}
                />
              )}
              {activeSection === 'testData' && <TestData testData={testData} setTestData={setTestData} />}
              {activeSection === 'output' && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Architecture Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-4">
                      <span className="text-[10px] font-medium text-orange-500 dark:text-orange-400 uppercase tracking-wider">Language</span>
                      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">{language}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-4">
                      <span className="text-[10px] font-medium text-orange-500 dark:text-orange-400 uppercase tracking-wider">Architecture</span>
                      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {(architectureDetails[architecture] || {}).label || architecture}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={steps.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
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
                Reset Form
              </button>
            </div>
          </div>

          <div className="flex flex-col" style={{ minHeight: '700px' }}>
            <CodePreviewPanel
              files={files}
              checks={checks}
              practices={practices}
              explanation={explanationContent}
              hasContent={hasContent}
              onClear={handleClear}
              onDownloadFile={downloadFile}
              onDownloadZip={downloadZip}
              fileTree={fileTree}
              filterFilesByPrefix={filterFilesByPrefix}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CodePreviewPanel({ files, checks, practices, explanation, hasContent, onClear, onDownloadFile, onDownloadZip, fileTree, filterFilesByPrefix }) {
  var [activeView, setActiveView] = useState('script')
  var [activeFile, setActiveFile] = useState(0)
  var [copied, setCopied] = useState(false)

  var currentFiles = (files && files.length > 0) ? files : []
  var currentContent = currentFiles[activeFile]?.content || ''
  var currentName = currentFiles[activeFile]?.name || 'output.txt'

  var isPom = files && files.length > 1

  var viewTabs = [
    { id: 'script', label: 'Generated Code' },
    { id: 'structure', label: 'Project Structure' },
  ]
  if (isPom) {
    viewTabs.push({ id: 'pages', label: 'Page Objects' })
    viewTabs.push({ id: 'components', label: 'Components' })
    viewTabs.push({ id: 'helpers', label: 'Helpers' })
  }
  viewTabs.push({ id: 'explanation', label: 'Explanation' })
  viewTabs.push({ id: 'checklist', label: 'QA Checklist' })
  viewTabs.push({ id: 'practices', label: 'Best Practices' })

  var handleCopy = async function() {
    try {
      await navigator.clipboard.writeText(currentContent)
      setCopied(true)
      setTimeout(function() { setCopied(false) }, 2000)
    } catch {
      var textarea = document.createElement('textarea')
      textarea.value = currentContent
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(function() { setCopied(false) }, 2000)
    }
  }

  var FileTreeView = function() {
    if (!fileTree || fileTree.length === 0) {
      return <p className="text-sm text-slate-400 dark:text-slate-500">Generate a project to see the file structure.</p>
    }
    return (
      <div className="space-y-0.5">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-2">
          <span className="text-orange-500">selenium-project/</span>
        </div>
        {fileTree.map(function(node, i) {
          return <FileTreeViewNode key={i} node={node} depth={0} />
        })}
      </div>
    )
  }

  function FileTreeViewNode({ node, depth }) {
    var [open, setOpen] = useState(true)
    var isFolder = node.type === 'folder'
    return (
      <div>
        <div
          className={'flex items-center gap-2 py-1 px-2 rounded-md hover:bg-orange-50 dark:hover:bg-slate-800/50 cursor-default transition-colors' + (depth > 0 ? ' ml-5' : ' ml-2')}
          onClick={() => isFolder && setOpen(!open)}
        >
          {isFolder ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'h-4 w-4 shrink-0 text-orange-500 transition-transform' + (open ? ' rotate-90' : '')}>
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
              <path fillRule="evenodd" d="M5.5 3.5A1.5 1.5 0 017 2h2.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0115 6.622V16.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 015 16.5v-13z" clipRule="evenodd" />
            </svg>
          )}
          <span className={'text-xs font-medium ' + (isFolder ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400')}>{node.name}</span>
        </div>
        {isFolder && open && node.children && node.children.map(function(child, i) {
          return <FileTreeViewNode key={i} node={child} depth={depth + 1} />
        })}
      </div>
    )
  }

  var PagesView = function() {
    var pages = filterFilesByPrefix('pages/') || filterFilesByPrefix('Pages/')
    if (pages.length === 0) return <p className="text-sm text-slate-400 dark:text-slate-500">No page objects generated for this architecture.</p>
    return (
      <div className="space-y-2">
        {pages.map(function(f, i) {
          return (
            <button
              key={i}
              onClick={() => { setActiveFile(currentFiles.indexOf(f)); setActiveView('script') }}
              className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3 hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{f.name}</span>
            </button>
          )
        })}
      </div>
    )
  }

  var ComponentsView = function() {
    var comps = filterFilesByPrefix('components/') || filterFilesByPrefix('Components/')
    if (comps.length === 0) return <p className="text-sm text-slate-400 dark:text-slate-500">No components generated for this architecture.</p>
    return (
      <div className="space-y-2">
        {comps.map(function(f, i) {
          return (
            <button
              key={i}
              onClick={() => { setActiveFile(currentFiles.indexOf(f)); setActiveView('script') }}
              className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3 hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{f.name}</span>
            </button>
          )
        })}
      </div>
    )
  }

  var HelpersView = function() {
    var helpers = filterFilesByPrefix('utils/') || filterFilesByPrefix('Utilities/') || filterFilesByPrefix('config/') || filterFilesByPrefix('Config/') || filterFilesByPrefix('data/')
    if (helpers.length === 0) return <p className="text-sm text-slate-400 dark:text-slate-500">No helper files generated for this architecture.</p>
    return (
      <div className="space-y-2">
        {helpers.map(function(f, i) {
          return (
            <button
              key={i}
              onClick={() => { setActiveFile(currentFiles.indexOf(f)); setActiveView('script') }}
              className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3 hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{f.name}</span>
            </button>
          )
        })}
      </div>
    )
  }

  var ChecklistView = function() {
    if (!checks || checks.length === 0) {
      return <p className="text-sm text-slate-400 dark:text-slate-500">Generate a project to see the QA checklist.</p>
    }
    return (
      <div className="space-y-4">
        {checks.map(function(cat, ci) {
          return (
            <div key={ci}>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{cat.category}</h4>
              <div className="space-y-1.5">
                {cat.items.map(function(item, ii) {
                  return (
                    <div key={ii} className={'flex items-start gap-2.5 rounded-lg p-2.5 ' + (item.passed ? 'bg-green-50 dark:bg-green-900/10' : 'bg-amber-50 dark:bg-amber-900/10')}>
                      {item.passed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 mt-0.5 text-green-500">
                          <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 mt-0.5 text-amber-500">
                          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={'text-xs font-medium ' + (item.passed ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300')}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  var PracticesView = function() {
    if (!practices || practices.length === 0) {
      return <p className="text-sm text-slate-400 dark:text-slate-500">Generate a project to see best practices.</p>
    }
    return (
      <div className="space-y-3">
        {practices.map(function(p, i) {
          return (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{p.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.description}</p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 overflow-x-auto">
          {viewTabs.map(function(tab) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap ' + (activeView === tab.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300')}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        {(activeView === 'script' || activeView === 'structure') && hasContent && (
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {activeView === 'script' && (
              <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer">
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            )}
            {hasContent && files.length > 1 && (
              <button onClick={onDownloadZip} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                Download ZIP
              </button>
            )}
            {activeView === 'script' && files && files.length <= 1 && (
              <button onClick={() => onDownloadFile(activeFile)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                Download
              </button>
            )}
            <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all duration-200 cursor-pointer">Clear</button>
          </div>
        )}
      </div>

      {activeView === 'script' && currentFiles.length > 1 && (
        <div className="flex items-center gap-1 mb-3 overflow-x-auto">
          {currentFiles.map(function(f, i) {
            return (
              <button
                key={f.name}
                onClick={() => setActiveFile(i)}
                className={'px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ' + (activeFile === i ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800' : 'text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50')}
              >
                {f.name}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950">
        {activeView === 'script' && (
          <pre className="h-full w-full overflow-auto p-4 text-sm text-green-400 font-mono leading-relaxed">
            <code>{hasContent ? currentContent : emptyCode}</code>
          </pre>
        )}
        {activeView === 'structure' && (
          <div className="p-4 overflow-auto h-full bg-white dark:bg-slate-900/20">
            <FileTreeView />
          </div>
        )}
        {activeView === 'pages' && (
          <div className="p-4 overflow-auto h-full bg-white dark:bg-slate-900/20">
            <PagesView />
          </div>
        )}
        {activeView === 'components' && (
          <div className="p-4 overflow-auto h-full bg-white dark:bg-slate-900/20">
            <ComponentsView />
          </div>
        )}
        {activeView === 'helpers' && (
          <div className="p-4 overflow-auto h-full bg-white dark:bg-slate-900/20">
            <HelpersView />
          </div>
        )}
        {activeView === 'explanation' && (
          <div className="p-4 overflow-auto h-full bg-white dark:bg-slate-900/20">
            {hasContent ? (
              <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">{explanation}</pre>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">Generate a project to see the explanation.</p>
            )}
          </div>
        )}
        {activeView === 'checklist' && (
          <div className="p-4 overflow-auto h-full bg-white dark:bg-slate-900/20">
            <ChecklistView />
          </div>
        )}
        {activeView === 'practices' && (
          <div className="p-4 overflow-auto h-full bg-white dark:bg-slate-900/20">
            <PracticesView />
          </div>
        )}
      </div>
    </div>
  )
}
