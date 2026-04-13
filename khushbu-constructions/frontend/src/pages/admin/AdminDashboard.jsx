import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaProjectDiagram, FaImages, FaHardHat, FaCheckCircle,
  FaArrowRight, FaPlus, FaChartLine, FaBuilding, FaEye
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

function StatCard({ icon: Icon, label, value, change, color, bgColor, to }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${bgColor} rounded-2xl flex items-center justify-center`}>
          <Icon className={color} size={20} />
        </div>
        {to && (
          <Link to={to} className="text-ink-300 hover:text-brand-500 transition-colors">
            <FaArrowRight size={12} />
          </Link>
        )}
      </div>
      <p className="text-3xl font-bold text-ink-900 mb-1">{value ?? '—'}</p>
      <p className="text-ink-500 text-sm">{label}</p>
      {change && <p className="text-green-600 text-xs font-medium mt-2">{change}</p>}
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, galleryRes] = await Promise.all([
          api.get('/projects?limit=100'),
          api.get('/gallery?limit=1'),
        ])
        const projects = projRes.data.data
        setData({
          total: projects.length,
          ongoing: projects.filter(p => p.status === 'ongoing').length,
          completed: projects.filter(p => p.status === 'completed').length,
          gallery: galleryRes.data.total,
        })
        setRecentProjects(projects.slice(0, 6))
      } catch {
        setData({ total: 0, ongoing: 0, completed: 0, gallery: 0 })
      } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const quickActions = [
    { label: 'Add New Project', to: '/admin/projects', icon: FaPlus, color: 'text-brand-600', bg: 'bg-brand-50 hover:bg-brand-100', desc: 'Create a project listing' },
    { label: 'Upload Image', to: '/admin/gallery', icon: FaImages, color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100', desc: 'Add to gallery' },
    { label: 'Update Settings', to: '/admin/profile', icon: FaChartLine, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100', desc: 'Company info & stats' },
  ]

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-bold text-ink-900 text-3xl mb-1">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'Admin'} 👋
        </h1>
        <p className="text-ink-500 text-sm">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="spinner w-8 h-8" /></div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FaProjectDiagram} label="Total Projects" value={data?.total} bgColor="bg-brand-100" color="text-brand-600" to="/admin/projects" />
            <StatCard icon={FaHardHat} label="Ongoing" value={data?.ongoing} bgColor="bg-amber-100" color="text-amber-600" to="/admin/projects" />
            <StatCard icon={FaCheckCircle} label="Completed" value={data?.completed} bgColor="bg-green-100" color="text-green-600" to="/admin/projects" change="All delivered on time" />
            <StatCard icon={FaImages} label="Gallery Images" value={data?.gallery} bgColor="bg-purple-100" color="text-purple-600" to="/admin/gallery" />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="font-bold text-ink-900 text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickActions.map(action => (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`card ${action.bg} p-4 flex items-center gap-4 group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover`}
                >
                  <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
                    <action.icon className={action.color} size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900 text-sm">{action.label}</p>
                    <p className="text-ink-500 text-xs">{action.desc}</p>
                  </div>
                  <FaArrowRight size={12} className="ml-auto text-ink-300 group-hover:text-brand-500 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
              <h2 className="font-bold text-ink-900 text-base">Recent Projects</h2>
              <Link to="/admin/projects" className="text-brand-500 text-xs font-semibold hover:text-brand-600 transition-colors flex items-center gap-1">
                Manage all <FaArrowRight size={10} />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FaBuilding className="text-ink-400" size={20} />
                </div>
                <p className="text-ink-500 text-sm mb-3">No projects yet</p>
                <Link to="/admin/projects" className="btn-primary text-xs py-2 px-4 rounded-lg">
                  <FaPlus size={11} /> Add First Project
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-surface-100">
                {recentProjects.map((p, i) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center overflow-hidden shrink-0">
                      {p.images?.[0]
                        ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                        : <FaBuilding className="text-ink-400" size={15} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink-900 text-sm truncate">{p.title}</p>
                      <p className="text-ink-400 text-xs truncate">{p.location} · {p.area}</p>
                    </div>
                    <span className={p.status === 'completed' ? 'badge-green' : 'badge-amber'}>
                      {p.status}
                    </span>
                    <Link to="/admin/projects" className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-400 hover:text-brand-500 p-1">
                      <FaEye size={13} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
