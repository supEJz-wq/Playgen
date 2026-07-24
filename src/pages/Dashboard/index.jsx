import { Link } from 'react-router-dom'

const quickActions = [
  {
    title: 'Web Generator (Playwright)',
    desc: 'Modern end-to-end testing with Playwright - JavaScript & TypeScript',
    to: '/generator',
    icon: 'M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zM7.28 6.22a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z',
    color: 'bg-gradient-to-br from-pink-500 to-orange-500',
  },
  {
    title: 'Web Generator (Selenium)',
    desc: 'Enterprise Selenium automation - Java, Python, JS, C# with POM',
    to: '/selenium-generator',
    icon: 'M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.199z',
    color: 'bg-gradient-to-br from-orange-500 to-red-500',
  },
  {
    title: 'Mobile Generator (Appium)',
    desc: 'Mobile automation for Android & iOS - Java, Python, JS, C#',
    to: '/appium-generator',
    icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  },
  {
    title: 'CI/CD Pipeline Generator',
    desc: 'Generate GitHub Actions, GitLab CI, Jenkins, and Azure DevOps pipelines',
    to: '/cicd-generator',
    icon: 'M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z',
    color: 'bg-gradient-to-br from-indigo-500 to-violet-500',
  },
  {
    title: 'SQL Validation Studio',
    desc: 'Generate SQL queries for database validation',
    to: '/sql-builder',
    icon: 'M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.59-4.3a2.25 2.25 0 00-2.11 0L1.5 8.67zM3 10.67l4.5 2.25v4.33L3 14.94v-4.27zm10.5 2.25l4.5-2.25v4.27l-4.5 2.25v-4.27zm-1.5 6.16l-4.5-2.25v-4.33l4.5 2.25v4.33zm1.5-6.66l-4.5-2.25L12 7.66l4.5 2.25-1.5.75z',
    color: 'bg-emerald-500',
  },
  {
    title: 'Pre-built Templates',
    desc: 'Start from ready-made test templates',
    to: '/templates',
    icon: 'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 013.5.834M15.75 17.25c0-3.75-2.25-4.5-4.5-4.5M15.75 17.25h3.375c.621 0 1.125-.504 1.125-1.125V9.75a9.06 9.06 0 00-3.5-.834M15.75 9.75v-3.5a9.06 9.06 0 00-3.5-.835M10.5 17.25l-1.5-1.5m0 0l-1.5 1.5m1.5-1.5v6',
    color: 'bg-blue-500',
  },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">QA Automation Toolkit</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Build once, generate for any framework.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.to} className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 no-underline">
              <div className={'mb-4 flex h-12 w-12 items-center justify-center rounded-lg ' + action.color + ' text-white group-hover:scale-110 transition-transform duration-300'}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d={action.icon} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{action.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{action.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">Welcome to PlayGen</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Enterprise QA Automation Suite. Build your test once using the visual builder,
            then generate production-ready automation code for Playwright, Selenium, or Appium
            across multiple languages. Choose from Simple Script, Page Object Model,
            or Page Factory architectures. Database validation and SQL generation included.
          </p>
        </div>
      </div>
    </div>
  )
}
