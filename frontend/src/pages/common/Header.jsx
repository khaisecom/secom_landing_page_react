import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice.js'
import { useLanguage } from '../../i18n/LanguageContext'
import secomLogo from '../../assets/images/secom_logo.png'
import vietnamFlag from '../../assets/images/VietNam_flag.png'
import chinaFlag from '../../assets/images/China_flag.svg.png'
import ukFlag from '../../assets/images/United_Kingdom_flag.svg'

const LANGUAGES = [
  { code: 'en', label: 'ENG', flag: ukFlag },
  { code: 'vi', label: 'VIE', flag: vietnamFlag },
  { code: 'zh', label: '中文', flag: chinaFlag },
]

const NAV_KEYS = [
  { key: 'home', to: '/' },
  { key: 'product', to: '/product' },
  { key: 'services', to: '/services' },
  { key: 'recruitment', to: '/recruitment' },
  { key: 'news', to: '/news' },
  { key: 'contact', to: '/contact' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading } = useSelector((state) => state.auth)

  const currentLang = LANGUAGES.find(l => l.code === lang)

  const handleLangSelect = (code) => {
    setLang(code)
    setLangOpen(false)
  }

  const handleLogout = async () => {
    await dispatch(logout())
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="w-full bg-[#0e0e0e] border-b border-white/5 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/">
          <img src={secomLogo} alt="Secom" className="h-8 w-auto" />
        </NavLink>

        {/* Nav Links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_KEYS.map(({ key, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'relative text-white font-semibold text-sm tracking-wide nav-active'
                  : 'relative text-gray-400 font-medium text-sm tracking-wide hover:text-white transition-colors duration-200'
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 -inset-x-4 -inset-y-2 rounded-full bg-red-700/25 blur-md -z-10" />
                  )}
                  {t.nav[key]}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side — desktop only */}
        <div className="hidden md:flex items-center gap-3">
          {/* Logout button */}
          {!loading && user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-red-600/20 hover:border-red-600/40 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-600/60 bg-red-950/40 hover:bg-red-900/50 transition-colors duration-200"
            >
              <span className="text-white font-semibold text-sm tracking-wider">{currentLang.label}</span>
              {currentLang.flag && (
                <img src={currentLang.flag} alt="" className="h-4 w-auto rounded-sm" />
              )}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                   className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-lg border border-white/10 bg-[#1a1a1a] overflow-hidden shadow-xl">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => handleLangSelect(l.code)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200
                               ${lang === l.code ? 'text-white bg-red-950/50' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                  >
                    {l.flag && <img src={l.flag} alt="" className="h-3.5 w-auto rounded-sm" />}
                    <span>{l.label}</span>
                    {lang === l.code && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="ml-auto">
                        <path d="M20 6L9 17L4 12" stroke="#FF0137" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

      </div>

      {/* Overlay to close mobile menu when clicking outside */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[-1] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[#0e0e0e] border-t border-white/5 ${menuOpen ? 'max-h-[500px]' : 'max-h-0'}`}
      >
        <nav className="flex flex-col px-6 py-4 gap-3">
          {NAV_KEYS.map(({ key, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-semibold text-sm tracking-wide py-2'
                  : 'text-gray-400 font-medium text-sm tracking-wide py-2 hover:text-white transition-colors duration-200'
              }
            >
              {t.nav[key]}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-6 border-t border-white/10" />

        {/* Language selector in sidebar */}
        <div className="px-6 py-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Language</p>
          <div className="flex gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { handleLangSelect(l.code); setMenuOpen(false) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors duration-200
                           ${lang === l.code
                             ? 'bg-red-950/50 border border-red-600/60 text-white'
                             : 'border border-white/10 text-white/60 hover:text-white hover:border-white/30'}`}
              >
                {l.flag && <img src={l.flag} alt="" className="h-3.5 w-auto rounded-sm" />}
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout in sidebar */}
        {!loading && user && (
          <>
            <div className="mx-6 border-t border-white/10" />
            <div className="px-6 py-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-600/40 bg-red-950/20 hover:bg-red-600/20 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
