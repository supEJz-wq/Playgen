export default function Statistics({ conditions, sql, steps, assertions, code, colors }) {
  const isGenerator = steps !== undefined
  const c = colors || { text: 'pink-600', darkText: 'pink-400' }

  const stats = isGenerator
    ? [
        { label: 'Steps', value: steps?.length || 0, color: 'text-' + c.text + ' dark:text-' + c.darkText },
        { label: 'Assertions', value: assertions?.length || 0, color: 'text-purple-600 dark:text-purple-400' },
        { label: 'Lines', value: code ? code.split('\n').length : 0, color: 'text-blue-600 dark:text-blue-400' },
      ]
    : [
        { label: 'Conditions', value: conditions?.filter((c) => c.column).length || 0, color: 'text-pink-600 dark:text-pink-400' },
        { label: 'Est. Query Length', value: (sql ? sql.split('\n').length : 0) + ' lines', color: 'text-purple-600 dark:text-purple-400' },
      ]

  return (
    <div className="flex items-center gap-4">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className={'text-sm font-bold ' + s.color}>{s.value}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
