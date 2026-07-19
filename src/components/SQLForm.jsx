import ConditionRow from './ConditionRow'
import { validationTypes, databaseTypes } from '../utils/sqlGenerator'

export default function SQLForm({ form, setForm, onGenerate, onReset }) {
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateCondition = (index, field, value) => {
    setForm((prev) => {
      const conditions = [...prev.conditions]
      conditions[index] = { ...conditions[index], [field]: value }
      return { ...prev, conditions }
    })
  }

  const addCondition = () => {
    setForm((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { column: '', operator: '=', value: '' }],
    }))
  }

  const deleteCondition = (index) => {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }))
  }

  const vt = form.validationType
  const showConditions = !['Latest Record', 'Duplicate Check'].includes(vt)
  const showExpectedCount = vt === 'Count Records'
  const showVerifyColumn = vt === 'Verify Column Value'
  const showDuplicateColumn = vt === 'Duplicate Check'
  const showCustomWhere = vt === 'Custom WHERE Query'
  const showOrderColumn = vt === 'Latest Record'

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Database Type</label>
          <select
            value={form.databaseType}
            onChange={(e) => updateField('databaseType', e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200"
          >
            {databaseTypes.map((db) => (
              <option key={db} value={db}>{db}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Table Name</label>
          <input
            type="text"
            value={form.tableName}
            onChange={(e) => updateField('tableName', e.target.value)}
            placeholder="e.g., users, orders, products"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Validation Type</label>
        <select
          value={form.validationType}
          onChange={(e) => updateField('validationType', e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200"
        >
          {validationTypes.map((vt) => (
            <option key={vt} value={vt}>{vt}</option>
          ))}
        </select>
      </div>

      {showConditions && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Conditions</h3>
            <button
              onClick={addCondition}
              className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Condition
            </button>
          </div>
          <div className="space-y-2">
            {form.conditions.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center">
                <p className="text-sm text-slate-400 dark:text-slate-500">No conditions yet. Click "Add Condition" to begin.</p>
              </div>
            )}
            {form.conditions.map((condition, index) => (
              <ConditionRow
                key={index}
                condition={condition}
                index={index}
                onChange={updateCondition}
                onDelete={() => deleteCondition(index)}
              />
            ))}
          </div>
        </div>
      )}

      {showCustomWhere && (
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Custom WHERE Clause</label>
          <textarea
            value={form.customWhere}
            onChange={(e) => updateField('customWhere', e.target.value)}
            placeholder="e.g., status = 'active' AND created_at > '2024-01-01'"
            rows={3}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200 resize-none"
          />
        </div>
      )}

      {showExpectedCount && (
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Expected Count</label>
          <input
            type="number"
            value={form.expectedCount}
            onChange={(e) => updateField('expectedCount', e.target.value)}
            placeholder="e.g., 5"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200"
          />
        </div>
      )}

      {showVerifyColumn && (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Expected Column</label>
            <input
              type="text"
              value={form.expectedColumn}
              onChange={(e) => updateField('expectedColumn', e.target.value)}
              placeholder="e.g., email, status"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Expected Value</label>
            <input
              type="text"
              value={form.expectedValue}
              onChange={(e) => updateField('expectedValue', e.target.value)}
              placeholder="e.g., john@email.com"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200"
            />
          </div>
        </>
      )}

      {showDuplicateColumn && (
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Column Name</label>
          <input
            type="text"
            value={form.duplicateColumn}
            onChange={(e) => updateField('duplicateColumn', e.target.value)}
            placeholder="e.g., email, username"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200"
          />
        </div>
      )}

      {showOrderColumn && (
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Order Column</label>
          <input
            type="text"
            value={form.orderColumn}
            onChange={(e) => updateField('orderColumn', e.target.value)}
            placeholder="e.g., id, created_at"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors duration-200"
          />
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onGenerate}
          disabled={!form.tableName}
          className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-200 dark:shadow-pink-900/30 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-600 transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          Generate SQL
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
      </div>
    </div>
  )
}
