import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaSave, FaBuilding, FaChartBar, FaLock,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
  FaFacebook, FaInstagram, FaLinkedin, FaEye, FaEyeSlash
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const TABS = [
  { id: 'company', label: 'Company Info', icon: FaBuilding },
  { id: 'stats', label: 'Statistics', icon: FaChartBar },
  { id: 'password', label: 'Change Password', icon: FaLock },
]

function Field({ label, value, onChange, type = 'text', textarea, rows = 3, required, placeholder, icon: Icon, hint }) {
  return (
    <div>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-ink-400 text-xs mb-1.5">{hint}</p>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-3.5 text-ink-400" size={14} />}
        {textarea
          ? <textarea
              value={value} onChange={e => onChange(e.target.value)}
              className={`form-input resize-none ${Icon ? 'pl-10' : ''}`}
              rows={rows} placeholder={placeholder} required={required}
            />
          : <input
              type={type} value={value} onChange={e => onChange(e.target.value)}
              className={`form-input ${Icon ? 'pl-10' : ''}`}
              placeholder={placeholder} required={required}
            />
        }
      </div>
    </div>
  )
}

function StatInput({ label, value, onChange, icon }) {
  return (
    <div className="card p-4">
      <label className="form-label text-xs">{label}</label>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-2xl">{icon}</span>
        <input
          type="number" value={value} min={0}
          onChange={e => onChange(parseInt(e.target.value) || 0)}
          className="form-input text-2xl font-bold text-ink-900 border-0 bg-transparent p-0 focus:ring-0 w-32"
        />
        <span className="text-ink-400 text-sm font-medium">+</span>
      </div>
      <p className="text-ink-400 text-xs mt-2">Displayed on homepage with animated counter</p>
    </div>
  )
}

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState('company')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPasses, setShowPasses] = useState({})

  const [info, setInfo] = useState({
    companyName: '', tagline: '', description: '', mission: '', vision: '',
    email: '', phone: '', whatsapp: '', address: '', mapUrl: '',
    facebook: '', instagram: '', linkedin: ''
  })

  const [stats, setStats] = useState({
    experienceYears: 15, completedProjects: 250, happyClients: 500, employees: 120
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  })

  useEffect(() => {
    api.get('/profile').then(r => {
      const p = r.data.data
      setInfo({
        companyName: p.companyName || '',
        tagline: p.tagline || '',
        description: p.description || '',
        mission: p.mission || '',
        vision: p.vision || '',
        email: p.email || '',
        phone: p.phone || '',
        whatsapp: p.whatsapp || '',
        address: p.address || '',
        mapUrl: p.mapUrl || '',
        facebook: p.socialLinks?.facebook || '',
        instagram: p.socialLinks?.instagram || '',
        linkedin: p.socialLinks?.linkedin || '',
      })
      setStats({ ...p.statistics })
    }).catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const saveInfo = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = {
        ...info,
        socialLinks: JSON.stringify({
          facebook: info.facebook,
          instagram: info.instagram,
          linkedin: info.linkedin
        })
      }
      await api.put('/profile', payload)
      toast.success('Profile updated successfully!')
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setSaving(false) }
  }

  const saveStats = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.put('/profile/statistics', stats)
      toast.success('Statistics updated!')
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('New passwords do not match'); return }
    if (passwords.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setSaving(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      toast.success('Password changed successfully!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Password change failed') }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="spinner w-8 h-8" />
    </div>
  )

  const togglePass = (key) => setShowPasses(p => ({ ...p, [key]: !p[key] }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bold text-ink-900 text-2xl">Settings</h1>
        <p className="text-ink-500 text-sm mt-0.5">Manage company info, statistics, and account security</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl w-fit mb-7 border border-surface-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-brand-600 shadow-card'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Company Info ── */}
      {activeTab === 'company' && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={saveInfo}
          className="space-y-6"
        >
          {/* Basic info */}
          <div className="card p-6">
            <h3 className="font-bold text-ink-900 text-base mb-5 flex items-center gap-2">
              <FaBuilding className="text-brand-500" size={16} />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Company Name"
                value={info.companyName}
                onChange={v => setInfo(i => ({ ...i, companyName: v }))}
                placeholder="Khushbu Constructions Pvt. Ltd."
              />
              <Field
                label="Tagline"
                value={info.tagline}
                onChange={v => setInfo(i => ({ ...i, tagline: v }))}
                placeholder="Building Dreams, Constructing Futures"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Company Description"
                  value={info.description}
                  onChange={v => setInfo(i => ({ ...i, description: v }))}
                  textarea rows={3}
                  placeholder="Brief company description shown on About page…"
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Mission Statement"
                  value={info.mission}
                  onChange={v => setInfo(i => ({ ...i, mission: v }))}
                  textarea rows={3}
                  placeholder="Company mission statement…"
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Vision Statement"
                  value={info.vision}
                  onChange={v => setInfo(i => ({ ...i, vision: v }))}
                  textarea rows={3}
                  placeholder="Company vision statement…"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card p-6">
            <h3 className="font-bold text-ink-900 text-base mb-5 flex items-center gap-2">
              <FaPhone className="text-brand-500" size={15} />
              Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" type="email" value={info.email} onChange={v => setInfo(i => ({ ...i, email: v }))} icon={FaEnvelope} placeholder="info@khushbuconstructions.com" />
              <Field label="Phone" value={info.phone} onChange={v => setInfo(i => ({ ...i, phone: v }))} icon={FaPhone} placeholder="+91 98765 43210" />
              <Field
                label="WhatsApp Number"
                value={info.whatsapp}
                onChange={v => setInfo(i => ({ ...i, whatsapp: v }))}
                icon={FaWhatsapp}
                placeholder="919876543210"
                hint="Include country code, no + or spaces. e.g. 919876543210"
              />
              <Field
                label="Google Maps URL"
                value={info.mapUrl}
                onChange={v => setInfo(i => ({ ...i, mapUrl: v }))}
                placeholder="https://maps.google.com/..."
              />
              <div className="sm:col-span-2">
                <Field label="Full Address" value={info.address} onChange={v => setInfo(i => ({ ...i, address: v }))} icon={FaMapMarkerAlt} textarea rows={2} placeholder="Plot No., Area, City, State - PIN" />
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="card p-6">
            <h3 className="font-bold text-ink-900 text-base mb-5 flex items-center gap-2">
              <FaFacebook className="text-brand-500" size={16} />
              Social Media Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Facebook" value={info.facebook} onChange={v => setInfo(i => ({ ...i, facebook: v }))} icon={FaFacebook} placeholder="https://facebook.com/..." />
              <Field label="Instagram" value={info.instagram} onChange={v => setInfo(i => ({ ...i, instagram: v }))} icon={FaInstagram} placeholder="https://instagram.com/..." />
              <Field label="LinkedIn" value={info.linkedin} onChange={v => setInfo(i => ({ ...i, linkedin: v }))} icon={FaLinkedin} placeholder="https://linkedin.com/..." />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary py-3 px-8 rounded-xl text-sm disabled:opacity-60">
              {saving ? <div className="spinner w-4 h-4" /> : <FaSave size={14} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </motion.form>
      )}

      {/* ── Tab: Statistics ── */}
      {activeTab === 'stats' && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={saveStats}
        >
          <div className="card p-6 mb-6">
            <h3 className="font-bold text-ink-900 text-base mb-2 flex items-center gap-2">
              <FaChartBar className="text-brand-500" size={16} />
              Homepage Statistics
            </h3>
            <p className="text-ink-500 text-sm mb-6">
              These numbers are displayed as animated counters on your homepage. Update them to reflect your current achievements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatInput
                label="Years of Experience"
                value={stats.experienceYears}
                onChange={v => setStats(s => ({ ...s, experienceYears: v }))}
                icon="🏗️"
              />
              <StatInput
                label="Completed Projects"
                value={stats.completedProjects}
                onChange={v => setStats(s => ({ ...s, completedProjects: v }))}
                icon="✅"
              />
              <StatInput
                label="Happy Clients"
                value={stats.happyClients}
                onChange={v => setStats(s => ({ ...s, happyClients: v }))}
                icon="🤝"
              />
              <StatInput
                label="Team Members / Employees"
                value={stats.employees}
                onChange={v => setStats(s => ({ ...s, employees: v }))}
                icon="👷"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="card p-5 bg-brand-50 border-brand-200 mb-6">
            <p className="text-brand-700 text-sm font-semibold mb-3">Preview — how it looks on homepage:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: stats.experienceYears, l: 'Years Experience', icon: '🏗️' },
                { v: stats.completedProjects, l: 'Projects Done', icon: '✅' },
                { v: stats.happyClients, l: 'Happy Clients', icon: '🤝' },
                { v: stats.employees, l: 'Team Members', icon: '👷' },
              ].map(s => (
                <div key={s.l} className="bg-white rounded-xl p-3 text-center shadow-card">
                  <p className="text-xl font-bold text-brand-600">{s.v}+</p>
                  <p className="text-ink-500 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary py-3 px-8 rounded-xl text-sm disabled:opacity-60">
              {saving ? <div className="spinner w-4 h-4" /> : <FaSave size={14} />}
              {saving ? 'Saving…' : 'Update Statistics'}
            </button>
          </div>
        </motion.form>
      )}

      {/* ── Tab: Change Password ── */}
      {activeTab === 'password' && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={savePassword}
          className="max-w-md"
        >
          <div className="card p-6">
            <h3 className="font-bold text-ink-900 text-base mb-2 flex items-center gap-2">
              <FaLock className="text-brand-500" size={15} />
              Change Password
            </h3>
            <p className="text-ink-500 text-sm mb-6">Use a strong password of at least 8 characters.</p>

            <div className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
                { key: 'newPassword', label: 'New Password', placeholder: 'Min. 8 characters' },
                { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="form-label">{label}</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={13} />
                    <input
                      type={showPasses[key] ? 'text' : 'password'}
                      value={passwords[key]}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                      className="form-input pl-10 pr-11"
                      placeholder={placeholder}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePass(key)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-brand-600 transition-colors"
                    >
                      {showPasses[key] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button type="submit" disabled={saving} className="btn-primary py-3 px-8 rounded-xl text-sm w-full disabled:opacity-60">
                {saving ? <div className="spinner w-4 h-4" /> : <FaLock size={14} />}
                {saving ? 'Updating…' : 'Change Password'}
              </button>
            </div>
          </div>
        </motion.form>
      )}
    </div>
  )
}
