import { appiumPlatformOptions, appiumAutomationNameOptions, appiumDeviceOptions, appiumCapabilityDefaults } from '../../constants/appiumSettings'

export default function PlatformSelector({ projectInfo, onChange, colors }) {
  const c = colors || { focus: 'emerald-500', ring: 'emerald-200', darkRing: 'emerald-800', text: 'emerald-600', darkText: 'emerald-400' }
  const platform = projectInfo.platform || 'Android'
  const devices = appiumDeviceOptions[platform] || []
  const automationNames = appiumAutomationNameOptions[platform] || []

  const update = (field, value) => {
    onChange({ ...projectInfo, [field]: value })
  }

  const handlePlatformChange = (newPlatform) => {
    const defaults = appiumCapabilityDefaults[newPlatform] || {}
    onChange({
      ...projectInfo,
      platform: newPlatform,
      automationName: defaults.automationName || '',
      deviceName: defaults.deviceName || '',
      appPackage: defaults.appPackage || '',
      appActivity: defaults.appActivity || '',
    })
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Mobile Platform Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Platform</label>
          <div className="flex gap-3">
            {appiumPlatformOptions.map((p) => {
              const selected = platform === p
              return (
                <button
                  key={p}
                  onClick={() => handlePlatformChange(p)}
                  className={`flex-1 rounded-xl border p-3 text-center cursor-pointer transition-all duration-200 ${
                    selected
                      ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`text-lg ${selected ? 'opacity-100' : 'opacity-50'}`}>
                    {p === 'Android' ? '🤖' : '🍎'}
                  </span>
                  <p className={`text-sm font-medium mt-1 ${selected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{p}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Automation Name</label>
            <select value={projectInfo.automationName || ''} onChange={(e) => update('automationName', e.target.value)} className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'}>
              <option value="">Select automation</option>
              {automationNames.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Device Name</label>
            <select value={projectInfo.deviceName || ''} onChange={(e) => update('deviceName', e.target.value)} className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'}>
              <option value="">Select device</option>
              {devices.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">App Package</label>
            <input type="text" value={projectInfo.appPackage || ''} onChange={(e) => update('appPackage', e.target.value)} placeholder="com.example.app" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">App Activity</label>
            <input type="text" value={projectInfo.appActivity || ''} onChange={(e) => update('appActivity', e.target.value)} placeholder=".MainActivity" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Appium Server URL</label>
          <input type="text" value={projectInfo.appiumUrl || ''} onChange={(e) => update('appiumUrl', e.target.value)} placeholder="http://127.0.0.1:4723" className={'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-' + c.focus + ' focus:outline-none focus:ring-2 focus:ring-' + c.ring + ' dark:focus:ring-' + c.darkRing + ' transition-colors'} />
        </div>
      </div>
    </div>
  )
}
