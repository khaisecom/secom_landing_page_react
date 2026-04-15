import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import secomLogo from '../../assets/images/secom_logo.png'
import bannerImg from '../../assets/images/ttd-academy/IMG_2331.jpg'
import marketAnalysis from '../../assets/images/ttd-academy/market-analysis.jpg'
import fbaLaunching from '../../assets/images/ttd-academy/fba-launching.jpg'
import ppcAds from '../../assets/images/ttd-academy/ppc-ads.jpg'

const TEXT = {
  en: {
    date: '02/09/2024',
    bannerTitle: 'Establishment of\nSECOM Academy',
    desc: 'Founded in 2017, SECOM is proud to be one of the outstanding enterprises in cross-border e-commerce, excelling in conquering global markets through deep understanding of international customer needs. We continuously innovate technology, optimize design processes, and select high-quality products to bring global consumers branded products with superior quality, unique features, and reasonable prices on platforms such as Amazon, Etsy, Google Shopping, TikTok Shop, Shopify, WooCommerce, etc.',
    introTitle: 'Introduction',
    introDesc: 'At SECOM Academy, we focus on developing high-quality human resources for the e-commerce industry. We provide comprehensive training programs, from basic to advanced courses, equipping learners with the skills and knowledge needed to succeed in this field.',
    introPoints: ['International Vision', 'Knowledge Connection', 'Human Resource Development'],
    valuesTitle: 'Target Values',
    accordion: [
      { title: 'Vision', content: 'Promote the development and elevate Vietnam\'s e-commerce industry in the international market.' },
      { title: 'Mission', content: 'Born with the mission of connecting international knowledge to elevate the quality of human resources and build Vietnamese brands in the international e-commerce industry.' },
      { title: 'Strategy', content: 'Provide essential principles and tools for the potential workforce in Vietnam\'s e-commerce industry through career counseling and practical training programs. We focus on equipping necessary knowledge and skills, fully meeting the requirements of each position in e-commerce, to enhance efficiency and professionalism in the industry.' },
      { title: 'Key Activities', content: 'Provide in-depth career counseling services in e-commerce and organize high-quality training seminars, both domestically and internationally. Committed to enhancing lecturer expertise and providing quality human resources for e-commerce; Issuing training certificates.' },
    ],
    coursesTitle: 'Courses',
    courses: [
      {
        title: 'Amazon Market Analysis',
        desc: 'A course providing comprehensive knowledge, skills and tools to help you conduct product business potential research and evaluation. Includes 5 main modules:\n- Industry Analysis\n- Competitor Analysis\n- Product Niche Analysis\n- Business Potential Evaluation\n- Business Planning',
      },
      {
        title: 'Amazon FBA Launching',
        desc: 'A course including 6 major topics professionally compiled by SECOM, helping you master the secrets of successful product launching on Amazon:\n- Market Research\n- Seller Account Setup\n- Inventory & Supply Chain Management\n- Product Listing Optimization\n- Comprehensive Marketing Strategy\n- Problem Solving',
      },
      {
        title: 'Amazon PPC Advertising',
        desc: 'A course providing comprehensive knowledge and skills to help learners effectively execute PPC advertising on Amazon. Topics include:\n- Types of PPC Ads\n- Effective Keyword Research\n- Campaign Tracking & Optimization',
      },
    ],
    contactBtn: 'Contact',
    contactTitle: 'Contact SECOM Academy',
    phone: '+84.093.825.3801',
    addressLabel: 'Address:',
    address: 'XL Building, 167 Tran Nao, An Khanh Ward, Ho Chi Minh City',
  },
  vi: {
    date: '02/09/2024',
    bannerTitle: 'Thành lập\nSECOM Academy',
    desc: 'Thành lập năm 2017, SECOM tự hào là một trong những doanh nghiệp xuất sắc trong ngành thương mại điện tử xuyên biên giới, nổi bật với khả năng chinh phục thị trường toàn cầu nhờ sự thấu hiểu sâu sắc về nhu cầu của khách hàng quốc tế. Chúng tôi không ngừng đổi mới công nghệ, tối ưu quy trình thiết kế, và lựa chọn những sản phẩm chất lượng cao, nhằm mang đến cho người tiêu dùng toàn cầu những sản phẩm mang thương hiệu với chất lượng vượt trội, tính năng độc đáo, và mức giá hợp lý trên các nền tảng như Amazon, Etsy, Google Shopping, Tiktok Shop, Shopify, Woocommerce,...vv',
    introTitle: 'Giới thiệu',
    introDesc: 'Tại SECOM Academy, chúng tôi tập trung vào việc phát triển nguồn nhân lực chất lượng cao cho ngành thương mại điện tử. Chúng tôi cung cấp các chương trình đào tạo toàn diện, từ các khóa học cơ bản đến nâng cao, nhằm trang bị cho học viên những kỹ năng và kiến thức cần thiết để thành công trong lĩnh vực này.',
    introPoints: ['Tầm nhìn Quốc tế', 'Kết nối tri thức', 'Phát triển nguồn nhân lực'],
    valuesTitle: 'Giá trị hướng tới',
    accordion: [
      { title: 'Tầm nhìn', content: 'Thúc đẩy sự phát triển và nâng tầm ngành thương mại điện tử Việt Nam trên thị trường quốc tế.' },
      { title: 'Sứ mệnh', content: 'Ra đời với sứ mệnh kết nối tri thức quốc tế nhằm nâng tầm chất lượng nguồn nhân lực và tạo dựng thương hiệu Việt trong ngành thương mại điện tử quốc tế.' },
      { title: 'Chiến lược', content: 'Cung cấp nguyên lý và công cụ thiết yếu cho lực lượng lao động tiềm năng trong ngành thương mại điện tử Việt Nam thông qua các chương trình tư vấn hướng nghiệp và đào tạo thực tiễn. Chúng tôi tập trung vào việc trang bị kiến thức và kỹ năng cần thiết, đáp ứng đầy đủ các yêu cầu về chức trách và nhiệm vụ của từng vị trí trong lĩnh vực thương mại điện tử, nhằm nâng cao hiệu quả và sự chuyên nghiệp trong ngành.' },
      { title: 'Các hoạt động chính', content: 'Cung cấp dịch vụ tư vấn hướng nghiệp chuyên sâu trong ngành thương mại điện tử và tổ chức các hội thảo đào tạo chất lượng cao, cả trong nước và quốc tế. Cam kết nâng cao nghiệp vụ giảng viên và cung cấp nhân lực chất lượng cho lĩnh vực thương mại điện tử; Cấp chứng nhận đào tạo.' },
    ],
    coursesTitle: 'Các khóa học',
    courses: [
      {
        title: 'Amazon Market Analysis',
        desc: 'Là khóa học cung cấp đầy đủ kiến thức, kỹ năng và công cụ giúp bạn tự tiến hành nghiên cứu và đánh giá tiềm năng kinh doanh sản phẩm. Bao gồm 5 module chính:\n- Phân tích ngành hàng\n- Phân tích đối thủ\n- Phân tích ngách sản phẩm\n- Đánh giá tiềm năng kinh doanh\n- Lập kế hoạch kinh doanh',
      },
      {
        title: 'Amazon FBA Launching',
        desc: 'Là khóa học bao gồm 6 chủ đề lớn được SECOM tự biên soạn bài bản, chuyên sâu giúp bạn nắm bắt bí quyết launching sản phẩm thành công trên Amazon:\n- Nghiên cứu thị trường\n- Thiết lập tài khoản bán hàng\n- Quản lý hàng hóa và chuỗi cung ứng\n- Xây dựng và tối ưu listing sản phẩm\n- Chiến lược marketing tổng hợp\n- Giải quyết các vấn đề phát sinh',
      },
      {
        title: 'Amazon PPC Advertising',
        desc: 'Là khóa học cung cấp đầy đủ kiến thức và kĩ năng giúp học viên thực thi các loại hình quảng cáo PPC trên Amazon một cách hiệu quả. Bao gồm các chủ đề:\n- Các loại hình chạy PPC Ads\n- Nghiên cứu từ khóa hiệu quả\n- Theo dõi và tối ưu chiến dịch',
      },
    ],
    contactBtn: 'Liên hệ',
    contactTitle: 'Liên hệ SECOM Academy',
    phone: '+84.093.825.3801',
    addressLabel: 'Địa chỉ:',
    address: 'Tòa nhà XL Building, 167 Trần Não, Phường An Khánh, Thành phố Hồ Chí Minh',
  },
  zh: {
    date: '02/09/2024',
    bannerTitle: '成立\nSECOM Academy',
    desc: 'SECOM成立于2017年，是跨境电子商务行业的杰出企业之一，凭借对国际客户需求的深刻理解，在全球市场上脱颖而出。我们不断创新技术、优化设计流程、精选高品质产品，在Amazon、Etsy、Google Shopping、TikTok Shop、Shopify、WooCommerce等平台上为全球消费者提供品质卓越、功能独特、价格合理的品牌产品。',
    introTitle: '简介',
    introDesc: '在SECOM Academy，我们专注于为电子商务行业培养高素质人才。我们提供从基础到高级的全面培训课程，为学员配备在该领域取得成功所需的技能和知识。',
    introPoints: ['国际视野', '知识连接', '人力资源开发'],
    valuesTitle: '目标价值',
    accordion: [
      { title: '愿景', content: '推动越南电子商务行业在国际市场上的发展和提升。' },
      { title: '使命', content: '以连接国际知识为使命，提升人力资源质量，在国际电子商务行业中打造越南品牌。' },
      { title: '战略', content: '通过职业咨询和实践培训项目，为越南电子商务行业的潜在劳动力提供必要的原则和工具。我们专注于装备必要的知识和技能，充分满足电子商务领域各岗位的职责要求，以提高行业效率和专业性。' },
      { title: '主要活动', content: '提供电子商务行业深度职业咨询服务，组织国内外高质量培训研讨会。致力于提升讲师专业素质，为电子商务领域提供优质人才；颁发培训证书。' },
    ],
    coursesTitle: '课程',
    courses: [
      {
        title: 'Amazon Market Analysis',
        desc: '提供全面的知识、技能和工具，帮助您进行产品商业潜力研究和评估的课程。包括5个主要模块：\n- 行业分析\n- 竞争对手分析\n- 产品利基分析\n- 商业潜力评估\n- 商业计划',
      },
      {
        title: 'Amazon FBA Launching',
        desc: '包含6大主题的课程，由SECOM专业编写，帮助您掌握在Amazon上成功发布产品的秘诀：\n- 市场研究\n- 卖家账户设置\n- 库存与供应链管理\n- 产品列表优化\n- 综合营销策略\n- 问题解决',
      },
      {
        title: 'Amazon PPC Advertising',
        desc: '提供全面的知识和技能，帮助学员有效执行Amazon PPC广告的课程。主题包括：\n- PPC广告类型\n- 有效关键词研究\n- 活动跟踪与优化',
      },
    ],
    contactBtn: '联系',
    contactTitle: '联系 SECOM Academy',
    phone: '+84.093.825.3801',
    addressLabel: '地址：',
    address: 'XL Building, 167 Tran Nao, An Khanh Ward, Ho Chi Minh City',
  },
}

