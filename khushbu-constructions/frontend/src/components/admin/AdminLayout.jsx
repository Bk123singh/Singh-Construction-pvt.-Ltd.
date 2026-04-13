import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTachometerAlt, FaProjectDiagram, FaImages, FaCog,
  FaBars, FaTimes, FaSignOutAlt, FaExternalLinkAlt,
  FaChevronRight, FaBell
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FaProjectDiagram },
  { to: '/admin/gallery', label: 'Gallery', icon: FaImages },
  { to: '/admin/profile', label: 'Settings', icon: FaCog },
]

function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/admin/login')
  }

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700">
        <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform shrink-0">
            <span className="text-white font-bold text-sm">KC</span>
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Khushbu</p>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto admin-scroll">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Menu</p>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => isActive ? 'admin-nav-item-active' : 'admin-nav-item'}
          >
            <item.icon size={16} className="shrink-0" />
            <span className="flex-1">{item.label}</span>
            <FaChevronRight size={10} className="opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User area */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-1">
        <Link
          to="/" target="_blank"
          onClick={onClose}
          className="admin-nav-item text-xs"
        >
          <FaExternalLinkAlt size={13} />
          <span>View Website</span>
        </Link>
        <button onClick={handleLogout} className="admin-nav-item w-full text-red-400 hover:bg-red-900/30 hover:text-red-300 text-xs">
          <FaSignOutAlt size={14} />
          <span>Logout</span>
        </button>
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-3 mt-1 bg-slate-800/50 rounded-xl">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs truncate capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 fixed h-full z-40 shadow-admin">
        <Sidebar onClose={() => {}} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="fixed left-0 top-0 bottom-0 w-56 z-50 md:hidden shadow-admin"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-surface-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-nav">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors text-ink-700"
          >
            <FaBars size={16} />
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm text-ink-500">
            <span className="font-medium text-ink-400">Khushbu Constructions</span>
            <FaChevronRight size={10} className="text-ink-300" />
            <span className="text-ink-700 font-semibold">Admin</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors text-ink-500 relative">
              <FaBell size={14} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-brand">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
