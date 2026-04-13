import { useState, useRef } from 'react' // useRef kept for dot scroll
import hoodieImg from '../../../assets/images/products/hoodie.png'
import pajamasImg from '../../../assets/images/products/pajamas.png'
import sweaterImg from '../../../assets/images/products/sweater.png'
import buttonShirtImg from '../../../assets/images/products/button-shirt.png'

const PRODUCTS = [
  { name: 'Hoodie', img: hoodieImg },
  { name: 'Pajamas Set', img: pajamasImg },
  { name: 'Sweater', img: sweaterImg },
  { name: 'Button Shirt', img: buttonShirtImg },
]

const DOTS = 3

function ProductCard({ product }) {
  return (
    <div
      className="rounded-2xl flex flex-col overflow-hidden"
      style={{ background: '#1a0c10' }}
    >
      {/* Label bar */}
      <div
        className="px-4 py-3 border-b border-white/5 flex items-center justify-center"
        style={{ background: '#110709' }}
      >
        <span className="text-white font-semibold text-sm tracking-wide text-center ">
          {product.name} 
        </span>
      </div>

      {/* Image — large, fills the card */}
      <div className="flex items-center justify-center p-5">
        <img
          src={product.img}
          alt={product.name}
          className="w-full object-contain"
          style={{ height: 'clamp(200px, 20vw, 300px)' }}
        />
      </div>
    </div>
  )
}

function FeaturedProduct() {
  const [activeDot, setActiveDot] = useState(0)
  const trackRef = useRef(null)

  /* Dot click → scroll the card track on mobile */
  const handleDot = (i) => {
    setActiveDot(i)
    if (!trackRef.current) return
    const cards = trackRef.current.children
    if (cards[i]) {
      cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }
  }

  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* ── Header ── */}
        <div className="mb-8 md:mb-10 flex flex-col items-center text-center">
          {/* Badge */}
          <span className="inline-block mb-4 px-4 py-1 bg-[#FF0137] text-white
                           text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            Giant Stories
          </span>

          <h2
            className="text-white font-bold m-0 mb-3 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            Featured Product
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

        {/* ── Product cards — 4 columns on desktop ── */}
        <div
          ref={trackRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {PRODUCTS.map((p, i) => (
            <ProductCard key={i} product={p} />
          ))}
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
