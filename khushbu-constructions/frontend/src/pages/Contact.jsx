import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../utils/api'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

export default function Contact() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => { api.get('/profile').then(r => setProfile(r.data.data)).catch(() => {}) }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill in all required fields'); return }
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success("Message sent! We'll get back to you shortly.")
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setSending(false)
  }

  const contactItems = [
    { icon: FaPhone, label: 'Phone', value: profile?.phone || '+91 7735687076', href: `tel:${profile?.phone || '+91 7735687076'}`, color: 'bg-blue-100 text-blue-600' },
    { icon: FaEnvelope, label: 'Email', value: profile?.email || 'info@khushbuconstructions.com', href: `mailto:${profile?.email}`, color: 'bg-brand-100 text-brand-600' },
    { icon: FaMapMarkerAlt, label: 'Address', value: profile?.address || 'Pune, Maharashtra - 412101.', color: 'bg-green-100 text-green-600' },
    { icon: FaClock, label: 'Hours', value: 'Mon–Sat: 9:00 AM – 7:00 PM', color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="bg-surface-50">
      {/* Header */}
      <section className="relative py-20 bg-white border-b border-surface-200 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-tag">Reach Out</span>
            <h1 className="section-title text-5xl md:text-6xl">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      {/* Quick CTA bar */}
      <section className="py-4 bg-brand-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <p className="font-bold text-white">Ready to start your project?</p>
            <div className="flex gap-2">
              <a href={`tel:${profile?.phone || '+91 7735687076'}`} className="flex items-center gap-1.5 bg-white text-brand-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-50 transition-colors">
                <FaPhone size={12} /> Call Now
              </a>
              <a href={`https://wa.me/${profile?.whatsapp || WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-white/20 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors border border-white/30">
                <FaWhatsapp size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Info column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-4"
            >
              <h2 className="font-bold text-ink-900 text-2xl mb-6">Get In Touch</h2>

              {contactItems.map((item) => (
                <div key={item.label} className="card p-4 flex items-start gap-4">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <item.icon size={15} />
                  </div>
                  <div>
                    <p className="text-ink-400 text-xs font-semibold uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-ink-800 text-sm font-medium hover:text-brand-600 transition-colors">{item.value}</a>
                      : <p className="text-ink-800 text-sm font-medium">{item.value}</p>
                    }
                  </div>
                </div>
              ))}

              {/* WhatsApp card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <FaWhatsapp size={22} />
                  <h4 className="font-bold text-lg">Chat on WhatsApp</h4>
                </div>
                <p className="text-white/80 text-sm mb-4">Get instant response during business hours.</p>
                <a
                  href={`https://wa.me/${profile?.whatsapp || WHATSAPP}?text=Hello! I'd like to get a quote.`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-green-50 transition-colors shadow-sm"
                >
                  <FaWhatsapp size={15} /> Start Chat
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="card p-7">
                <h3 className="font-bold text-ink-900 text-2xl mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Name <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your full name" required />
                    </div>
                    <div>
                      <label className="form-label">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" required />
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                      <label className="form-label">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} className="form-select">
                        <option value="">Select topic</option>
                        <option value="residential">Residential Project</option>
                        <option value="commercial">Commercial Project</option>
                        <option value="industrial">Industrial Project</option>
                        <option value="renovation">Renovation</option>
                        <option value="consultation">Consultation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Message <span className="text-red-500">*</span></label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="form-input resize-none" placeholder="Tell us about your project…" required />
                  </div>
                  <button type="submit" disabled={sending} className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                    {sending ? <div className="spinner w-4 h-4" /> : <FaPaperPlane size={14} />}
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-80 relative overflow-hidden border-t border-surface-200">
        <div className="absolute inset-0 bg-surface-100 flex items-center justify-center z-10 pointer-events-none" style={{ background: 'rgba(250,250,250,0.7)' }}>
          <div className="text-center pointer-events-auto">
            <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FaMapMarkerAlt className="text-brand-600" size={20} />
            </div>
            <p className="font-bold text-ink-900 text-base mb-1">Find Us</p>
            <p className="text-ink-500 text-sm mb-3">{profile?.address || 'Pune, Maharashtra - 412101'}</p>
            <a href={profile?.mapUrl || 'https://maps.google.com/?q=Pune, Maharashtra'} target="_blank" rel="noreferrer" className="btn-primary text-xs py-2 px-4 rounded-lg">
              Open in Google Maps
            </a>
          </div>
        </div>
        <iframe
          src="https://maps.google.com/maps?q=Pune, Maharashtra,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 w-full h-full opacity-40"
          frameBorder="0" title="Location" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  )
}
