const tags = ['Smoke', 'Regression', 'Sanity', 'Critical']

export default function ProjectInfo({ projectInfo, onChange, colors }) {
  const c = colors || { focus: 'pink-500', ring: 'pink-200', darkRing: 'pink-800', text: 'pink-600', darkText: 'pink-400', border: 'pink-300', darkBorder: 'pink-700' }

  const update = (field, value) => {
    onChange({ ...projectInfo, [field]: value })
  }

  const toggleTag = (tag) => {
    const current = projectInfo.tags || []
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag]
    update('tags', updated)
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Project Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Project Name</label>
          <input type="text" value={projectInfo.projectName || ''} onChange={(e) => update('projectName', e.target.value)} placeholder="e.g., SauceDemo" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Environment</label>
          <select value={projectInfo.environment || ''} onChange={(e) => update('environment', e.target.value)} className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'}>
            <option value="">Select environment</option>
            <option value="Development">Development</option>
            <option value="Staging">Staging</option>
            <option value="Production">Production</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Feature</label>
          <input type="text" value={projectInfo.feature || ''} onChange={(e) => update('feature', e.target.value)} placeholder="e.g., Authentication" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Module</label>
          <input type="text" value={projectInfo.module || ''} onChange={(e) => update('module', e.target.value)} placeholder="e.g., Login" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Base URL</label>
          <input type="text" value={projectInfo.baseUrl || ''} onChange={(e) => update('baseUrl', e.target.value)} placeholder="https://www.saucedemo.com" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Test Title</label>
          <input type="text" value={projectInfo.testTitle || ''} onChange={(e) => update('testTitle', e.target.value)} placeholder="e.g., Successful Login" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Author</label>
          <input type="text" value={projectInfo.author || ''} onChange={(e) => update('author', e.target.value)} placeholder="Your name" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Priority</label>
          <select value={projectInfo.priority || 'Medium'} onChange={(e) => update('priority', e.target.value)} className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = (projectInfo.tags || []).includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={'px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ' + (active ? 'bg-' + c.text + ' text-white border-' + c.text : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-' + c.border || 'pink-300' + ' dark:hover:border-' + c.darkBorder || 'pink-700')}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Description</label>
        <textarea
          value={projectInfo.description || ''}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Brief description of the test scenario"
          rows={2}
          className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors resize-none'}
        />
      </div>
    </div>
  )
}
