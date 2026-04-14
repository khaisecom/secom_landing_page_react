import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'
import { login, register } from '../../store/authSlice.js'

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
)

const CheckIcon = ({ pass }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={pass ? 'text-green-500' : 'text-red-500'}>
    {pass
      ? <polyline points="20 6 9 17 4 12" />
      : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
    }
  </svg>
)

export default function Admin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const passwordMin6 = form.password.length >= 6

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'password' ? value.replace(/\s/g, '') : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!emailValid || !passwordMin6) return
    setLoading(true)

    try {
      const action = isLogin ? login(form) : register(form)
      const result = await dispatch(action).unwrap()

      toast.success(
        isLogin
          ? `Welcome back, ${result.email}!`
          : `Account created successfully!`
      )

      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      toast.error(err || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setForm({ email: '', password: '' })
    setShowPassword(false)
    setSubmitted(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <div className="w-full max-w-md">
        <div className="border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-white/50 text-sm">
              {isLogin
                ? 'Enter your credentials to access the admin panel'
                : 'Register a new account to get started'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
              />
              {submitted && !emailValid && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <CheckIcon pass={false} />
                  <span className="text-xs text-red-500">
                    Valid email address
                  </span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {submitted && !passwordMin6 && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <CheckIcon pass={false} />
                  <span className="text-xs text-red-500">
                    Min 6 characters
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Please wait...'
                : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center text-sm text-white/50">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="text-red-500 hover:text-red-400 font-medium transition-colors"
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
