export default function TestData({ testData, setTestData }) {
  const add = () => {
    setTestData((prev) => [...prev, { name: '', value: '' }])
  }

  const update = (index, field, val) => {
    setTestData((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: val } : d)))
  }

  const remove = (index) => {
    setTestData((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Test Data</h3>
        <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors duration-200 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Add Variable
        </button>
      </div>

      <div className="space-y-2">
        {testData.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">No test data defined.</p>
          </div>
        )}
        {testData.map((d, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-3">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input type="text" value={d.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Variable name" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 font-mono text-xs focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors" />
              <input type="text" value={d.value} onChange={(e) => update(i, 'value', e.target.value)} placeholder="Value" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors" />
            </div>
            <button onClick={() => remove(i)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
