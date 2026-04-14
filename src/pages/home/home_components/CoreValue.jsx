import { useLanguage } from '../../../i18n/LanguageContext'
import coreValueImg from '../../../assets/images/5_core_value.svg'

/* ── Section ────────────────────────────────────────────────── */
function CoreValue() {
  const { t } = useLanguage()
  return (
    <section className="bg-[#0c0c0c] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Core Value Image */}
        <div className="flex justify-center">
          <img
            src={coreValueImg}
            alt="5 Core Values"
            className="w-full max-w-4xl h-auto object-contain"
          />
        </div>

      </div>
    </section>
  )
}

export default CoreValue
