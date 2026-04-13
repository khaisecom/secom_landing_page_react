import { useState } from 'react'
import news1 from '../../../assets/images/focus/news-1.png'
import news2 from '../../../assets/images/focus/news-2.png'
import news3 from '../../../assets/images/focus/news-3.png'

const ARTICLES = [
  {
    img: news1,
    title: 'Đi Làm Ngày Mưa - Sài Gòn',
    desc:  'Khám phá câu chuyện về những ngày mưa thành phố Sài Gòn, trang điểm qua podcast đặc biệt của SECOM.',
  },
  {
    img: news2,
    title: "SECOM nhận giải thưởng 'Rising Star' tại Amazon Award 2022",
    desc:  "SECOM trở thành một trong những doanh nghiệp Việt Nam xuất sắc nhận giải 'Rising Star' tại Amazon Global Selling Việt Nam.",
  },
  {
    img: news3,
    title: 'Team Building 2024: Đại Gia Đình SECOM Tại Nha Trang',
    desc:  'Team building 2024 cùng đại gia đình SECOM tại Nha Trang. Khám phá những trải nghiệm vui chơi và gắn kết.',
  },
]

function NewsCard({ article }) {
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
        <div className="flex items-center gap-3 mt-auto pt-2">
          <span className="text-white/70 text-sm font-light">Read more</span>
          <button
            className="w-8 h-8 rounded-full border border-[#FF0137] flex items-center justify-center
                       shrink-0 transition-all duration-300 hover:bg-[#FF0137]/20"
            style={{ boxShadow: '0 0 12px rgba(255,1,55,0.25)' }}
            aria-label="Read more"
          >
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
  const [activeDot, setActiveDot] = useState(0)

  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* ── Header ── */}
        <div className="mb-8 md:mb-10 flex flex-col items-center text-center">
          <span className="inline-block mb-4 px-4 py-1 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            Giant Stories
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            SECOM Focus
          </h2>

          <p
            className="text-white/80 italic mb-2"
            style={{ fontSize: 'clamp(13px, 1.2vw, 16px)' }}
          >
            "Bringing Vietnamese brands to shine globally."
          </p>

          <p
            className="text-white/45 max-w-2xl"
            style={{ fontSize: 'clamp(12px, 1.1vw, 15px)' }}
          >
            We move forward with passion, dedication, and the belief that
            signature creations leave an enduring mark.
          </p>
        </div>

        {/* ── Cards — 3 columns on desktop ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARTICLES.map((article, i) => (
            <NewsCard key={i} article={article} />
          ))}
        </div>

        {/* ── Dots ── */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {ARTICLES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveDot(i)}
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
