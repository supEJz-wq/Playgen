export default function OutputOptions({ value, onChange }) {
  const options = [
    {
      id: 'simple',
      label: 'Simple Script',
      desc: 'Generate a single Playwright test file (.spec.js)',
      files: '1 file',
    },
    {
      id: 'pom',
      label: 'Page Object Model',
      desc: 'Full project with page objects, components, test data, and helpers',
      files: '5+ files',
    },
  ]

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Output Style</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const selected = value === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`text-left rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                selected
                  ? 'border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/10 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative mt-0.5">
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    selected
                      ? 'border-pink-600'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selected && (
                      <div className="h-2 w-2 rounded-full bg-pink-600" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{opt.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{opt.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-medium text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-full">
                    {opt.files}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
