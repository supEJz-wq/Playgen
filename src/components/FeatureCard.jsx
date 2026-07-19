export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}
