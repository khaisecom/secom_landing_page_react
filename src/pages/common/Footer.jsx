import { useLanguage } from '../../i18n/LanguageContext'
import secomLogo from '../../assets/images/secom_logo.png'

const NAV_KEYS = ['home', 'about', 'services', 'recruitment', 'news', 'contact']

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

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative w-full bg-[#080808] overflow-hidden">
      {/* Subtle red glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,1,55,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-12 pb-8">

        {/* Top section: Logo + Nav + Socials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">

          {/* Logo & tagline */}
          <div className="flex flex-col gap-4">
            <img src={secomLogo} alt="SECOM" className="h-8 w-auto self-start" />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs m-0">
              Pioneering global e-commerce, bringing Vietnamese brands to the world.
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

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm tracking-wide m-0 mb-1">Quick Links</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {NAV_KEYS.map(key => (
                <a
                  key={key}
                  href="#"
                  className="text-white/45 text-sm hover:text-white transition-colors duration-200"
                >
                  {t.nav[key]}
                </a>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm tracking-wide m-0 mb-1">{t.nav.contact}</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white/45 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>contact@secom.vn</span>
              </div>
              <div className="flex items-center gap-2 text-white/45 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                <span>+84 28 1234 5678</span>
              </div>
              <div className="flex items-start gap-2 text-white/45 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), rgba(255,1,55,0.15), rgba(255,255,255,0.08), transparent)' }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs m-0">
            {t.footer.copyright}
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-white/35 text-xs hover:text-white/70 transition-colors duration-200">
              {t.footer.terms}
            </a>
            <a href="#" className="text-white/35 text-xs hover:text-white/70 transition-colors duration-200">
              {t.footer.privacy}
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
