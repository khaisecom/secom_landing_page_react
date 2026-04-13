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
  return (
    <header className="w-full bg-[#0e0e0e] border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/home">
          <img src={secomLogo} alt="Secom" className="h-8 w-auto" />
        </NavLink>

        {/* Nav Links */}
        <nav className="flex items-center gap-8">
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

        {/* Language Toggle */}
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-600/60 bg-red-950/40 hover:bg-red-900/50 transition-colors duration-200">
          <span className="text-white font-semibold text-sm tracking-wider">VIE</span>
          <img src={vietnamFlag} alt="Vietnam flag" className="h-4 w-auto rounded-sm" />
        </button>

      </div>
    </header>
  )
}

export default Header
