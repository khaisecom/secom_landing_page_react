import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'
import topRedSun from '../../../assets/images/top_red_sun.svg'
import risingStarCup from '../../../assets/images/rising_star_cup.png'
import './Hero.css'

/* ── Static data ─────────────────────────────────────────── */
const STARS = [
  { top: '12%', left: '8%',  delay: '0s'    },
  { top: '22%', left: '30%', delay: '0.35s' },
  { top: '8%',  left: '58%', delay: '0.7s'  },
  { top: '18%', left: '78%', delay: '0.2s'  },
  { top: '32%', left: '18%', delay: '0.55s' },
  { top: '28%', left: '70%', delay: '0.9s'  },
  { top: '42%', left: '90%', delay: '0.4s'  },
  { top: '38%', left: '45%', delay: '0.15s' },
]

const STATS = [
  { target: 8,   format: n => `${n}+`,  labelKey: 'experience'  },
  { target: 200, format: n => `${n}+`,  labelKey: 'staffs'      },
  { isImage: true,                       labelKey: 'risingstar'  },
  { target: 95,  format: n => `${n}%`,  labelKey: 'satisfaction' },
  { target: 1,   format: n => `${n}M+`, labelKey: 'products'    },
]

/* Each card gets a unique red hotspot in a different corner/position */
const CARD_GRADIENTS = [
  'radial-gradient(ellipse at 15% 20%,  rgba(255,1,55,0.38) 6%, rgba(12,12,12,0.97) 99%)',
  'radial-gradient(ellipse at 80% 15%,  rgba(255,1,55,0.34) 6%, rgba(12,12,12,0.97) 99%)',
  'radial-gradient(ellipse at 50% 0%,   rgba(255,1,55,0.40) 6%, rgba(12,12,12,0.97) 99%)',
  'radial-gradient(ellipse at 10% 80%,  rgba(255,1,55,0.36) 6%, rgba(12,12,12,0.97) 99%)',
  'radial-gradient(ellipse at 88% 78%,  rgba(255,1,55,0.37) 6%, rgba(12,12,12,0.97) 99%)',
]

/* ── Counter hook ────────────────────────────────────────── */
function useCountUp(target, duration, triggered) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!triggered) return
    const start = performance.now()

    const tick = (now) => {
      const p     = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - p) * (1 - p)           // easeOutQuad
      setCount(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(tick)
      else       setCount(target)
    }
    requestAnimationFrame(tick)
  }, [triggered, target, duration])

  return count
}

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({ stat, triggered, gradient, className = '' }) {
  const count = useCountUp(stat.target ?? 0, 1500, triggered && !stat.isImage)

  return (
    <div className={`stat-card ${className}`} style={{ background: gradient }}>
      {stat.isImage ? (
        <img
          src={risingStarCup}
          alt="Amazon Rising Star 2022"
          className="h-10 w-auto object-contain"
        />
      ) : (
        <span
          className="text-white font-bold leading-none"
          style={{ fontSize: 'clamp(20px, 3vw, 48px)' }}
        >
          {stat.format(count)}
        </span>
      )}
      <span
        className="text-white/55 text-center leading-snug"
        style={{ fontSize: 'clamp(10px, 1vw, 13px)', whiteSpace: 'pre-line' }}
      >
        {stat.translatedLabel}
      </span>
    </div>
  )
}

