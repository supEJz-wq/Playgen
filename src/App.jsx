import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import Generator from './pages/Generator'
import Templates from './pages/Templates'
import SQLValidationStudio from './pages/SQLValidationStudio'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/sql-builder" element={<SQLValidationStudio />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
