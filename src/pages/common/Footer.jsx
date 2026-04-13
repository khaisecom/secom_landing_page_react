const NAV_LINKS = ['Home', 'About', 'Services', 'Recruitment', 'News', 'Contact Us']

function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6">

        {/* Nav links row */}
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 mb-4">
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href="#"
              className="text-white/55 text-sm hover:text-white transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Copyright */}
          <p className="text-white/35 text-xs m-0">
            © Copyright SECOM. All Rights Reserved
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/45 text-xs hover:text-white transition-colors duration-200">
              Term of Service
            </a>
            <a href="#" className="text-white/45 text-xs hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
