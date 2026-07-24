export default function QAChecklist({ checks }) {
  if (!checks || checks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-400 dark:text-slate-500">
        <p>Generate a script to see the QA checklist.</p>
      </div>
    )
  }

  const hasCategories = checks[0]?.category != null

  if (hasCategories) {
    const allItems = checks.flatMap((c) => c.items || [])
    const passCount = allItems.filter((i) => i.passed).length
    const failCount = allItems.filter((i) => !i.passed).length

    return (
      <div className="p-4 space-y-4 overflow-auto h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-slate-500 dark:text-slate-400">{passCount} passed</span>
          </div>
          {failCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-slate-500 dark:text-slate-400">{failCount} warning(s)</span>
            </div>
          )}
        </div>

        {checks.map((cat, ci) => (
          <div key={ci}>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{cat.category}</h5>
            <div className="space-y-1.5">
              {cat.items.map((item, ii) => (
                <div key={ii} className={'flex items-start gap-2.5 rounded-lg p-2.5 ' + (item.passed ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30' : 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30')}>
                  {item.passed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-green-500 mt-0.5">
                      <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-amber-500 mt-0.5">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  )}
                  <p className={'text-xs font-medium ' + (item.passed ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300')}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const passCount = checks.filter((c) => c.pass).length
  const failCount = checks.filter((c) => !c.pass).length

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-slate-500 dark:text-slate-400">{passCount} passed</span>
        </div>
        {failCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-slate-500 dark:text-slate-400">{failCount} warning(s)</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {checks.map((check, i) => (
          <div key={i} className={'flex items-start gap-3 rounded-xl p-3 ' + (check.pass ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30' : 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30')}>
            {check.pass ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-green-500">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-amber-500">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p className={'text-sm font-medium ' + (check.pass ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300')}>
                {check.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
