import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '../../i18n/LanguageContext'
import jobContactImage from '../../assets/images/job-contact-image.jpg'
import recruitment1 from '../../assets/images/recruitment_1.webp'
import recruitment2 from '../../assets/images/recruitment_2.webp'
import recruitment3 from '../../assets/images/recruitment_3.webp'
import recruitment4 from '../../assets/images/recruitment_4.webp'

const RECRUITMENT_IMAGES = [recruitment1, recruitment2, recruitment3, recruitment4]

import { API_URL as BASE_API_URL } from '../../config/api'

const API_URL = `${BASE_API_URL}/jobs`

const TEMPLATE_HTML = `<h5><strong>TRÁCH NHIỆM / RESPONSIBILITIES:</strong></h5>
<ul>
  <li>Mô tả công việc chính / Main duties...</li>
  <li>Nhiệm vụ hàng ngày / Daily tasks...</li>
</ul>

<h5><strong>YÊU CẦU ỨNG VIÊN / REQUIREMENTS:</strong></h5>
<ul>
  <li>Học vấn / Education: ...</li>
  <li>Kinh nghiệm / Experience: ...</li>
  <li>Kỹ năng / Skills: ...</li>
</ul>

<h5><strong>PHÚC LỢI / BENEFITS:</strong></h5>
<ul>
  <li>Lương / Salary: ...</li>
  <li>Thưởng / Bonus: ...</li>
  <li>Bảo hiểm / Insurance: ...</li>
</ul>

<h5><strong>THỜI GIAN LÀM VIỆC / WORKING HOURS:</strong></h5>
<ul>
  <li>Thứ 2 - Thứ 6, 8:30 - 17:30</li>
</ul>

<h5><strong>NƠI LÀM VIỆC / WORKPLACE:</strong></h5>
<ul>
  <li>Địa chỉ văn phòng / Office address...</li>
</ul>`

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function formatDateInput(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

// ── Modal Form ──
function JobModal({ isOpen, onClose, onSave, job, attributes, isEn, t }) {
  const [form, setForm] = useState({
    title: '', title_en: '', description: '',
    vacancies: 1, locations: 'HCM', deadline: '',
    from_salary: 0, to_salary: 0, is_negotiable: true, is_active: true,
    attribute_ids: [],
  })
  const [saving, setSaving] = useState(false)
  const [tipsOpen, setTipsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || '', title_en: job.title_en || '',
        description: job.description || '',
        vacancies: job.vacancies || 1, locations: job.locations || 'HCM',
        deadline: formatDateInput(job.deadline),
        from_salary: job.from_salary || 0, to_salary: job.to_salary || 0,
        is_negotiable: job.is_negotiable ?? true, is_active: job.is_active ?? true,
        attribute_ids: (job.attributes || []).map(a => a.id),
      })
    } else {
      setForm({
        title: '', title_en: '', description: '',
        vacancies: 1, locations: 'HCM', deadline: '',
        from_salary: 0, to_salary: 0, is_negotiable: true, is_active: true,
        attribute_ids: [],
      })
    }
  }, [job, isOpen])

  if (!isOpen) return null

  const allAttrs = Object.entries(attributes).flatMap(([type, items]) =>
    items.map(a => ({ ...a, type }))
  )

  const toggleAttr = (id) => {
    setForm(f => ({
      ...f,
      attribute_ids: f.attribute_ids.includes(id)
        ? f.attribute_ids.filter(x => x !== id)
        : [...f.attribute_ids, id]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error(t.admin.titleRequired)
    setSaving(true)
    try {
      await onSave({
        ...form,
        vacancies: Number(form.vacancies),
        from_salary: Number(form.from_salary),
        to_salary: Number(form.to_salary),
      })
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || t.admin.saveFail)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-none" onClick={onClose}>
      <div className="min-h-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-5">{job ? t.admin.editPost : t.admin.newPost}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Title (VI) *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                placeholder="VD: Nhân viên thiết kế đồ họa"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Title (EN)</label>
              <input value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })}
                placeholder="VD: Graphic Designer"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500" />
            </div>
          </div>

          {/* Vacancies, Location, Deadline */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Vacancies</label>
              <input type="number" min="1" value={form.vacancies} onChange={e => setForm({ ...form, vacancies: e.target.value })}
                placeholder="1"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Location</label>
              <input value={form.locations} onChange={e => setForm({ ...form, locations: e.target.value })}
                placeholder="VD: HCM, HN"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500" />
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">From Salary</label>
              <input type="number" min="0" value={form.from_salary} onChange={e => setForm({ ...form, from_salary: e.target.value })}
                placeholder="VD: 8000000"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">To Salary</label>
              <input type="number" min="0" value={form.to_salary} onChange={e => setForm({ ...form, to_salary: e.target.value })}
                placeholder="VD: 15000000"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-500" />
            </div>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_negotiable} onChange={e => setForm({ ...form, is_negotiable: e.target.checked })} className="accent-red-600" />
                <span className="text-xs text-white/60">Negotiable</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-red-600" />
                <span className="text-xs text-white/60">Active</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-white/50">Description (HTML) *</span>
            <button type="button" onClick={() => setTipsOpen(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] font-medium hover:bg-yellow-500/20 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Tips
            </button>
          </div>
          <div>
            <textarea rows={8} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="<h5><strong>TRÁCH NHIỆM:</strong></h5>&#10;<ul>&#10;  <li>Mô tả công việc...</li>&#10;</ul>&#10;&#10;Bấm Tips để xem mẫu HTML"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-red-500 resize-y" />
          </div>

          {/* Tips modal */}
          {tipsOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4" onClick={() => setTipsOpen(false)}>
              <div className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    HTML Description Template
                  </h4>
                  <button type="button" onClick={() => setTipsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="p-5 max-h-[60vh] overflow-y-auto">
                  <p className="text-xs text-white/40 mb-4">Description is stored as HTML. Use the template below as a guide:</p>
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

          {/* Attributes */}
          {allAttrs.length > 0 && (
            <div>
              <label className="block text-xs text-white/50 mb-2">Attributes</label>
              <div className="flex flex-wrap gap-2">
                {allAttrs.map(attr => (
                  <button key={attr.id} type="button" onClick={() => toggleAttr(attr.id)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      form.attribute_ids.includes(attr.id)
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-white/10 text-white/50 hover:border-white/30'
                    }`}>
                    {isEn ? attr.name_en : attr.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">
              {t.admin.cancel}
            </button>
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
export default function RecruitmentPage() {
  const { lang, t } = useLanguage()
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const [jobs, setJobs] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [attributes, setAttributes] = useState({})
  const [search, setSearch] = useState('')
  const [selectedDepts, setSelectedDepts] = useState([])
  const [selectedWorkForms, setSelectedWorkForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

  // CRUD state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const isEn = lang === 'en'

  const fetchJobs = useCallback(async (page = 1) => {
    if (jobs.length === 0) setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page)
      params.set('limit', '10')
      if (search.trim()) params.set('search', search.trim())
      if (selectedDepts.length) params.set('departments', selectedDepts.join(','))
      if (selectedWorkForms.length) params.set('workForms', selectedWorkForms.join(','))

      const res = await axios.get(`${API_URL}?${params}`)
      setJobs(res.data.data)
      setMeta(res.data.meta)
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [selectedDepts, selectedWorkForms, search])

  useEffect(() => {
    axios.get(`${API_URL}/attributes`).then(res => setAttributes(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    fetchJobs(1)
  }, [fetchJobs])

  const toggleFilter = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const resetFilters = () => {
    setSelectedDepts([])
    setSelectedWorkForms([])
  }

  // CRUD handlers
  const handleCreate = () => {
    setEditingJob(null)
    setModalOpen(true)
  }

  const handleEdit = async (jobId) => {
    try {
      const res = await axios.get(`${API_URL}/${jobId}`, { withCredentials: true })
      setEditingJob(res.data)
      setModalOpen(true)
    } catch {
      toast.error(t.admin.saveFail)
    }
  }

  const handleSave = async (form) => {
    if (editingJob) {
      await axios.put(`${API_URL}/${editingJob.id}`, form, { withCredentials: true })
      toast.success(t.admin.updateSuccess)
    } else {
      await axios.post(API_URL, form, { withCredentials: true })
      toast.success(t.admin.createSuccess)
    }
    fetchJobs(meta.page)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await axios.delete(`${API_URL}/${deleteId}`, { withCredentials: true })
      toast.success(t.admin.deleteSuccess)
      fetchJobs(meta.page)
    } catch {
      toast.error(t.admin.deleteFail)
    } finally {
      setDeleteId(null)
    }
  }

  const depts = attributes.DEPARTMENT || []
  const workForms = attributes.WORK_FORM || []

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />

      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        job={editingJob}
        attributes={attributes}
        isEn={isEn}
        t={t}
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
            <h3 className="text-lg font-bold mb-2">{isEn ? 'Delete Position' : 'Xóa vị trí'}</h3>
            <p className="text-sm text-white/50 mb-6">
              {isEn ? 'Are you sure you want to delete this position? This action cannot be undone.' : 'Bạn có chắc chắn muốn xóa vị trí này? Hành động này không thể hoàn tác.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">
                {isEn ? 'Cancel' : 'Hủy'}
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                {isEn ? 'Delete' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About section */}
      <div className="py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-red-500 mb-4 text-center">
            {isEn ? 'About Us' : 'Về chúng tôi'}
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-4xl mx-auto text-center">
            {isEn
              ? 'Founded in 2017, SECOM pursues the mission: Weaving happiness into every print-on-demand product. With creativity as our core and quality as our compass, we transform ideas into inspiring designs. Under the vision "Bringing Vietnamese brands to shine globally", we move forward with passion, dedication, and the belief that creative designs leave lasting impressions.'
              : 'Thành lập năm 2017, SECOM theo đuổi sứ mệnh: Đan tặng hạnh phúc trong từng sản phẩm in ấn theo yêu cầu. Lấy sáng tạo làm cốt lõi, chất lượng làm kim chỉ nam, chúng tôi biến ý tưởng thành những thiết kế truyền cảm hứng. Dưới tầm nhìn "Mang thương hiệu Việt tỏa sáng toàn cầu", chúng tôi tiến bước với đam mê, tận tâm và niềm tin rằng những thiết kế sáng tạo để lại dấu ấn bền lâu.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:auto-rows-fr">
            <div className="aspect-4/3 md:aspect-auto rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/9hmSaD1_6hw?si=nEftRUyiyVbA28aU"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {RECRUITMENT_IMAGES.map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <img src={img} alt={`Recruitment ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job listings section */}
      <div className="py-8 md:py-16 px-4 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-center mb-8 md:mb-12">
            {isEn ? 'Open Positions' : 'Vị trí đang tuyển dụng'}
          </h2>
          {/* Search + Add */}
          <div className="flex items-center gap-3 mb-6 max-w-2xl mx-auto w-full">
            <div className="relative flex-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isEn ? 'Search position by name...' : 'Tìm kiếm vị trí theo tên...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <NavLink to="/recruitment/cv"
                  className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  {isEn ? 'Manage CV' : 'Quản lý CV'}
                </NavLink>
                <button onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {isEn ? 'Add Position' : 'Thêm vị trí'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Filter - Desktop sidebar */}
            <div className="hidden lg:block w-64 shrink-0 border border-white/10 rounded-xl p-4 bg-white/5">
              <FilterContent
                depts={depts} workForms={workForms}
                selectedDepts={selectedDepts} selectedWorkForms={selectedWorkForms}
                toggleDept={(v) => toggleFilter(selectedDepts, setSelectedDepts, v)}
                toggleWorkForm={(v) => toggleFilter(selectedWorkForms, setSelectedWorkForms, v)}
                onReset={resetFilters} isEn={isEn}
              />
            </div>

            {/* Filter - Mobile toggle */}
            <div className="lg:hidden w-full">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white/70"
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
                    <line x1="17" y1="16" x2="23" y2="16" />
                  </svg>
                  {isEn ? 'Filters' : 'Bộ lọc'}
                  {(selectedDepts.length + selectedWorkForms.length > 0) && (
                    <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedDepts.length + selectedWorkForms.length}
                    </span>
                  )}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`}>
                  <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {filterOpen && (
                <div className="mt-2 border border-white/10 rounded-xl p-4 bg-white/5">
                  <FilterContent
                    depts={depts} workForms={workForms}
                    selectedDepts={selectedDepts} selectedWorkForms={selectedWorkForms}
                    toggleDept={(v) => toggleFilter(selectedDepts, setSelectedDepts, v)}
                    toggleWorkForm={(v) => toggleFilter(selectedWorkForms, setSelectedWorkForms, v)}
                    onReset={resetFilters} isEn={isEn}
                  />
                </div>
              )}
            </div>

            {/* Job table */}
            <div className="flex-1 w-full min-w-0">
              {loading ? (
                <div className="text-center py-16 text-white/40">{isEn ? 'Loading...' : 'Đang tải...'}</div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16 text-white/40">{isEn ? 'No jobs found' : 'Không tìm thấy vị trí nào'}</div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/10">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">{isEn ? 'Position' : 'Vị trí tuyển dụng'}</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">{isEn ? 'Apply' : 'Đăng tuyển'}</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">{isEn ? 'Quantity' : 'Số lượng'}</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">{isEn ? 'Location' : 'Nơi làm việc'}</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">{isEn ? 'Deadline' : 'Hạn nộp'}</th>
                          {isAdmin && <th className="px-4 py-3 text-center text-sm font-semibold text-white/80"></th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-sm">{isEn ? (job.title_en || job.title) : job.title}</td>
                            <td className="px-4 py-3 text-center">
                              <a href={`/recruitment/${job.id}`}
                                className="inline-block px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-full transition-colors">
                                {isEn ? 'Apply' : 'Ứng tuyển'} &rarr;
                              </a>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-white/70">{job.vacancies || '—'}</td>
                            <td className="px-4 py-3 text-center text-sm text-white/70">{job.locations || '—'}</td>
                            <td className="px-4 py-3 text-center text-sm text-white/70">{formatDate(job.deadline)}</td>
                            {isAdmin && (
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => handleEdit(job.id)} title="Edit"
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                  </button>
                                  <button onClick={() => setDeleteId(job.id)} title="Delete"
                                    className="p-1.5 rounded-lg hover:bg-red-600/20 text-white/40 hover:text-red-500 transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                          <span className="text-sm font-semibold">{isEn ? (job.title_en || job.title) : job.title}</span>
                          {isAdmin && (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleEdit(job.id)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button onClick={() => setDeleteId(job.id)}
                                className="p-1.5 rounded-lg hover:bg-red-600/20 text-white/40 hover:text-red-500 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-2 flex justify-between items-center text-xs text-white/60 border-b border-white/5">
                          <span>{isEn ? 'Quantity' : 'Số lượng'}</span>
                          <span className="text-white">{job.vacancies || '—'}</span>
                        </div>
                        <div className="px-4 py-2 flex justify-between items-center text-xs text-white/60 border-b border-white/5">
                          <span>{isEn ? 'Location' : 'Nơi làm việc'}</span>
                          <span className="text-white">{job.locations || '—'}</span>
                        </div>
                        <div className="px-4 py-2 flex justify-between items-center text-xs text-white/60 border-b border-white/5">
                          <span>{isEn ? 'Deadline' : 'Hạn nộp hồ sơ'}</span>
                          <span className="text-white">{formatDate(job.deadline)}</span>
                        </div>
                        <div className="px-4 py-3 text-center">
                          <a href={`/recruitment/${job.id}`}
                            className="inline-block px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-full transition-colors">
                            {isEn ? 'Apply' : 'Ứng tuyển'} &rarr;
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {meta.totalPages > 1 && (
                    <div className="flex justify-center mt-8 gap-1">
                      <button onClick={() => fetchJobs(meta.page - 1)} disabled={meta.page <= 1}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        &lt;
                      </button>
                      {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => fetchJobs(p)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            p === meta.page ? 'bg-red-600 text-white' : 'border border-white/10 text-white/60 hover:bg-white/5'
                          }`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => fetchJobs(meta.page + 1)} disabled={meta.page >= meta.totalPages}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application info */}
      <div className="py-10 md:py-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center text-center gap-8">
          <div className="w-56 md:w-64 shrink-0">
            <img src={jobContactImage} alt="Contact" className="w-full rounded-xl object-cover" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              {isEn ? 'Application Information' : 'Thông tin ứng tuyển'}
            </h3>
            <p className="text-white/70 text-sm md:text-base mb-2">
              {isEn ? 'Send your CV to: ' : 'Gửi CV về email: '}
              <a href="mailto:hr@secomvn.com" className="text-red-500 hover:text-red-400 transition-colors">hr@secomvn.com</a>
              {isEn ? ' or ' : ' hoặc '}
              <a href="mailto:recruitment@secomvn.com" className="text-red-500 hover:text-red-400 transition-colors">recruitment@secomvn.com</a>
            </p>
            <p className="text-white/50 text-xs md:text-sm">
              {isEn
                ? 'Subject format: Position - Full Name (e.g.: MARKETING - Nguyen Van A)'
                : 'Cú pháp tiêu đề: Vị trí ứng tuyển - Họ và tên ứng viên (VD: MARKETING - Nguyễn Văn A)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterContent({ depts, workForms, selectedDepts, selectedWorkForms, toggleDept, toggleWorkForm, onReset, isEn }) {
  return (
    <>
      {depts.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-white/80 mb-2">
            {isEn ? 'Department' : 'Phòng ban'}
          </label>
          <div className="space-y-1.5">
            {depts.map((attr) => (
              <label key={attr.search_key} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={selectedDepts.includes(attr.search_key)}
                  onChange={() => toggleDept(attr.search_key)} className="accent-red-600 w-3.5 h-3.5" />
                <span className="text-xs text-white/60 group-hover:text-white transition-colors">
                  {isEn ? attr.name_en : attr.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      {workForms.length > 0 && (
        <>
          <div className="border-t border-white/10 my-3" />
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white/80 mb-2">
              {isEn ? 'Work Type' : 'Hình thức làm việc'}
            </label>
            <div className="space-y-1.5">
              {workForms.map((attr) => (
                <label key={attr.search_key} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={selectedWorkForms.includes(attr.search_key)}
                    onChange={() => toggleWorkForm(attr.search_key)} className="accent-red-600 w-3.5 h-3.5" />
                  <span className="text-xs text-white/60 group-hover:text-white transition-colors">
                    {isEn ? attr.name_en : attr.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="flex gap-2 pt-2">
        <button onClick={onReset}
          className="flex-1 py-2 text-xs rounded-full border border-white/10 text-white/60 hover:bg-white/5 transition-colors">
          {isEn ? 'Reset' : 'Đặt lại'}
        </button>
      </div>
    </>
  )
}
