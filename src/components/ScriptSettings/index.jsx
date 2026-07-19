export default function ScriptSettings({ settings, onChange }) {
  const update = (field, value) => {
    onChange({ ...settings, [field]: value })
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Script Settings</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Language</label>
          <select value={settings.language || 'JavaScript'} onChange={(e) => update('language', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors">
            <option value="JavaScript">JavaScript</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Locator Style</label>
          <select value={settings.locatorStyle || 'locator()'} onChange={(e) => update('locatorStyle', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors">
            <option value="locator()">locator()</option>
            <option value="getByRole()">getByRole()</option>
            <option value="getByText()">getByText()</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Quote Style</label>
          <select value={settings.quoteStyle || 'Single Quotes'} onChange={(e) => update('quoteStyle', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors">
            <option value="Single Quotes">Single Quotes</option>
            <option value="Double Quotes">Double Quotes</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Semicolons</label>
          <select value={settings.semicolons || 'On'} onChange={(e) => update('semicolons', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors">
            <option value="On">On</option>
            <option value="Off">Off</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Indentation</label>
          <select value={settings.indentation || '2 Spaces'} onChange={(e) => update('indentation', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors">
            <option value="2 Spaces">2 Spaces</option>
            <option value="4 Spaces">4 Spaces</option>
          </select>
        </div>
      </div>
    </div>
  )
}
