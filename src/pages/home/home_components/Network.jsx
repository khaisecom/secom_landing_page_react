import networkBg    from '../../../assets/images/network.png'
import amazonLogo   from '../../../assets/images/amazon_logo.svg'
import etsyLogo     from '../../../assets/images/etsy_logo.png'
import tiktokLogo   from '../../../assets/images/tiktok_logo.svg'
import shopifyLogo  from '../../../assets/images/shopify_logo.png'
import './Network.css'
import { useLanguage } from '../../../i18n/LanguageContext'

const LOGOS = [
  { src: amazonLogo,  alt: 'Amazon'  },
  { src: etsyLogo,    alt: 'Etsy'    },
  { src: tiktokLogo,  alt: 'TikTok'  },
  { src: shopifyLogo, alt: 'Shopify' },
]

/* Triplicate so the strip is always wide enough to fill any screen */
const TRACK = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS]

function Network() {
  const { t } = useLanguage()
  return (
    <section
      id="network"
      className="relative bg-[#0c0c0c] overflow-hidden
                 h-[50vh] sm:h-[65vh] md:h-[80vh]"
    >
      {/* ── Background : network visualization ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src={networkBg}
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[140%] md:w-[130%] lg:w-3/4 h-auto object-contain"
          style={{
            opacity: 0.78,
            filter: 'brightness(2)',
            mask: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,0,0,1) 25%, transparent 90%)',
            WebkitMask: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,0,0,1) 25%, transparent 90%)',
          }}
        />
      </div>

      {/* ── Top content ── */}
      <div className="relative z-20 pt- md:pt-6 flex flex-col items-center text-center px-4 gap-3">
        {/* Badge */}
        <span className="inline-block px-4 py-1 text-[10px] font-semibold tracking-[0.18em]
                         text-white/90 uppercase border border-red-600/40 bg-red-950/25 rounded-full">
          {t.network.badge}
        </span>

        <h2
          className="text-white font-semibold m-0"
          style={{ fontSize: 'clamp(22px, 3vw, 40px)' }}
        >
          {t.network.title}
        </h2>

        <p
          className="text-white/50 m-0 max-w-md"
          style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}
        >
          {t.network.desc}
        </p>
      </div>

      {/* ── Infinite logo carousel — absolute so it sits ON the image ── */}
      <div className="absolute bottom-8 md:bottom-10 left-0 right-0 z-10 px-6 md:px-10 lg:px-[12.5%]">
        <div className="overflow-hidden">
          <div className="carousel-track gap-4">
          {TRACK.map((logo, i) => (
            <div key={i} className="logo-card">
              <img
                src={logo.src}
                alt={logo.alt}
                className="logo-red h-5 lg:h-7 w-auto object-contain select-none"
                draggable={false}
              />
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Network
