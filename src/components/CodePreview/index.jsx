import { useRef, useState, useEffect } from 'react'
import JSZip from 'jszip'
import MonacoEditor from '@monaco-editor/react'
import ExplanationPanel from '../ExplanationPanel'
import QAChecklist from '../QAChecklist'
import BestPracticesPanel from '../BestPracticesPanel'

function getFlatFiles(files) {
  return (files && files.length > 0) ? files : []
}

function buildTreeFromFiles(files) {
  if (!files || files.length === 0) return []
  const tree = [
    { name: 'tests/', type: 'folder', children: [] },
    { name: 'pages/', type: 'folder', children: [] },
    { name: 'utils/', type: 'folder', children: [] },
    { name: 'data/', type: 'folder', children: [] },
    { name: 'config/', type: 'folder', children: [] },
  ]
  files.forEach((f) => {
    const name = f.name || ''
    for (const folder of tree) {
      const prefix = folder.name
      if (name.startsWith(prefix)) {
        folder.children.push({ name: name.replace(prefix, ''), type: 'file' })
        return
      }
    }
    tree.push({ name, type: 'file' })
  })
  return tree.filter((n) => n.type === 'folder' ? n.children.length > 0 : true)
}

function FileTreeNode({ node, depth }) {
  const [open, setOpen] = useState(true)
  const isFolder = node.type === 'folder'

  return (
    <div>
      <div
        className={'flex items-center gap-2 py-1 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-default transition-colors ' + (depth > 0 ? 'ml-5' : '')}
        onClick={() => isFolder && setOpen(!open)}
      >
        {isFolder ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={'h-4 w-4 shrink-0 text-slate-500 transition-transform ' + (open ? 'rotate-90' : '')}>
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
            <path fillRule="evenodd" d="M5.5 3.5A1.5 1.5 0 017 2h2.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0115 6.622V16.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 015 16.5v-13z" clipRule="evenodd" />
          </svg>
        )}
        <span className={'text-xs font-medium ' + (isFolder ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400')}>
          {node.name}
        </span>
      </div>
      {isFolder && open && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CodePreview({ code, files, steps, assertions, checks, bestPractices, hasContent, onClear, colors, framework }) {
  const editorRef = useRef(null)
  const [activeView, setActiveView] = useState('script')
  const [activeFile, setActiveFile] = useState(0)
  const [copied, setCopied] = useState(false)
  const [downloadDropdown, setDownloadDropdown] = useState(false)

  const c = colors || { text: 'pink-600', darkText: 'pink-400', light: 'pink-50', dark: 'pink-900/20', border: 'pink-200', darkBorder: 'pink-800' }

  const viewTabs = [
    { id: 'script', label: 'Generated Code' },
    { id: 'structure', label: 'Project Structure' },
    { id: 'explanation', label: 'Explanation' },
    { id: 'checklist', label: 'QA Checklist' },
    { id: 'bestPractices', label: 'Best Practices' },
  ]

  const currentFiles = getFlatFiles(files)
  const fileTree = buildTreeFromFiles(currentFiles)

  useEffect(() => {
    setActiveFile(0)
  }, [files, code])

  const currentContent = currentFiles[activeFile]?.content || code || ''
  const currentName = currentFiles[activeFile]?.name || 'output.txt'

  const handleMount = (editor) => {
    editorRef.current = editor
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = currentContent
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = async (format) => {
    setDownloadDropdown(false)

    if (currentFiles.length > 1) {
      const zip = new JSZip()
      currentFiles.forEach((f) => {
        zip.file(f.name, f.content)
      })
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'playgen-project.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const mimeMap = { py: 'text/x-python', java: 'text/x-java', cs: 'text/x-csharp', js: 'text/javascript', spec: 'text/javascript' }
      const ext = currentName.includes('.') ? currentName.split('.').pop() : 'txt'
      const mime = mimeMap[format] || mimeMap[ext] || 'text/plain'
      const blob = new Blob([currentContent], { type: mime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = currentName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  function getLanguage() {
    const name = currentName.toLowerCase()
    if (name.endsWith('.java')) return 'java'
    if (name.endsWith('.py')) return 'python'
    if (name.endsWith('.cs')) return 'csharp'
    if (name.endsWith('.js') || name.endsWith('.spec.js')) return 'javascript'
    if (name.endsWith('.properties')) return 'ini'
    return 'javascript'
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ' + (activeView === tab.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {(activeView === 'script' || activeView === 'structure') && (
          <div className="flex items-center gap-2">
            {activeView === 'script' && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-green-500">
                      <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>Copy Code</>
                )}
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setDownloadDropdown(!downloadDropdown)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                {currentFiles.length > 1 ? 'Download ZIP' : 'Download'}
              </button>
              {downloadDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDownloadDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-20">
                    <div className="py-1">
                      {currentFiles.length > 1 ? (
                        <button onClick={() => handleDownload('zip')} className="block w-full px-3 py-1.5 text-xs text-left text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                          Download ZIP
                        </button>
                      ) : (
                        <button onClick={() => handleDownload('file')} className="block w-full px-3 py-1.5 text-xs text-left text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                          Download File
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            {hasContent && (
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {activeView === 'script' && currentFiles.length > 1 && (
        <div className="flex items-center gap-1 mb-3 overflow-x-auto">
          {currentFiles.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setActiveFile(i)}
              className={'px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ' + (activeFile === i ? 'bg-' + c.light + ' dark:bg-' + c.dark + ' text-' + c.text + ' dark:text-' + c.darkText + ' border border-' + c.border + ' dark:border-' + c.darkBorder : 'text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50')}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        {activeView === 'script' && (
          <MonacoEditor
            key={currentName}
            height="100%"
            language={getLanguage()}
            theme="vs-dark"
            value={currentContent}
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 12 },
              readOnly: true,
              renderWhitespace: 'selection',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        )}
        {activeView === 'structure' && (
          <div className="p-4 overflow-auto h-full">
            {fileTree.length > 0 ? (
              <div className="space-y-0.5">
                {fileTree.map((node, i) => (
                  <FileTreeNode key={i} node={node} depth={0} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">Generate a project to see the file structure.</p>
            )}
          </div>
        )}
        {activeView === 'explanation' && <ExplanationPanel steps={steps} assertions={assertions} framework={framework} />}
        {activeView === 'checklist' && <QAChecklist checks={checks} />}
        {activeView === 'bestPractices' && <BestPracticesPanel bestPractices={bestPractices} />}
      </div>
    </div>
  )
}
