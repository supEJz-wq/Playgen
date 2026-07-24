import StepCard from '../StepCard'

export default function TestStepBuilder({ steps, setSteps, colors, framework }) {
  const c = colors || { text: 'pink-600', darkText: 'pink-400', light: 'pink-50', dark: 'pink-900/20', hoverLight: 'pink-100', hoverDark: 'pink-900/30' }

  const updateStep = (index, field, value) => {
    setSteps((prev) => {
      const updated = prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
      return updated
    })
  }

  const addStep = () => {
    const isAppium = framework === 'appium'
    setSteps((prev) => [
      ...prev,
      { action: isAppium ? 'Tap' : 'Click', locatorType: isAppium ? 'Accessibility ID' : 'CSS Selector', locator: '', value: '', description: '', expectedValue: '', notes: '' },
    ])
  }

  const deleteStep = (index) => {
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  const duplicateStep = (index) => {
    setSteps((prev) => {
      const copy = { ...prev[index] }
      const updated = [...prev]
      updated.splice(index + 1, 0, copy)
      return updated
    })
  }

  const moveStep = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= steps.length) return
    setSteps((prev) => {
      const updated = [...prev]
      const tmp = updated[index]
      updated[index] = updated[target]
      updated[target] = tmp
      return updated
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Test Steps</h3>
        <button onClick={addStep} className={'inline-flex items-center gap-1.5 rounded-lg bg-' + c.light + ' dark:bg-' + c.dark + ' px-3 py-1.5 text-xs font-medium text-' + c.text + ' dark:text-' + c.darkText + ' hover:bg-' + c.hoverLight + ' dark:hover:bg-' + c.hoverDark + ' transition-colors duration-200 cursor-pointer'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Add Step
        </button>
      </div>

      <div className="space-y-3">
        {steps.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">No test steps yet. Click "Add Step" to begin.</p>
          </div>
        )}
        {steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            index={index}
            onChange={updateStep}
            onDelete={() => deleteStep(index)}
            onDuplicate={() => duplicateStep(index)}
            onMoveUp={() => moveStep(index, -1)}
            onMoveDown={() => moveStep(index, 1)}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
            colors={c}
            framework={framework}
          />
        ))}
      </div>
    </div>
  )
}
