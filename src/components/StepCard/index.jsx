import { useState } from 'react'
import LocatorBuilder from '../LocatorBuilder'
import { allActions, actionsWithNoLocator } from '../../constants/actions'

export default function StepCard({ step, index, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [expanded, setExpanded] = useState(false)
  const showLocator = !actionsWithNoLocator.includes(step.action)
  const showValue = ['Fill', 'Press', 'Select Option', 'Open URL', 'Wait For URL', 'Wait For Response',
    'Drag And Drop', 'Screenshot', 'Full Page Screenshot', 'Press Arrow Keys',
    'GET Request', 'POST Request', 'PUT Request', 'DELETE Request', 'Upload File',
  ].includes(step.action)

  return (
    <div className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30 text-xs font-bold text-pink-600 dark:text-pink-400">
              {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={onMoveUp} disabled={isFirst} className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" title="Move up">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" /></svg>
              </button>
              <button onClick={onMoveDown} disabled={isLast} className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" title="Move down">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Step {index + 1}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onDuplicate} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors cursor-pointer" title="Duplicate step">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" /><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" /></svg>
            </button>
            <button onClick={onDelete} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer" title="Delete step">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={step.description || ''}
              onChange={(e) => onChange(index, 'description', e.target.value)}
              placeholder="Step description (e.g., Enter username)"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Action</label>
              <select
                value={step.action}
                onChange={(e) => onChange(index, 'action', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
              >
                {allActions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            {showValue && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Value</label>
                <input
                  type="text"
                  value={step.value || ''}
                  onChange={(e) => onChange(index, 'value', e.target.value)}
                  placeholder={step.action === 'Open URL' ? '/login or full URL' : step.action === 'Upload File' ? '/path/to/file.pdf' : 'value'}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
                />
              </div>
            )}
          </div>
          {showLocator && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Locator</label>
              <LocatorBuilder
                locatorType={step.locatorType || 'CSS'}
                locator={step.locator || ''}
                onChange={(field, val) => onChange(index, field, val)}
              />
            </div>
          )}

          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
              {expanded ? 'Hide' : 'Show'} Advanced
            </button>
          </div>

          {expanded && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Expected Value</label>
                <input
                  type="text"
                  value={step.expectedValue || ''}
                  onChange={(e) => onChange(index, 'expectedValue', e.target.value)}
                  placeholder="Expected result after this step"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Notes</label>
                <input
                  type="text"
                  value={step.notes || ''}
                  onChange={(e) => onChange(index, 'notes', e.target.value)}
                  placeholder="Additional notes or comments"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
