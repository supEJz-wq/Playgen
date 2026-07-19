import { operators, logicalOperators } from '../../constants/operators'

export default function ConditionBuilder({ conditions, setConditions }) {
  const update = (index, field, value) => {
    setConditions((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
  }

  const add = () => {
    setConditions((prev) => [...prev, { column: '', operator: '=', value: '', logical: 'AND' }])
  }

  const remove = (index) => {
    setConditions((prev) => prev.filter((_, i) => i !== index))
  }

  const move = (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= conditions.length) return
    setConditions((prev) => {
      const updated = [...prev]
      const tmp = updated[index]
      updated[index] = updated[target]
      updated[target] = tmp
      return updated
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-pink-100 dark:bg-pink-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400">
              <path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h11.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zM2 7.5a.75.75 0 01.75-.75h7.508a.75.75 0 010 1.5H2.75A.75.75 0 012 7.5zM2 11.25a.75.75 0 01.75-.75h9.954a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 15a.75.75 0 01.75-.75h5.514a.75.75 0 010 1.5H2.75A.75.75 0 012 15z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Conditions</h3>
          {conditions.length > 0 && (
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
              {conditions.filter((c) => c.column).length} active
            </span>
          )}
        </div>
        <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Add Condition
        </button>
      </div>

      <div className="space-y-2">
        {conditions.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2">
              <path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h11.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zM2 7.5a.75.75 0 01.75-.75h7.508a.75.75 0 010 1.5H2.75A.75.75 0 012 7.5zM2 11.25a.75.75 0 01.75-.75h9.954a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 15a.75.75 0 01.75-.75h5.514a.75.75 0 010 1.5H2.75A.75.75 0 012 15z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-slate-400 dark:text-slate-500">No conditions yet. Add filters to narrow down your query.</p>
          </div>
        )}
        {conditions.map((c, i) => (
          <div key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 p-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <div className="flex flex-col items-center gap-0.5 pt-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors" title="Move up">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" /></svg>
              </button>
              <span className="text-[10px] font-medium text-slate-300 dark:text-slate-600">{i + 1}</span>
              <button onClick={() => move(i, 1)} disabled={i === conditions.length - 1} className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors" title="Move down">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {i > 0 && (
                  <div className="shrink-0">
                    <select
                      value={c.logical || 'AND'}
                      onChange={(e) => update(i, 'logical', e.target.value)}
                      className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 focus:border-pink-500 focus:outline-none transition-colors"
                    >
                      {logicalOperators.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex-1 grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <input type="text" value={c.column} onChange={(e) => update(i, 'column', e.target.value)} placeholder="Column name" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors" />
                  </div>
                  <div className="col-span-3">
                    <select value={c.operator} onChange={(e) => update(i, 'operator', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors">
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-5">
                    {c.operator !== 'IS NULL' && c.operator !== 'IS NOT NULL' ? (
                      <input type="text" value={c.value} onChange={(e) => update(i, 'value', e.target.value)} placeholder="Value" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors" />
                    ) : (
                      <div className="flex items-center px-3 py-1.5 text-xs text-slate-400 italic">no value needed</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => remove(i)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer mt-0.5" title="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
