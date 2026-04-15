import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import secomLogo from '../../assets/images/secom_logo.png'

const SOCIALS = [
  { label: 'Facebook', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
  )},
  { label: 'LinkedIn', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
  )},
  { label: 'Instagram', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  )},
  { label: 'YouTube', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  )},
]

const NAV_LINKS = [
  { label: 'Sản phẩm', labelEn: 'Products', to: '/product' },
  { label: 'SECOM - Academy', labelEn: 'SECOM - Academy', to: '/academy' },
  { label: 'Tuyển dụng', labelEn: 'Recruitment', to: '/recruitment', badge: true },
  { label: 'SECOM-News', labelEn: 'SECOM-News', to: '/news' },
  { label: 'Liên hệ', labelEn: 'Contact', to: '/contact' },
]

function Footer() {
  const { lang } = useLanguage()
  const [email, setEmail] = useState('')
  const isEn = lang === 'en'

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setEmail('')
    }
  }

  return (
    <footer className="relative w-full bg-[#080808] overflow-hidden">
      {/* Subtle red glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,1,55,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-12 pb-8">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">

          {/* Logo & description */}
          <div className="flex flex-col gap-4">
            <img src={secomLogo} alt="SECOM" className="h-8 w-auto self-start" />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs m-0">
              {isEn
                ? 'SECOM is an outstanding enterprise in Vietnam with comprehensive benefits and a clear career development path in cross-border e-commerce.'
                : 'SECOM là doanh nghiệp xuất sắc tại Việt Nam với chính sách đãi ngộ toàn diện và lộ trình phát triển rõ ràng trong lĩnh vực thương mại điện tử xuyên biên giới.'}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/50
                             border border-white/10 hover:border-red-600/50 hover:text-white
                             hover:bg-red-950/30 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm tracking-wide m-0 mb-1">
              {isEn ? 'Categories' : 'Danh mục'}
            </h4>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-white/45 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  {isEn ? link.labelEn : link.label}
                  {link.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                      {isEn ? "we're hiring" : "we're hiring"}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm tracking-wide m-0 mb-1">
              {isEn ? 'SECOM Service Ltd Company' : 'Công ty TNHH dịch vụ SECOM'}
            </h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-white/45 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:contact@secomvn.com" className="text-white/45 hover:text-white transition-colors">contact@secomvn.com</a>
              </div>
              <div className="flex items-center gap-2 text-white/45 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                <a href="tel:+84938253801" className="text-white/45 hover:text-white transition-colors">+84.938.253.801</a>
              </div>
              <div className="flex items-start gap-2 text-white/45 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{isEn
                  ? 'XL Building, 167 Tran Nao, An Khanh Ward, Ho Chi Minh City'
                  : 'Tòa nhà XL Building, 167 Trần Não, Phường An Khánh, Thành phố Hồ Chí Minh'}</span>
              </div>
            </div>

            {/* Email subscribe */}
            <form onSubmit={handleSubscribe} className="mt-3 flex">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isEn ? 'Your email (*)' : 'Email của bạn (*)'}
                required
                className="flex-1 px-3 py-2 rounded-l-lg bg-white/5 border border-white/10 border-r-0 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
              />
              <button type="submit"
                className="px-4 py-2 rounded-r-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>

        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), rgba(255,1,55,0.15), rgba(255,255,255,0.08), transparent)' }}
        />

        {/* Bottom bar */}
        <div className="text-center">
          <p className="text-white/30 text-xs m-0">
            &copy; Copyright SECOM. All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
