import { templates } from '../../constants/templates'

export default function TemplateSelector({ onSelect }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Quick Start Templates</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3 text-center hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-sm transition-all duration-200 cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              {t.name}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
              {t.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
