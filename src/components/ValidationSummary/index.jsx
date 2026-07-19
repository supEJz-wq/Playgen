import { getExpectedResultText, estimateComplexity } from '../../utils/validationTemplates'
import { databases } from '../../constants/databases'

function getDbLabel(value) {
  const found = databases.find((d) => d.value === value)
  return found ? found.label : value
}

export default function ValidationSummary({ form }) {
  if (!form.tableName) return null

  const complexity = estimateComplexity(form)
  const expected = getExpectedResultText(form)

  const conditionText = (form.conditions || [])
    .filter((c) => c.column)
    .map((c) => `${c.column} ${c.operator} ${c.value}`)
    .join(', ')

  const items = [
    { label: 'Database', value: getDbLabel(form.databaseType) },
    { label: 'Validation', value: form.validationType },
    { label: 'Table', value: form.tableName },
  ]

  if (conditionText) {
    items.push({ label: 'Conditions', value: conditionText })
  }

  items.push({ label: 'Expected Result', value: expected })
  items.push({ label: 'Complexity', value: `${complexity.icon} ${complexity.level}` })

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white dark:from-slate-800/40 to-slate-50 dark:to-slate-800/20 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-pink-100 dark:bg-pink-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Validation Summary</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
        {items.map((item) => (
          <div key={item.label}>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.label}</span>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug truncate" title={item.value}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
