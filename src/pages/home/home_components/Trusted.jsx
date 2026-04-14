import { useState, useEffect } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'

const TESTIMONIALS = [
  { name: 'Michael Tanaka', company: 'ZWave Inc.', initials: 'MT' },
  { name: 'Hana Sato', company: 'JTech Solutions', initials: 'HS' },
  { name: 'Sophia Martinez', company: 'ALink Media', initials: 'SM' },
  { name: 'James Chen', company: 'NovaBrand Co.', initials: 'JC' },
  { name: 'Emily Nguyen', company: 'PureLeaf Organics', initials: 'EN' },
]

const AVATAR_COLORS = [
  'linear-gradient(135deg, #FF0137 0%, #8b000f 100%)',
  'linear-gradient(135deg, #c0003f 0%, #5a0020 100%)',
  'linear-gradient(135deg, #ff4060 0%, #aa0030 100%)',
  'linear-gradient(135deg, #e00030 0%, #700015 100%)',
  'linear-gradient(135deg, #ff2050 0%, #900025 100%)',
]

/* ── Single testimonial card ────────────────────────────────── */
function TestimonialCard({ t, idx, active }) {
  const isActive = idx === active
  return (
    <div
      className="relative flex flex-col items-center transition-all duration-500"
      style={{
        paddingTop: '40px',
        width: '100%',
        opacity: isActive ? 1 : 0.55,
        transform: isActive ? 'scale(1)' : 'scale(0.93)',
        transition: 'opacity 0.4s, transform 0.4s',
      }}
    >
      {/* Avatar — protrudes from top */}
      <div
        className="absolute z-10"
        style={{ top: 0, left: '50%', transform: 'translate(-50%, 0)' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center
                     text-white text-xl font-bold select-none shrink-0"
          style={{
            background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
            boxShadow: isActive
              ? '0 0 0 3px rgba(255,255,255,0.85), 0 0 28px rgba(255,1,55,0.55)'
              : '0 0 0 2px rgba(255,255,255,0.25)',
          }}
        >
          {t.initials}
        </div>
      </div>

      {/* Card body */}
      <div
        className="w-full rounded-2xl px-6 pb-6 flex flex-col items-center text-center"
        style={{
          paddingTop: '52px',
          background: isActive
            ? 'linear-gradient(160deg, rgba(255,1,55,0.22) 0%, #1a0c10 45%, #0e0508 100%)'
            : '#140a0d',
          border: isActive
            ? '1px solid rgba(255,1,55,0.38)'
            : '1px solid rgba(255,255,255,0.07)',
          boxShadow: isActive ? '0 8px 40px rgba(255,1,55,0.18)' : 'none',
        }}
      >
        {/* Quote mark */}
        <div
          className="mb-3 text-4xl font-serif leading-none select-none"
          style={{ color: isActive ? 'rgba(255,1,55,0.55)' : 'rgba(255,255,255,0.12)' }}
        >
          "
        </div>

        <p
          className="text-white/65 leading-relaxed mb-5"
          style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}
        >
          {t.quote}
        </p>

        {/* Divider */}
        <div
          className="w-10 h-px mb-4"
          style={{
            background: isActive ? 'rgba(255,1,55,0.55)' : 'rgba(255,255,255,0.12)',
          }}
        />

        <p
          className="text-white font-semibold m-0 leading-tight"
          style={{ fontSize: 'clamp(12px, 1.1vw, 14px)' }}
        >
          {t.name}
        </p>
        <p
          className="text-white/45 m-0 mt-0.5"
          style={{ fontSize: 'clamp(10px, 0.9vw, 12px)' }}
        >
          {t.role}, {t.company}
        </p>
      </div>
    </div>
  )
}

/* ── Section ─────────────────────────────────────────────────── */
function Trusted() {
  const { t } = useLanguage()
  const [active, setActive] = useState(1)
  const total = TESTIMONIALS.length

  /* auto-advance every 4 s */
  useEffect(() => {
    const id = setInterval(() => setActive(prev => (prev + 1) % total), 4000)
    return () => clearInterval(id)
  }, [total])

  const prev = () => setActive(p => (p - 1 + total) % total)
  const next = () => setActive(p => (p + 1) % total)

  /* Visible indices: prev, active, next */
  const indices = [
    (active - 1 + total) % total,
    active,
    (active + 1) % total,
  ]

  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="inline-block mb-5 px-5 py-1.5 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            {t.trusted.badge}
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {t.trusted.title1}<br />{t.trusted.title2}
          </h2>

          <p className="text-white/45 max-w-lg" style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}>
            {t.trusted.desc}
          </p>
        </div>

        {/* Carousel — 3 cards visible */}
        <div className="relative">
          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start max-w-4xl mx-auto">
            {indices.map((tIdx, slotIdx) => (
              <TestimonialCard
                key={tIdx}
                t={{
                  ...TESTIMONIALS[tIdx],
                  quote: t.trusted.testimonials[tIdx].quote,
                  role: t.trusted.testimonials[tIdx].role,
                }}
                idx={tIdx}
                active={active}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2
                       w-9 h-9 rounded-full items-center justify-center
                       transition-all duration-200 hover:brightness-125 active:scale-90"
            style={{
              background: 'rgba(255,1,55,0.15)',
              border: '1px solid rgba(255,1,55,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={next}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2
                       w-9 h-9 rounded-full items-center justify-center
                       transition-all duration-200 hover:brightness-125 active:scale-90"
            style={{
              background: 'rgba(255,1,55,0.15)',
              border: '1px solid rgba(255,1,55,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === active ? '22px' : '10px',
                height:     '10px',
                background: i === active ? '#FF0137' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Trusted
