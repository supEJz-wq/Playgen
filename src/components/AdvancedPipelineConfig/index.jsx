import { useState, useCallback } from 'react'

const MOCK_TEST_FILES = [
  'tests/login.spec.js',
  'tests/cart.spec.js',
  'tests/payment.spec.js',
  'tests/profile.spec.js',
  'tests/search.spec.js',
  'tests/checkout.spec.js',
  'tests/navigation.spec.js',
  'tests/registration.spec.js',
]

const PLAYWRIGHT_TAGS = [
  { id: '@smoke', label: '@smoke', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
  { id: '@regression', label: '@regression', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  { id: '@sanity', label: '@sanity', color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  { id: '@mobile', label: '@mobile', color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
  { id: '@slow', label: '@slow', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
]

const ENV_VARIABLE_KEYS = [
  { key: 'BASE_URL', label: 'Base URL', placeholder: 'https://example.com', secret: false },
  { key: 'USERNAME', label: 'Username', placeholder: 'user', secret: false },
  { key: 'PASSWORD', label: 'Password', placeholder: '', secret: true },
  { key: 'API_KEY', label: 'API Key', placeholder: '', secret: true },
  { key: 'TOKEN', label: 'Token', placeholder: '', secret: true },
  { key: 'DEVICE', label: 'Device', placeholder: 'desktop', secret: false },
  { key: 'BROWSER', label: 'Browser', placeholder: 'Chromium', secret: false },
  { key: 'TIMEOUT', label: 'Timeout (ms)', placeholder: '30000', secret: false },
]

const CACHE_MANAGERS = [
  { id: 'npm', label: 'npm', icon: '📦' },
  { id: 'maven', label: 'Maven', icon: '☕' },
  { id: 'gradle', label: 'Gradle', icon: '🐘' },
  { id: 'pip', label: 'pip', icon: '🐍' },
  { id: 'nuget', label: 'NuGet', icon: '🔷' },
]

const BROWSER_OPTIONS = [
  { id: 'chromium', label: 'Chromium' },
  { id: 'firefox', label: 'Firefox' },
  { id: 'webkit', label: 'WebKit' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'edge', label: 'Edge' },
]

const OS_OPTIONS = [
  { id: 'ubuntu', label: 'Ubuntu' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
]

const PRESET_SUITES = [
  { id: 'smoke', name: 'Smoke Suite', icon: '🔥', desc: 'Critical path tests', defaultFiles: ['tests/login.spec.js', 'tests/cart.spec.js'], defaultTags: ['@smoke'] },
  { id: 'regression', name: 'Regression Suite', icon: '🧪', desc: 'Full regression coverage', defaultFiles: ['tests/login.spec.js', 'tests/cart.spec.js', 'tests/payment.spec.js', 'tests/profile.spec.js'], defaultTags: ['@regression'] },
  { id: 'sanity', name: 'Sanity Suite', icon: '✅', desc: 'Quick sanity checks', defaultFiles: ['tests/login.spec.js'], defaultTags: ['@sanity'] },
  { id: 'cross-browser', name: 'Cross Browser Suite', icon: '🌐', desc: 'Multi-browser testing', defaultFiles: ['tests/login.spec.js', 'tests/search.spec.js', 'tests/navigation.spec.js'], defaultTags: [] },
  { id: 'mobile', name: 'Mobile Suite', icon: '📱', desc: 'Mobile-specific tests', defaultFiles: ['tests/registration.spec.js', 'tests/checkout.spec.js'], defaultTags: ['@mobile'] },
  { id: 'database', name: 'Database Validation Suite', icon: '🗄️', desc: 'Data integrity checks', defaultFiles: [], defaultTags: [] },
  { id: 'custom', name: 'Custom Suite', icon: '⚡', desc: 'User-defined collection', defaultFiles: [], defaultTags: [] },
]

export function getDefaultTestSuites() {
  return PRESET_SUITES.map((s) => ({
    id: s.id,
    name: s.name,
    icon: s.icon,
    desc: s.desc,
    files: [...s.defaultFiles],
    tags: [...s.defaultTags],
    enabled: s.id === 'smoke' || s.id === 'regression',
  }))
}

export function getDefaultEnvironments() {
  return [
    {
      id: 'dev', name: 'Development',
      variables: { BASE_URL: 'https://dev.example.com', USERNAME: 'dev_user', PASSWORD: '', API_KEY: '', TOKEN: '', DEVICE: 'desktop', BROWSER: 'Chromium', TIMEOUT: '30000' },
    },
    {
      id: 'staging', name: 'Staging',
      variables: { BASE_URL: 'https://staging.example.com', USERNAME: 'staging_user', PASSWORD: '', API_KEY: '', TOKEN: '', DEVICE: 'desktop', BROWSER: 'Chromium', TIMEOUT: '30000' },
    },
    {
      id: 'production', name: 'Production',
      variables: { BASE_URL: 'https://example.com', USERNAME: '', PASSWORD: '', API_KEY: '', TOKEN: '', DEVICE: 'desktop', BROWSER: 'Chromium', TIMEOUT: '60000' },
    },
  ]
}

export function getDefaultProjectVariables() {
  return [
    { key: 'APPLICATION_NAME', value: 'My App' },
    { key: 'TEST_ENVIRONMENT', value: 'staging' },
    { key: 'REPORT_NAME', value: 'test-report' },
    { key: 'ARTIFACT_NAME', value: 'test-results' },
    { key: 'BUILD_NUMBER', value: '${BUILD_NUMBER}' },
  ]
}

export default function AdvancedPipelineConfig({
  section,
  testSuites,
  setTestSuites,
  environments,
  setEnvironments,
  activeEnvironment,
  setActiveEnvironment,
  executionOptions,
  setExecutionOptions,
  cacheConfig,
  setCacheConfig,
  matrixConfig,
  setMatrixConfig,
  projectVariables,
  setProjectVariables,
}) {
  if (section === 'test-suites') {
    return <TestSuiteManager suites={testSuites} setSuites={setTestSuites} />
  }
  if (section === 'environments') {
    return <EnvironmentManager environments={environments} setEnvironments={setEnvironments} activeId={activeEnvironment} setActiveId={setActiveEnvironment} />
  }
  if (section === 'execution') {
    return <ExecutionOptions options={executionOptions} setOptions={setExecutionOptions} />
  }
  if (section === 'cache-matrix') {
    return <CacheAndMatrix cacheConfig={cacheConfig} setCacheConfig={setCacheConfig} matrixConfig={matrixConfig} setMatrixConfig={setMatrixConfig} />
  }
  if (section === 'variables') {
    return <ProjectVariablesManager variables={projectVariables} setVariables={setProjectVariables} />
  }
  return null
}

function TestSuiteManager({ suites, setSuites }) {
  const toggleSuite = useCallback((id) => {
    setSuites((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }, [setSuites])

  const toggleFile = useCallback((suiteId, file) => {
    setSuites((prev) => prev.map((s) => {
      if (s.id !== suiteId) return s
      const has = s.files.includes(file)
      return { ...s, files: has ? s.files.filter((f) => f !== file) : [...s.files, file] }
    }))
  }, [setSuites])

  const toggleTag = useCallback((suiteId, tag) => {
    setSuites((prev) => prev.map((s) => {
      if (s.id !== suiteId) return s
      const has = s.tags.includes(tag)
      return { ...s, tags: has ? s.tags.filter((t) => t !== tag) : [...s.tags, tag] }
    }))
  }, [setSuites])

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Test Suite Manager</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        Create and manage reusable test suites. Select test files and assign tags to organize your test execution strategy.
      </p>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {suites.map((suite) => (
          <div key={suite.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{suite.icon}</span>
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{suite.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2">{suite.desc}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={suite.enabled} onChange={() => toggleSuite(suite.id)} className="sr-only peer" />
                <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all" />
              </label>
            </div>
            {suite.enabled && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <div>
                  <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-1.5">Test Files ({suite.files.length} selected)</div>
                  <div className="grid grid-cols-1 gap-1">
                    {MOCK_TEST_FILES.map((file) => {
                      const selected = suite.files.includes(file)
                      return (
                        <button key={file} onClick={() => toggleFile(suite.id, file)}
                          className={'flex items-center gap-2 px-2 py-1 rounded-lg text-[11px] transition-all duration-200 cursor-pointer ' + (selected ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50')}
                        >
                          <div className={'h-3.5 w-3.5 rounded border flex items-center justify-center ' + (selected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600')}>
                            {selected && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5 text-white">
                                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="font-mono">{file}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-1.5">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PLAYWRIGHT_TAGS.map((tag) => {
                      const selected = suite.tags.includes(tag.id)
                      return (
                        <button key={tag.id} onClick={() => toggleTag(suite.id, tag.id)}
                          className={'px-2 py-0.5 rounded-md text-[10px] font-medium transition-all duration-200 cursor-pointer ' + (selected ? tag.color + ' ring-1 ring-current' : 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700')}
                        >
                          {tag.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                  <span>{suite.files.length} file(s)</span>
                  {suite.tags.length > 0 && <span>{suite.tags.length} tag(s)</span>}
                  {suite.tags.length > 0 && <span className="text-indigo-400">npx playwright test --grep "{suite.tags.join(' ')}"</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function EnvironmentManager({ environments, setEnvironments, activeId, setActiveId }) {
  const updateVar = useCallback((envId, key, value) => {
    setEnvironments((prev) => prev.map((e) => {
      if (e.id !== envId) return e
      return { ...e, variables: { ...e.variables, [key]: value } }
    }))
  }, [setEnvironments])

  const activeEnv = environments.find((e) => e.id === activeId) || environments[0]

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Environment Manager</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        Manage environment-specific configuration variables. Select an environment to edit its variables.
      </p>
      <div className="flex items-center gap-2 mb-4">
        {environments.map((env) => (
          <button key={env.id} onClick={() => setActiveId(env.id)}
            className={'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ' + (activeId === env.id ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700')}
          >
            {env.name}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3">
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
          {activeEnv.name} Variables
          <span className="text-[10px] font-normal text-slate-400 ml-2">(.env.{activeEnv.id})</span>
        </div>
        <div className="space-y-2">
          {ENV_VARIABLE_KEYS.map((v) => (
            <div key={v.key} className="flex items-center gap-2">
              <div className="w-24 shrink-0">
                <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{v.key}</label>
              </div>
              <div className="flex-1 relative">
                <input
                  type={v.secret && activeEnv.variables[v.key] ? 'password' : 'text'}
                  value={activeEnv.variables[v.key] || ''}
                  onChange={(e) => updateVar(activeEnv.id, v.key, e.target.value)}
                  placeholder={v.placeholder || 'Enter ' + v.key}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors"
                />
                {v.secret && activeEnv.variables[v.key] && (
                  <button
                    onClick={() => {
                      const input = document.querySelector(`[data-env-key="${v.key}"]`)
                      if (input) input.type = input.type === 'password' ? 'text' : 'password'
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    data-env-key={v.key}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500">
        Environment files will be generated as <span className="font-mono text-indigo-400">.env.{'{envId}'}</span>
      </div>
    </div>
  )
}

function ExecutionOptions({ options, setOptions }) {
  const update = useCallback((key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }, [setOptions])

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Execution Options</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        Configure how tests are executed in the pipeline.
      </p>
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Execution Strategy</label>
          <div className="flex items-center gap-2">
            {['sequential', 'parallel'].map((mode) => (
              <button key={mode} onClick={() => update('mode', mode)}
                className={'flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer capitalize ' + (options.mode === mode ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600')}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        {options.mode === 'parallel' && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Maximum Workers</label>
            <select value={options.workers} onChange={(e) => update('workers', Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors"
            >
              {[1, 2, 4, 6, 8, 12, 16].map((n) => <option key={n} value={n}>{n} workers</option>)}
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Retry Count</label>
            <select value={options.retries} onChange={(e) => update('retries', Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors"
            >
              {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n === 0 ? 'No retry' : n + ' retries'}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Global Timeout (min)</label>
            <select value={options.timeout} onChange={(e) => update('timeout', Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors"
            >
              {[10, 15, 30, 45, 60, 90, 120].map((n) => <option key={n} value={n}>{n} min</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Slow Motion (ms)</label>
            <select value={options.slowMo} onChange={(e) => update('slowMo', Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors"
            >
              {[0, 100, 200, 500, 1000].map((n) => <option key={n} value={n}>{n === 0 ? 'Off' : n + ' ms'}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Execution Mode</label>
            <div className="flex items-center gap-2">
              {['Headless', 'Headed'].map((mode) => (
                <button key={mode} onClick={() => update('executionMode', mode)}
                  className={'flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ' + (options.executionMode === mode ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600')}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={options.failFast} onChange={(e) => update('failFast', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">Fail Fast</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={options.headless} onChange={(e) => update('headless', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">Headless Mode</span>
          </label>
        </div>
      </div>
    </div>
  )
}

function CacheAndMatrix({ cacheConfig, setCacheConfig, matrixConfig, setMatrixConfig }) {
  const toggleCache = useCallback((id) => {
    setCacheConfig((prev) => {
      if (prev.packageManager === id) return { packageManager: '' }
      return { packageManager: id }
    })
  }, [setCacheConfig])

  const toggleBrowser = useCallback((id) => {
    setMatrixConfig((prev) => ({
      ...prev,
      browsers: prev.browsers.includes(id) ? prev.browsers.filter((b) => b !== id) : [...prev.browsers, id],
    }))
  }, [setMatrixConfig])

  const toggleOS = useCallback((id) => {
    setMatrixConfig((prev) => ({
      ...prev,
      os: prev.os.includes(id) ? prev.os.filter((o) => o !== id) : [...prev.os, id],
    }))
  }, [setMatrixConfig])

  const activeCache = cacheConfig?.packageManager

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Dependency Cache</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
          Select a package manager to cache its dependencies and speed up pipeline execution.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CACHE_MANAGERS.map((cm) => {
            const selected = activeCache === cm.id
            return (
              <button key={cm.id} onClick={() => toggleCache(cm.id)}
                className={'rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ' + (selected ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{cm.icon}</span>
                  <div>
                    <div className={'text-xs font-medium ' + (selected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400')}>{cm.label}</div>
                    <div className={'text-[10px] ' + (selected ? 'text-indigo-400' : 'text-slate-400 dark:text-slate-500')}>{selected ? 'Caching enabled' : 'Click to enable'}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Pipeline Matrix</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
          Run tests across multiple browser and operating system combinations.
        </p>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Browsers ({matrixConfig.browsers.length} selected)</div>
            <div className="flex flex-wrap gap-2">
              {BROWSER_OPTIONS.map((b) => {
                const selected = matrixConfig.browsers.includes(b.id)
                return (
                  <button key={b.id} onClick={() => toggleBrowser(b.id)}
                    className={'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer ' + (selected ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600')}
                  >
                    {selected && '✓ '}{b.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Operating Systems ({matrixConfig.os.length} selected)</div>
            <div className="flex flex-wrap gap-2">
              {OS_OPTIONS.map((os) => {
                const selected = matrixConfig.os.includes(os.id)
                return (
                  <button key={os.id} onClick={() => toggleOS(os.id)}
                    className={'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer ' + (selected ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600')}
                  >
                    {selected && '✓ '}{os.label}
                  </button>
                )
              })}
            </div>
          </div>
          {matrixConfig.browsers.length > 0 && matrixConfig.os.length > 0 && (
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/10 p-2.5">
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                Matrix will generate {matrixConfig.browsers.length * matrixConfig.os.length} job combinations
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {matrixConfig.browsers.join(', ')} × {matrixConfig.os.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectVariablesManager({ variables, setVariables }) {
  const updateVar = useCallback((idx, key, value) => {
    setVariables((prev) => prev.map((v, i) => i === idx ? { ...v, [key]: value } : v))
  }, [setVariables])

  const addVar = useCallback(() => {
    setVariables((prev) => [...prev, { key: '', value: '' }])
  }, [setVariables])

  const removeVar = useCallback((idx) => {
    setVariables((prev) => prev.filter((_, i) => i !== idx))
  }, [setVariables])

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Project Variables</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        Define reusable variables that can be referenced throughout your pipeline configuration.
      </p>
      <div className="space-y-2">
        {variables.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={v.key}
                onChange={(e) => updateVar(i, 'key', e.target.value)}
                placeholder="VARIABLE_NAME"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors uppercase"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={v.value}
                onChange={(e) => updateVar(i, 'value', e.target.value)}
                placeholder="value"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors"
              />
            </div>
            <button onClick={() => removeVar(i)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button onClick={addVar}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all duration-200 cursor-pointer w-full justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        Add Variable
      </button>
    </div>
  )
}
