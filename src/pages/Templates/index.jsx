import { useNavigate } from 'react-router-dom'
import { templates } from '../../constants/templates'

export default function Templates() {
  const navigate = useNavigate()

  const handleSelect = (template) => {
    const data = encodeURIComponent(JSON.stringify(template))
    navigate(`/generator?template=${data}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Test Templates
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pre-built templates to accelerate your test creation. Click any template to start building.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className="group text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm hover:shadow-md hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 013.5.834M15.75 17.25c0-3.75-2.25-4.5-4.5-4.5M15.75 17.25h3.375c.621 0 1.125-.504 1.125-1.125V9.75a9.06 9.06 0 00-3.5-.834M15.75 9.75v-3.5a9.06 9.06 0 00-3.5-.835M10.5 17.25l-1.5-1.5m0 0l-1.5 1.5m1.5-1.5v6" />
                  </svg>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  template.projectInfo.priority === 'Critical'
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : template.projectInfo.priority === 'High'
                    ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {template.projectInfo.priority}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                {template.name}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {template.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                <span>{template.steps.length} steps</span>
                <span>·</span>
                <span>{template.assertions.length} assertion(s)</span>
                <span>·</span>
                <span>{template.testData.length} variable(s)</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(template.projectInfo.tags || []).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
