import { databases } from '../../constants/databases'

export default function DatabaseSelector({ value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Database</label>
      <select
        value={value}
        onChange={(e) => onChange('databaseType', e.target.value)}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
      >
        {databases.map((db) => (
          <option key={db.value} value={db.value}>{db.label}</option>
        ))}
      </select>
    </div>
  )
}
