import { seleniumTemplates } from '../../constants/seleniumTemplates'

export default function SeleniumTemplateSelector({ onSelect }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Quick Start Templates</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {seleniumTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3 text-center hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-sm transition-all duration-200 cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {t.name}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
              {t.description}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
              {t.settings.language} &middot; {t.settings.browser}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
