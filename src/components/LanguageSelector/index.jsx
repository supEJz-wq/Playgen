import { frameworks } from '../../constants/frameworks'

const languageIcons = {
  JavaScript: '🟨',
  TypeScript: '🔷',
  Java: '🟧',
  Python: '🐍',
  'C#': '🟣',
}

export default function LanguageSelector({ framework, value, onChange, colors }) {
  const fw = frameworks.find((f) => f.id === framework)
  const languages = fw?.languages || []
  const c = colors || { text: 'pink-600', darkText: 'pink-400', border: 'pink-300', darkBorder: 'pink-700' }

  if (languages.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Programming Language
        <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
          for {fw?.icon} {fw?.label}
        </span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {languages.map((lang) => {
          const selected = value === lang
          return (
            <button
              key={lang}
              onClick={() => onChange(lang)}
              className={`text-left rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                selected
                  ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    selected ? 'border-slate-900 dark:border-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selected && <div className="h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span>{languageIcons[lang] || '📄'}</span>
                  <span className="text-sm font-medium truncate text-slate-700 dark:text-slate-300">{lang}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
