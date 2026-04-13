import secomLogo from '../../../assets/images/secom_logo.png'

/*
 Layout (symmetric — 2↔4 same top, 3↔5 same top):
          [1 Integrity]
 [2 Resp]   ●SECOM●   [4 Learning]
  [3 Collab]         [5 Creativity]

 numPos uses left-edge of 28px badge.
 SVG x2/y2 target badge center = left + ~1%, top + ~2.5% (for ~580px tall container).
*/
const VALUES = [
  {
    num: 1,
    title: 'Integrity',
    desc: 'Building trust and respect with customers, partners, colleagues, and the community is the foundation for maintaining relationships and sustainable growth in all activities.',
    cardPos: { top: '2%',  left: '50%', transform: 'translateX(-50%)' },
    numPos:  { top: '26%', left: 'calc(50% - 14px)' },
    align:   'center',
    line:    { x2: 50, y2: 28 },
    // red hotspot at bottom — faces the center below
    gradient: 'radial-gradient(ellipse at 50% 100%, rgba(255,1,55,0.38) 0%, rgba(12,12,12,0.97) 65%)',
  },
  {
    num: 2,
    title: 'Responsibility',
    desc: "It forms the foundation of trust with customers, partners, and colleagues while ensuring that each individual fulfills their duties and contributes to the company's sustainable development.",
    cardPos: { top: '32%', left: '1%' },
    numPos:  { top: '46%', left: '26%' },
    align:   'left',
    line:    { x2: 27, y2: 48 },
    // red hotspot at right — faces the center to the right
    gradient: 'radial-gradient(ellipse at 100% 50%, rgba(255,1,55,0.38) 0%, rgba(12,12,12,0.97) 65%)',
  },
  {
    num: 3,
    title: 'Collaboration',
    desc: "A key factor in a dynamic working environment, enabling the team to overcome challenges and pursue the highest performance for the company's sustainable growth.",
    cardPos: { top: '67%', left: '1%' },
    numPos:  { top: '63%', left: '26%' },
    align:   'left',
    line:    { x2: 27, y2: 65 },
    // red hotspot at top-right — faces center
    gradient: 'radial-gradient(ellipse at 100% 0%, rgba(255,1,55,0.38) 0%, rgba(12,12,12,0.97) 65%)',
  },
  {
    num: 4,
    title: 'Continuous Learning',
    desc: "A crucial element that helps each individual improve skills, grow personally, and stay updated with knowledge, contributing to the company's overall development.",
    cardPos: { top: '32%', right: '1%' },
    numPos:  { top: '46%', left: '72%' },
    align:   'right',
    line:    { x2: 73, y2: 48 },
    // red hotspot at left — faces the center to the left
    gradient: 'radial-gradient(ellipse at 0% 50%, rgba(255,1,55,0.38) 0%, rgba(12,12,12,0.97) 65%)',
  },
  {
    num: 5,
    title: 'Creativity',
    desc: "Plays an essential role in solving problems effectively, driving innovation, and thinking beyond current limits, opening new opportunities for growth.",
    cardPos: { top: '67%', right: '1%' },
    numPos:  { top: '63%', left: '72%' },
    align:   'right',
    line:    { x2: 73, y2: 65 },
    // red hotspot at top-left — faces center
    gradient: 'radial-gradient(ellipse at 0% 0%, rgba(255,1,55,0.38) 0%, rgba(12,12,12,0.97) 65%)',
  },
]

/* ── Desktop spider diagram ─────────────────────────────── */
function Diagram() {
  return (
    <div
      className="relative w-full"
      style={{ height: 'clamp(480px, 60vh, 680px)' }}
    >
      {/* SVG connecting lines — preserveAspectRatio:none maps coords to % of container */}
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
            stroke="rgba(255,1,55,0.40)"
            strokeWidth="0.3"
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
            boxShadow:  '0 0 50px rgba(255,1,55,0.7), 0 0 14px rgba(255,1,55,0.4) inset',
          }}
        >
          <img
            src={secomLogo}
            alt="SECOM"
            className="w-12 h-auto object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>

      {/* Numbered badges */}
      {VALUES.map(v => (
        <div key={v.num} className="absolute z-10" style={v.numPos}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center
                       text-white text-xs font-bold select-none"
            style={{
              background: '#FF0137',
              boxShadow:  '0 0 12px rgba(255,1,55,0.6)',
            }}
          >
            {v.num}
          </div>
        </div>
      ))}

      {/* Value text cards */}
      {VALUES.map(v => (
        <div
          key={v.num}
          className="absolute"
          style={{ ...v.cardPos, width: '200px' }}
        >
          <div
            className="rounded-xl p-4 relative overflow-hidden"
            style={{
              background:  v.gradient,
              border:      '1px solid rgba(255,1,55,0.30)',
              boxShadow:   '0 0 20px rgba(255,1,55,0.10)',
            }}
          >
            {/* top-edge red shine */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,1,55,0.6), transparent)' }}
            />
            <h3
              className="text-white font-semibold text-sm mb-1.5 m-0 leading-snug"
              style={{ textAlign: v.align }}
            >
              {v.title}
            </h3>
            <p
              className="text-white/50 leading-relaxed m-0"
              style={{ fontSize: '11px', textAlign: v.align }}
            >
              {v.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Mobile fallback list ───────────────────────────────── */
function MobileList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {VALUES.map(v => (
        <div
          key={v.num}
          className="rounded-xl p-4 relative overflow-hidden"
          style={{
            background: v.gradient,
            border:     '1px solid rgba(255,1,55,0.30)',
            boxShadow:  '0 0 20px rgba(255,1,55,0.10)',
          }}
        >
          {/* top-edge shine */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,1,55,0.6), transparent)' }}
          />
          <div className="flex items-start gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center
                         text-white text-xs font-bold shrink-0 mt-0.5"
              style={{ background: '#FF0137', boxShadow: '0 0 10px rgba(255,1,55,0.45)' }}
            >
              {v.num}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-1 m-0">{v.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed m-0">{v.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Section ────────────────────────────────────────────── */
function CoreValue() {
  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span
            className="inline-block mb-4 px-4 py-1 text-white text-[10px] font-bold
                       tracking-[0.2em] uppercase rounded-full border border-red-600/40
                       bg-red-950/25"
          >
            Why Partner With Us?
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            5 Core Values
          </h2>

          <p
            className="text-white/70 italic mb-2"
            style={{ fontSize: 'clamp(13px, 1.2vw, 16px)' }}
          >
            "Guided by the vision 'Bringing Vietnamese brands to shine globally'"
          </p>

          <p
            className="text-white/40 max-w-2xl"
            style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}
          >
            we move forward with passion, dedication and the belief that
            signature creations leave an enduring mark.
          </p>
        </div>

        {/* Diagram on lg+, list on smaller screens */}
        <div className="hidden lg:block">
          <Diagram />
        </div>
        <div className="lg:hidden">
          <MobileList />
        </div>

      </div>
    </section>
  )
}

export default CoreValue
