import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBuilding, FaMapMarkerAlt, FaRuler, FaSearch, FaFilter, FaChevronDown } from 'react-icons/fa'
import api from '../utils/api'

const categories = ['all', 'residential', 'commercial', 'industrial', 'infrastructure']

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-hover group overflow-hidden"
    >
      <div className="relative overflow-hidden h-52 rounded-t-2xl bg-surface-100">
        {project.images?.[0] ? (
          <img src={project.images[0].url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaBuilding className="text-ink-300" size={36} />
          </div>
        )}
        {project.images?.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
            +{project.images.length - 1} photos
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={project.status === 'completed' ? 'badge-green' : 'badge-amber'}>
            {project.status === 'completed' ? '✓ Completed' : '⚡ Ongoing'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge-gray capitalize">{project.category}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-ink-900 text-lg mb-2">{project.title}</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <span className="flex items-center gap-1.5 text-xs text-ink-500 font-medium">
            <FaMapMarkerAlt className="text-brand-500" size={11} />{project.location}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-ink-500 font-medium">
            <FaRuler className="text-brand-500" size={11} />{project.area}
          </span>
        </div>
        <p className={`text-ink-500 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {project.description}
        </p>
        {project.description?.length > 100 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-brand-500 text-xs font-semibold mt-2 hover:text-brand-600 transition-colors flex items-center gap-1"
          >
            {expanded ? 'Show Less' : 'Read More'}
            <FaChevronDown size={10} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
        {project.completionYear && (
          <div className="mt-3 pt-3 border-t border-surface-200 text-xs text-ink-400">
            {project.status === 'completed' ? `Completed ${project.completionYear}` : 'Currently in progress'}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (activeTab !== 'all') params.set('status', activeTab)
        if (category !== 'all') params.set('category', category)
        const { data } = await api.get(`/projects?${params}&limit=50`)
        setProjects(data.data)
      } catch { setProjects([]) }
      finally { setLoading(false) }
    }
    fetch()
  }, [activeTab, category])

  const filtered = projects.filter(p =>
    search === '' ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-surface-50">
      {/* Header */}
      <section className="relative py-20 bg-white border-b border-surface-200 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl translate-y-48 translate-x-24 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-tag">Our Portfolio</span>
            <h1 className="section-title text-5xl md:text-6xl">Projects</h1>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white border-b border-surface-200 shadow-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-3">
            {/* Status tabs */}
            <div className="flex gap-1 p-1 bg-surface-100 rounded-xl shrink-0">
              {['all', 'ongoing', 'completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeTab === tab ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500 hover:text-ink-900'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={11} />
              <select value={category} onChange={e => setCategory(e.target.value)} className="form-select pl-8 py-2 text-xs rounded-xl w-44 bg-surface-100 border-surface-200">
                {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>

            <div className="relative flex-1 max-w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={12} />
              <input
                type="text" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)}
                className="form-input pl-9 py-2 text-xs rounded-xl bg-surface-100 border-surface-200"
              />
            </div>

            <div className="text-ink-400 text-xs ml-auto shrink-0 hidden sm:block">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 min-h-96">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="spinner w-9 h-9" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-16 h-16 bg-surface-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaBuilding className="text-ink-400" size={24} />
              </div>
              <h3 className="font-bold text-ink-700 text-xl mb-2">No Projects Found</h3>
              <p className="text-ink-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${category}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filtered.map((project, i) => <ProjectCard key={project._id} project={project} index={i} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  )
}