/* ── Badge ───────────────────────────────────────────────── */
function Badge({ children }) {
  return (
    <span
      className="inline-block px-4 py-1 text-[10px] font-semibold tracking-[0.18em]
                 text-white/90 uppercase border border-red-600/40 bg-red-950/25 rounded-full"
    >
      {children}
    </span>
  )
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  const { t } = useLanguage()
  const [triggered, setTriggered] = useState(false)
  const statsRef   = useRef(null)

  /* trigger counters when stats section enters viewport */
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); io.disconnect() } },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const handleExplore = () => {
    const el = document.getElementById('network')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative w-full bg-[#0c0c0c] overflow-hidden isolate"
    >
      {/* ── Layer 1 : Stars (desktop only, hidden on small screens) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        {STARS.map((s, i) => (
          <div
            key={i}
            className="hero-star"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          />
        ))}
      </div>

      {/* ── Layer 2 : Planet SVG (absolute on md+, flows on mobile) ── */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <div className="hero-planet-wrap">
          <img src={topRedSun} alt="" className="w-full h-full block sun-flicker" style={{ objectFit: 'fill' }} />
        </div>
      </div>

      {/* ── Layer 3 : Main content ── */}
      <div
        className="relative flex flex-col items-center text-center
                   h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)] md:h-auto"
        style={{ zIndex: 3 }}
      >
        {/* ── Top 40% : headline ── */}
        <div
          className="w-full flex flex-col items-center justify-center gap-2 md:gap-5
                     pt-4 md:pt-0 mb-0 md:mb-10 px-4
                     flex-2"
        >
          <Badge>{t.hero.badge1}</Badge>
          <h1
            className="text-white font-semibold leading-[0.95] tracking-wide m-0"
            style={{ fontSize: 'clamp(38px, 6.5vw, 96px)' }}
          >
            {t.hero.title1}<br />{t.hero.title2}
          </h1>
        </div>

        {/* ── Mobile planet (sits between title and stats) ── */}
        <div
          className="flex md:hidden w-full pointer-events-none overflow-hidden -my-8 justify-center"
          aria-hidden="true"
        >
          <div className="hero-planet-wrap" style={{ width: '140%', flexShrink: 0 }}>
            <img
              src={topRedSun}
              alt=""
              className="w-full h-full block sun-flicker"
              style={{
                objectFit: 'fill',
                mask: 'radial-gradient(ellipse 70% 80% at 50% 40%, rgba(0,0,0,1) 30%, transparent 85%)',
                WebkitMask: 'radial-gradient(ellipse 70% 80% at 50% 40%, rgba(0,0,0,1) 30%, transparent 85%)',
              }}
            />
          </div>
        </div>

        {/* ── Bottom 60% : numbers ── */}
        <div
          ref={statsRef}
          className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center
                     gap-1 md:gap-4 md:pb-6 mt-0 md:mt-10 px-4
                     flex-3"
        >
          <div id="your-success" className="mt-0 md:mt-6 mb-0 md:mb-2">
            <Badge>{t.hero.badge2}</Badge>
          </div>

          <h2
            className="text-white font-semibold m-0 px-2 py-4 md:py-5"
            style={{ fontSize: 'clamp(16px, 2.4vw, 34px)' }}
          >
            {t.hero.subtitle}
          </h2>

          <p
            className="text-white/50 m-0 px-4"
            style={{ fontSize: 'clamp(11px, 1.1vw, 15px)' }}
          >
            {t.hero.desc}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 w-full mt-1 pt-3 md:pt-4">
            {STATS.map((stat, i) => (
              <StatCard
                key={i}
                stat={{ ...stat, translatedLabel: t.hero.stats[stat.labelKey] }}
                triggered={triggered}
                gradient={CARD_GRADIENTS[i]}
                className={stat.isImage ? 'col-span-2 md:col-span-1' : ''}
              />
            ))}
          </div>

          {/* Explore More */}
          <div className="w-full flex items-center justify-end gap-2 md:gap-3 mt-auto pb-6 md:pb-1 pt-2 md:pt-1 pr-2">
            <span className="text-white/65 text-xs md:text-sm font-light tracking-wide">{t.hero.explore}</span>
            <button
              onClick={handleExplore}
              aria-label="Scroll to next section"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0
                         border border-[#FF0137] bg-transparent cursor-pointer
                         transition-all duration-300 hover:translate-y-1 active:translate-y-1.5"
              style={{ boxShadow: '0 4px 18px rgba(255,1,55,0.45)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19M12 19L19 12M12 19L5 12"
                  stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
