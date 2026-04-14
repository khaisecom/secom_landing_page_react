import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '../../i18n/LanguageContext'

const API_URL = 'http://localhost:3000/api'

function stripStyles(html) {
  if (!html) return ''
  return html
    .replace(/\s*style="[^"]*"/gi, '')
    .replace(/\s*class="[^"]*"/gi, '')
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

function getAttrByType(attributes, type) {
  return attributes.filter(a => a.type === type).map(a => a.name).join(', ') || '—'
}

function getAttrByTypeEn(attributes, type) {
  return attributes.filter(a => a.type === type).map(a => a.name_en || a.name).join(', ') || '—'
}

export default function JobDetail() {
  const { id } = useParams()
  const { lang } = useLanguage()
  const isEn = lang === 'en'

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applyOpen, setApplyOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '' })
  const [cvFile, setCvFile] = useState(null)

  useEffect(() => {
    setLoading(true)
    axios.get(`${API_URL}/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (applyOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [applyOpen])

  const handleApply = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('full_name', form.full_name)
      formData.append('email', form.email)
      formData.append('phone_number', form.phone_number)
      formData.append('job_category_id', String(job.category_id || job.id))
      formData.append('location', job.locations || '')
      if (cvFile) formData.append('cv', cvFile)

      await axios.post(`${API_URL}/applications`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success(isEn ? 'Application submitted successfully!' : 'Ứng tuyển thành công!')
      setApplyOpen(false)
      setForm({ full_name: '', email: '', phone_number: '' })
      setCvFile(null)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white/40">{isEn ? 'Loading...' : 'Đang tải...'}</div>
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/40">{isEn ? 'Job not found' : 'Không tìm thấy vị trí'}</p>
        <Link to="/recruitment" className="text-red-500 hover:text-red-400 text-sm">&larr; {isEn ? 'Back to listings' : 'Quay lại danh sách'}</Link>
      </div>
    )
  }

  const salary = job.is_negotiable
    ? (isEn ? 'Negotiable' : 'Thỏa thuận')
    : (job.from_salary && job.to_salary)
      ? `${job.from_salary.toLocaleString()} - ${job.to_salary.toLocaleString()}`
      : '—'

  const infoItems = [
    { icon: 'calendar', label: isEn ? 'Deadline' : 'Hạn ứng tuyển', value: formatDate(job.deadline) },
    { icon: 'group', label: isEn ? 'Quantity' : 'Số lượng', value: job.vacancies || '—' },
    { icon: 'clock', label: isEn ? 'Work type' : 'Hình thức làm việc', value: isEn ? getAttrByTypeEn(job.attributes, 'WORK_FORM') : getAttrByType(job.attributes, 'WORK_FORM') },
    { icon: 'money', label: isEn ? 'Salary' : 'Thu nhập', value: salary },
    { icon: 'education', label: isEn ? 'Education' : 'Học vấn', value: isEn ? getAttrByTypeEn(job.attributes, 'EDUCATION') : getAttrByType(job.attributes, 'EDUCATION') },
    { icon: 'experience', label: isEn ? 'Experience' : 'Kinh nghiệm', value: isEn ? getAttrByTypeEn(job.attributes, 'EXPERIENCE') : getAttrByType(job.attributes, 'EXPERIENCE') },
  ]

  return (
    <div className="min-h-screen py-8 md:py-16 px-4">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      }} />

      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link to="/recruitment" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold mb-6 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          {isEn ? 'Back to listings' : 'Quay lại danh sách'}
        </Link>

        {/* Main card */}
        <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10">
            <h1 className="text-xl md:text-2xl font-bold mb-3">
              {isEn ? (job.title_en || job.title) : job.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-white/40 text-sm">
                {isEn ? 'Posted: ' : 'Ngày đăng: '}{formatDate(job.created_at || new Date().toISOString())}
              </span>
              <button onClick={() => setApplyOpen(true)}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
                {isEn ? 'Apply Now' : 'Ứng tuyển ngay'}
              </button>
            </div>
          </div>

          {/* Info grid */}
          <div className="p-6 md:p-8 border-b border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {infoItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <InfoIcon type={item.icon} />
                  <div>
                    <div className="text-white/40 text-xs">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="p-6 md:p-8">
            {job.description ? (
              <div
                className="max-w-none text-sm text-white/70 leading-relaxed
                  [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-sm [&_h4]:text-sm [&_h5]:text-sm [&_h6]:text-sm
                  [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold [&_h5]:font-bold [&_h6]:font-bold
                  [&_h1]:text-white/70 [&_h2]:text-white/70 [&_h3]:text-white/70 [&_h4]:text-white/70 [&_h5]:text-white/70 [&_h6]:text-white/70
                  [&_h1]:mt-6 [&_h2]:mt-6 [&_h3]:mt-4 [&_h4]:mt-4 [&_h5]:mt-4 [&_h6]:mt-4
                  [&_h1]:mb-3 [&_h2]:mb-3 [&_h3]:mb-2 [&_h4]:mb-2 [&_h5]:mb-2 [&_h6]:mb-2
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4
                  [&_li]:pl-1 [&_p]:mb-3 [&_strong]:text-white/70 [&_a]:text-red-500"
                dangerouslySetInnerHTML={{ __html: stripStyles(job.description) }}
              />
            ) : (
              <p className="text-white/40 text-sm">{isEn ? 'No description available.' : 'Chưa có mô tả chi tiết.'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-none" onClick={() => setApplyOpen(false)}>
          <div className="min-h-full flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold">{isEn ? 'Apply' : 'Ứng tuyển'}</h3>
                <button onClick={() => setApplyOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleApply} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">{isEn ? 'Full Name' : 'Họ và Tên'}</label>
                  <input type="text" required value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Nguyen Van A"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Email</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">{isEn ? 'Phone Number' : 'Số điện thoại'}</label>
                  <input type="tel" required value={form.phone_number}
                    onChange={e => setForm({ ...form, phone_number: e.target.value.replace(/[^0-9]/g, '') })}
                    pattern="[0-9]{9,11}"
                    placeholder="0123456789"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">{isEn ? 'Upload CV' : 'Tải lên CV'}</label>
                  <input type="file" accept=".doc,.docx,.pdf" required
                    onChange={e => setCvFile(e.target.files[0] || null)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-red-600 file:text-white file:cursor-pointer focus:outline-none focus:border-red-500 transition-colors" />
                  <p className="text-white/30 text-[10px] mt-1.5 uppercase leading-tight">
                    {isEn
                      ? 'Please name the file without accents. E.g.: CV_NGUYEN_THI_VAN.PDF'
                      : 'Vui lòng đặt tên file dạng không dấu. VD: CV_NGUYEN_THI_VAN.PDF'}
                  </p>
                </div>

                {/* Modal footer */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setApplyOpen(false)}
                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">
                    {isEn ? 'Cancel' : 'Hủy'}
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                    {submitting ? (isEn ? 'Submitting...' : 'Đang gửi...') : (isEn ? 'Apply' : 'Ứng tuyển')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoIcon({ type }) {
  const cls = "w-8 h-8 rounded-lg bg-red-600/15 flex items-center justify-center shrink-0"
  const svgCls = "text-red-500"
  switch (type) {
    case 'calendar': return <div className={cls}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgCls}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
    case 'group': return <div className={cls}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgCls}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
    case 'clock': return <div className={cls}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgCls}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
    case 'money': return <div className={cls}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgCls}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
    case 'education': return <div className={cls}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgCls}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /></svg></div>
    case 'experience': return <div className={cls}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgCls}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg></div>
    default: return null
  }
}
