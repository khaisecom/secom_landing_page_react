import { useEffect, useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

// Import all product gallery images
import img1 from '../../assets/images/product-gallery/product_gallery_1.png'
import img2 from '../../assets/images/product-gallery/product_gallery_2.png'
import img3 from '../../assets/images/product-gallery/product_gallery_3.png'
import img4 from '../../assets/images/product-gallery/product_gallery_4.png'
import img5 from '../../assets/images/product-gallery/product_gallery_5.png'
import img6 from '../../assets/images/product-gallery/product_gallery_6.png'
import img7 from '../../assets/images/product-gallery/product_gallery_7.png'
import img8 from '../../assets/images/product-gallery/product_gallery_8.png'
import img9 from '../../assets/images/product-gallery/product_gallery_9.png'
import img10 from '../../assets/images/product-gallery/product_gallery_10.png'
import img11 from '../../assets/images/product-gallery/product_gallery_11.png'
import img12 from '../../assets/images/product-gallery/product_gallery_12.png'
import img13 from '../../assets/images/product-gallery/product_gallery_13.png'
import img14 from '../../assets/images/product-gallery/product_gallery_14.png'
import img15 from '../../assets/images/product-gallery/product_gallery_15.png'
import img16 from '../../assets/images/product-gallery/product_gallery_16.png'
import img17 from '../../assets/images/product-gallery/product_gallery_17.png'
import img18 from '../../assets/images/product-gallery/product_gallery_18.png'
import img19 from '../../assets/images/product-gallery/product_gallery_19.png'
import img20 from '../../assets/images/product-gallery/product_gallery_20.png'

const COLUMNS = [
  [img4, img8, img12, img16, img20],
  [img1, img5, img9, img13, img17],
  [img2, img6, img10, img14, img18],
  [img3, img7, img11, img15, img19],
]

const TEXT = {
  en: {
    title: 'Our Products',
    desc: 'Founded in 2017, SECOM pursues the mission: Weaving happiness into every print-on-demand product. With creativity as our core and quality as our guiding principle, we turn ideas into inspiring designs. Under the vision "Bringing Vietnamese brands to shine globally", we move forward with passion, dedication and the belief that creative designs leave a lasting mark.',
  },
  vi: {
    title: 'Sản phẩm của chúng tôi',
    desc: 'Thành lập năm 2017, SECOM theo đuổi sứ mệnh: Đan tặng hạnh phúc trong từng sản phẩm in ấn theo yêu cầu. Lấy sáng tạo làm cốt lõi, chất lượng làm kim chỉ nam, chúng tôi biến ý tưởng thành những thiết kế truyền cảm hứng. Dưới tầm nhìn "Mang thương hiệu Việt tỏa sáng toàn cầu", chúng tôi tiến bước với đam mê, tận tâm và niềm tin rằng những thiết kế sáng tạo để lại dấu ấn bền lâu.',
  },
  zh: {
    title: '我们的产品',
    desc: 'SECOM成立于2017年，秉承使命：将幸福编织在每一个按需印刷产品中。以创意为核心，以品质为指南，我们将创意转化为鼓舞人心的设计。在"让越南品牌在全球闪耀"的愿景下，我们怀着热情、奉献和信念前行，相信创意设计能留下持久的印记。',
  },
}

function Product() {
  const { lang } = useLanguage()
  const t = TEXT[lang] || TEXT.vi
  const galleryRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const items = galleryRef.current?.querySelectorAll('.gallery-item')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#111]">

      {/* Banner */}
      <div className="relative w-full h-[50vh] md:h-[70vh] -mt-16 overflow-hidden">
        <img
          src={img1}
          alt="SECOM Products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-[#111]" />
      </div>

      {/* Title & Description */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 text-center py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 uppercase mb-6">
          {t.title}
        </h1>
        <p className="text-white/60 text-sm md:text-base leading-relaxed text-justify">
          {t.desc}
        </p>
      </section>

      {/* Product Gallery - 4 column masonry */}
      <section className="bg-[#0a0a0a] py-8 md:py-14">
        <div ref={galleryRef} className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            {COLUMNS.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-2 md:gap-3">
                {col.map((src, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="gallery-item rounded-lg overflow-hidden opacity-0 translate-y-6 transition-all duration-700 ease-out"
                    style={{ transitionDelay: `${(colIdx * 80) + (imgIdx * 120)}ms` }}
                  >
                    <img
                      src={src}
                      alt="SECOM product"
                      className="w-full h-auto block hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inline style for reveal animation */}
      <style>{`
        .gallery-item.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

export default Product
