import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

const PIPELINE_STAGES = [
  { id: 'checkout', name: 'Checkout Repository', duration: 2000, description: 'This stage pulls the latest source code from the repository using the platform-native checkout action.' },
  { id: 'setup-runtime', name: 'Setup Runtime', duration: 1500, description: 'This stage configures the runtime environment including Node.js, Java, Python, or .NET based on your project requirements.' },
  { id: 'install-deps', name: 'Install Dependencies', duration: 3000, description: 'This stage installs all project dependencies (npm ci, mvn install, pip install) required for test execution.' },
  { id: 'restore-cache', name: 'Restore Cache', duration: 1000, description: 'This stage restores previously cached dependencies to speed up subsequent pipeline runs.' },
  { id: 'install-browsers', name: 'Install Browsers', duration: 4000, description: 'This stage downloads and installs the required browser binaries and system dependencies for Playwright, Selenium, or Appium.' },
  { id: 'smoke-tests', name: 'Run Smoke Tests', duration: 5000, description: 'This stage executes a subset of critical tests to quickly verify core functionality before running the full suite.' },
  { id: 'regression-tests', name: 'Run Regression Tests', duration: 8000, description: 'This stage executes the complete regression suite to verify existing functionality after code changes.' },
  { id: 'generate-reports', name: 'Generate Reports', duration: 2000, description: 'This stage creates HTML, Allure, and JUnit reports for review and analysis.' },
  { id: 'upload-artifacts', name: 'Upload Artifacts', duration: 2000, description: 'This stage uploads test artifacts such as reports, screenshots, videos, and logs for later review.' },
  { id: 'notify-team', name: 'Notify Team', duration: 1000, description: 'This stage sends notifications to Slack, Microsoft Teams, or email about the pipeline result.' },
  { id: 'finished', name: 'Pipeline Finished', duration: 500, description: 'The pipeline has completed execution. Review the summary and artifacts for details.' },
]

const SIMULATION_EVENTS = [
  { id: 'all-passed', label: 'All Tests Passed' },
  { id: 'smoke-failed', label: 'Smoke Test Failed' },
  { id: 'regression-failed', label: 'Regression Test Failed' },
  { id: 'install-deps-failed', label: 'Dependency Installation Failed' },
  { id: 'browser-install-failed', label: 'Browser Installation Failed' },
  { id: 'build-failed', label: 'Build Failed' },
  { id: 'artifact-upload-failed', label: 'Artifact Upload Failed' },
  { id: 'notification-failed', label: 'Notification Failed' },
  { id: 'random-failure', label: 'Random Failure' },
]

const SPEED_OPTIONS = [
  { id: 'slow', label: 'Slow', multiplier: 2 },
  { id: 'normal', label: 'Normal', multiplier: 1 },
  { id: 'fast', label: 'Fast', multiplier: 0.4 },
]

const FAILURE_MAP = {
  'all-passed': null,
  'smoke-failed': 'smoke-tests',
  'regression-failed': 'regression-tests',
  'install-deps-failed': 'install-deps',
  'browser-install-failed': 'install-browsers',
  'build-failed': 'setup-runtime',
  'artifact-upload-failed': 'upload-artifacts',
  'notification-failed': 'notify-team',
}

function getFailureStage(eventId) {
  if (eventId === 'random-failure') {
    const failCandidates = PIPELINE_STAGES.slice(0, -1).filter((s) => s.id !== 'checkout')
    return failCandidates[Math.floor(Math.random() * failCandidates.length)].id
  }
  return FAILURE_MAP[eventId] || null
}

function getTestResults(eventId) {
  if (eventId === 'smoke-failed') {
    return {
      smoke: { passed: 1, failed: 1, total: 2, tests: ['login.spec.js passed', 'checkout.spec.js failed'] },
      regression: { passed: 0, failed: 0, total: 0, tests: [] },
    }
  }
  if (eventId === 'regression-failed') {
    return {
      smoke: { passed: 2, failed: 0, total: 2, tests: ['login.spec.js passed', 'search.spec.js passed'] },
      regression: { passed: 24, failed: 2, total: 26, tests: Array.from({ length: 24 }, (_, i) => `test-case-${i + 1}.spec.js passed`).concat(['payment.spec.js failed', 'checkout.spec.js failed']) },
    }
  }
  return {
    smoke: { passed: 2, failed: 0, total: 2, tests: ['login.spec.js passed', 'search.spec.js passed'] },
    regression: { passed: 26, failed: 0, total: 26, tests: Array.from({ length: 26 }, (_, i) => `test-case-${i + 1}.spec.js passed`) },
  }
}

