import { queryTemplates, queryCategories } from '../../constants/queryLibrary'

export default function QueryLibrary({ onSelect }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Query Templates</h3>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Select a template to quickly load a pre-configured query.</p>
      {queryCategories.map((category) => {
        const items = queryTemplates.filter((t) => t.category === category)
        if (items.length === 0) return null
        return (
          <div key={category} className="mb-4">
            <h4 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" clipRule="evenodd" />
              </svg>
              {category}
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group text-left px-3 py-2.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{item.label}</span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {item.form.validationType} &middot; {item.form.tableName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
