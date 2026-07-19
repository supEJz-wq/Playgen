import DatabaseSelector from '../DatabaseSelector'
import { validationTypes } from '../../constants/validationTypes'

export default function ValidationBuilder({ form, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Validation Type</label>
        <select
          value={form.validationType}
          onChange={(e) => onChange('validationType', e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
        >
          <option value="">Select validation...</option>
          {validationTypes.map((group) => (
            <optgroup key={group.category} label={group.category}>
              {group.types.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <DatabaseSelector value={form.databaseType} onChange={onChange} />
      <div className="col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Table Name</label>
        <input
          type="text"
          value={form.tableName}
          onChange={(e) => onChange('tableName', e.target.value)}
          placeholder="e.g., users"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
        />
      </div>
    </div>
  )
}
