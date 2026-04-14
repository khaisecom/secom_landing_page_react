import { useLanguage } from '../../../i18n/LanguageContext'
import secomS from '../../../assets/images/secome_center_S_character.svg'

/* ── Value Card — number node sits half-in half-out on the edge ── */
function ValueCard({ number, title, desc, nodePosition, gradientDir }) {
  // nodePosition: 'bottom-center' | 'left-center' | 'right-center'
  const nodeStyles = {
    'bottom-center': 'left-1/2 -translate-x-1/2 -bottom-5',
    'left-center':   '-left-5 top-1/2 -translate-y-1/2',
    'right-center':  '-right-5 top-1/2 -translate-y-1/2',
  }

  // Red side faces the center
  const gradients = {
    'to top':    'linear-gradient(to top, #2a0a0f, #140000 40%, #0c0c0c 100%)',
    'to left':   'linear-gradient(to left, #2a0a0f, #140000 40%, #0c0c0c 100%)',
    'to right':  'linear-gradient(to right, #2a0a0f, #140000 40%, #0c0c0c 100%)',
    'to bottom-right': 'linear-gradient(to bottom left, #0c0c0c 30%, #140000 60%, #2a0a0f 100%)',
    'to bottom-left':  'linear-gradient(to bottom right, #0c0c0c 30%, #140000 60%, #2a0a0f 100%)',
  }

  return (
    <div className="relative rounded-2xl border border-white/10 p-5 md:p-6 overflow-visible"
         style={{ background: gradients[gradientDir] || gradients['to top'] }}>
      {/* Corner dots */}
      <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full border border-white/30" />
      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full border border-white/30" />

      {/* Title */}
      <h3 className="text-white font-semibold text-sm md:text-base mb-2">{title}</h3>

      {/* Description */}
      <p className="text-white/50 text-xs md:text-sm leading-relaxed m-0 line-clamp-4">{desc}</p>

      {/* Number node — half in, half out */}
      {nodePosition && (
        <div className={`absolute z-10 ${nodeStyles[nodePosition]}`}>
          <div className="w-10 h-10 rounded-full bg-black border border-red-500/60
                          flex items-center justify-center shadow-[0_0_14px_rgba(255,1,55,0.35)]"
               style={{ background: 'radial-gradient(circle, #1a0008 0%, #000 70%)' }}>
            <span className="text-white font-bold text-sm">{number}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Section ────────────────────────────────────────────────── */
function CoreValue() {
  const { t } = useLanguage()
  const values = t.coreValue.values

  /* Center point of the pentagon layout (px) */
  const cy = 345

  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center gap-3 mb-10 md:mb-16">
          <span className="inline-block px-4 py-1 text-[10px] font-semibold tracking-[0.18em]
                           text-white/90 uppercase border border-red-600/40 bg-red-950/25 rounded-full">
            {t.coreValue.badge}
          </span>

          <h2 className="text-white font-semibold m-0"
              style={{ fontSize: 'clamp(22px, 3vw, 40px)' }}>
            {t.coreValue.title}
          </h2>

          <p className="text-white/60 m-0 max-w-lg italic"
             style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}>
            {t.coreValue.quote}
          </p>

          <p className="text-white/40 m-0 max-w-md"
             style={{ fontSize: 'clamp(11px, 1vw, 14px)' }}>
            {t.coreValue.desc}
          </p>
        </div>

        {/* ── Desktop layout (lg+) — pentagon arrangement ── */}
        <div className="hidden lg:block relative" style={{ minHeight: 640 }}>

          {/* Center circle with SECOM logo + red sun glow */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
               style={{ top: cy }}>
            {/* Red sun glow layers */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(255,1,55,0.2) 0%, transparent 70%)' }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(255,1,55,0.4) 0%, transparent 65%)' }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(255,1,55,1) 0%, transparent 70%)' }} />

            <img src={secomS} alt="SECOM" className="relative  object-contain z-10" />
          </div>

          {/* Connecting lines (SVG) — straight + 90° corners */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
               viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet">
            {/* 1: Center → straight up to number 1 */}
            <path d="M 500 310 L 500 160" stroke="white" strokeOpacity="0.6" strokeWidth="1" fill="none" />
            {/* 2: Center top → straight up, rounded 90° turn left, straight to number 2 */}
            <path d="M 485 310 L 485 235 Q 485 220 470 220 L 260 220" stroke="white" strokeOpacity="0.6" strokeWidth="1" fill="none" />
            {/* 4: Center top → straight up, rounded 90° turn right, straight to number 4 */}
            <path d="M 515 310 L 515 235 Q 515 220 530 220 L 740 220" stroke="white" strokeOpacity="0.6" strokeWidth="1" fill="none" />
            {/* 3: Center bottom → straight down, rounded 90° turn left, straight to number 3 */}
            <path d="M 485 380 L 485 470 Q 485 485 470 485 L 310 485" stroke="white" strokeOpacity="0.6" strokeWidth="1" fill="none" />
            {/* 5: Center bottom → straight down, rounded 90° turn right, straight to number 5 */}
            <path d="M 515 380 L 515 470 Q 515 485 530 485 L 690 485" stroke="white" strokeOpacity="0.6" strokeWidth="1" fill="none" />
          </svg>

          {/* Card 1 — Top center (Integrity) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[320px]">
            <ValueCard number={1} title={values[0].title} desc={values[0].desc} nodePosition="bottom-center" gradientDir="to top" />
          </div>

          {/* Card 2 — Left (Responsibility) */}
          <div className="absolute left-0 w-[320px]" style={{ top: 130 }}>
            <ValueCard number={2} title={values[1].title} desc={values[1].desc} nodePosition="right-center" gradientDir="to left" />
          </div>

          {/* Card 4 — Right (Continuous Learning) */}
          <div className="absolute right-0 w-[320px]" style={{ top: 130 }}>
            <ValueCard number={4} title={values[3].title} desc={values[3].desc} nodePosition="left-center" gradientDir="to right" />
          </div>

          {/* Card 3 — Bottom-left (Collaboration) */}
          <div className="absolute left-[60px] w-[320px]" style={{ top: 400 }}>
            <ValueCard number={3} title={values[2].title} desc={values[2].desc} nodePosition="right-center" gradientDir="to left" />
          </div>

          {/* Card 5 — Bottom-right (Creativity) */}
          <div className="absolute right-[60px] w-[320px]" style={{ top: 400 }}>
            <ValueCard number={5} title={values[4].title} desc={values[4].desc} nodePosition="left-center" gradientDir="to right" />
          </div>
        </div>

        {/* ── Mobile / Tablet layout — flex wrap ── */}
        <div className="lg:hidden flex flex-wrap gap-4">
          {values.map((value, i) => (
            <div key={i} className="w-full sm:w-[calc(50%-8px)]">
              <ValueCard number={i + 1} title={value.title} desc={value.desc} gradientDir="to top" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default CoreValue
