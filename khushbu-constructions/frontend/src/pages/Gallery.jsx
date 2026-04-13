import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { FaImage, FaExpand } from 'react-icons/fa'
import api from '../utils/api'

const categories = ['all', 'residential', 'commercial', 'industrial', 'infrastructure', 'team', 'other']

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const params = activeCategory !== 'all' ? `?category=${activeCategory}&limit=100` : '?limit=100'
        const { data } = await api.get(`/gallery${params}`)
        setImages(data.data)
      } catch { setImages([]) }
      finally { setLoading(false) }
    }
    fetch()
  }, [activeCategory])

  const openLightbox = (index) => { setLightboxIndex(index); setLightboxOpen(true) }
  const slides = images.map(img => ({ src: img.url, alt: img.caption || 'Gallery image' }))

  return (
    <div className="bg-surface-50">
      {/* Header */}
      <section className="relative py-20 bg-white border-b border-surface-200 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute left-0 top-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl -translate-y-48 -translate-x-24 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-tag">Our Work in Pictures</span>
            <h1 className="section-title text-5xl md:text-6xl">Gallery</h1>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-30 bg-white border-b border-surface-200 shadow-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-500 text-white shadow-brand'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-surface-100'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 min-h-96">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="spinner w-9 h-9" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-16 h-16 bg-surface-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaImage className="text-ink-400" size={24} />
              </div>
              <h3 className="font-bold text-ink-700 text-xl mb-2">No Images Yet</h3>
              <p className="text-ink-400 text-sm">Check back soon for gallery updates</p>
            </div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
            >
              {images.map((img, i) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={img.url}
                    alt={img.caption || 'Gallery image'}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-between p-3">
                    {img.caption && (
                      <p className="text-white text-xs font-medium leading-tight line-clamp-2">{img.caption}</p>
                    )}
                    <div className="ml-auto shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <FaExpand size={12} className="text-white" />
                    </div>
                  </div>
                  {img.category !== 'other' && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="badge bg-white/90 text-ink-600 text-xs capitalize shadow-sm">{img.category}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
      />
    </div>
  )
}
