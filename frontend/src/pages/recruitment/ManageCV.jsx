import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '../../i18n/LanguageContext'

import { API_URL, BACKEND_URL } from '../../config/api'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function ManageCV() {
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const { t } = useLanguage()

  const [applications, setApplications] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  const fetchApplications = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page)
      params.set('limit', '10')
      if (search.trim()) params.set('search', search.trim())
      const res = await axios.get(`${API_URL}/applications?${params}`, { withCredentials: true })
      setApplications(res.data.data || [])
      setMeta(res.data.meta || { total: 0, page: 1, totalPages: 1 })
    } catch {
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    if (isAdmin) fetchApplications(1)
  }, [isAdmin, fetchApplications])

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await axios.delete(`${API_URL}/applications/${deleteId}`, { withCredentials: true })
      toast.success(t.manageCV.deleteSuccess)
      fetchApplications(meta.page)
    } catch {
      toast.error(t.manageCV.deleteFail)
    } finally {
      setDeleteId(null)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#111] pt-24 text-center">
        <p className="text-white/50 text-lg">{t.manageCV.noAccess}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#111] pt-20 pb-16">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      }} />
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
            <h3 className="text-lg font-bold text-white mb-2">{t.manageCV.deleteRecord}</h3>
            <p className="text-sm text-white/50 mb-6">{t.manageCV.deleteConfirm}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">{t.manageCV.cancel}</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">{t.manageCV.delete}</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Back button */}
        <Link to="/recruitment"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors no-underline mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t.manageCV.backToRecruitment}
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white uppercase">{t.manageCV.title}</h1>
            <p className="text-white/40 text-sm mt-1">{meta.total} {t.manageCV.applications}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.manageCV.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 py-3 text-xs font-semibold text-white/60 w-12">#</th>
                  <th className="px-4 py-3 text-xs font-semibold text-white/60">{t.manageCV.fullName}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-white/60">{t.manageCV.email}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-white/60">{t.manageCV.phone}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-white/60">{t.manageCV.position}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-white/60 w-28">{t.manageCV.date}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-white/60 w-28 text-center">{t.manageCV.actions}</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/40 text-sm">{t.manageCV.noApplications}</td>
                  </tr>
                ) : (
                  applications.map((app, idx) => (
                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-white/40">{(meta.page - 1) * 10 + idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{app.full_name}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{app.email}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{app.phone_number}</td>
                      <td className="px-4 py-3">
                        {app.job_category ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">
                            {app.job_category}
                          </span>
                        ) : (
                          <span className="text-xs text-white/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{formatDate(app.application_date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {app.cv_url ? (
                            <button
                              onClick={() => {
                                window.open(`${BACKEND_URL}${app.cv_url}`, '_blank')
                              }}
                              title="Tải CV"
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-green-400 transition-colors"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </button>
                          ) : (
                            <span className="p-1.5 text-white/20">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </span>
                          )}
                          <button
                            onClick={() => setDeleteId(app.id)}
                            title="Xóa"
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                          >
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
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => fetchApplications(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {t.manageCV.prev}
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => fetchApplications(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === meta.page ? 'bg-red-600 text-white' : 'text-white/60 hover:bg-white/5'
                }`}>
                {p}
              </button>
            ))}
            <button
              onClick={() => fetchApplications(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {t.manageCV.next}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageCV
