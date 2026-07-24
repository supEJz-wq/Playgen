import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
  { to: '/generator', label: 'Test Generator', icon: 'M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zM7.28 6.22a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z' },
  { to: '/sql-builder', label: 'SQL Validation', icon: 'M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.59-4.3a2.25 2.25 0 00-2.11 0L1.5 8.67zM3 10.67l4.5 2.25v4.33L3 14.94v-4.27zm10.5 2.25l4.5-2.25v4.27l-4.5 2.25v-4.27zm-1.5 6.16l-4.5-2.25v-4.33l4.5 2.25v4.33zm1.5-6.66l-4.5-2.25L12 7.66l4.5 2.25-1.5.75z' },
  { to: '/templates', label: 'Templates', icon: 'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 013.5.834M15.75 17.25c0-3.75-2.25-4.5-4.5-4.5M15.75 17.25h3.375c.621 0 1.125-.504 1.125-1.125V9.75a9.06 9.06 0 00-3.5-.834M15.75 9.75v-3.5a9.06 9.06 0 00-3.5-.835M10.5 17.25l-1.5-1.5m0 0l-1.5 1.5m1.5-1.5v6' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 shrink-0 border-r border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#0F172A]/50 min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to || 
            (link.to === '/generator' && (location.pathname.startsWith('/generator') || location.pathname.startsWith('/selenium-generator')))
          return (
            <Link
              key={link.to}
              to={link.to}
              className={'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 no-underline ' + (isActive ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0">
                <path d={link.icon} />
              </svg>
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
