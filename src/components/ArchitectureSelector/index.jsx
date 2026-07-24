import { architectures, architectureDetails } from '../../constants/frameworks'

export default function ArchitectureSelector({ framework, language, value, onChange }) {
  const available = architectures[framework] || ['simple']

  const filtered = available.filter((archId) => {
    const detail = architectureDetails[archId]
    if (!detail) return true
    if (detail.frameworks && !detail.frameworks.includes(framework)) return false
    if (detail.languages && !detail.languages.includes(language)) return false
    return true
  })

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Project Architecture</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((archId) => {
          const detail = architectureDetails[archId]
          if (!detail) return null
          const selected = value === archId
          return (
            <button
              key={archId}
              onClick={() => onChange(archId)}
              className={`text-left rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                selected
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
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{detail.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{detail.description}</p>
                  <span className="inline-block mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    {detail.files}
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
