import sunImg from '../../../assets/images/top_red_sun.svg'
import '../home_components/Hero.css'

const STARS = [
  { top: '15%', left: '5%',  delay: '0s'    },
  { top: '25%', left: '25%', delay: '0.4s'  },
  { top: '10%', left: '50%', delay: '0.8s'  },
  { top: '20%', left: '72%', delay: '0.2s'  },
  { top: '30%', left: '88%', delay: '0.6s'  },
  { top: '40%', left: '15%', delay: '0.3s'  },
  { top: '35%', left: '60%', delay: '0.7s'  },
  { top: '45%', left: '40%', delay: '0.1s'  },
]

function EndOfSun() {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#0c0c0c]"
      style={{ marginTop: '-2px' }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="hero-star"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          />
        ))}
      </div>

      {/* Gradient overlay to blend top edge into background */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '30%',
          background: 'linear-gradient(to bottom, #0c0c0c, transparent)',
        }}
      />
      <img
        src={sunImg}
        alt=""
        aria-hidden="true"
        className="sun-flicker"
        style={{
          width: '100%',
          transform: 'rotate(180deg)',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  )
}

export default EndOfSun
