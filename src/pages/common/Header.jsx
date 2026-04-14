import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import secomLogo from '../../assets/images/secom_logo.png'
import vietnamFlag from '../../assets/images/VietNam_flag.png'

const navLinks = [
  { label: 'Home', to: '/home' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Recruitment', to: '/recruitment' },
  { label: 'News', to: '/news' },
  { label: 'Contact Us', to: '/contact' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="w-full bg-[#0e0e0e] border-b border-white/5 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/home">
          <img src={secomLogo} alt="Secom" className="h-8 w-auto" />
        </NavLink>

        {/* Nav Links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
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
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full border border-red-600/60 bg-red-950/40 hover:bg-red-900/50 transition-colors duration-200">
            <span className="text-white font-semibold text-sm tracking-wider">VIE</span>
            <img src={vietnamFlag} alt="Vietnam flag" className="h-4 w-auto rounded-sm" />
          </button>

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
          {navLinks.map(({ label, to }) => (
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
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
