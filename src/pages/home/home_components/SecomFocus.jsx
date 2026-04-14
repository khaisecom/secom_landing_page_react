import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'
import news1 from '../../../assets/images/focus/news-1.png'
import news2 from '../../../assets/images/focus/news-2.png'
import news3 from '../../../assets/images/focus/news-3.png'

const ARTICLES = [
  { img: news1 },
  { img: news2 },
  { img: news3 },
]

const DOTS = 3

function NewsCard({ article, readMore }) {
  return (
    <div
      className="rounded-2xl flex flex-col overflow-hidden h-full"
      style={{ background: '#1a0c10' }}
    >
      {/* Thumbnail */}
      <div className="w-full overflow-hidden shrink-0"
           style={{ height: 'clamp(150px, 14vw, 210px)' }}>
        <img
          src={article.img}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className="text-white font-semibold leading-snug line-clamp-2 m-0"
          style={{ fontSize: 'clamp(13px, 1.1vw, 15px)' }}
        >
          {article.title}
        </h3>

        <p
          className="text-white/45 leading-relaxed line-clamp-3 m-0"
          style={{ fontSize: 'clamp(11px, 0.95vw, 13px)' }}
        >
          {article.desc}
        </p>

        {/* Read more */}
        <div className="mt-auto pt-2">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FF0137]/50
                       transition-all duration-300 hover:border-[#FF0137]"
            style={{
              background: 'linear-gradient(to top, rgba(255,1,55,0.35), rgba(255,1,55,0) 100%)',
              boxShadow: '0 0 12px rgba(255,1,55,0.2)',
            }}
            aria-label={readMore}
          >
            <span className="text-white/90 text-sm font-light">{readMore}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="white" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function SecomFocus() {
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

  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* ── Header ── */}
        <div className="mb-8 md:mb-10 flex flex-col items-center text-center">
          <span className="inline-block mb-4 px-4 py-1 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            {t.secomFocus.badge}
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {t.secomFocus.title}
          </h2>

          <p
            className="text-white/80 italic mb-2"
            style={{ fontSize: 'clamp(13px, 1.2vw, 16px)' }}
          >
            {t.secomFocus.quote}
          </p>

          <p
            className="text-white/45 max-w-2xl"
            style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}
          >
            {t.secomFocus.desc}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {ARTICLES.map((article, j) => (
                    <NewsCard
                      key={j}
                      article={{
                        img: article.img,
                        title: t.secomFocus.articles[j].title,
                        desc: t.secomFocus.articles[j].desc,
                      }}
                      readMore={t.secomFocus.readMore}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dots ── */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: DOTS }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === activeDot ? '22px' : '10px',
                height:     '10px',
                background: i === activeDot ? '#FF0137' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default SecomFocus
