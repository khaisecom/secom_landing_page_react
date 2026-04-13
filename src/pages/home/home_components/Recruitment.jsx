import { useState } from 'react'

const JOBS = [
  {
    title: 'Talent Acquisition Specialist',
    bullets: [
      'Sourcing and screening candidates across multiple platforms',
      'Conducting interviews and coordinating hiring processes',
      'Building talent pipelines for current and future hiring needs',
    ],
  },
  {
    title: 'Performance Marketing Team Leader',
    bullets: [
      'Planning & Executing PPC Strategies',
      'Managing and Optimizing PPC Campaigns',
      'Team Management and Development',
    ],
  },
  {
    title: 'Performance Marketing Specialist',
    bullets: [
      'Running paid ad campaigns on Meta, Google, TikTok',
      'Analyzing campaign data and optimizing for ROAS',
      'A/B testing creatives and landing pages',
    ],
  },
  {
    title: 'Operations Leader',
    bullets: [
      'Overseeing day-to-day operational workflows',
      'Coordinating cross-functional teams and processes',
      'Driving continuous improvement initiatives',
    ],
  },
  {
    title: 'Ecommerce Leader',
    bullets: [
      'Managing product listings and marketplace storefronts',
      'Developing growth strategies across Amazon, Etsy, TikTok',
      'Analyzing sales data and identifying optimization opportunities',
    ],
  },
]

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

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {/* Active red dot */}
          {open && (
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                background: '#FF0137',
                boxShadow: '0 0 8px rgba(255,1,55,0.7)',
              }}
            />
          )}
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
            <div key={i} className="flex items-start gap-2">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: '#FF0137' }}
              />
              <p className="text-white/55 m-0" style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}>
                {b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Section ───────────────────────────────────────────────── */
function Recruitment() {
  const [activeIndex, setActiveIndex] = useState(1)
  const [activeDot, setActiveDot]     = useState(0)

  const toggle = (i) => setActiveIndex(prev => (prev === i ? null : i))

  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20">
      <div className="max-w-3xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="inline-block mb-5 px-5 py-1.5 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            Join With Us!
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            Recruitment<br />SECOM
          </h2>

          <p className="text-white/45 max-w-lg" style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}>
            Here's what our partners say about working with us to achieve stellar growth.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {JOBS.map((job, i) => (
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
            Contact Us
          </button>
        </div>

      </div>
    </section>
  )
}

export default Recruitment
