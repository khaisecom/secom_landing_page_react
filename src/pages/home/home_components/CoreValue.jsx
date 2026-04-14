import secomLogo from '../../../assets/images/secom_logo.png'
import { useLanguage } from '../../../i18n/LanguageContext'

/* Shared gradient: dark top → red bottom */
const CARD_GRADIENT = 'linear-gradient(to bottom, #0a0a0a 0%, #170810 52%, rgba(160,0,30,0.72) 100%)'
const CARD_BORDER   = '1px solid rgba(255,1,55,0.32)'
const CARD_SHADOW   = '0 0 24px rgba(255,1,55,0.12)'

/*
 Symmetric layout:
        [1 Integrity]
[2 Resp]  ●SECOM●  [4 Learning]
 [3 Collab]      [5 Creativity]

 line.x2/y2 = SVG coords (viewBox 0-100, preserveAspectRatio:none)
 targeting badge center at bottom of each card.
 Cards are ~200px wide, ~120px tall → ~22% of ~550px container height.
*/
const VALUES = [
  {
    num: 1,
    cardPos: { top: '2%', left: '50%', transform: 'translateX(-50%)' },
    align: 'center',
    line:  { x2: 50, y2: 25 },   // badge at bottom-center of top card
  },
  {
    num: 2,
    cardPos: { top: '32%', left: '1%' },
    align: 'left',
    line:  { x2: 10, y2: 55 },   // badge bottom-center of left-mid card
  },
  {
    num: 3,
    cardPos: { top: '63%', left: '1%' },
    align: 'left',
    line:  { x2: 10, y2: 86 },   // badge bottom-center of bottom-left card
  },
  {
    num: 4,
    cardPos: { top: '32%', right: '1%' },
    align: 'right',
    line:  { x2: 90, y2: 55 },   // mirror of value 2
  },
  {
    num: 5,
    cardPos: { top: '63%', right: '1%' },
    align: 'right',
    line:  { x2: 90, y2: 86 },   // mirror of value 3
  },
]

/* ── Shared card (badge protrudes from bottom) ─────────────── */
function ValueCard({ v, title, desc, textAlign }) {
  const align = textAlign ?? v.align
  return (
    <div className="relative" style={{ paddingBottom: '14px' }}>
      {/* Card body */}
      <div
        className="rounded-xl p-4"
        style={{
          background: CARD_GRADIENT,
          border:     CARD_BORDER,
          boxShadow:  CARD_SHADOW,
        }}
      >
        {/* bottom-edge red shine */}
        <div
          className="absolute bottom-3.5 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,1,55,0.55), transparent)' }}
        />
        <h3
          className="text-white font-semibold text-sm mb-1.5 m-0 leading-snug"
          style={{ textAlign: align }}
        >
          {title}
        </h3>
        <p
          className="text-white/50 leading-relaxed m-0"
          style={{ fontSize: '11px', textAlign: align }}
        >
          {desc}
        </p>
      </div>

      {/* Number badge — sits at bottom center, half outside card */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center
                     text-white text-xs font-bold select-none"
          style={{
            background: '#FF0137',
            boxShadow:  '0 0 14px rgba(255,1,55,0.65)',
          }}
        >
          {v.num}
        </div>
      </div>
    </div>
  )
}

/* ── Desktop spider diagram ─────────────────────────────────── */
function Diagram() {
  const { t } = useLanguage()
  return (
    <div
      className="relative w-full"
      style={{ height: 'clamp(500px, 62vh, 700px)' }}
    >
      {/* SVG connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {VALUES.map(v => (
          <line
            key={v.num}
            x1="50" y1="48"
            x2={v.line.x2} y2={v.line.y2}
            stroke="rgba(255,1,55,0.38)"
            strokeWidth="0.28"
          />
        ))}
      </svg>

      {/* Center SECOM glow circle */}
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ top: '48%', left: '50%' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: 'radial-gradient(circle, #ff0137 0%, #8b000f 60%, #3a0008 100%)',
            boxShadow:  '0 0 52px rgba(255,1,55,0.72), 0 0 14px rgba(255,1,55,0.4) inset',
          }}
        >
          <img
            src={secomLogo} alt="SECOM"
            className="w-12 h-auto object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>

      {/* Value cards — positioned absolutely */}
      {VALUES.map((v, i) => (
        <div
          key={v.num}
          className="absolute"
          style={{ ...v.cardPos, width: '200px' }}
        >
          <ValueCard v={v} title={t.coreValue.values[i].title} desc={t.coreValue.values[i].desc} />
        </div>
      ))}
    </div>
  )
}

/* ── Mobile list ────────────────────────────────────────────── */
function MobileList() {
  const { t } = useLanguage()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {VALUES.map((v, i) => (
        <ValueCard key={v.num} v={v} title={t.coreValue.values[i].title} desc={t.coreValue.values[i].desc} textAlign="left" />
      ))}
    </div>
  )
}

/* ── Section ────────────────────────────────────────────────── */
function CoreValue() {
  const { t } = useLanguage()
  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-block mb-4 px-4 py-1 text-white text-[10px] font-bold
                           tracking-[0.2em] uppercase rounded-full border border-red-600/40
                           bg-red-950/25">
            {t.coreValue.badge}
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {t.coreValue.title}
          </h2>

          <p className="text-white/70 italic mb-2"
             style={{ fontSize: 'clamp(13px, 1.2vw, 16px)' }}>
            {t.coreValue.quote}
          </p>

          <p className="text-white/40 max-w-2xl"
             style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}>
            {t.coreValue.desc}
          </p>
        </div>

        <div className="hidden lg:block"><Diagram /></div>
        <div className="lg:hidden"><MobileList /></div>

      </div>
    </section>
  )
}

export default CoreValue