function getNotifications(eventId) {
  const failed = eventId !== 'all-passed'
  return [
    {
      platform: 'Slack',
      icon: '#',
      title: failed ? 'Pipeline Failed' : 'Pipeline Successful',
      message: failed ? 'checkout.spec.js failed in smoke tests.' : 'All tests passed successfully.',
      time: '2 min ago',
      color: failed ? 'text-red-500' : 'text-green-500',
    },
    {
      platform: 'Microsoft Teams',
      icon: 'T',
      title: 'Regression Suite Completed',
      message: failed ? '2 tests failed in regression suite.' : 'All 26 regression tests passed.',
      time: '1 min ago',
      color: 'text-blue-500',
    },
    {
      platform: 'Email',
      icon: '@',
      title: failed ? 'Pipeline Failure Alert' : 'Pipeline Success Notification',
      message: failed ? 'Pipeline completed with failures. Review logs.' : 'Pipeline completed successfully.',
      time: 'just now',
      color: 'text-amber-500',
    },
  ]
}

function getMockArtifacts() {
  return [
    { name: 'screenshots/login-page.png', size: '124 KB', type: 'Screenshots' },
    { name: 'screenshots/dashboard.png', size: '89 KB', type: 'Screenshots' },
    { name: 'videos/test-execution.mp4', size: '2.3 MB', type: 'Videos' },
    { name: 'trace/trace.zip', size: '456 KB', type: 'Trace Files' },
    { name: 'logs/pipeline.log', size: '12 KB', type: 'Logs' },
    { name: 'logs/test-output.log', size: '48 KB', type: 'Logs' },
    { name: 'reports/html-report/index.html', size: '320 KB', type: 'Reports' },
    { name: 'reports/allure-report/index.html', size: '1.1 MB', type: 'Reports' },
  ]
}

function getMockReports() {
  return [
    { name: 'HTML Report', format: 'HTML', file: 'reports/html-report/index.html', icon: '📊' },
    { name: 'Allure Report', format: 'HTML', file: 'reports/allure-report/index.html', icon: '📈' },
    { name: 'JUnit XML', format: 'XML', file: 'reports/junit/results.xml', icon: '📋' },
    { name: 'JSON Report', format: 'JSON', file: 'reports/json/test-results.json', icon: '📄' },
    { name: 'Playwright Report', format: 'HTML', file: 'reports/playwright/index.html', icon: '🎭' },
  ]
}

const BEST_PRACTICES_DATA = [
  { title: 'Use Dependency Caching', description: 'Cache node_modules, Maven ~/.m2, or pip cache to reduce pipeline execution time by 40-60% on subsequent runs.' },
  { title: 'Prefer Explicit Waits', description: 'Always use explicit waits (WebDriverWait, page.waitForSelector) instead of fixed timeouts for reliable test synchronization.' },
  { title: 'Avoid Hardcoded Credentials', description: 'Store credentials in CI/CD secrets or environment variables. Never commit passwords, tokens, or API keys to the repository.' },
  { title: 'Archive Reports as Artifacts', description: 'Always upload test reports and screenshots as artifacts using if: always() to preserve results even on failure.' },
  { title: 'Use Matrix Builds', description: 'Parallelize test execution across browsers and operating systems using matrix strategies to reduce total pipeline duration.' },
  { title: 'Run Headless in CI', description: 'Configure browsers to run in headless mode in CI environments to reduce resource usage and avoid display server dependencies.' },
  { title: 'Set Pipeline Timeouts', description: 'Configure job-level and step-level timeouts to prevent runaway workflows from consuming CI minutes unnecessarily.' },
  { title: 'Separate Install and Test', description: 'Keep dependency installation and test execution in separate stages for better cache utilization and clearer error reporting.' },
]

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return pad(mins) + ':' + pad(secs)
}

