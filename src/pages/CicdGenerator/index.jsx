import { useState, useCallback, useMemo } from 'react'
import JSZip from 'jszip'
import MonacoEditor from '@monaco-editor/react'
import Statistics from '../../components/Statistics'
import QAChecklist from '../../components/QAChecklist'
import BestPracticesPanel from '../../components/BestPracticesPanel'
import { frameworkColors, cicdPlatforms, cicdLanguageMap, cicdSettings } from '../../constants/frameworks'
import { generateTestCode, generateChecklist, generateBestPractices } from '../../generators'
import { toPipelineModel } from '../../models/cicdPipelineModel'

const emptyCode = '# Configure your pipeline, then click Generate.'

const cicdFrameworkOptions = [
  { id: 'playwright', label: 'Playwright', icon: '🎭' },
  { id: 'selenium', label: 'Selenium', icon: '🌍' },
  { id: 'appium', label: 'Appium', icon: '📱' },
]

const ciLabelMap = {
  'github-actions': 'GitHub Actions',
  'gitlab-ci': 'GitLab CI/CD',
  'jenkins': 'Jenkins',
  'azure-devops': 'Azure DevOps',
}

export default function CicdGenerator() {
  const [automationFramework, setAutomationFramework] = useState('playwright')
  const [language, setLanguage] = useState('JavaScript')
  const [ciPlatform, setCiPlatform] = useState('github-actions')
  const [pipelineName, setPipelineName] = useState('CI/CD Pipeline')
  const [operatingSystem, setOperatingSystem] = useState('Ubuntu')
  const [trigger, setTrigger] = useState('Push')
  const [executionMode, setExecutionMode] = useState('Headless')
  const [enableRetry, setEnableRetry] = useState(false)
  const [browser, setBrowser] = useState('Chrome')
  const [platform, setPlatform] = useState('Android')
  const [parallelExecution, setParallelExecution] = useState(false)
  const [reports, setReports] = useState({ html: true, allure: false, junit: false })
  const [artifacts, setArtifacts] = useState({ reports: true, screenshots: false, videos: false, logs: false })
  const [files, setFiles] = useState(null)
  const [checks, setChecks] = useState([])
  const [bestPractices, setBestPractices] = useState([])
  const [activeSection, setActiveSection] = useState('framework')

  const hasContent = files !== null && files.length > 0
  const colors = frameworkColors.cicd
  const singleCode = files && files.length > 0 ? files[0].content : emptyCode
  const ciLabel = ciLabelMap[ciPlatform] || ciPlatform
  const fwLabel = cicdFrameworkOptions.find((f) => f.id === automationFramework)?.label || automationFramework

  const handleGenerate = useCallback(() => {
    const pipelineInfo = {
      automationFramework,
      language,
      ciPlatform,
      pipelineName,
      operatingSystem,
      trigger,
      executionMode,
      enableRetry,
      browser,
      platform,
      buildTool: 'npm',
      parallelExecution,
      reports,
      artifacts,
    }
    const model = toPipelineModel(pipelineInfo)
    const generatedFiles = generateTestCode(model)
    setFiles(generatedFiles)
    setChecks(generateChecklist(model))
    setBestPractices(generateBestPractices(model))
    setActiveSection('framework')
  }, [automationFramework, language, ciPlatform, pipelineName, operatingSystem, trigger, executionMode, enableRetry, browser, platform, parallelExecution, reports, artifacts])

  const handleReset = useCallback(() => {
    setAutomationFramework('playwright')
    setLanguage('JavaScript')
    setCiPlatform('github-actions')
    setPipelineName('CI/CD Pipeline')
    setOperatingSystem('Ubuntu')
    setTrigger('Push')
    setExecutionMode('Headless')
    setEnableRetry(false)
    setBrowser('Chrome')
    setPlatform('Android')
    setParallelExecution(false)
    setReports({ html: true, allure: false, junit: false })
    setArtifacts({ reports: true, screenshots: false, videos: false, logs: false })
    setFiles(null)
    setChecks([])
    setBestPractices([])
    setActiveSection('framework')
  }, [])

  const handleClear = useCallback(() => {
    setFiles(null)
    setChecks([])
    setBestPractices([])
  }, [])

  const handleFrameworkChange = useCallback((fw) => {
    setAutomationFramework(fw)
    const langs = cicdLanguageMap[fw] || ['JavaScript']
    setLanguage(langs[0])
  }, [])

  const toggleReport = useCallback((key) => {
    setReports((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const toggleArtifact = useCallback((key) => {
    setArtifacts((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const sections = [
    { id: 'framework', label: 'Framework' },
    { id: 'language', label: 'Language' },
    { id: 'platform', label: 'CI/CD Platform' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'reports', label: 'Reports' },
    { id: 'artifacts', label: 'Artifacts' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              CI/CD Pipeline Generator
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Generate production-ready pipeline configs for GitHub Actions, GitLab CI, Jenkins, and Azure DevOps.
            </p>
          </div>
          <Statistics steps={[]} assertions={[]} code={singleCode} colors={colors} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1 overflow-x-auto pb-1">
              {sections.map((sec, i) => (
                <div key={sec.id} className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setActiveSection(sec.id)}
                    className={'px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap ' + (activeSection === sec.id ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700')}
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
              {activeSection === 'framework' && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Select Automation Framework</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {cicdFrameworkOptions.map((fw) => {
                      const selected = automationFramework === fw.id
                      return (
                        <button key={fw.id} onClick={() => handleFrameworkChange(fw.id)}
                          className={'text-left rounded-xl border p-4 cursor-pointer transition-all duration-200 ' + (selected ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600')}
                        >
                          <div className="flex items-center gap-3">
                            <div className={'flex h-8 w-8 items-center justify-center rounded-lg text-base ' + (selected ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')}>
                              <span>{fw.icon}</span>
                            </div>
                            <div>
                              <div className={'text-sm font-semibold ' + (selected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300')}>{fw.label}</div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeSection === 'language' && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    Programming Language
                    <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">for {fwLabel}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(cicdLanguageMap[automationFramework] || ['JavaScript']).map((lang) => {
                      const selected = language === lang
                      return (
                        <button key={lang} onClick={() => setLanguage(lang)}
                          className={'text-left rounded-xl border p-3 cursor-pointer transition-all duration-200 ' + (selected ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600')}
                        >
                          <div className="flex items-center gap-3">
                            <div className={'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ' + (selected ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-600')}>
                              {selected && <div className="h-2 w-2 rounded-full bg-indigo-500" />}
                            </div>
                            <span className={'text-sm font-medium ' + (selected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300')}>{lang}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeSection === 'platform' && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Select CI/CD Platform</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cicdPlatforms.map((p) => {
                      const selected = ciPlatform === p.id
                      const isComingSoon = p.id === 'circleci'
                      return (
                        <button key={p.id} onClick={() => !isComingSoon && setCiPlatform(p.id)} disabled={isComingSoon}
                          className={'text-left rounded-xl border p-4 cursor-pointer transition-all duration-200 ' + (isComingSoon ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20' : selected ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600')}
                        >
                          <div className="flex items-center gap-3">
                            <div className={'flex h-8 w-8 items-center justify-center rounded-lg text-base ' + (isComingSoon ? 'bg-slate-100 dark:bg-slate-700' : selected ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')}>
                              <span>{p.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={'text-sm font-semibold ' + (isComingSoon ? 'text-slate-400 dark:text-slate-500' : selected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300')}>{p.label}</div>
                              <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{p.description}</div>
                            </div>
                            {isComingSoon && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">Coming Soon</span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeSection === 'pipeline' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Pipeline Configuration</h3>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Pipeline Name</label>
                    <input type="text" value={pipelineName} onChange={(e) => setPipelineName(e.target.value)}
                      className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">Operating System</label>
                      <select value={operatingSystem} onChange={(e) => setOperatingSystem(e.target.value)}
                        className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors'}
                      >
                        {cicdSettings.osOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">Trigger</label>
                      <select value={trigger} onChange={(e) => setTrigger(e.target.value)}
                        className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors'}
                      >
                        {cicdSettings.triggers.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">Execution Mode</label>
                      <select value={executionMode} onChange={(e) => setExecutionMode(e.target.value)}
                        className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors'}
                      >
                        {cicdSettings.executionModes.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">Browser</label>
                      <select value={browser} onChange={(e) => setBrowser(e.target.value)}
                        className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors'}
                      >
                        {cicdSettings.browsers.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {automationFramework === 'appium' && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">Platform</label>
                      <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                        className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors'}
                      >
                        <option value="Android">Android</option>
                        <option value="iOS">iOS</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={parallelExecution} onChange={(e) => setParallelExecution(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Parallel Execution</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={enableRetry} onChange={(e) => setEnableRetry(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Enable Retry</span>
                    </label>
                  </div>
                </div>
              )}

              {activeSection === 'reports' && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Report Settings</h3>
                  <div className="space-y-3">
                    {cicdSettings.reportOptions.map((key) => {
                      const k = key === 'HTML Report' ? 'html' : key === 'Allure Report' ? 'allure' : 'junit'
                      return (
                        <label key={key} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                          <input type="checkbox" checked={reports[k]} onChange={() => toggleReport(k)}
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">Generate {key}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeSection === 'artifacts' && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Artifact Settings</h3>
                  <div className="space-y-3">
                    {cicdSettings.artifactOptions.map((key) => {
                      const k = key === 'Test Reports' ? 'reports' : key === 'Screenshots' ? 'screenshots' : key === 'Videos' ? 'videos' : 'logs'
                      return (
                        <label key={key} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                          <input type="checkbox" checked={artifacts[k]} onChange={() => toggleArtifact(k)}
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">Archive {key}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Generate Pipeline
              </button>
              <button onClick={handleReset}
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
            <CicdOutputPanel
              files={files}
              checks={checks}
              bestPractices={bestPractices}
              hasContent={hasContent}
              onClear={handleClear}
              colors={colors}
              framework={automationFramework}
              ciPlatform={ciPlatform}
              ciLabel={ciLabel}
              fwLabel={fwLabel}
              language={language}
              pipelineName={pipelineName}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CicdOutputPanel({ files, checks, bestPractices, hasContent, onClear, framework, ciLabel, fwLabel, language, pipelineName }) {
  const [activeView, setActiveView] = useState('script')
  const [activeFile, setActiveFile] = useState(0)
  const [copied, setCopied] = useState(false)

  const currentFiles = (files && files.length > 0) ? files : []
  const currentContent = currentFiles[activeFile]?.content || ''
  const currentName = currentFiles[activeFile]?.name || 'output.yml'

  const viewTabs = [
    { id: 'script', label: 'Generated Pipeline' },
    { id: 'structure', label: 'Project Structure' },
    { id: 'explanation', label: 'Pipeline Explanation' },
    { id: 'checklist', label: 'QA Checklist' },
    { id: 'bestPractices', label: 'Best Practices' },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = currentContent
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadZip = async () => {
    if (!currentFiles || currentFiles.length === 0) return
    const zip = new JSZip()
    currentFiles.forEach((f) => {
      zip.file(f.name, f.content)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cicd-pipeline.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadFile = () => {
    if (!currentFiles || currentFiles.length === 0) return
    const f = currentFiles[activeFile]
    const blob = new Blob([f.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = f.name.split('/').pop() || f.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const fileTree = useMemo(() => {
    const cf = (files && files.length > 0) ? files : []
    if (cf.length === 0) return []
    const tree = []
    const folders = {}
    cf.forEach((f) => {
      const parts = (f.name || 'unknown').split('/')
      if (parts.length > 1) {
        const folder = parts[0]
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
  }, [files])

  const explanationContent = useMemo(() => {
    if (!files || files.length === 0) return ''
    const platformName = ciLabel
    const fw = fwLabel
    const lang = language
    const name = pipelineName

    const stageExplanations = {
      'Checkout': 'Pulls the latest source code from the repository using the platform-native checkout action.',
      'Install': 'Installs all project dependencies required to run the tests.',
      'Browsers': 'Downloads and installs the required browser binaries and system dependencies.',
      'Drivers': 'Sets up browser drivers needed for Selenium WebDriver communication.',
      'Appium': 'Installs the Appium server and the appropriate platform driver (UiAutomator2 for Android / XCUITest for iOS).',
      'Test': 'Executes the test suite with the configured options and reporters.',
      'Report': 'Generates test reports in the configured formats (HTML, Allure, JUnit).',
      'Artifact': 'Uploads test artifacts such as reports, screenshots, videos, and logs for later review.',
    }

    return `# Pipeline Explanation: ${platformName}

This configuration defines a CI/CD pipeline that automatically runs ${fw} (${lang}) tests whenever code changes are pushed.

## Pipeline Stages

### 1. Checkout Source Code
${stageExplanations['Checkout']}

### 2. Install Dependencies
${stageExplanations['Install']}

### 3. ${framework === 'playwright' ? 'Install Browsers' : framework === 'appium' ? 'Setup Appium' : 'Setup Drivers'}
${framework === 'playwright' ? stageExplanations['Browsers'] : framework === 'appium' ? stageExplanations['Appium'] : stageExplanations['Drivers']}

### 4. Run Tests
${stageExplanations['Test']}

### 5. Generate Reports
${stageExplanations['Report']}

### 6. Upload Artifacts
${stageExplanations['Artifact']}

## Key Configuration

- **Pipeline Name**: ${name}
- **Trigger**: Configured to run on specified events
- **Runtime**: ${platformName} with ${language} support
- **Browser**: Configured for cross-browser testing
- **Mode**: Optimized for CI environments

## Output Files

The generator produces a single pipeline configuration file that defines the complete CI/CD workflow. This file should be placed in the root of your repository.`
  }, [files, ciLabel, fwLabel, language, pipelineName, framework])

  function getLanguage() {
    const name = currentName.toLowerCase()
    if (name.endsWith('.yml') || name.endsWith('.yaml')) return 'yaml'
    if (name.endsWith('.groovy') || name.endsWith('.jenkinsfile') || name === 'jenkinsfile') return 'groovy'
    return 'yaml'
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap ' + (activeView === tab.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {(activeView === 'script' || activeView === 'structure') && hasContent && (
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer">
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {currentFiles.length > 1 && (
              <button onClick={handleDownloadZip} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                Download ZIP
              </button>
            )}
            {currentFiles.length <= 1 && (
              <button onClick={handleDownloadFile} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                Download
              </button>
            )}
            <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 cursor-pointer">Clear</button>
          </div>
        )}
      </div>

      {activeView === 'script' && currentFiles.length > 1 && (
        <div className="flex items-center gap-1 mb-3 overflow-x-auto">
          {currentFiles.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setActiveFile(i)}
              className={'px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ' + (activeFile === i ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50')}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        {activeView === 'script' && (
          <MonacoEditor
            key={currentName}
            height="100%"
            language={getLanguage()}
            theme="vs-dark"
            value={currentContent}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 12 },
              readOnly: true,
              renderWhitespace: 'selection',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        )}
        {activeView === 'structure' && (
          <div className="p-4 overflow-auto h-full">
            {fileTree.length > 0 ? (
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-2">
                  <span className="text-indigo-500">cicd-pipeline/</span>
                </div>
                {fileTree.map((node, i) => (
                  <FileTreeNode key={i} node={node} depth={0} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">Generate a pipeline to see the project structure.</p>
            )}
          </div>
        )}
        {activeView === 'explanation' && (
          <div className="p-4 overflow-auto h-full">
            {hasContent ? (
              <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{explanationContent}</pre>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">Generate a pipeline to see the explanation.</p>
            )}
          </div>
        )}
        {activeView === 'checklist' && (
          <QAChecklist checks={checks} />
        )}
        {activeView === 'bestPractices' && (
          <BestPracticesPanel bestPractices={bestPractices} />
        )}
      </div>
    </div>
  )
}

function FileTreeNode({ node, depth }) {
  const [open, setOpen] = useState(true)
  const isFolder = node.type === 'folder'

  return (
    <div>
      <div
        className={'flex items-center gap-2 py-1 px-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-800/50 cursor-default transition-colors ' + (depth > 0 ? 'ml-5' : 'ml-2')}
        onClick={() => isFolder && setOpen(!open)}
      >
        {isFolder ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'h-4 w-4 shrink-0 text-indigo-500 transition-transform ' + (open ? 'rotate-90' : '')}>
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
            <path fillRule="evenodd" d="M5.5 3.5A1.5 1.5 0 017 2h2.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0115 6.622V16.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 015 16.5v-13z" clipRule="evenodd" />
          </svg>
        )}
        <span className={'text-xs font-medium ' + (isFolder ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400')}>
          {node.name}
        </span>
      </div>
      {isFolder && open && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
