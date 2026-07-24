export default function ExplanationPanel({ steps, assertions, colors }) {
  const c = colors || { light: 'pink-100', dark: 'pink-900/30', text: 'pink-600', darkText: 'pink-400' }

  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-400 dark:text-slate-500">
        <p>Generate a script to see the explanation.</p>
      </div>
    )
  }

  const explanations = {
    'Open URL': 'Opens the application at the specified URL.',
    'Go Back': 'Navigates back to the previous page.',
    'Go Forward': 'Navigates forward to the next page.',
    'Reload': 'Reloads the current page.',
    'Close Page': 'Closes the current page/tab.',
    'Click': 'Clicks the element at the specified locator.',
    'Double Click': 'Double-clicks the element.',
    'Right Click': 'Right-clicks the element.',
    'Hover': 'Hovers over the element.',
    'Drag And Drop': 'Drags the element to the target location.',
    'Fill': 'Types the value into the input field.',
    'Clear': 'Clears the input field.',
    'Press Key': 'Presses the specified key.',
    'Type': 'Types the value into the element.',
    'Check': 'Checks the checkbox or radio button.',
    'Uncheck': 'Unchecks the checkbox.',
    'Select Dropdown': 'Selects an option from the dropdown.',
    'Upload File': 'Uploads a file using the file input element.',
    'Take Screenshot': 'Takes a screenshot of the current viewport.',
    'Wait': 'Waits for the element to be ready.',
    'Wait For URL': 'Waits for the page URL to match.',
    'Switch Frame': 'Switches to an iframe for interaction.',
    'Exit Frame': 'Exits the current iframe back to the main page.',
    'Switch Window': 'Switches to a different browser window/tab.',
    'Open New Window': 'Opens a new browser window or tab.',
    'Close Window': 'Closes the current browser window/tab.',
    'Scroll': 'Scrolls the page vertically.',
    'API Request': 'Sends an HTTP API request.',
    'Assert': 'Performs an assertion check.',
  }

  return (
    <div className="p-4 space-y-3 overflow-auto h-full">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Step-by-Step Explanation</h4>
      {steps.map((step, i) => {
        const desc = step.description || step.action
        const explain = explanations[step.action] || 'Performs the selected action.'
        return (
          <div key={i} className="flex gap-3">
            <span className={'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-' + c.light + ' dark:bg-' + c.dark + ' text-[10px] font-bold text-' + c.text + ' dark:text-' + c.darkText}>
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{desc}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{explain}</p>
            </div>
          </div>
        )
      })}

      {assertions && assertions.length > 0 && (
        <>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-6 mb-3">Assertions</h4>
          {assertions.map((a, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-[10px] font-bold text-green-600 dark:text-green-400">
                {(steps?.length || 0) + i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{a.type}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Validates that the {a.type.toLowerCase()} condition is met.
                  {a.value ? ' Expected: ' + a.value : ''}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
