import { useLanguage } from '../../../i18n/LanguageContext'
import ceoImg          from '../../../assets/images/directors/mac-vuong-bien.png'
import vuDucDuongImg   from '../../../assets/images/directors/vu-duc-duong.png'
import phanHuuThanhImg from '../../../assets/images/directors/phan-huu-thanh.png'
import nguyenVanThinhImg from '../../../assets/images/directors/nguyen-van-thinh.png'

const CEO = {
  img: ceoImg, name: 'Mac Vuong Bien',
}

/* 3 founders, positioned around the CEO circle */
const FOUNDERS = [
  {
    img: vuDucDuongImg,
    name: 'Vu Duc Duong',
    // left side
    pos: { top: '38%', left: '10%', transform: 'translate(-50%, -50%)' },
  },
  {
    img: phanHuuThanhImg,
    name: 'Phan Huu Thanh',
    // right side
    pos: { top: '38%', left: '90%', transform: 'translate(-50%, -50%)' },
  },
  {
    img: nguyenVanThinhImg,
    name: 'Nguyen Van Thinh',
    // bottom center
    pos: { top: '80%', left: '50%', transform: 'translate(-50%, -50%)' },
  },
]

/* ── Avatar circle ─────────────────────────────────────────── */
function Avatar({ img, name, title, large = false }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`rounded-full overflow-hidden shrink-0
                    ${large ? 'w-28 h-28' : 'w-[72px] h-[72px]'}`}
        style={{
          boxShadow: large
            ? '0 0 0 3px rgba(255,255,255,0.9), 0 0 36px rgba(255,80,80,0.75), 0 0 60px rgba(255,1,55,0.4)'
            : '0 0 0 2px rgba(255,255,255,0.35)',
        }}
      >
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="text-center">
        <p className={`text-white font-semibold m-0 leading-tight
                       ${large ? 'text-sm' : 'text-xs'}`}>
          {name}
        </p>
        <p className="text-white/45 text-xs m-0">{title}</p>
      </div>
    </div>
  )
}

/* ── Orbit rings config ─────────────────────────────────────── */
const ORBITS = [
  { size: 160, opacity: 0.12, duration: '30s', direction: 'normal' },
  { size: 260, opacity: 0.08, duration: '45s', direction: 'reverse' },
  { size: 340, opacity: 0.10, duration: '60s', direction: 'normal' },
  { size: 440, opacity: 0.06, duration: '50s', direction: 'reverse' },
  { size: 540, opacity: 0.04, duration: '70s', direction: 'normal' },
]

/* ── Desktop radial diagram ────────────────────────────────── */
function Diagram({ t }) {
  return (
    <div className="relative mx-auto" style={{ maxWidth: '700px', height: '420px' }}>

      {/* Red radial glow behind CEO */}
      <div
        className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2
                   pointer-events-none rounded-full"
        style={{
          width: '420px', height: '420px',
          background: 'radial-gradient(circle, rgba(255,1,55,0.18) 0%, rgba(255,1,55,0.06) 45%, transparent 70%)',
        }}
      />

      {/* Orbit rings — solar system style */}
      {ORBITS.map((orbit, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${orbit.size}px`,
            height: `${orbit.size}px`,
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: `1px solid rgba(255, 255, 255, ${orbit.opacity})`,
            animation: `orbit-spin ${orbit.duration} linear infinite ${orbit.direction}`,
          }}
        >
          {/* Small dot on orbit */}
          <div
            className="absolute rounded-full"
            style={{
              width: '4px',
              height: '4px',
              top: '-2px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: `rgba(255, 1, 55, ${orbit.opacity * 4})`,
              boxShadow: `0 0 6px rgba(255, 1, 55, ${orbit.opacity * 3})`,
            }}
          />
        </div>
      ))}

      {/* CEO — center */}
      <div
        className="absolute z-10"
        style={{ top: '42%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <Avatar img={CEO.img} name={CEO.name} title={t.board.ceo} large />
      </div>

      {/* Founders around orbit */}
      {FOUNDERS.map(f => (
        <div key={f.name} className="absolute z-10" style={f.pos}>
          <Avatar img={f.img} name={f.name} title={t.board.founder} />
        </div>
      ))}
    </div>
  )
}

/* ── Mobile grid ───────────────────────────────────────────── */
function MobileGrid({ t }) {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* CEO first */}
      <Avatar img={CEO.img} name={CEO.name} title={t.board.ceo} large />
      {/* Founders in row */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
        {FOUNDERS.map(f => (
          <Avatar key={f.name} img={f.img} name={f.name} title={t.board.founder} />
        ))}
      </div>
    </div>
  )
}

/* ── Section ───────────────────────────────────────────────── */
function BoardOfDirector() {
  const { t } = useLanguage()

  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Top badge + heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <span className="inline-block mb-5 px-5 py-1.5 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            {t.board.badge}
          </span>

          <h2
            className="text-white font-bold m-0 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {t.board.title}<br />SECOM
          </h2>
        </div>

        {/* Diagram */}
        <div className="hidden md:block">
          <Diagram t={t} />
        </div>
        <div className="md:hidden">
          <MobileGrid t={t} />
        </div>

        {/* Bottom badge */}
        <div className="flex justify-center mt-6 md:mt-2">
          <span className="inline-block px-5 py-1.5 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            {t.board.badge}
          </span>
        </div>

      </div>
    </section>
  )
}

export default BoardOfDirector
