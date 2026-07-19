import { locatorTypes } from '../../constants/locatorTypes'

export default function LocatorBuilder({ locatorType, locator, onChange }) {
  const current = locatorTypes.find((l) => l.value === locatorType)
  return (
    <div className="flex gap-2">
      <div className="w-32 shrink-0">
        <select
          value={locatorType}
          onChange={(e) => onChange('locatorType', e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
        >
          {locatorTypes.map((lt) => (
            <option key={lt.value} value={lt.value}>{lt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={locator}
          onChange={(e) => onChange('locator', e.target.value)}
          placeholder={current?.example || 'Enter locator value'}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors font-mono text-xs"
        />
      </div>
    </div>
  )
}
