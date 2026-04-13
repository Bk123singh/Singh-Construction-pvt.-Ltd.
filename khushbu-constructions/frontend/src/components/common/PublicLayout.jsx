import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaBars, FaTimes, FaWhatsapp, FaPhone,
  FaMapMarkerAlt, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaArrowUp
} from 'react-icons/fa'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '7735687076'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 60); setShowTop(window.scrollY > 400) }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0) }, [location.pathname])

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-nav border-b border-surface-200' : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-sm">KC</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-ink-900 text-sm leading-tight">Khushbu Constructions</p>
                <p className="text-brand-500 text-xs font-semibold">Pvt. Ltd.</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-ink-500 hover:text-ink-900 hover:bg-surface-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href={`tel:+7735687076`} className="hidden sm:flex items-center gap-1.5 text-ink-500 hover:text-brand-600 transition-colors text-sm font-medium">
                <FaPhone size={12} /><span className="text-xs hidden lg:inline">+91 7735687076</span>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello! I want to get a free quote.`}
                target="_blank" rel="noreferrer"
                className="hidden md:flex btn-primary text-xs px-4 py-2.5 rounded-lg"
              >
                <FaWhatsapp size={14} /> Get Quote
              </a>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors text-ink-700"
              >
                {menuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-surface-200 overflow-hidden"
            >
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to} to={link.to} end={link.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-ink-600 hover:bg-surface-100'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="pt-3">
                  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="btn-primary w-full rounded-xl py-3 text-sm">
                    <FaWhatsapp size={16} /> Get Free Quote
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1 pt-16"><Outlet /></main>

      {/* ── Footer ── */}
      <footer className="bg-sidebar text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KC</span>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Khushbu Constructions</p>
                  <p className="text-brand-400 text-xs">Pvt. Ltd.</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">Building dreams with precision and dedication since 2009.</p>
              <div className="flex gap-2">
                {[FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-brand-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                    <Icon size={12} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
              <div className="space-y-2.5">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} className="block text-slate-400 hover:text-brand-400 text-sm transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
              <div className="space-y-2.5 text-slate-400 text-sm">
                {['Residential Construction', 'Commercial Buildings', 'Industrial Projects', 'Interior Design', 'Renovation'].map(s => <p key={s}>{s}</p>)}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <FaMapMarkerAlt className="text-brand-400 mt-0.5 shrink-0" size={12} />
                  <span className="text-slate-400 text-sm">Pune Maharashtra - 411002 </span>
                </div>
                <div className="flex gap-3 items-center">
                  <FaPhone className="text-brand-400 shrink-0" size={12} />
                  <a href="tel:+ 7735687076" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">+91 7735687076</a>
                </div>
                <div className="flex gap-3 items-center">
                  <FaEnvelope className="text-brand-400 shrink-0" size={12} />
                  <a href="mailto:info@khushbuconstructions.com" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">info@khushbuconstructions.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Khushbu Constructions Pvt. Ltd. All rights reserved.</p>
            <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Admin Panel</Link>
          </div>
        </div>
      </footer>

      {/* WhatsApp float */}
      <motion.a
        href={`https://wa.me/${WHATSAPP}?text=Hello! I'm interested in a construction project.`}
        target="_blank" rel="noreferrer"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 transition-colors"
      >
        <FaWhatsapp size={24} className="text-white" />
      </motion.a>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-24 z-50 w-10 h-10 bg-white border border-surface-300 rounded-xl flex items-center justify-center shadow-card hover:border-brand-400 hover:text-brand-600 transition-all text-ink-500"
          >
            <FaArrowUp size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
