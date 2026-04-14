import { useState } from 'react'
import { NavLink } from 'react-router-dom'
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
  { key: 'about', to: '/about' },
  { key: 'services', to: '/services' },
  { key: 'recruitment', to: '/recruitment' },
  { key: 'news', to: '/news' },
  { key: 'contact', to: '/contact' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()

  const currentLang = LANGUAGES.find(l => l.code === lang)

  const handleLangSelect = (code) => {
    setLang(code)
    setLangOpen(false)
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full border border-red-600/60 bg-red-950/40 hover:bg-red-900/50 transition-colors duration-200"
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

            {/* Dropdown */}
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

      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[#0e0e0e] border-t border-white/5 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}
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
      </div>
    </header>
  )
}

export default Header
