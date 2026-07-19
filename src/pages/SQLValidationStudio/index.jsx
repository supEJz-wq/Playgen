import { useState, useCallback } from 'react'
import ValidationBuilder from '../../components/ValidationBuilder'
import ConditionBuilder from '../../components/ConditionBuilder'
import JoinBuilder from '../../components/JoinBuilder'
import AggregateBuilder from '../../components/AggregateBuilder'
import QueryLibrary from '../../components/QueryLibrary'
import ValidationSummary from '../../components/ValidationSummary'
import GeneratedSQL from '../../components/GeneratedSQL'
import Statistics from '../../components/Statistics'
import { generateSQL, generateExplanation, generateChecklist } from '../../utils/sqlGenerator'
import { applyQueryTemplate } from '../../utils/queryTemplates'

const initialForm = {
  databaseType: 'PostgreSQL',
  validationType: '',
  tableName: '',
  conditions: [],
  joinEnabled: false,
  joinType: 'INNER JOIN',
  joinTable: '',
  joinPrimaryColumn: '',
  joinForeignColumn: '',
  aggregateEnabled: false,
  aggregateFunction: 'COUNT',
  aggregateColumn: '',
  limit: '',
  orderByColumn: '',
  orderByDirection: 'ASC',
  expectedColumn: '',
  expectedValue: '',
  expectedCount: '',
  duplicateColumn: '',
  customSelect: '',
  customWhere: '',
}

const sections = [
  { id: 'details', label: 'Query Details', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z' },
  { id: 'conditions', label: 'Conditions', icon: 'M2 3.75A.75.75 0 012.75 3h11.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zM2 7.5a.75.75 0 01.75-.75h7.508a.75.75 0 010 1.5H2.75A.75.75 0 012 7.5zM2 11.25a.75.75 0 01.75-.75h9.954a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 15a.75.75 0 01.75-.75h5.514a.75.75 0 010 1.5H2.75A.75.75 0 012 15z' },
  { id: 'joins', label: 'Joins & Aggregates', icon: 'M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z' },
  { id: 'advanced', label: 'Advanced', icon: 'M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018a.75.75 0 000 1.324l7.115 3.925a.75.75 0 00.724 0l7.115-3.925a.75.75 0 000-1.324L10.362 1.093z' },
  { id: 'templates', label: 'Templates', icon: 'M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z' },
]

export default function SQLValidationStudio() {
  const [form, setForm] = useState(initialForm)
  const [sql, setSql] = useState('')
  const [activeTab, setActiveTab] = useState('sql')
  const [explanation, setExplanation] = useState('')
  const [checks, setChecks] = useState([])
  const [hasContent, setHasContent] = useState(false)
  const [activeSection, setActiveSection] = useState('details')

  const onChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleGenerate = () => {
    const result = generateSQL(form)
    setSql(result)
    setExplanation(generateExplanation(result, form))
    setChecks(generateChecklist(form))
    setHasContent(true)
    setActiveTab('sql')
  }

  const handleClear = () => {
    setSql('')
    setExplanation('')
    setChecks([])
    setHasContent(false)
  }

  const handleTemplateSelect = (template) => {
    const updated = applyQueryTemplate(template, form)
    setForm(updated)
    setActiveSection('details')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SQL Validation Studio</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Build, validate, and export SQL queries for QA automation</p>
        </div>
        <div className="flex items-center gap-3">
          <Statistics conditions={form.conditions} sql={sql} />
          <button onClick={handleGenerate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.85-9.773l-5.167 4.133a.5.5 0 01-.808-.386V8.026a.5.5 0 01.808-.386l5.167 4.133a.5.5 0 010 .808z" clipRule="evenodd" /></svg>
            Generate SQL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {sections.map((sec, i) => (
              <div key={sec.id} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setActiveSection(sec.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    activeSection === sec.id
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                    <path d={sec.icon} />
                  </svg>
                  {i + 1}. {sec.label}
                </button>
                {i < sections.length - 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-slate-300 dark:text-slate-600 shrink-0">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/20 p-6 shadow-sm">
            {activeSection === 'details' && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Query Details</h2>
                <ValidationBuilder form={form} onChange={onChange} />
              </div>
            )}
            {activeSection === 'conditions' && (
              <ConditionBuilder conditions={form.conditions} setConditions={(fn) => setForm((prev) => ({ ...prev, conditions: fn(prev.conditions) }))} />
            )}
            {activeSection === 'joins' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/20">
                  <JoinBuilder form={form} onChange={onChange} />
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/20">
                  <AggregateBuilder form={form} onChange={onChange} />
                </div>
              </div>
            )}
            {activeSection === 'advanced' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400">
                      <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018a.75.75 0 000 1.324l7.115 3.925a.75.75 0 00.724 0l7.115-3.925a.75.75 0 000-1.324L10.362 1.093z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Advanced Options</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20 p-4">
                    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Limit</label>
                    <input type="number" value={form.limit} onChange={(e) => onChange('limit', e.target.value)} placeholder="e.g., 100" min="0" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors" />
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20 p-4">
                    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Order By</label>
                    <input type="text" value={form.orderByColumn} onChange={(e) => onChange('orderByColumn', e.target.value)} placeholder="e.g., created_at" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors" />
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20 p-4">
                    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Direction</label>
                    <select value={form.orderByDirection} onChange={(e) => onChange('orderByDirection', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-colors">
                      <option value="ASC">ASC</option>
                      <option value="DESC">DESC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {activeSection === 'templates' && (
              <QueryLibrary onSelect={handleTemplateSelect} />
            )}
          </div>

          <ValidationSummary form={form} />
        </div>

        <div className="xl:col-span-1">
          <div className="sticky top-24 h-[calc(100vh-8rem)]">
            <GeneratedSQL
              sql={sql}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              explanation={explanation}
              checks={checks}
              hasContent={hasContent}
              onClear={handleClear}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
