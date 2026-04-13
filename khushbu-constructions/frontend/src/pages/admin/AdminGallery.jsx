import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTrash, FaImage, FaTimes, FaUpload, FaTag } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const CATS = ['residential', 'commercial', 'industrial', 'infrastructure', 'team', 'other']

export default function AdminGallery() {
  const [images, setImages]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeCategory, setCategory] = useState('all')
  const [showModal, setShowModal]     = useState(false)
  const [file, setFile]               = useState(null)
  const [preview, setPreview]         = useState(null)
  const [form, setForm]               = useState({ caption: '', category: 'other' })
  const [uploading, setUploading]     = useState(false)
  const [deletingId, setDeleting]     = useState(null)

  /* ── fetch ── */
  const fetchImages = async () => {
    setLoading(true)
    try {
      const params = activeCategory !== 'all'
        ? `?category=${activeCategory}&limit=200`
        : '?limit=200'
      const { data } = await api.get(`/gallery${params}`)
      setImages(data.data)
    } catch { toast.error('Failed to load gallery') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchImages() }, [activeCategory])

  /* ── file pick / drop ── */
  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f); setPreview(URL.createObjectURL(f))
  }
  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    setFile(f); setPreview(URL.createObjectURL(f))
  }

  /* ── upload ── */
  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please select an image'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('caption', form.caption)
      fd.append('category', form.category)
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Image uploaded!')
      closeModal()
      fetchImages()
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed') }
    finally { setUploading(false) }
  }

  /* ── delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return
    setDeleting(id)
    try {
      await api.delete(`/gallery/${id}`)
      toast.success('Image deleted')
      setImages(imgs => imgs.filter(img => img._id !== id))
    } catch { toast.error('Delete failed') }
    finally { setDeleting(null) }
  }

  const openModal = () => {
    setFile(null); setPreview(null)
    setForm({ caption: '', category: 'other' })
    setShowModal(true)
  }
  const closeModal = () => setShowModal(false)

  /* ════════════════════════════════════ */
  return (
    <div>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-ink-900 text-2xl">Gallery</h1>
          <p className="text-ink-500 text-sm mt-0.5">{images.length} images</p>
        </div>
        <button onClick={openModal} className="btn-primary text-sm py-2.5 rounded-xl">
          <FaPlus size={12} /> Upload Image
        </button>
      </div>

      {/* ── Category pills ── */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto hide-scrollbar pb-1">
        {['all', ...CATS].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeCategory === cat
                ? 'bg-brand-500 text-white shadow-brand'
                : 'bg-white text-ink-500 border border-surface-300 hover:border-brand-400 hover:text-brand-600'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* ── Image Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner w-8 h-8" />
        </div>
      ) : images.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaImage className="text-ink-400" size={22} />
          </div>
          <p className="font-semibold text-ink-700 mb-1">No images yet</p>
          <p className="text-ink-400 text-sm mb-4">Upload your first gallery image</p>
          <button onClick={openModal} className="btn-primary text-sm py-2 px-5 rounded-xl mx-auto">
            <FaPlus size={11} /> Upload Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {images.map((img, i) => (
            <motion.div
              key={img._id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="relative group aspect-square rounded-xl overflow-hidden bg-surface-100 border border-surface-200 hover:border-brand-300 hover:shadow-card transition-all duration-300"
            >
              <img
                src={img.url} alt={img.caption || ''}
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2">
                {img.caption && (
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2 mb-1">{img.caption}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-lg capitalize">
                    {img.category}
                  </span>
                  <button
                    onClick={() => handleDelete(img._id)}
                    disabled={deletingId === img._id}
                    className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
                  >
                    {deletingId === img._id
                      ? <div className="spinner w-3 h-3" />
                      : <FaTrash size={10} className="text-white" />
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════
          UPLOAD MODAL — fixed flex overlay so it
          is always centred on the full viewport,
          regardless of the sidebar on the left.
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* 1. Backdrop */}
            <motion.div
              key="gallery-backdrop"
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

            {/* 2. Full-screen flex container */}
            <div
              key="gallery-wrapper"
              style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px',
                pointerEvents: 'none',
              }}
            >
              {/* 3. Modal card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit   ={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                onClick={e => e.stopPropagation()}
                style={{
                  pointerEvents: 'auto',
                  width: '100%', maxWidth: 480,
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
                    Upload Image
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
                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  <div style={{ overflowY: 'auto', flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Drop zone */}
                    <label
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      style={{
                        display: 'block',
                        border: '2px dashed #E5E5E5', borderRadius: 14,
                        overflow: 'hidden', cursor: 'pointer',
                        transition: 'border-color .2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#F59E0B'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E5E5'}
                    >
                      {preview ? (
                        <div style={{ position: 'relative' }}>
                          <img src={preview} alt="Preview"
                            style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity .2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0}
                          >
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Click to change</p>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          justifyContent: 'center', padding: '40px 24px', gap: 12,
                          background: '#FAFAFA',
                        }}>
                          <div style={{
                            width: 48, height: 48, background: '#FEF3C7', borderRadius: 14,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <FaUpload color="#D97706" size={20} />
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#374151' }}>
                              Drop image here or click to browse
                            </p>
                            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                              JPG, PNG, WebP · Max 5 MB
                            </p>
                          </div>
                        </div>
                      )}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                    </label>

                    {/* Caption */}
                    <div>
                      <label className="form-label">Caption</label>
                      <input
                        value={form.caption}
                        onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                        className="form-input"
                        placeholder="Describe this image (optional)"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FaTag size={11} color="#F59E0B" /> Category
                      </label>
                      <select
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="form-select"
                      >
                        {CATS.map(c => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex', gap: 12,
                    padding: '16px 24px', borderTop: '1px solid #F0F0F0',
                    backgroundColor: '#FAFAFA', flexShrink: 0,
                  }}>
                    <button type="button" onClick={closeModal} style={{
                      flex: 1, padding: '11px 0', borderRadius: 12,
                      border: '1.5px solid #E5E5E5', background: 'white',
                      color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    }}>Cancel</button>

                    <button type="submit" disabled={uploading || !file} style={{
                      flex: 1, padding: '11px 0', borderRadius: 12, border: 'none',
                      background: uploading || !file ? '#FCD34D' : '#F59E0B',
                      color: 'white', fontWeight: 600, fontSize: 13,
                      cursor: uploading || !file ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: !file ? 0.7 : 1,
                    }}>
                      {uploading
                        ? <><div className="spinner" style={{ width: 14, height: 14, borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> Uploading…</>
                        : <><FaUpload size={13} /> Upload Image</>
                      }
                    </button>
                  </div>
                </form>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}