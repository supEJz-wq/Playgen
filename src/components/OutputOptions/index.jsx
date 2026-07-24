export default function OutputOptions({ value, onChange, colors }) {
  const c = colors || { text: 'pink-600', darkText: 'pink-400', light: 'pink-50', dark: 'pink-900/10', border: 'pink-300', darkBorder: 'pink-700' }
  const options = [
    {
      id: 'simple',
      label: 'Simple Script',
      desc: 'Generate a single test file',
      files: '1 file',
    },
    {
      id: 'pom',
      label: 'Page Object Model',
      desc: 'Full project with page objects, utils, config, and data',
      files: '8+ files',
    },
    {
      id: 'page-factory',
      label: 'Page Factory',
      desc: '@FindBy with PageFactory.initElements() - Java Selenium only',
      files: '8+ files',
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
              className={'text-left rounded-xl border p-4 cursor-pointer transition-all duration-200 ' + (selected ? 'border-' + c.border + ' dark:border-' + c.darkBorder + ' bg-' + c.light + ' dark:bg-' + c.dark + ' shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600')}
            >
              <div className="flex items-start gap-3">
                <div className="relative mt-0.5">
                  <div className={'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-200 ' + (selected ? 'border-' + c.text : 'border-slate-300 dark:border-slate-600')}>
                    {selected && <div className={'h-2 w-2 rounded-full bg-' + c.text} />}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{opt.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{opt.desc}</p>
                  <span className={'inline-block mt-2 text-[10px] font-medium text-' + c.text + ' dark:text-' + c.darkText + ' bg-' + c.light + ' dark:bg-' + c.dark + ' px-2 py-0.5 rounded-full'}>
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
