import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20 px-4 py-1.5 text-xs font-medium text-pink-700 dark:text-pink-300 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
          </span>
          QA Automation Tool
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
          PlayGen
        </h1>

        <p className="mt-6 text-xl font-medium text-slate-700 dark:text-slate-300 sm:text-2xl">
          Enterprise QA Automation Suite for Playwright, Selenium &amp; Appium
        </p>

        <p className="mt-4 text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Build tests visually and generate production-ready automation code across multiple frameworks and languages.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 dark:shadow-pink-900/30 hover:bg-pink-700 transition-all duration-200 no-underline"
          >
            Start Generating
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 no-underline"
          >
            View Demo
          </a>
        </div>
      </div>
    </section>
  )
}
