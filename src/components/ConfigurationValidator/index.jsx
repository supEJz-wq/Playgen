import { useMemo } from 'react'

export default function ConfigurationValidator({
  testSuites,
  reports,
  artifacts,
  activeEnvironment,
  environments,
  matrixConfig,
  model,
}) {
  const warnings = useMemo(() => {
    const w = []

    const enabledSuites = testSuites.filter((s) => s.enabled)
    const totalFiles = enabledSuites.reduce((sum, s) => sum + s.files.length, 0)

    if (!enabledSuites.length || totalFiles === 0) {
      w.push({ type: 'warning', message: 'No tests selected. The pipeline will run all tests by default.' })
    }

    const p = model?.pipeline || {}
    if (!p.browser || p.browser === 'None') {
      w.push({ type: 'warning', message: 'No browser selected. Default browser will be used.' })
    }

    const hasReports = reports?.html || reports?.allure || reports?.junit
    if (!hasReports) {
      w.push({ type: 'warning', message: 'No reports enabled. Test results will not be documented.' })
    }

    const hasArtifacts = artifacts ? Object.values(artifacts).some(Boolean) : false
    if (!hasArtifacts) {
      w.push({ type: 'warning', message: 'Artifacts disabled. Test outputs will not be saved.' })
    }

    const activeEnv = environments.find((e) => e.id === activeEnvironment)
    if (activeEnv) {
      const emptyVars = Object.entries(activeEnv.variables).filter(([, v]) => !v)
      if (emptyVars.length > 0) {
        w.push({ type: 'info', message: `Environment variables missing: ${emptyVars.map(([k]) => k).join(', ')}. Placeholder values will be used.` })
      }
    }

    if (matrixConfig?.browsers?.length > 1 && !matrixConfig?.os?.length) {
      w.push({ type: 'info', message: 'Multiple browsers selected but no operating systems configured for matrix.' })
    }

    if (w.length === 0) {
      w.push({ type: 'success', message: 'Configuration looks good! All checks passed.' })
    }

    return w
  }, [testSuites, reports, artifacts, activeEnvironment, environments, matrixConfig, model])

  if (!model) return null

  return (
    <div className="p-4 overflow-auto h-full">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Configuration Validator</h4>
      <div className="space-y-2">
        {warnings.map((w, i) => (
          <div key={i} className={'flex items-start gap-2.5 rounded-lg p-2.5 border ' + (
            w.type === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' :
            w.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30' :
            'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30'
          )}>
            {w.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-green-500 mt-0.5">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            ) : w.type === 'warning' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-amber-500 mt-0.5">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-blue-500 mt-0.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            )}
            <p className={'text-xs font-medium ' + (
              w.type === 'success' ? 'text-green-700 dark:text-green-300' :
              w.type === 'warning' ? 'text-amber-700 dark:text-amber-300' :
              'text-blue-700 dark:text-blue-300'
            )}>
              {w.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
