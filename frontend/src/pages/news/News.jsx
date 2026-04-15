import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import newsBanner1 from '../../assets/images/news_1.jpg'
import newsBanner2 from '../../assets/images/news_2.jpg'
import newsBanner3 from '../../assets/images/news_3.jpg'
import newsPost1 from '../../assets/images/news_post_1.png'
import newsPost2 from '../../assets/images/news_post_2.jpg'
import newsPost3 from '../../assets/images/news_post_3.jpg'

const API_URL = 'http://localhost:3000/api'

const bannerSlides = [
  { image: newsBanner1, heading: 'Tin tức nổi bật', desc: 'Cùng SECOM khám phá thị trường Ecommerce 2024' },
  { image: newsBanner2, heading: 'Podcast', desc: 'Đón Trung thu 2024 cùng SECOM' },
  { image: newsBanner3, heading: 'Sự kiện sắp diễn ra', desc: 'Company trip 2024' },
]

const defaultNewsPosts = [
  {
    id: 1, title: 'Sự Trỗi Dậy Của Thương Hiệu Việt Trên Thị Trường Quốc Tế',
    slug: 'su-troi-day-cua-thuong-hieu-viet-tren-thi-truong-quoc-te',
    short_description: 'Thương hiệu Việt đang ngày càng khẳng định vị thế của mình trên thị trường quốc tế. Cùng khám phá cách các doanh nghiệp Việt Nam bứt phá và thành công trên con đường toàn cầu hóa.',
    thumbnail: newsPost1, created_at: '2024-08-19', likes: 100, views: 666,
  },
  {
    id: 2, title: 'SECOM Xác Lập Kỷ Lục Đầu Tiên: Bước Tiến Vượt Bậc Trong Thương Mại Điện Tử',
    slug: 'secom-xac-lap-ky-luc-dau-tien-buoc-tien-vuot-bac-trong-thuong-mai-dien-tu',
    short_description: 'Trong thế giới thương mại điện tử đầy cạnh tranh, SECOM đã nhanh chóng khẳng định vị thế của mình bằng cách xác lập kỷ lục đầu tiên đầy ấn tượng.',
    thumbnail: newsPost2, created_at: '2024-08-19', likes: 32, views: 115,
  },
  {
    id: 3, title: '8 Kinh nghiệm Bán Hàng Trên Amazon Cùng SECOM Academy',
    slug: '8-kinh-nghiem-ban-hang-tren-amazon-cung-ttd-academy',
    short_description: 'Amazon là một "ông lớn" trong ngành thương mại điện tử với hàng triệu sản phẩm và lượng khách hàng toàn cầu khổng lồ. Nhiều doanh nghiệp Việt Nam đã gặt hái thành công ấn tượng.',
    thumbnail: newsPost3, created_at: '2024-08-19', likes: 26, views: 1137,
  },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function formatDateInput(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return String(num)
}

// ── Post Modal (Create / Edit) ──
function PostModal({ isOpen, onClose, onSave, post }) {
  const [form, setForm] = useState({
    title: '', slug: '', short_description: '', html_desc: '',
    thumbnail: '', type: 'news', podcast_url: '', active_on_home: false,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || '', slug: post.slug || '',
        short_description: post.short_description || '',
        html_desc: post.html_desc || '',
        thumbnail: post.thumbnail || '', type: post.type || 'news',
        podcast_url: post.podcast_url || '',
        active_on_home: post.active_on_home ?? false,
      })
    } else {
      setForm({
        title: '', slug: '', short_description: '', html_desc: '',
        thumbnail: '', type: 'news', podcast_url: '', active_on_home: false,
      })
    }
  }, [post, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Tiêu đề không được để trống')
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-none" onClick={onClose}>
      <div className="min-h-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-white mb-5">{post ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs text-white/50 mb-1">Tiêu đề *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500" />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs text-white/50 mb-1">Loại bài viết</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500">
                <option value="news">Tin tức</option>
                <option value="podcast">Podcast</option>
                <option value="event">Sự kiện</option>
              </select>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-xs text-white/50 mb-1">Thumbnail URL</label>
              <input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://... hoặc /upload/..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500" />
            </div>

            {/* Podcast URL (shown only for podcast type) */}
            {form.type === 'podcast' && (
              <div>
                <label className="block text-xs text-white/50 mb-1">Podcast URL</label>
                <input value={form.podcast_url} onChange={e => setForm({ ...form, podcast_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500" />
              </div>
            )}

            {/* Short description */}
            <div>
              <label className="block text-xs text-white/50 mb-1">Mô tả ngắn</label>
              <textarea rows={3} value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 resize-y" />
            </div>

            {/* HTML Content */}
            <div>
              <label className="block text-xs text-white/50 mb-1">Nội dung (HTML)</label>
              <textarea rows={8} value={form.html_desc} onChange={e => setForm({ ...form, html_desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-red-500 resize-y" />
            </div>

            {/* Active on home */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active_on_home} onChange={e => setForm({ ...form, active_on_home: e.target.checked })} className="accent-red-600" />
              <span className="text-xs text-white/60">Hiển thị trên trang chủ</span>
            </label>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-5 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">
                Hủy
              </button>
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main News Page ──
function News() {
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ROLE_ADMIN'

  const [currentSlide, setCurrentSlide] = useState(0)
  const [newsPosts, setNewsPosts] = useState(defaultNewsPosts)
  const [radioPosts, setRadioPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [email, setEmail] = useState('')

  // CRUD state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Fetch posts for display sections
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const [newsRes, radioRes] = await Promise.all([
        axios.get(`${API_URL}/posts?type=news&limit=3`),
        axios.get(`${API_URL}/posts?type=podcast&limit=3`),
      ])
      const newsData = newsRes.data.data || []
      if (newsData.length > 0) setNewsPosts(newsData)
      setRadioPosts(radioRes.data.data || [])
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    }
  }

  // Fetch all posts for admin table
  const fetchAllPosts = useCallback(async (page = 1) => {
    try {
      const res = await axios.get(`${API_URL}/posts?page=${page}&limit=10`)
      setAllPosts(res.data.data || [])
      setMeta(res.data.meta || { total: 0, page: 1, totalPages: 1 })
    } catch (err) {
      console.error('Failed to fetch all posts:', err)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) fetchAllPosts(1)
  }, [isAdmin, fetchAllPosts])

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_URL}/posts/${postId}/like`)
      fetchPosts()
    } catch (err) {
      console.error('Failed to like post:', err)
    }
  }

  const handleSubscribe = () => {
    if (email) {
      toast.success('Đăng ký thành công!')
      setEmail('')
    }
  }

  // CRUD handlers
  const handleCreate = () => {
    setEditingPost(null)
    setModalOpen(true)
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setModalOpen(true)
  }

  const handleSave = async (form) => {
    if (editingPost) {
      await axios.put(`${API_URL}/posts/${editingPost.id}`, form, { withCredentials: true })
      toast.success('Cập nhật bài viết thành công')
    } else {
      await axios.post(`${API_URL}/posts`, form, { withCredentials: true })
      toast.success('Tạo bài viết thành công')
    }
    fetchPosts()
    fetchAllPosts(meta.page)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await axios.delete(`${API_URL}/posts/${deleteId}`, { withCredentials: true })
      toast.success('Xóa bài viết thành công')
      fetchPosts()
      fetchAllPosts(meta.page)
    } catch {
      toast.error('Xóa thất bại')
    } finally {
      setDeleteId(null)
    }
  }

  const mainRadio = radioPosts[0]
  const sideRadios = radioPosts.slice(1)

  return (
    <div className="min-h-screen bg-[#111] -mt-16">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />

      <PostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        post={editingPost}
      />

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setDeleteId(null)}>
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Xóa bài viết</h3>
            <p className="text-sm text-white/50 mb-6">Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">
                Hủy
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Carousel */}
      <section className="relative w-full h-[75vh] overflow-hidden">
        {bannerSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
            </div>
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pt-16">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{slide.heading}</h1>
              <p className="text-lg md:text-2xl text-white/90 leading-relaxed">{slide.desc}</p>
            </div>
          </div>
        ))}
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-red-600 w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* News Section - Nhịp đập SECOM */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase mb-8 text-center md:text-left">
            Nhịp đập SECOM
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsPosts.map((post, idx) => (
              <NewsCard key={post.id} post={post} delay={idx * 100} onLike={handleLike} fallbackImage={[newsPost1, newsPost2, newsPost3][idx]} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/news/all"
              className="inline-block px-10 py-3 border border-red-600 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 font-medium"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      {/* Radio / Podcast Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase mb-8 text-center md:text-left">
            Radio
          </h2>

          {radioPosts.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Chưa có podcast nào.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mainRadio && (
                <div className="lg:col-span-2">
                  <Link to={`/news/${mainRadio.slug}`} className="block group">
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={mainRadio.thumbnail || newsBanner2}
                        alt={mainRadio.title}
                        className="w-full h-[300px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button className="absolute top-4 right-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-white text-lg md:text-xl font-semibold mt-4 group-hover:text-red-500 transition-colors">
                      {mainRadio.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{mainRadio.short_description}</p>
                    <PostMeta post={mainRadio} onLike={handleLike} />
                  </Link>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {sideRadios.map((post) => (
                  <Link key={post.id} to={`/news/${post.slug}`} className="flex gap-3 group">
                    <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img src={post.thumbnail || newsBanner3} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-500 transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(post.created_at)}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <HeartIcon className="w-3.5 h-3.5" /> {formatNumber(post.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <EyeIcon className="w-3.5 h-3.5" /> {formatNumber(post.views)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link to="/news/all?type=podcast"
                  className="text-red-500 hover:text-red-400 font-semibold text-sm flex items-center gap-1 mt-2">
                  Xem thêm
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Admin: Post Management Table ── */}
      {isAdmin && (
        <section className="py-12 md:py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">
                Quản lý bài viết
              </h2>
              <button onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Thêm bài viết
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-4 py-3 text-xs font-semibold text-white/60 w-12">#</th>
                    <th className="px-4 py-3 text-xs font-semibold text-white/60">Tiêu đề</th>
                    <th className="px-4 py-3 text-xs font-semibold text-white/60 w-24">Loại</th>
                    <th className="px-4 py-3 text-xs font-semibold text-white/60 w-20 text-center">Lượt xem</th>
                    <th className="px-4 py-3 text-xs font-semibold text-white/60 w-20 text-center">Thích</th>
                    <th className="px-4 py-3 text-xs font-semibold text-white/60 w-28">Ngày tạo</th>
                    <th className="px-4 py-3 text-xs font-semibold text-white/60 w-28 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {allPosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-white/40 text-sm">Chưa có bài viết nào</td>
                    </tr>
                  ) : (
                    allPosts.map((post, idx) => (
                      <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-sm text-white/40">{(meta.page - 1) * 10 + idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {post.thumbnail && (
                              <img src={post.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            )}
                            <span className="text-sm text-white font-medium line-clamp-1">{post.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            post.type === 'podcast' ? 'bg-purple-500/20 text-purple-400' :
                            post.type === 'event' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {post.type === 'podcast' ? 'Podcast' : post.type === 'event' ? 'Sự kiện' : 'Tin tức'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/60 text-center">{formatNumber(post.views)}</td>
                        <td className="px-4 py-3 text-sm text-white/60 text-center">{formatNumber(post.likes)}</td>
                        <td className="px-4 py-3 text-sm text-white/60">{formatDate(post.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(post)} title="Sửa"
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-blue-400 transition-colors">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button onClick={() => setDeleteId(post.id)} title="Xóa"
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => fetchAllPosts(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => fetchAllPosts(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      p === meta.page ? 'bg-red-600 text-white' : 'text-white/60 hover:bg-white/5'
                    }`}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => fetchAllPosts(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Subscribe Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl py-12 px-6 md:px-16">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Đăng ký nhận tin của <span className="text-white">SECOM</span>
            </h3>
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn (*)"
                className="flex-1 px-5 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={handleSubscribe}
                className="px-8 py-3 bg-white text-red-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* --- Sub-components --- */

function NewsCard({ post, delay = 0, onLike, fallbackImage }) {
  return (
    <div className="group">
      <Link to={`/news/${post.slug}`} className="block">
        <div className="rounded-xl overflow-hidden">
          <img
            src={post.thumbnail || fallbackImage || newsPost1}
            alt={post.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h3 className="text-white font-semibold text-lg mt-4 group-hover:text-red-500 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm mt-2 line-clamp-3">{post.short_description}</p>
      </Link>
      <PostMeta post={post} onLike={onLike} />
    </div>
  )
}

function PostMeta({ post, onLike }) {
  return (
    <div className="flex items-center justify-between mt-3">
      <span className="text-gray-500 text-xs">
        Ngày đăng: {formatDate(post.created_at)}
      </span>
      <div className="flex items-center gap-4 text-gray-500 text-xs">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLike(post.id) }}
          className="flex items-center gap-1 hover:text-red-500 transition-colors"
        >
          <HeartIcon className="w-4 h-4" />
          <span>{formatNumber(post.likes)}</span>
        </button>
        <span className="flex items-center gap-1">
          <EyeIcon className="w-4 h-4" />
          <span>{formatNumber(post.views)}</span>
        </span>
      </div>
    </div>
  )
}

function HeartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function EyeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  )
}

export default News