import { useRef, useState } from 'react'

export default function GeneratedSQL({ sql, activeTab, onTabChange, explanation, checks, hasContent, onClear }) {
  const [copied, setCopied] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = sql
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = (format) => {
    setDownloadOpen(false)
    let content = sql
    let name = 'validation.sql'
    let mime = 'text/sql'
    if (format === 'txt') { content = sql; name = 'validation.txt'; mime = 'text/plain' }
    if (format === 'md') { content = '```sql\n' + sql + '\n```'; name = 'validation.md'; mime = 'text/markdown' }
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'sql', label: 'Generated SQL' },
    { id: 'explanation', label: 'Explanation' },
    { id: 'checklist', label: 'QA Checklist' },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'sql' && hasContent && (
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
              {copied ? (
                <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-green-500"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg> Copied!</>
              ) : (
                <>Copy SQL</>
              )}
            </button>
            <div className="relative">
              <button onClick={() => setDownloadOpen(!downloadOpen)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                Download
              </button>
              {downloadOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDownloadOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-28 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-20">
                    {[ { label: '.sql', format: 'sql' }, { label: '.txt', format: 'txt' }, { label: '.md', format: 'md' } ].map((opt) => (
                      <button key={opt.format} onClick={() => handleDownload(opt.format)} className="block w-full px-3 py-1.5 text-xs text-left text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">{opt.label}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer">Clear</button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20">
        {activeTab === 'sql' && (
          <>
            {hasContent ? (
              <pre className="h-full w-full overflow-auto bg-slate-950 p-4 text-sm text-green-400 font-mono leading-relaxed">
                <code>{sql}</code>
              </pre>
            ) : (
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center max-w-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3">
                    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h13A1.5 1.5 0 0118 3.5v13a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-13zM16 5.5v-1a.5.5 0 00-.5-.5h-13a.5.5 0 00-.5.5v1h14z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Click <span className="font-semibold text-slate-500 dark:text-slate-400">&quot;Generate SQL&quot;</span> to see the query here.</p>
                </div>
              </div>
            )}
          </>
        )}
        {activeTab === 'explanation' && (
          <div className="p-4 overflow-auto h-full">
            {explanation ? (
              <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">{explanation}</pre>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center max-w-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Generate a query to see the explanation.</p>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'checklist' && (
          <div className="p-4 overflow-auto h-full space-y-2">
            {checks && checks.length > 0 ? (
              checks.map((c, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl p-3 ${c.pass ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30' : 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30'}`}>
                  {c.pass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-green-500"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-amber-500"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  )}
                  <p className={`text-sm font-medium ${c.pass ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>{c.text}</p>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center max-w-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Generate a query to see the QA checklist.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
