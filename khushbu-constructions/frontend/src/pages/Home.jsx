import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  FaHardHat, FaBuilding, FaUsers, FaAward, FaArrowRight,
  FaPhone, FaWhatsapp, FaCheckCircle, FaStar, FaShieldAlt
} from 'react-icons/fa'
import api from '../utils/api'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

function useCounter(target, duration = 2200) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return [count, ref]
}

function StatCard({ icon: Icon, value, label, color }) {
  const [count, ref] = useCounter(value)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        <Icon className="text-white" size={22} />
      </div>
      <div className="text-4xl font-bold text-ink-900 mb-1 font-display">
        {count}+
      </div>
      <div className="text-ink-500 text-sm font-medium">{label}</div>
    </motion.div>
  )
}

const services = [
  { title: 'Residential Buildings', desc: 'Custom homes and complexes built to the highest standards of quality and comfort.', icon: '🏠', color: 'bg-blue-50 text-blue-600' },
  { title: 'Commercial Projects', desc: 'Office towers, retail spaces, and mixed-use developments with modern design.', icon: '🏢', color: 'bg-purple-50 text-purple-600' },
  { title: 'Industrial Facilities', desc: 'Warehouses, factories, and robust industrial infrastructure.', icon: '🏭', color: 'bg-orange-50 text-orange-600' },
  { title: 'Interior Design', desc: 'Complete interior solutions combining aesthetics with functionality.', icon: '🎨', color: 'bg-pink-50 text-pink-600' },
  { title: 'Project Consulting', desc: 'Expert guidance for planning and executing your construction vision.', icon: '📋', color: 'bg-green-50 text-green-600' },
  { title: 'Renovation & Repair', desc: 'Revamp and modernize existing structures with quality craftsmanship.', icon: '🔧', color: 'bg-brand-50 text-brand-600' },
]

const whyUs = [
  'ISO certified construction processes',
  '15+ years of industry expertise',
  'In-house team of 120+ professionals',
  'On-time project delivery guarantee',
  'Transparent pricing, no hidden costs',
  'Post-construction support & warranty',
]

const testimonials = [
  { name: 'Ramesh Gupta', role: 'Home Owner', text: 'Exceptional quality and on-time delivery. Singh Constructions turned our dream home into reality.', rating: 5 },
  { name: 'Priya Mehta', role: 'Business Owner', text: 'Professional team, great communication, and outstanding results for our commercial project.', rating: 5 },
  { name: 'Anil Sharma', role: 'Property Developer', text: 'Trusted partner for all our construction needs. Consistent quality across multiple projects.', rating: 5 },
]

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [featuredProjects, setFeaturedProjects] = useState([])

  useEffect(() => {
    api.get('/profile').then(r => setProfile(r.data.data)).catch(() => {})
    api.get('/projects?featured=true&limit=3').then(r => setFeaturedProjects(r.data.data)).catch(() => {})
  }, [])

  const stats = profile?.statistics || { experienceYears: 15, completedProjects: 250, happyClients: 500, employees: 120 }

  return (
    <div className="bg-surface-50">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 dot-pattern opacity-50" />
        {/* Warm gradient blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-brand-100/60 via-brand-50/40 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5"
              >
                <span className="section-tag">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  Est. 2009 · Pune, Maharashtra

                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ink-900 leading-[1.1] mb-6"
              >
                Building{' '}
                <span className="relative">
                  <span className="text-brand-500">Dreams</span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                <br />Constructing<br />
                <span className="text-ink-400">Futures.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-ink-500 text-lg leading-relaxed mb-8 max-w-lg"
              >
                Singh Constructions delivers world-class residential and commercial projects
                with uncompromising quality, precision, and care.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hello! I want a free quote for a construction project.`}
                  target="_blank" rel="noreferrer"
                  className="btn-primary px-7 py-3.5 rounded-xl text-base shadow-brand"
                >
                  <FaWhatsapp size={18} /> Get Free Quote
                </a>
                <Link to="/projects" className="btn-secondary px-7 py-3.5 rounded-xl text-base">
                  View Our Projects <FaArrowRight size={14} />
                </Link>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex items-center gap-4"
              >
                <div className="flex -space-x-2">
                  {['RK', 'PM', 'AS', 'VJ'].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-brand-700 text-xs font-bold">{i}</div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <FaStar key={i} size={12} />)}
                  </div>
                  <p className="text-ink-500 text-xs mt-0.5">500+ happy clients</p>
                </div>
              </motion.div>
            </div>

            {/* Right — floating stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative hidden lg:block"
            >
              {/* Main decorative box */}
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl p-8 shadow-brand">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Projects Done', value: `${stats.completedProjects}+`, icon: '🏗️' },
                    { label: 'Years Active', value: `${stats.experienceYears}+`, icon: '📅' },
                    { label: 'Happy Clients', value: `${stats.happyClients}+`, icon: '🤝' },
                    { label: 'Team Size', value: `${stats.employees}+`, icon: '👷' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-white">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="text-3xl font-bold">{s.value}</div>
                      <div className="text-white/70 text-xs font-medium mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-white/15 rounded-2xl p-4 text-white flex items-center gap-3">
                  <FaShieldAlt size={20} className="text-white/80 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">ISO Certified Quality</p>
                    <p className="text-white/60 text-xs">All projects meet international standards</p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card-hover p-3 flex items-center gap-2 border border-surface-200"
              >
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="text-ink-900 font-bold text-sm">On-Time Delivery</p>
                  <p className="text-ink-400 text-xs">100% guaranteed</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FaAward} value={stats.experienceYears} label="Years of Experience" color="bg-brand-500" />
            <StatCard icon={FaBuilding} value={stats.completedProjects} label="Projects Completed" color="bg-blue-500" />
            <StatCard icon={FaUsers} value={stats.happyClients} label="Happy Clients" color="bg-green-500" />
            <StatCard icon={FaHardHat} value={stats.employees} label="Team Members" color="bg-purple-500" />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <span className="section-tag">What We Do</span>
            <h2 className="section-title mb-4">Our Services</h2>
            <p className="section-body mx-auto text-center">
              Comprehensive construction solutions tailored to meet every need with quality and precision.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-hover p-6 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-2xl mb-4`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-ink-900 text-lg mb-2 group-hover:text-brand-600 transition-colors">{s.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      {featuredProjects.length > 0 && (
        <section className="py-24 bg-surface-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="section-tag">Our Work</span>
                <h2 className="section-title">Featured Projects</h2>
              </div>
              <Link to="/projects" className="btn-outline text-sm rounded-xl px-5 py-2.5 whitespace-nowrap">
                View All Projects
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredProjects.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-hover group overflow-hidden"
                >
                  <div className="relative overflow-hidden h-52 rounded-t-2xl">
                    {p.images?.[0] ? (
                      <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                    ) : (
                      <div className="w-full h-full bg-surface-200 flex items-center justify-center">
                        <FaBuilding className="text-ink-300" size={36} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={p.status === 'completed' ? 'badge-green' : 'badge-amber'}>
                        {p.status === 'completed' ? '✓ Completed' : '⚡ Ongoing'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-ink-900 text-lg mb-1">{p.title}</h3>
                    <p className="text-brand-500 text-xs font-semibold mb-2 flex items-center gap-1">
                      📍 {p.location}
                    </p>
                    <p className="text-ink-500 text-sm line-clamp-2">{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="section-tag">Why Choose Us</span>
              <h2 className="section-title mb-5">The Singh Construction Difference</h2>
              <p className="text-ink-500 mb-8 leading-relaxed">
                With over 15 years of expertise, we combine traditional craftsmanship with modern
                technology to deliver projects that stand the test of time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whyUs.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-50 transition-colors"
                  >
                    <FaCheckCircle className="text-brand-500 mt-0.5 shrink-0" size={16} />
                    <span className="text-ink-700 text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl p-8 shadow-brand relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 pointer-events-none" />
              <div className="relative">
                <h3 className="font-bold text-white text-3xl mb-3">Ready to Start Your Project?</h3>
                <p className="text-white/80 mb-8 text-sm leading-relaxed">
                  Contact us today for a free consultation and quote. Our expert team is ready to bring your vision to life.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=Hello! I'd like to discuss a project.`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-white text-brand-600 font-semibold px-6 py-3.5 rounded-xl hover:bg-brand-50 transition-colors shadow-sm"
                  >
                    <FaWhatsapp size={18} /> Chat on WhatsApp
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/25 transition-colors border border-white/20"
                  >
                    <FaPhone size={14} /> Call Now
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <span className="section-tag">Client Feedback</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} size={14} />)}
                </div>
                <p className="text-ink-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{t.name}</p>
                    <p className="text-ink-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-sidebar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Let's Build Something Great Together
              </h2>
              <p className="text-slate-400">Get in touch with our expert team today.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/contact" className="btn-primary rounded-xl px-6 py-3.5">
                Contact Us
              </Link>
              <a href="tel:+919876543210" className="btn-secondary rounded-xl px-6 py-3.5 border-slate-600 text-slate-300 hover:text-white hover:border-brand-500 bg-transparent">
                <FaPhone size={13} /> Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
