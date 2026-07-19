export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-pink-500 text-[10px] font-bold text-white">
              PG
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              PlayGen
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built for QA Engineers. Open source and free to use.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} PlayGen
          </p>
        </div>
      </div>
    </footer>
  )
}
