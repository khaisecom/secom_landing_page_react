import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import newsPost1 from '../../assets/images/news_post_1.png'
import { useLanguage } from '../../i18n/LanguageContext'

import { API_URL, BACKEND_URL } from '../../config/api'

const TEMPLATE_HTML = `<h3>Tiêu đề phần 1</h3>
<p>Nội dung đoạn văn ở đây...</p>
<p>Có thể dùng <strong>chữ đậm</strong> và <em>chữ nghiêng</em> trong đoạn văn.</p>

<h3>Tiêu đề phần 2</h3>
<ul>
  <li>Điểm nổi bật 1</li>
  <li>Điểm nổi bật 2</li>
  <li>Điểm nổi bật 3</li>
</ul>

<h3>Chèn ảnh</h3>
<img src="/upload/ten-anh.jpg" />

<h3>Liên kết</h3>
<p>Truy cập <a href="https://secomvn.com">trang web SECOM</a> để biết thêm.</p>

<hr />

<h3>Kết luận</h3>
<p>Nội dung kết luận...</p>`

function resolveImage(path) {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path
  return `${BACKEND_URL}${path}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return String(num)
}

// ── Post Modal ──
function PostModal({ isOpen, onClose, onSave, post, t }) {
  const [form, setForm] = useState({
    title: '', short_description: '', html_desc: '',
    thumbnail: '', type: 'news', podcast_url: '', active_on_home: false,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [tipsOpen, setTipsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || '', short_description: post.short_description || '',
        html_desc: post.html_desc || '', thumbnail: post.thumbnail || '',
        type: post.type || 'news', podcast_url: post.podcast_url || '',
        active_on_home: post.active_on_home ?? false,
      })
      setPreviewUrl(post.thumbnail ? resolveImage(post.thumbnail) : null)
    } else {
      setForm({
        title: '', short_description: '', html_desc: '',
        thumbnail: '', type: 'news', podcast_url: '', active_on_home: false,
      })
      setPreviewUrl(null)
    }
  }, [post, isOpen])

  if (!isOpen) return null

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post(`${API_URL}/posts/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm(f => ({ ...f, thumbnail: res.data.url }))
      toast.success(t.admin.uploadSuccess)
    } catch {
      toast.error(t.admin.uploadFail)
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error(t.admin.titleRequired)
    if (!form.type) return toast.error(t.admin.typeRequired)
    if (!form.thumbnail) return toast.error(t.admin.thumbnailRequired)
    if (!form.short_description.trim()) return toast.error(t.admin.shortDescRequired)
    if (!form.html_desc.trim()) return toast.error(t.admin.contentRequired)
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || t.admin.saveFail)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain" onClick={onClose}>
      <div className="min-h-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-white mb-5">{post ? t.admin.editPost : t.admin.newPost}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Tiêu đề *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                placeholder="VD: SECOM ra mắt sản phẩm mới 2024"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Loại bài viết *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500">
                <option value="news" className="bg-[#1a1a1a] text-white">{t.allNews.newsLabel}</option>
                <option value="podcast" className="bg-[#1a1a1a] text-white">{t.allNews.podcast}</option>
                <option value="event" className="bg-[#1a1a1a] text-white">{t.allNews.event}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Ảnh thumbnail *</label>
              <div className="flex items-center gap-4">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                )}
                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {uploading ? t.admin.uploading : t.admin.selectImage}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
            {form.type === 'podcast' && (
              <div>
                <label className="block text-xs text-white/50 mb-1">Podcast URL</label>
                <input value={form.podcast_url} onChange={e => setForm({ ...form, podcast_url: e.target.value })}
                  placeholder="VD: https://open.spotify.com/episode/..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500" />
              </div>
            )}
            <div>
              <label className="block text-xs text-white/50 mb-1">Mô tả ngắn *</label>
              <textarea rows={3} value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} required
                placeholder="Tóm tắt ngắn gọn nội dung bài viết, hiển thị ở danh sách tin tức..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500 resize-y" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-xs text-white/50">Nội dung (HTML) *</label>
                <button type="button" onClick={() => setTipsOpen(true)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] font-medium hover:bg-yellow-500/20 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Tips
                </button>
              </div>
              <textarea rows={8} value={form.html_desc} onChange={e => setForm({ ...form, html_desc: e.target.value })} required
                placeholder="<h3>Tiêu đề</h3>&#10;<p>Nội dung bài viết...</p>&#10;&#10;Bấm Tips để xem mẫu HTML"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-red-500 resize-y" />

              {tipsOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4 overflow-y-auto overscroll-contain" onClick={() => setTipsOpen(false)}>
                  <div className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        HTML Template
                      </h4>
                      <button type="button" onClick={() => setTipsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-5 max-h-[60vh] overflow-y-auto">
                      <p className="text-xs text-white/40 mb-4">Nội dung bài viết sử dụng HTML. Copy mẫu bên dưới để bắt đầu.<br/>Ngoài ra có thể dùng: <code className="text-white/60">&lt;strong&gt;</code> chữ đậm, <code className="text-white/60">&lt;em&gt;</code> chữ nghiêng, <code className="text-white/60">&lt;img src="..."&gt;</code> chèn ảnh, <code className="text-white/60">&lt;hr&gt;</code> đường kẻ ngang, <code className="text-white/60">&lt;a href="..."&gt;</code> liên kết.</p>
                      <div className="relative">
                        <button type="button" onClick={() => {
                          navigator.clipboard.writeText(TEMPLATE_HTML)
                          toast.success(t.admin.copiedTemplate)
                        }}
                          className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[10px] text-white/50 hover:bg-white/20 hover:text-white transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </button>
                        <pre className="text-[11px] text-white/60 leading-relaxed whitespace-pre-wrap font-mono bg-white/5 rounded-lg p-4 pr-20 border border-white/10">{TEMPLATE_HTML}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active_on_home} onChange={e => setForm({ ...form, active_on_home: e.target.checked })} className="accent-red-600" />
              <span className="text-xs text-white/60">{t.admin.showOnHome}</span>
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-5 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">{t.admin.cancel}</button>
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                {saving ? t.admin.saving : t.admin.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──
function AllNews() {
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()

  const [posts, setPosts] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '')
  const [loading, setLoading] = useState(true)

  // CRUD
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page)
      params.set('limit', '9')
      if (search.trim()) params.set('search', search.trim())
      if (typeFilter) params.set('type', typeFilter)
      const res = await axios.get(`${API_URL}/posts?${params}`)
      setPosts(res.data.data || [])
      setMeta(res.data.meta || { total: 0, page: 1, totalPages: 1 })
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const handleCreate = () => { setEditingPost(null); setModalOpen(true) }
  const handleEdit = (post) => { setEditingPost(post); setModalOpen(true) }

  const handleSave = async (form) => {
    if (editingPost) {
      await axios.put(`${API_URL}/posts/${editingPost.id}`, form, { withCredentials: true })
      toast.success(t.admin.updateSuccess)
    } else {
      await axios.post(`${API_URL}/posts`, form, { withCredentials: true })
      toast.success(t.admin.createSuccess)
    }
    fetchPosts(meta.page)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await axios.delete(`${API_URL}/posts/${deleteId}`, { withCredentials: true })
      toast.success(t.admin.deleteSuccess)
      fetchPosts(meta.page)
    } catch {
      toast.error(t.admin.deleteFail)
    } finally {
      setDeleteId(null)
    }
  }

  const TYPE_LABELS = { news: t.allNews.newsLabel, podcast: t.allNews.podcast, event: t.allNews.event }

  return (
    <div className="min-h-screen bg-[#111] pt-20 pb-16">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      }} />

      <PostModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} post={editingPost} t={t} />

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 overflow-y-auto overscroll-contain" onClick={() => setDeleteId(null)}>
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.allNews.deletePost}</h3>
            <p className="text-sm text-white/50 mb-6">{t.allNews.deleteConfirm}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">{t.allNews.cancel}</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">{t.allNews.delete}</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Back link */}
        <Link to="/news"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t.allNews.backToNews}
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white uppercase">{t.allNews.allPosts}</h1>
            <p className="text-white/40 text-sm mt-1">{meta.total} {t.allNews.posts}</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.allNews.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['', 'news', 'podcast', 'event'].map(ft => (
              <button
                key={ft}
                onClick={() => setTypeFilter(ft)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  typeFilter === ft
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {ft === '' ? t.allNews.all : TYPE_LABELS[ft]}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">{t.allNews.noPosts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="group relative">
                <Link to={`/news/${post.slug}`} className="block">
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={resolveImage(post.thumbnail) || newsPost1}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        post.type === 'podcast' ? 'bg-purple-500/20 text-purple-400' :
                        post.type === 'event' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {TYPE_LABELS[post.type] || t.allNews.newsLabel}
                      </span>
                      <span className="text-white/30 text-xs">{formatDate(post.created_at)}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-red-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">{post.short_description}</p>
                  </div>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-white/30 text-xs">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {formatNumber(post.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                      {formatNumber(post.views)}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(post)} title="Sửa"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-blue-400 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteId(post.id)} title="Xóa"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-red-400 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => fetchPosts(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {t.allNews.prev}
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => fetchPosts(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === meta.page ? 'bg-red-600 text-white' : 'text-white/60 hover:bg-white/5'
                }`}>
                {p}
              </button>
            ))}
            <button
              onClick={() => fetchPosts(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {t.allNews.next}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default AllNews
