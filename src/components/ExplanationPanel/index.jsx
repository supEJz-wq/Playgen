export default function ExplanationPanel({ steps, assertions }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-400 dark:text-slate-500">
        <p>Generate a script to see the explanation.</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3 overflow-auto h-full">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Step-by-Step Explanation</h4>
      {steps.map((step, i) => {
        const desc = step.description || step.action
        let explain = ''
        switch (step.action) {
          case 'Open URL': explain = 'Opens the application at the specified URL.'; break
          case 'Go Back': explain = 'Navigates back to the previous page.'; break
          case 'Go Forward': explain = 'Navigates forward to the next page.'; break
          case 'Reload Page': explain = 'Reloads the current page.'; break
          case 'Close Page': explain = 'Closes the current page/tab.'; break
          case 'Click': explain = 'Clicks the element at the specified locator.'; break
          case 'Double Click': explain = 'Double-clicks the element.'; break
          case 'Right Click': explain = 'Right-clicks the element.'; break
          case 'Hover': explain = 'Hovers over the element.'; break
          case 'Drag And Drop': explain = 'Drags the element to the target location.'; break
          case 'Fill': explain = 'Types the value into the input field.'; break
          case 'Clear': explain = 'Clears the input field.'; break
          case 'Press': explain = 'Presses the specified key.'; break
          case 'Press Enter': explain = 'Presses the Enter key to submit.'; break
          case 'Press Escape': explain = 'Presses the Escape key to dismiss.'; break
          case 'Press Tab': explain = 'Presses Tab to move focus to the next element.'; break
          case 'Press Arrow Keys': explain = 'Presses an arrow key for navigation.'; break
          case 'Check': explain = 'Checks the checkbox.'; break
          case 'Uncheck': explain = 'Unchecks the checkbox.'; break
          case 'Select Option': explain = 'Selects an option from the dropdown.'; break
          case 'New Page': explain = 'Opens a new page or popup window.'; break
          case 'New Context': explain = 'Creates a new browser context (incognito).'; break
          case 'Switch Tab': explain = 'Switches to a different browser tab.'; break
          case 'Close Tab': explain = 'Closes the current browser tab.'; break
          case 'Upload File': explain = 'Uploads a file using the file input element.'; break
          case 'Switch Frame': explain = 'Switches to an iframe for interaction.'; break
          case 'Exit Frame': explain = 'Exits the current iframe back to the main page.'; break
          case 'Wait For Visible': explain = 'Waits for the element to become visible before proceeding.'; break
          case 'Wait For Hidden': explain = 'Waits for the element to become hidden.'; break
          case 'Wait For URL': explain = 'Waits for the page URL to match the expected pattern.'; break
          case 'Wait For Load State': explain = 'Waits for the page to finish loading.'; break
          case 'Wait For Response': explain = 'Waits for a network response from the specified URL.'; break
          case 'Screenshot': explain = 'Takes a screenshot of the current viewport.'; break
          case 'Full Page Screenshot': explain = 'Takes a full-page screenshot including scrollable content.'; break
          case 'GET Request': explain = 'Sends a GET request and verifies the response is OK.'; break
          case 'POST Request': explain = 'Sends a POST request with data and verifies the response.'; break
          case 'PUT Request': explain = 'Sends a PUT request to update existing data.'; break
          case 'DELETE Request': explain = 'Sends a DELETE request to remove data.'; break
          default: explain = 'Performs the selected action.'
        }
        return (
          <div key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 text-[10px] font-bold text-pink-600 dark:text-pink-400">
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
                  {a.value ? ` Expected: ${a.value}` : ''}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
