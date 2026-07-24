import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import PlaywrightGenerator from './pages/PlaywrightGenerator'
import SeleniumGenerator from './pages/SeleniumGenerator'
import AppiumGenerator from './pages/AppiumGenerator'
import CicdGenerator from './pages/CicdGenerator'
import Templates from './pages/Templates'
import SQLValidationStudio from './pages/SQLValidationStudio'
import Settings from './pages/Settings'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generator" element={<PlaywrightGenerator />} />
          <Route path="/selenium-generator" element={<SeleniumGenerator />} />
          <Route path="/appium-generator" element={<AppiumGenerator />} />
          <Route path="/cicd-generator" element={<CicdGenerator />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/sql-builder" element={<SQLValidationStudio />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
