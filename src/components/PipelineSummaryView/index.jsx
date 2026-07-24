export default function PipelineSummaryView({
  ciLabel,
  fwLabel,
  framework,
  language,
  pipelineName,
  browser,
  operatingSystem,
  trigger,
  executionMode,
  enableRetry,
  parallelExecution,
  reports,
  artifacts,
  testSuites,
  activeEnvironment,
  environments,
  executionOptions,
  cacheConfig,
  matrixConfig,
  projectVariables,
}) {
  const activeEnv = (environments || []).find((e) => e.id === activeEnvironment)
  const enabledSuites = (testSuites || []).filter((s) => s.enabled)
  const totalTestFiles = enabledSuites.reduce((sum, s) => sum + (s.files ? s.files.length : 0), 0)

  const summarySections = [
    {
      title: 'Pipeline Overview',
      items: [
        { label: 'Framework', value: fwLabel || framework || '-' },
        { label: 'Language', value: language || '-' },
        { label: 'Pipeline Platform', value: ciLabel || '-' },
        { label: 'Pipeline Name', value: pipelineName || 'CI/CD Pipeline' },
      ],
    },
    {
      title: 'Test Selection',
      items: [
        { label: 'Selected Suites', value: enabledSuites.length > 0 ? enabledSuites.map((s) => s.name).join(', ') : 'None' },
        { label: 'Total Test Files', value: totalTestFiles > 0 ? String(totalTestFiles) : 'None selected' },
        { label: 'Browser', value: browser || 'Chrome' },
      ],
    },
    {
      title: 'Environment',
      items: [
        { label: 'Active Environment', value: activeEnv?.name || 'dev' },
        { label: 'Base URL', value: activeEnv?.variables?.BASE_URL || '-' },
        { label: 'Timeout', value: (activeEnv?.variables?.TIMEOUT || '30000') + ' ms' },
      ],
    },
    {
      title: 'Execution',
      items: [
        { label: 'Strategy', value: executionOptions?.mode === 'parallel' ? 'Parallel' : 'Sequential' },
        { label: 'Max Workers', value: executionOptions?.mode === 'parallel' ? String(executionOptions?.workers || 2) : 'N/A' },
        { label: 'Retry Count', value: String(executionOptions?.retries || 0) },
        { label: 'Global Timeout', value: (executionOptions?.timeout || 60) + ' min' },
        { label: 'Mode', value: executionMode === 'Headless' ? 'Headless' : 'Headed' },
        { label: 'Fail Fast', value: executionOptions?.failFast ? 'Enabled' : 'Disabled' },
      ],
    },
    {
      title: 'Reports & Artifacts',
      items: [
        { label: 'HTML Report', value: reports?.html ? 'Enabled' : 'Disabled' },
        { label: 'Allure Report', value: reports?.allure ? 'Enabled' : 'Disabled' },
        { label: 'JUnit XML', value: reports?.junit ? 'Enabled' : 'Disabled' },
        { label: 'Artifacts', value: artifacts ? Object.entries(artifacts).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None' : 'None' },
      ],
    },
    {
      title: 'Cache & Matrix',
      items: [
        { label: 'Cache Manager', value: cacheConfig?.packageManager || 'None' },
        { label: 'Matrix Browsers', value: matrixConfig?.browsers?.length > 0 ? matrixConfig.browsers.join(', ') : 'None' },
        { label: 'Matrix OS', value: matrixConfig?.os?.length > 0 ? matrixConfig.os.join(', ') : 'None' },
      ],
    },
  ]

  return (
    <>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Pipeline Summary</h4>
      <div className="space-y-4">
        {summarySections.map((section) => (
          <div key={section.title} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-4">
            <h5 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{section.title}</h5>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.label}</span>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
