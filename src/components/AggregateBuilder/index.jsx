export default function AggregateBuilder({ form, onChange }) {
  const update = (field, value) => {
    onChange(field, value)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400">
              <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zM1 7.5a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 011 7.5zM1 12.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75zM1 17a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H1.75A.75.75 0 011 17z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Aggregate</h3>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-colors ${form.aggregateEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
            {form.aggregateEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.aggregateEnabled || false}
            onChange={(e) => update('aggregateEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all" />
        </label>
      </div>

      {form.aggregateEnabled && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Function</label>
            <select value={form.aggregateFunction || 'COUNT'} onChange={(e) => update('aggregateFunction', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-colors">
              <option value="COUNT">COUNT</option>
              <option value="SUM">SUM</option>
              <option value="AVG">AVG</option>
              <option value="MAX">MAX</option>
              <option value="MIN">MIN</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Column</label>
            <input type="text" value={form.aggregateColumn || ''} onChange={(e) => update('aggregateColumn', e.target.value)} placeholder="e.g., amount" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-colors" />
          </div>
        </div>
      )}
    </div>
  )
}
