import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaBuilding, FaTimes, FaUpload, FaSearch } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const EMPTY = {
  title: '', description: '', location: '', area: '',
  category: 'residential', status: 'ongoing',
  completionYear: '', client: '', featured: false, order: 0
}

export default function AdminProjects() {
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [images, setImages]       = useState([])
  const [saving, setSaving]       = useState(false)
  const [deletingId, setDeleting] = useState(null)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/projects?limit=100')
      setProjects(data.data)
    } catch { toast.error('Failed to load projects') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchProjects() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setImages([]); setShowModal(true) }
  const openEdit   = (p) => {
    setEditing(p)
    setForm({
      title: p.title, description: p.description,
      location: p.location, area: p.area,
      category: p.category, status: p.status,
      completionYear: p.completionYear || '', client: p.client || '',
      featured: p.featured || false, order: p.order || 0
    })
    setImages([])
    setShowModal(true)
  }
  const closeModal = () => setShowModal(false)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach(f => fd.append('images', f))
      if (editing) {
        await api.put(`/projects/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Project updated!')
      } else {
        await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Project created!')
      }
      closeModal(); fetchProjects()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api.delete(`/projects/${id}`)
      toast.success('Project deleted')
      setProjects(p => p.filter(x => x._id !== id))
    } catch { toast.error('Delete failed') }
    finally { setDeleting(null) }
  }

  const filtered = projects.filter(p => {
    const q = search.toLowerCase()
    return (q === '' || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
        && (statusFilter === 'all' || p.status === statusFilter)
  })

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-ink-900 text-2xl">Projects</h1>
          <p className="text-ink-500 text-sm mt-0.5">{projects.length} total</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 rounded-xl">
          <FaPlus size={12} /> Add Project
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={12} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search projects…" className="form-input pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl w-fit">
          {['all', 'ongoing', 'completed'].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500 hover:text-ink-900'
              }`}
            >{s === 'all' ? 'All' : s}</button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="spinner w-8 h-8" /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaBuilding className="text-ink-400" size={22} />
          </div>
          <p className="font-semibold text-ink-700 mb-1">No projects found</p>
          <p className="text-ink-400 text-sm mb-4">Try different filters or add a new project</p>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-5 rounded-xl mx-auto">
            <FaPlus size={11} /> Add Project
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Project</th>
                  <th className="table-head">Location</th>
                  <th className="table-head">Area</th>
                  <th className="table-head hidden md:table-cell">Category</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }} className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {p.images?.[0]
                            ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                            : <FaBuilding className="text-ink-400" size={14} />}
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900 text-sm">{p.title}</p>
                          {p.featured && <span className="text-brand-500 text-xs font-medium">★ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-ink-500 text-sm">{p.location}</td>
                    <td className="table-cell text-ink-500 text-sm">{p.area}</td>
                    <td className="table-cell hidden md:table-cell">
                      <span className="badge-gray capitalize">{p.category}</span>
                    </td>
                    <td className="table-cell">
                      <span className={p.status === 'completed' ? 'badge-green' : 'badge-amber'}>{p.status}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 flex items-center justify-center transition-colors">
                          <FaEdit size={13} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors disabled:opacity-50">
                          {deletingId === p._id ? <div className="spinner w-3.5 h-3.5" /> : <FaTrash size={12} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL  —  fixed flex overlay so it is
          always perfectly centred regardless of
          the sidebar width on the left.
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* 1. Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(3px)',
                zIndex: 9998,
              }}
            />

            {/* 2. Full-screen flex container — centres the card */}
            <div
              key="wrapper"
              style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px',
                pointerEvents: 'none',       /* let clicks reach backdrop */
              }}
            >
              {/* 3. The actual modal card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit   ={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                onClick={e => e.stopPropagation()}
                style={{
                  pointerEvents: 'auto',
                  width: '100%', maxWidth: 680,
                  maxHeight: '90vh',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                  display: 'flex', flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 24px', borderBottom: '1px solid #F0F0F0', flexShrink: 0,
                }}>
                  <h2 style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>
                    {editing ? 'Edit Project' : 'New Project'}
                  </h2>
                  <button onClick={closeModal} style={{
                    width: 32, height: 32, borderRadius: 10, border: 'none',
                    background: '#F5F5F5', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280',
                  }}>
                    <FaTimes size={14} />
                  </button>
                </div>

                {/* Scrollable body */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
                  <form id="proj-form" onSubmit={handleSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                      {/* Title */}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Title <span style={{ color: '#ef4444' }}>*</span></label>
                        <input required value={form.title}
                          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                          className="form-input" placeholder="Project title" />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="form-label">Location <span style={{ color: '#ef4444' }}>*</span></label>
                        <input required value={form.location}
                          onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                          className="form-input" placeholder="City, State" />
                      </div>

                      {/* Area */}
                      <div>
                        <label className="form-label">Area <span style={{ color: '#ef4444' }}>*</span></label>
                        <input required value={form.area}
                          onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                          className="form-input" placeholder="e.g. 5000 sq.ft." />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="form-label">Category</label>
                        <select value={form.category}
                          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                          className="form-select">
                          {['residential','commercial','industrial','infrastructure'].map(c => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                          ))}
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="form-label">Status</label>
                        <select value={form.status}
                          onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                          className="form-select">
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      {/* Client */}
                      <div>
                        <label className="form-label">Client Name</label>
                        <input value={form.client}
                          onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                          className="form-input" placeholder="Optional" />
                      </div>

                      {/* Completion Year */}
                      <div>
                        <label className="form-label">Completion Year</label>
                        <input type="number" value={form.completionYear}
                          onChange={e => setForm(f => ({ ...f, completionYear: e.target.value }))}
                          className="form-input" placeholder="e.g. 2024" min="2000" max="2030" />
                      </div>

                      {/* Description */}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Description <span style={{ color: '#ef4444' }}>*</span></label>
                        <textarea required value={form.description}
                          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                          className="form-input" style={{ resize: 'none' }} rows={4}
                          placeholder="Describe the project…" />
                      </div>

                      {/* Featured */}
                      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input type="checkbox" id="featured" checked={form.featured}
                          onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                          style={{ width: 16, height: 16, accentColor: '#F59E0B' }} />
                        <label htmlFor="featured" style={{ fontSize: 14, color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
                          Mark as Featured Project (shown on homepage)
                        </label>
                      </div>

                      {/* Image upload */}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Upload Images</label>
                        <label style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          border: '2px dashed #E5E5E5', borderRadius: 12,
                          padding: '14px 16px', cursor: 'pointer', background: '#FAFAFA',
                          transition: 'border-color .2s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#F59E0B'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E5E5'}
                        >
                          <div style={{
                            width: 36, height: 36, background: '#FEF3C7', borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <FaUpload color="#D97706" size={14} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                              {images.length > 0 ? `${images.length} file(s) selected` : 'Click to choose images'}
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>
                              JPG, PNG, WebP · Max 5 MB each
                            </p>
                          </div>
                          <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                            onChange={e => setImages(Array.from(e.target.files))} />
                        </label>

                        {images.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                            {images.map((f, i) => (
                              <div key={i} style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E5E5' }}>
                                <img src={URL.createObjectURL(f)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ))}
                          </div>
                        )}

                        {editing?.images?.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>Current images:</p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {editing.images.map(img => (
                                <div key={img._id} style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E5E5' }}>
                                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </form>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12,
                  padding: '16px 24px', borderTop: '1px solid #F0F0F0',
                  backgroundColor: '#FAFAFA', flexShrink: 0,
                }}>
                  <button onClick={closeModal} style={{
                    padding: '10px 20px', borderRadius: 12, border: '1.5px solid #E5E5E5',
                    background: 'white', color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}>Cancel</button>
                  <button form="proj-form" type="submit" disabled={saving} style={{
                    padding: '10px 24px', borderRadius: 12, border: 'none',
                    background: saving ? '#FCD34D' : '#F59E0B', color: 'white',
                    fontWeight: 600, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.8 : 1,
                  }}>
                    {saving && <div className="spinner" style={{ width: 14, height: 14, borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />}
                    {saving ? 'Saving…' : editing ? 'Update Project' : 'Create Project'}
                  </button>
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}