const COURSE_IMAGES = [marketAnalysis, fbaLaunching, ppcAds]

function Services() {
  const { lang } = useLanguage()
  const t = TEXT[lang] || TEXT.vi
  const [openAccordion, setOpenAccordion] = useState(0)
  const sectionRef = useRef(null)

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
    const items = sectionRef.current?.querySelectorAll('.fade-item')
    items?.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#111]">

      {/* Banner */}
      <div className="relative w-full -mt-16">
        {/* Desktop banner */}
        <div className="hidden md:block relative h-[70vh]">
          <img src={bannerImg} alt="SECOM Academy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-white font-semibold text-lg mb-2">{t.date}</p>
            <h1 className="text-4xl lg:text-5xl font-medium text-white uppercase whitespace-pre-line leading-tight">
              {t.bannerTitle}
            </h1>
          </div>
        </div>
        {/* Mobile banner */}
        <div className="block md:hidden">
          <img src={bannerImg} alt="SECOM Academy" className="w-full h-auto" />
        </div>
      </div>

      {/* Mobile title */}
      <div className="block md:hidden text-center py-8 px-4">
        <p className="font-semibold text-white mb-2">{t.date}</p>
        <h1 className="text-2xl font-medium text-white uppercase whitespace-pre-line leading-tight">
          {t.bannerTitle}
        </h1>
      </div>

      {/* Logo + Description */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 text-center py-8 md:py-14">
        <img src={secomLogo} alt="SECOM Academy" className="h-10 mx-auto mb-6 fade-item opacity-0 translate-y-4 transition-all duration-700" />
        <p className="text-white/60 text-sm md:text-base leading-relaxed text-justify fade-item opacity-0 translate-y-4 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
          {t.desc}
        </p>
      </section>

      {/* Introduction + Target Values */}
      <section className="bg-[#0a0a0a] py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

            {/* Introduction */}
            <div className="fade-item opacity-0 translate-y-4 transition-all duration-700">
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-6">{t.introTitle}</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-8 text-justify">{t.introDesc}</p>
              <div className="flex flex-col gap-4">
                {t.introPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-3" style={{ transitionDelay: `${(i + 1) * 100}ms` }}>
                    <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-white font-semibold text-sm md:text-base">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Values - Accordion */}
            <div className="fade-item opacity-0 translate-y-4 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-6">{t.valuesTitle}</h2>
              <div className="flex flex-col gap-1">
                {t.accordion.map((item, i) => (
                  <div key={i} className="border-b border-white/10">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-white font-medium text-sm md:text-base">{item.title}</span>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={`shrink-0 transition-transform duration-300 ${openAccordion === i ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === i ? 'max-h-60 pb-4' : 'max-h-0'}`}>
                      <p className="text-white/45 text-sm leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-8 fade-item opacity-0 translate-y-4 transition-all duration-700">
            {t.coursesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {t.courses.map((course, i) => (
              <div
                key={i}
                className="fade-item opacity-0 translate-y-4 transition-all duration-700 flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#1a1a1a] hover:border-red-600/30 hover:bg-[#1e1a1a] transition-colors"
                style={{ transitionDelay: `${(i + 1) * 150}ms` }}
              >
                <img src={COURSE_IMAGES[i]} alt={course.title} className="w-full h-48 object-cover" />
                <div className="flex-1 flex flex-col p-5">
                  <h3 className="text-white font-semibold text-base mb-3">{course.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed flex-1 whitespace-pre-line mb-5">{course.desc}</p>
                  <NavLink
                    to="/contact"
                    className="block w-full text-center py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                  >
                    {t.contactBtn}
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#0a0a0a] py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-medium text-white mb-10 fade-item opacity-0 translate-y-4 transition-all duration-700">
            {t.contactTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Email */}
            <a href="mailto:contact@secomvn.com" className="fade-item opacity-0 translate-y-4 transition-all duration-700 flex flex-col items-center gap-3 group" style={{ transitionDelay: '100ms' }}>
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="text-white/60 text-sm hover:text-white transition-colors">contact@secomvn.com</span>
            </a>
            {/* Phone */}
            <a href="tel:+84938253801" className="fade-item opacity-0 translate-y-4 transition-all duration-700 flex flex-col items-center gap-3 group" style={{ transitionDelay: '200ms' }}>
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <span className="text-white/60 text-sm hover:text-white transition-colors">{t.phone}</span>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/secomvn/" target="_blank" rel="noopener noreferrer" className="fade-item opacity-0 translate-y-4 transition-all duration-700 flex flex-col items-center gap-3 group" style={{ transitionDelay: '300ms' }}>
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </div>
              <span className="text-white/60 text-sm hover:text-white transition-colors">Facebook</span>
            </a>
          </div>
          <p className="fade-item opacity-0 translate-y-4 transition-all duration-700 text-white/50 text-sm" style={{ transitionDelay: '400ms' }}>
            <span className="font-semibold text-white">{t.addressLabel} </span>
            {t.address}
          </p>
        </div>
      </section>

      {/* Inline style for reveal animation */}
      <style>{`
        .fade-item.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

export default Services
