export default function BestPracticesPanel({ bestPractices }) {
  if (!bestPractices || bestPractices.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-400 dark:text-slate-500">
        <p>Generate a script to see best practices.</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3 overflow-auto h-full">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Framework Best Practices</h4>
      {bestPractices.map((bp, i) => (
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
  )
}
