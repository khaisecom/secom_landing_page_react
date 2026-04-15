import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useScrollReveal } from '../../../hooks/useScrollReveal'
import hoodieImg from '../../../assets/images/products/hoodie.png'
import pajamasImg from '../../../assets/images/products/pajamas.png'
import sweaterImg from '../../../assets/images/products/sweater.png'
import buttonShirtImg from '../../../assets/images/products/button-shirt.png'

const PRODUCTS = [
  { nameKey: 'hoodie', img: hoodieImg },
  { nameKey: 'pajamas', img: pajamasImg },
  { nameKey: 'sweater', img: sweaterImg },
  { nameKey: 'buttonShirt', img: buttonShirtImg },
]

const DOTS = 3

function ProductCard({ product, t }) {
  const displayName = t.featuredProduct.products[product.nameKey]
  return (
    <div className="relative pt-4 product-float">
      {/* Label pill — sits half outside the card */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-3/4 py-2 rounded-xl border border-white/10 border-t-red-600/60 flex items-center justify-center"
        style={{ background: '#0d0507' }}
      >
        <span className="text-white font-semibold text-sm tracking-wide whitespace-nowrap">
          {displayName}
        </span>
      </div>

      {/* Card body */}
      <div
        className="product-shadow rounded-2xl flex items-center justify-center px-3 pb-5 pt-6"
        style={{ background: '#1a0c10' }}
      >
        <img
          src={product.img}
          alt={displayName}
          className="w-full object-contain"
          style={{ height: 'clamp(200px, 20vw, 300px)' }}
        />
      </div>
    </div>
  )
}

function FeaturedProduct() {
  const { t } = useLanguage()
  const [activeDot, setActiveDot] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideIndex, setSlideIndex] = useState(DOTS) // start at middle copy
  const trackRef = useRef(null)
  const slideIndexRef = useRef(slideIndex)
  slideIndexRef.current = slideIndex

  const totalSlides = DOTS * 3

  const handleDot = (i) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideIndex(DOTS + i)
    setActiveDot(i)
  }

  // After transition ends, silently jump to middle copy if at edges
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false)
    if (slideIndex < DOTS) {
      trackRef.current.style.transition = 'none'
      setSlideIndex(slideIndex + DOTS)
      requestAnimationFrame(() => {
        if (trackRef.current) trackRef.current.style.transition = ''
      })
    } else if (slideIndex >= DOTS * 2) {
      trackRef.current.style.transition = 'none'
      setSlideIndex(slideIndex - DOTS)
      requestAnimationFrame(() => {
        if (trackRef.current) trackRef.current.style.transition = ''
      })
    }
  }, [slideIndex])

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        const next = slideIndexRef.current + 1
        setIsTransitioning(true)
        setSlideIndex(next)
        setActiveDot(((next % DOTS) + DOTS) % DOTS)
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [isTransitioning])

  const [sectionRef, sectionVisible] = useScrollReveal(0.1)

  return (
    <section ref={sectionRef} className="bg-[#0c0c0c] pt-8 pb-20 md:pt-14 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16">

        {/* ── Header ── */}
        <div className={`mb-8 md:mb-10 flex flex-col items-center text-center px-2 md:px-0 reveal ${sectionVisible ? 'visible' : ''}`}>
          <span className="inline-block mb-4 px-4 py-1 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            {t.featuredProduct.badge}
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight py-3"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {t.featuredProduct.title}
          </h2>

          <p
            className="text-white/80 italic mb-6"
            style={{ fontSize: 'clamp(13px, 1.2vw, 16px)' }}
          >
            {t.featuredProduct.quote}
          </p>

          <p
            className="text-white/45 max-w-2xl"
            style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}
          >
            {t.featuredProduct.desc}
          </p>
        </div>

        {/* ── Carousel ── */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div key={i} className="w-full shrink-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {PRODUCTS.map((p, j) => (
                    <ProductCard key={j} product={p} t={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dots ── */}
        <div className="flex items-center gap-2 mt-7 justify-center">
          {Array.from({ length: DOTS }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeDot ? '22px' : '10px',
                height: '10px',
                background: i === activeDot ? '#FF0137' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default FeaturedProduct
