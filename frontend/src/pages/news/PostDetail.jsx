import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import newsPost1 from '../../assets/images/news_post_1.png'

const API_URL = 'http://localhost:3000/api'
const BACKEND_URL = 'http://localhost:3000'

function resolveImage(path) {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path
  return `${BACKEND_URL}${path}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return String(num)
}

function PostDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await axios.get(`${API_URL}/posts/${slug}`)
      setPost(res.data)
      // Fetch related posts
      const relatedRes = await axios.get(`${API_URL}/posts?limit=4&type=${res.data.type || ''}`)
      setRelatedPosts((relatedRes.data.data || []).filter(p => p.slug !== slug).slice(0, 4))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] pt-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#111] pt-24 text-center">
        <p className="text-white/50 text-lg">Bài viết không tồn tại</p>
        <Link to="/news" className="text-red-500 hover:text-red-400 mt-4 inline-block">Quay lại trang tin tức</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#111] pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Back to news */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors no-underline mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Quay lại trang tin tức
        </Link>

        {/* Article card */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-sm p-4 md:p-8">
          {/* Header */}
          <div className="border-b border-white/10 pb-4 mb-4">
            <h1 className="text-white text-lg md:text-xl font-medium leading-snug">{post.title}</h1>
            <div className="flex items-center justify-between mt-3">
              <div className="text-white/50 text-xs md:text-sm">
                <span className="mr-2">Ngày đăng:</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {formatNumber(post.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  {formatNumber(post.views)}
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <img
            src={resolveImage(post.thumbnail) || newsPost1}
            alt={post.title}
            className="w-full rounded-lg mb-4 object-cover"
          />

          {/* Content */}
          <div
            className="prose prose-sm md:prose-base max-w-none py-4 text-white/80 leading-relaxed"
            style={{ wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: post.html_desc }}
          />

          {/* Gallery */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {post.gallery.map((img) => (
                <img
                  key={img.id}
                  src={resolveImage(img.url)}
                  alt=""
                  className="w-full rounded-lg object-cover h-40 md:h-52"
                />
              ))}
            </div>
          )}
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-8 md:mt-10">
            <h2 className="text-white text-xl md:text-2xl font-semibold text-center mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  to={`/news/${rPost.slug}`}
                  className="group bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow no-underline"
                >
                  <div className="overflow-hidden">
                    <img
                      src={resolveImage(rPost.thumbnail) || newsPost1}
                      alt={rPost.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-500 transition-colors">
                      {rPost.title}
                    </h3>
                    <p className="text-white/50 text-xs mt-1.5 line-clamp-3">{rPost.short_description}</p>
                    <div className="flex items-center justify-between mt-3 text-white/40 text-xs">
                      <span>Ngày đăng: {formatDate(rPost.created_at)}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          {formatNumber(rPost.likes)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                          {formatNumber(rPost.views)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetail
