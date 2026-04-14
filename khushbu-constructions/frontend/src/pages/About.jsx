import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaEye, FaBullseye, FaHardHat, FaLeaf, FaShieldAlt, FaStar } from 'react-icons/fa'
import api from '../utils/api'

const values = [
  { icon: FaShieldAlt, title: 'Integrity', desc: 'Complete transparency and honesty in every project we undertake.', color: 'bg-blue-100 text-blue-600' },
  { icon: FaStar, title: 'Excellence', desc: 'We never compromise on quality — the best in every detail.', color: 'bg-amber-100 text-amber-600' },
  { icon: FaHardHat, title: 'Safety', desc: 'The safety of our workers and clients is our top priority.', color: 'bg-green-100 text-green-600' },
  { icon: FaLeaf, title: 'Sustainability', desc: 'Building responsibly with the environment in mind.', color: 'bg-emerald-100 text-emerald-600' },
]

const team = [
  { name: 'Rajesh Kumar', title: 'Managing Director', exp: '20+ years', bg: 'bg-brand-100 text-brand-700' },
  { name: 'Priya Sharma', title: 'Chief Architect', exp: '15+ years', bg: 'bg-blue-100 text-blue-700' },
  { name: 'Amit Singh', title: 'Project Manager', exp: '12+ years', bg: 'bg-green-100 text-green-700' },
  { name: 'Meera Patel', title: 'Head of Operations', exp: '10+ years', bg: 'bg-purple-100 text-purple-700' },
]

const fadeUp = { hidden: { opacity: 0, y: 25 }, show: { opacity: 1, y: 0 } }

export default function About() {
  const [profile, setProfile] = useState(null)
  useEffect(() => { api.get('/profile').then(r => setProfile(r.data.data)).catch(() => {}) }, [])

  return (
    <div className="bg-surface-50">
      {/* Header */}
      <section className="relative py-20 bg-white border-b border-surface-200 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl -translate-y-48 translate-x-48 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-tag">Our Story</span>
            <h1 className="section-title text-5xl md:text-6xl">About Us</h1>
          </motion.div>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="section-tag">Who We Are</span>
              <h2 className="section-title mb-5">A Legacy of Construction Excellence</h2>
              <p className="text-ink-500 leading-relaxed mb-4">
                {profile?.description || 'Singh Constructions. was founded in 2009 with a powerful vision — to deliver construction projects that exceed expectations. Over 15 years, we\'ve grown from a local contractor to one of Rajasthan\'s most respected builders.'}
              </p>
              <p className="text-ink-500 leading-relaxed">
                Our portfolio spans residential complexes, commercial towers, industrial facilities, and infrastructure projects — each a testament to our unwavering commitment to quality and timely delivery.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Founded', value: '2009', icon: '📅', color: 'bg-brand-50 border-brand-100' },
                { label: 'Projects', value: '250+', icon: '🏗️', color: 'bg-blue-50 border-blue-100' },
                { label: 'Cities Served', value: '15+', icon: '🗺️', color: 'bg-green-50 border-green-100' },
                { label: 'Awards Won', value: '12', icon: '🏆', color: 'bg-amber-50 border-amber-100' },
              ].map(stat => (
                <div key={stat.label} className={`card p-6 text-center ${stat.color} border`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-ink-900">{stat.value}</div>
                  <div className="text-ink-500 text-xs font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl p-8 relative overflow-hidden shadow-brand"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24 pointer-events-none" />
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                  <FaBullseye className="text-white" size={22} />
                </div>
                <h3 className="font-bold text-white text-3xl mb-4">Our Mission</h3>
                <p className="text-white/85 leading-relaxed">
                  {profile?.mission || 'To deliver high-quality construction projects that enhance communities, using innovative methods and sustainable practices while maintaining the highest standards of safety and customer satisfaction.'}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-8 border-2 border-brand-100"
            >
              <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center mb-5">
                <FaEye className="text-brand-600" size={22} />
              </div>
              <h3 className="font-bold text-ink-900 text-3xl mb-4">Our Vision</h3>
              <p className="text-ink-500 leading-relaxed">
                {profile?.vision || 'To be the most trusted construction company in India, recognized for our commitment to excellence, innovation, and the lasting positive impact we create in every community we serve.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <span className="section-tag">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="card-hover p-6"
              >
                <div className={`w-12 h-12 ${v.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <v.icon size={22} />
                </div>
                <h4 className="font-bold text-ink-900 text-lg mb-2">{v.title}</h4>
                <p className="text-ink-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <span className="section-tag">The People Behind Our Success</span>
            <h2 className="section-title">Leadership Team</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover text-center overflow-hidden group"
              >
                <div className="h-44 bg-surface-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                  <div className={`w-20 h-20 rounded-2xl ${member.bg} flex items-center justify-center text-2xl font-bold shadow-sm`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-ink-900 text-base">{member.name}</h4>
                  <p className="text-brand-500 text-xs font-semibold mt-1 mb-1">{member.title}</p>
                  <p className="text-ink-400 text-xs">{member.exp} experience</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
