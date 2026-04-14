import { useState } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'

/* ── Chevron icon ──────────────────────────────────────────── */
function Chevron({ open }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      className="shrink-0 transition-transform duration-300"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Single accordion item ─────────────────────────────────── */
function JobItem({ job, open, onToggle }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: open
          ? 'linear-gradient(135deg, rgba(255,1,55,0.18) 0%, #1a0c10 60%)'
          : '#140a0d',
        border: open
          ? '1px solid rgba(255,1,55,0.35)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: open ? '0 4px 24px rgba(255,1,55,0.12)' : 'none',
      }}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span
          className="font-semibold transition-colors duration-200"
          style={{
            fontSize: 'clamp(13px, 1.1vw, 15px)',
            color: open ? '#fff' : 'rgba(255,255,255,0.8)',
          }}
        >
          {job.title}
        </span>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 transition-all duration-300"
          style={{
            border: open ? '1px solid rgba(255,1,55,0.5)' : '1px solid rgba(255,255,255,0.15)',
            background: open ? 'rgba(255,1,55,0.15)' : 'transparent',
          }}
        >
          <Chevron open={open} />
        </div>
      </button>

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '200px' : '0px' }}
      >
        <div className="px-5 pb-5 flex flex-col gap-1.5">
          {job.bullets.map((b, i) => (
            <p key={i} className="text-white/55 m-0" style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}>
              {b}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Section ───────────────────────────────────────────────── */
function Recruitment() {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(1)
  const [activeDot, setActiveDot]     = useState(0)

  const toggle = (i) => setActiveIndex(prev => (prev === i ? null : i))

  return (
    <section className="relative bg-[#0c0c0c] py-14 md:py-20 overflow-hidden">
      {/* Floating blur red dots */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '300px', height: '300px',
          top: '10%', left: '-5%',
          background: 'radial-gradient(circle, rgba(255,1,55,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float-dot-1 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '200px', height: '200px',
          top: '50%', right: '-3%',
          background: 'radial-gradient(circle, rgba(255,1,55,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float-dot-2 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '250px', height: '250px',
          bottom: '5%', left: '30%',
          background: 'radial-gradient(circle, rgba(255,1,55,0.12) 0%, transparent 70%)',
          filter: 'blur(55px)',
          animation: 'float-dot-3 12s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="inline-block mb-5 px-5 py-1.5 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            {t.recruitment.badge}
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {t.recruitment.title}<br />SECOM
          </h2>

          <p className="text-white/45 max-w-lg" style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}>
            {t.recruitment.desc}
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {t.recruitment.jobs.map((job, i) => (
            <JobItem
              key={i}
              job={job}
              open={activeIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <button
              key={i}
              onClick={() => setActiveDot(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === activeDot ? '22px' : '10px',
                height:     '10px',
                background: i === activeDot ? '#FF0137' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        {/* Contact Us CTA */}
        <div className="flex justify-center mt-8">
          <button
            className="px-8 py-2.5 rounded-full text-white font-semibold text-sm
                       tracking-wide transition-all duration-300 hover:brightness-110
                       active:scale-95"
            style={{
              background: '#FF0137',
              boxShadow:  '0 4px 20px rgba(255,1,55,0.40)',
            }}
          >
            {t.recruitment.contactUs}
          </button>
        </div>

      </div>
    </section>
  )
}

export default Recruitment