export default function PipelineSimulator({ ciLabel, fwLabel, language, pipelineName }) {
  const [simState, setSimState] = useState('idle')
  const [currentStageIdx, setCurrentStageIdx] = useState(-1)
  const [stageStatuses, setStageStatuses] = useState({})
  const [eventId, setEventId] = useState('all-passed')
  const [speed, setSpeed] = useState('normal')
  const [logs, setLogs] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [failureStageId, setFailureStageId] = useState(null)
  const [selectedError, setSelectedError] = useState(null)
  const [activeTab, setActiveTab] = useState('visualizer')
  const [selectedStageInfo, setSelectedStageInfo] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  const timerRef = useRef(null)
  const stageTimerRef = useRef(null)
  const logContainerRef = useRef(null)
  const pausedDurationRef = useRef(0)
  const pauseStartRef = useRef(null)
  const stageStartRef = useRef(null)
  const speedRef = useRef(1)
  const currentStageRef = useRef(-1)
  const simStateRef = useRef('idle')
  const logsRef = useRef([])
  const eventIdRef = useRef('all-passed')
  const stageStatusesRef = useRef({})

  speedRef.current = SPEED_OPTIONS.find((s) => s.id === speed)?.multiplier || 1
  simStateRef.current = simState
  currentStageRef.current = currentStageIdx
  eventIdRef.current = eventId

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const addLog = useCallback((level, message) => {
    const now = new Date()
    const timestamp = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds())
    const entry = { timestamp, level, message }
    logsRef.current = [...logsRef.current, entry]
    setLogs((prev) => [...prev, entry])
  }, [])

  const resetAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current)
    timerRef.current = null
    stageTimerRef.current = null
    setSimState('idle')
    setCurrentStageIdx(-1)
    setStageStatuses({})
    setLogs([])
    setStartTime(null)
    setEndTime(null)
    setFailureStageId(null)
    setSelectedError(null)
    setElapsed(0)
    pausedDurationRef.current = 0
    pauseStartRef.current = null
    stageStartRef.current = null
    logsRef.current = []
    stageStatusesRef.current = {}
    currentStageRef.current = -1
  }, [])

  const executeStage = useCallback((idx) => {
    if (simStateRef.current === 'stopped' || simStateRef.current === 'idle') return
    if (idx >= PIPELINE_STAGES.length) {
      setSimState('completed')
      setEndTime(Date.now())
      addLog('SUCCESS', 'Pipeline execution completed.')
      return
    }

    const stage = PIPELINE_STAGES[idx]
    const failStage = failureStageId || getFailureStage(eventIdRef.current)

    currentStageRef.current = idx
    setCurrentStageIdx(idx)
    setStageStatuses((prev) => ({ ...prev, [stage.id]: 'running' }))
    stageStatusesRef.current = { ...stageStatusesRef.current, [stage.id]: 'running' }

    addLog('INFO', 'Starting stage: ' + stage.name + '...')

    const duration = stage.duration * speedRef.current

    stageTimerRef.current = setTimeout(() => {
      if (simStateRef.current === 'stopped') return

      const isFailed = failStage === stage.id

      if (isFailed) {
        setStageStatuses((prev) => ({ ...prev, [stage.id]: 'failed' }))
        stageStatusesRef.current = { ...stageStatusesRef.current, [stage.id]: 'failed' }
        addLog('FAILED', stage.name + ' failed.')
        setFailureStageId(stage.id)
        setSimState('stopped')
        setEndTime(Date.now())
        return
      }

      setStageStatuses((prev) => ({ ...prev, [stage.id]: 'completed' }))
      stageStatusesRef.current = { ...stageStatusesRef.current, [stage.id]: 'completed' }
      addLog('SUCCESS', stage.name + ' completed.')

      const nextIdx = idx + 1
      if (nextIdx < PIPELINE_STAGES.length) {
        executeStage(nextIdx)
      } else {
        setSimState('completed')
        setEndTime(Date.now())
        addLog('SUCCESS', 'Pipeline execution completed.')
      }
    }, duration)
  }, [addLog, failureStageId])

  const handleStart = useCallback(() => {
    resetAll()
    const failStage = getFailureStage(eventId)
    setFailureStageId(failStage)
    setSimState('running')
    setStartTime(Date.now())
    pausedDurationRef.current = 0

    addLog('INFO', 'Pipeline simulation started (' + ciLabel + ')...')
    addLog('INFO', 'Framework: ' + fwLabel + ' | Language: ' + language)
    addLog('INFO', 'Pipeline: ' + pipelineName)
    addLog('INFO', 'Event: ' + (SIMULATION_EVENTS.find((e) => e.id === eventId)?.label || eventId))
    addLog('INFO', 'Cloning repository...')
    addLog('SUCCESS', 'Repository downloaded.')

    setTimeout(() => {
      if (simStateRef.current === 'running') {
        executeStage(0)
      }
    }, 500)
  }, [resetAll, eventId, addLog, ciLabel, fwLabel, language, pipelineName, executeStage])

  const handlePause = useCallback(() => {
    if (simState !== 'running') return
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current)
    pauseStartRef.current = Date.now()
    setSimState('paused')
    addLog('INFO', 'Pipeline paused.')
  }, [simState, addLog])

  const handleResume = useCallback(() => {
    if (simState !== 'paused') return
    if (pauseStartRef.current) {
      pausedDurationRef.current += Date.now() - pauseStartRef.current
      pauseStartRef.current = null
    }
    setSimState('running')
    addLog('INFO', 'Pipeline resumed.')

    const idx = currentStageRef.current
    if (idx >= 0 && idx < PIPELINE_STAGES.length) {
      const stage = PIPELINE_STAGES[idx]
      const elapsedInStage = Date.now() - stageStartRef.current
      const remaining = Math.max(0, stage.duration * speedRef.current - elapsedInStage)

      stageTimerRef.current = setTimeout(() => {
        if (simStateRef.current === 'stopped') return
        const failStage = failureStageId || getFailureStage(eventIdRef.current)
        const isFailed = failStage === stage.id

        if (isFailed) {
          setStageStatuses((prev) => ({ ...prev, [stage.id]: 'failed' }))
          stageStatusesRef.current = { ...stageStatusesRef.current, [stage.id]: 'failed' }
          addLog('FAILED', stage.name + ' failed.')
          setFailureStageId(stage.id)
          setSimState('stopped')
          setEndTime(Date.now())
          return
        }

        setStageStatuses((prev) => ({ ...prev, [stage.id]: 'completed' }))
        stageStatusesRef.current = { ...stageStatusesRef.current, [stage.id]: 'completed' }
        addLog('SUCCESS', stage.name + ' completed.')

        const nextIdx = idx + 1
        if (nextIdx < PIPELINE_STAGES.length) {
          executeStage(nextIdx)
        } else {
          setSimState('completed')
          setEndTime(Date.now())
          addLog('SUCCESS', 'Pipeline execution completed.')
        }
      }, remaining)
    }
  }, [simState, addLog, failureStageId, executeStage])

  const handleStop = useCallback(() => {
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    setSimState('stopped')
    setEndTime(Date.now())
    addLog('WARN', 'Pipeline stopped by user.')
  }, [addLog])

  const handleReset = useCallback(() => {
    resetAll()
    addLog('INFO', 'Pipeline reset. Ready to start.')
  }, [resetAll, addLog])

  useEffect(() => {
    if (simState === 'running') {
      const interval = setInterval(() => {
        setElapsed(Date.now() - (startTime || Date.now()) - pausedDurationRef.current)
      }, 100)
      timerRef.current = interval
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [simState, startTime])

  const vStageStatuses = useMemo(() => stageStatuses, [stageStatuses])

  const isRunning = simState === 'running'
  const isPaused = simState === 'paused'
  const isIdle = simState === 'idle'
  const isCompleted = simState === 'completed'
  const isStopped = simState === 'stopped'
  const hasRun = simState !== 'idle'

  const totalStages = PIPELINE_STAGES.length
  const completedCount = Object.values(vStageStatuses).filter((s) => s === 'completed').length
  const failedCount = Object.values(vStageStatuses).filter((s) => s === 'failed').length
  const skippedCount = Object.values(vStageStatuses).filter((s) => s === 'skipped').length

  const executionTimeMs = endTime && startTime ? (endTime - startTime - pausedDurationRef.current) : 0
  const executionTimeFormatted = formatTime(Math.floor(executionTimeMs / 1000))

  const testResults = useMemo(() => getTestResults(eventId), [eventId])
  const notifications = useMemo(() => getNotifications(eventId), [eventId])
  const mockArtifacts = useMemo(() => getMockArtifacts(), [])
  const mockReports = useMemo(() => getMockReports(), [])

  const stageIcons = {
    'checkout': '📦',
    'setup-runtime': '⚙️',
    'install-deps': '📥',
    'restore-cache': '💾',
    'install-browsers': '🌐',
    'smoke-tests': '🔥',
    'regression-tests': '🧪',
    'generate-reports': '📊',
    'upload-artifacts': '📤',
    'notify-team': '🔔',
    'finished': '✅',
  }

  function getStageIcon(stage) {
    return stageIcons[stage.id] || '📍'
  }

  function handleStageClick(stage) {
    const status = vStageStatuses[stage.id]
    if (status === 'failed') {
      const failStage = failureStageId
      const errorDetails = {
        stageName: stage.name,
        reason: failStage === 'smoke-tests' ? 'Smoke test checkout.spec.js failed due to a timeout error.' :
                failStage === 'regression-tests' ? 'Regression test payment.spec.js failed - assertion mismatch.' :
                failStage === 'install-deps' ? 'npm install failed due to network timeout.' :
                failStage === 'install-browsers' ? 'Playwright browser download failed - disk space full.' :
                failStage === 'setup-runtime' ? 'Node.js setup failed - invalid version specified.' :
                failStage === 'upload-artifacts' ? 'Artifact upload failed - storage quota exceeded.' :
                failStage === 'notify-team' ? 'Notification service returned 503 Unavailable.' :
                'Stage failed due to an unexpected error.',
        suggestedFix: failStage === 'smoke-tests' ? 'Check test timeouts and ensure test environment is responsive. Consider increasing the default timeout.' :
                       failStage === 'regression-tests' ? 'Review the failed assertions. Update expected values if the behavior change is intentional.' :
                       failStage === 'install-deps' ? 'Check network connectivity and npm registry status. Retry with --prefer-offline if cached.' :
                       failStage === 'install-browsers' ? 'Free up disk space and verify browser dependency requirements.' :
                       failStage === 'setup-runtime' ? 'Verify the runtime version is correct and available in the CI environment.' :
                       failStage === 'upload-artifacts' ? 'Reduce artifact retention days or increase storage quota.' :
                       failStage === 'notify-team' ? 'Check notification service status and webhook URLs.' :
                       'Review the pipeline logs and fix the reported issue. Retry the pipeline.',
        log: failStage === 'smoke-tests' ? '[2024-01-15 09:03:22] RUN     tests/checkout.spec.js\n[2024-01-15 09:03:45] FAIL    tests/checkout.spec.js\n  Error: Timeout of 30000ms exceeded.\n  at checkout.spec.js:42:8' :
             failStage === 'regression-tests' ? '[2024-01-15 09:05:10] RUN     tests/payment.spec.js\n[2024-01-15 09:05:32] FAIL    tests/payment.spec.js\n  Expected: 200\n  Received: 500\n  at payment.spec.js:78:12' :
             failStage === 'install-deps' ? '[2024-01-15 09:01:30] RUN     npm install\n[2024-01-15 09:02:15] ERROR   npm ERR! code ETIMEDOUT\n  npm ERR! network request to https://registry.npmjs.org/' :
             failStage === 'install-browsers' ? '[2024-01-15 09:02:45] RUN     npx playwright install\n[2024-01-15 09:04:20] ERROR   ENOENT: no space left on device' :
             '[2024-01-15 09:00:00] ERROR   Stage failed. Check pipeline logs for details.',
        retrySuggestion: 'Add retry logic with "continue-on-error: true" in GitHub Actions or use the "retry" option in your pipeline configuration.',
      }
      setSelectedError(errorDetails)
    }
  }

  const viewTabs = [
    { id: 'visualizer', label: 'Pipeline View' },
    { id: 'logs', label: 'Logs' },
    { id: 'summary', label: 'Summary' },
    { id: 'testResults', label: 'Test Results' },
    { id: 'reports', label: 'Reports' },
    { id: 'artifacts', label: 'Artifacts' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'bestPractices', label: 'Best Practices' },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 mb-3 overflow-x-auto">
        {viewTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap ' + (activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        {activeTab === 'visualizer' && (
          <div className="p-4 overflow-auto h-full">
            <div className="flex flex-col items-center gap-1">
              {PIPELINE_STAGES.map((stage, idx) => {
                const status = vStageStatuses[stage.id] || 'pending'
                const isCurrent = currentStageIdx === idx
                const isLast = idx === PIPELINE_STAGES.length - 1

                return (
                  <div key={stage.id} className="flex flex-col items-center w-full max-w-sm">
                    <button
                      onClick={() => handleStageClick(stage)}
                      className={'w-full rounded-xl border p-3 text-left cursor-pointer transition-all duration-300 ' + (
                        status === 'completed' ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10 shadow-sm' :
                        status === 'running' ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md animate-pulse' :
                        status === 'failed' ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10 shadow-sm' :
                        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={'flex h-8 w-8 items-center justify-center rounded-lg text-sm ' + (
                          status === 'completed' ? 'bg-green-500 text-white' :
                          status === 'running' ? 'bg-indigo-500 text-white' :
                          status === 'failed' ? 'bg-red-500 text-white' :
                          'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        )}>
                          {status === 'completed' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                              <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                          ) : status === 'running' ? (
                            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : status === 'failed' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span>{getStageIcon(stage)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={'text-sm font-medium ' + (
                            status === 'completed' ? 'text-green-700 dark:text-green-300' :
                            status === 'running' ? 'text-indigo-700 dark:text-indigo-300' :
                            status === 'failed' ? 'text-red-700 dark:text-red-300' :
                            'text-slate-500 dark:text-slate-400'
                          )}>
                            {stage.name}
                          </div>
                          {status === 'running' && (
                            <div className="text-[10px] text-indigo-400 dark:text-indigo-400 mt-0.5">Running...</div>
                          )}
                          {status === 'pending' && !isIdle && (
                            <div className="text-[10px] text-slate-400 mt-0.5">Pending</div>
                          )}
                        </div>
                        {status === 'failed' && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-red-500 shrink-0">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                          </svg>
                        )}
                        {(status === 'pending' || status === 'completed' || status === 'running') && !isIdle && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedStageInfo(stage); }}
                            className="shrink-0 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Learn more about this stage"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400 hover:text-indigo-500">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </button>
                    {!isLast && (
                      <div className="h-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-300 dark:text-slate-600">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.573-4.072a.75.75 0 111.204 1.148l-5 5.5a.75.75 0 01-1.204 0l-5-5.5a.75.75 0 011.204-1.148L9.25 14.388V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-4 overflow-auto h-full" ref={logContainerRef}>
            {logs.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Start a simulation to see pipeline logs.</p>
            ) : (
              <div className="space-y-0.5 font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i} className={'py-0.5 ' + (
                    log.level === 'SUCCESS' ? 'text-green-500' :
                    log.level === 'FAILED' ? 'text-red-400' :
                    log.level === 'WARN' ? 'text-amber-400' :
                    'text-slate-300'
                  )}>
                    <span className="text-slate-500">[{log.timestamp}]</span>{' '}
                    <span className={'font-semibold ' + (
                      log.level === 'SUCCESS' ? 'text-green-500' :
                      log.level === 'FAILED' ? 'text-red-400' :
                      log.level === 'WARN' ? 'text-amber-400' :
                      'text-indigo-400'
                    )}>[{log.level}]</span>{' '}
                    {log.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="p-4 overflow-auto h-full">
            {!hasRun ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Start a simulation to see the pipeline summary.</p>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pipeline Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Stages', value: totalStages, color: 'text-slate-700 dark:text-slate-300' },
                    { label: 'Completed', value: completedCount, color: 'text-green-600 dark:text-green-400' },
                    { label: 'Failed', value: failedCount, color: 'text-red-600 dark:text-red-400' },
                    { label: 'Skipped', value: skippedCount, color: 'text-slate-400 dark:text-slate-500' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3 text-center">
                      <p className={'text-lg font-bold ' + s.color}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Execution Time', value: executionTimeFormatted, color: 'text-indigo-600 dark:text-indigo-400' },
                    { label: 'Framework', value: fwLabel, color: 'text-slate-700 dark:text-slate-300' },
                    { label: 'Language', value: language, color: 'text-slate-700 dark:text-slate-300' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3 text-center">
                      <p className={'text-sm font-bold ' + s.color}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Pipeline Type</div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{ciLabel} CI/CD Pipeline</div>
                  {pipelineName && <div className="text-xs text-slate-400 mt-1">Name: {pipelineName}</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'testResults' && (
          <div className="p-4 overflow-auto h-full">
            {!hasRun ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Start a simulation to see test results.</p>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Test Results</h4>
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Smoke Tests</h5>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 dark:text-green-400">{testResults.smoke.passed} Passed</span>
                        <span className={'font-medium ' + (testResults.smoke.failed > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500')}>{testResults.smoke.failed} Failed</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {testResults.smoke.tests.map((t, i) => (
                        <div key={i} className={'text-xs py-1 px-2 rounded ' + (t.includes('failed') ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400')}>
                          {t.includes('failed') ? '✗ ' : '✓ '}{t.replace(' passed', '').replace(' failed', '')}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Regression Tests</h5>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 dark:text-green-400">{testResults.regression.passed} Passed</span>
                        <span className={'font-medium ' + (testResults.regression.failed > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500')}>{testResults.regression.failed} Failed</span>
                      </div>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-0.5">
                      {testResults.regression.tests.slice(0, 10).map((t, i) => (
                        <div key={i} className={'text-xs py-0.5 px-2 rounded ' + (t.includes('failed') ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')}>
                          {t.includes('failed') ? '✗ ' : '✓ '}{t.replace(' passed', '').replace(' failed', '')}
                        </div>
                      ))}
                      {testResults.regression.tests.length > 10 && (
                        <div className="text-xs text-slate-400 dark:text-slate-500 px-2 pt-1">...and {testResults.regression.tests.length - 10} more</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-4 overflow-auto h-full">
            {!hasRun ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Start a simulation to see generated reports.</p>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Generated Reports</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mockReports.map((r, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-lg">{r.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.name}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{r.format} | {r.file}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'artifacts' && (
          <div className="p-4 overflow-auto h-full">
            {!hasRun ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Start a simulation to see generated artifacts.</p>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Generated Artifacts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mockArtifacts.map((a, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3">
                      <div className="flex items-center gap-3">
                        <div className={'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ' + (
                          a.type === 'Screenshots' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' :
                          a.type === 'Videos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-500' :
                          a.type === 'Trace Files' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' :
                          a.type === 'Logs' ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' :
                          'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'
                        )}>
                          {a.type === 'Screenshots' ? '🖼' : a.type === 'Videos' ? '🎬' : a.type === 'Trace Files' ? '📐' : a.type === 'Logs' ? '📝' : '📁'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{a.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{a.size}</span>
                            <span className="text-[10px] text-indigo-400 dark:text-indigo-400">{a.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="p-4 overflow-auto h-full">
            {!hasRun ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Start a simulation to see the pipeline timeline.</p>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pipeline Timeline</h4>
                <div className="relative pl-6">
                  <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
                  {PIPELINE_STAGES.map((stage, idx) => {
                    const status = vStageStatuses[stage.id] || 'pending'
                    return (
                      <div key={stage.id} className="relative pb-4 last:pb-0">
                        <div className={'absolute left-[-14px] top-1.5 h-3 w-3 rounded-full border-2 ' + (
                          status === 'completed' ? 'bg-green-500 border-green-500' :
                          status === 'running' ? 'bg-indigo-500 border-indigo-500 animate-pulse' :
                          status === 'failed' ? 'bg-red-500 border-red-500' :
                          'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                        )} />
                        <div className="ml-4">
                          <div className={'text-xs font-medium ' + (
                            status === 'completed' ? 'text-green-700 dark:text-green-300' :
                            status === 'running' ? 'text-indigo-700 dark:text-indigo-300' :
                            status === 'failed' ? 'text-red-700 dark:text-red-300' :
                            'text-slate-400 dark:text-slate-500'
                          )}>
                            {stage.name}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-4 overflow-auto h-full">
            {!hasRun ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Start a simulation to see notifications.</p>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Notifications</h4>
                {notifications.map((n, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className={'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ' + (
                        n.platform === 'Slack' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-500' :
                        n.platform === 'Microsoft Teams' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' :
                        'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
                      )}>
                        {n.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{n.platform}</div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{n.time}</span>
                        </div>
                        <div className={'text-xs font-medium mt-0.5 ' + n.color}>{n.title}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bestPractices' && (
          <div className="p-4 overflow-auto h-full">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">CI/CD Best Practices</h4>
              {BEST_PRACTICES_DATA.map((bp, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{bp.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{bp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedError(null)}>
          <div className="mx-4 w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Error Details</h3>
              <button onClick={() => setSelectedError(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-slate-400">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">Stage Name</div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedError.stageName}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">Reason</div>
                <div className="text-sm text-red-600 dark:text-red-400">{selectedError.reason}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">Suggested Fix</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">{selectedError.suggestedFix}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">Example Log</div>
                <pre className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 overflow-x-auto font-mono">{selectedError.log}</pre>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">Retry Suggestion</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">{selectedError.retrySuggestion}</div>
              </div>
            </div>
            <button onClick={() => setSelectedError(null)} className="mt-4 w-full rounded-lg bg-slate-100 dark:bg-slate-700 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}

      {selectedStageInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedStageInfo(null)}>
          <div className="mx-4 w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Learning Mode</h3>
              <button onClick={() => setSelectedStageInfo(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-slate-400">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{selectedStageInfo.name}</div>
              </div>
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/10 p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedStageInfo.description}</p>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/30 rounded-lg p-3">
                <p>💡 Tip: In a real CI/CD pipeline, this stage typically takes {Math.round(selectedStageInfo.duration / 1000)}-{Math.round(selectedStageInfo.duration / 1000 + 2)} seconds depending on project size and runner performance.</p>
              </div>
            </div>
            <button onClick={() => setSelectedStageInfo(null)} className="mt-4 w-full rounded-lg bg-indigo-50 dark:bg-indigo-900/20 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer">
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          {isIdle && (
            <>
              <select value={eventId} onChange={(e) => setEventId(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors"
              >
                {SIMULATION_EVENTS.map((e) => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                {SPEED_OPTIONS.map((s) => (
                  <button key={s.id} onClick={() => setSpeed(s.id)}
                    className={'px-2 py-1 text-[11px] font-medium rounded-md transition-all duration-200 cursor-pointer ' + (speed === s.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300')}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button onClick={handleStart}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Start Simulation
              </button>
            </>
          )}
          {isRunning && (
            <>
              <button onClick={handlePause}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                </svg>
                Pause
              </button>
              <button onClick={handleStop}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-800 px-4 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
                </svg>
                Stop
              </button>
            </>
          )}
          {isPaused && (
            <>
              <button onClick={handleResume}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Resume
              </button>
              <button onClick={handleStop}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-800 px-4 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-5.5z" />
                </svg>
                Stop
              </button>
            </>
          )}
          {(isCompleted || isStopped) && (
            <button onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
              </svg>
              Reset
            </button>
          )}
          {hasRun && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
              Elapsed: {formatTime(Math.floor(elapsed / 1000))}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
