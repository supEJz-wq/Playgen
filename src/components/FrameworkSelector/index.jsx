import { frameworks } from '../../constants/frameworks'

export default function FrameworkSelector({ value, onChange }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Test Framework</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {frameworks.map((fw) => {
          const selected = value === fw.id
          return (
            <button
              key={fw.id}
              onClick={() => !fw.comingSoon && onChange(fw.id)}
              disabled={fw.comingSoon}
              className={`text-left rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                fw.comingSoon
                  ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'
                  : selected
                    ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative mt-0.5">
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    selected ? 'border-slate-900 dark:border-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selected && <div className="h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{fw.icon}</span>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{fw.label}</p>
                    {fw.comingSoon && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{fw.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
