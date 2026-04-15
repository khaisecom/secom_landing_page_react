import { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import contactBanner from '../../assets/images/contact-banner.jpg'

const API_URL = 'http://localhost:3000/api'

function Contact() {
  const [form, setForm] = useState({
    customer_name: '',
    email: '',
    contact_method: '',
    message: '',
  })
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!form.customer_name.trim()) return toast.error('Vui lòng nhập tên')
    if (!form.email.trim()) return toast.error('Vui lòng nhập email')
    setSending(true)
    try {
      await axios.post(`${API_URL}/contacts`, form)
      toast.success('Gửi liên hệ thành công!')
      setForm({ customer_name: '', email: '', contact_method: '', message: '' })
    } catch {
      toast.error('Gửi thất bại, vui lòng thử lại')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111]">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      }} />

      {/* Banner */}
      <div className="relative w-full -mt-16">
        <img
          src={contactBanner}
          alt="Contact"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#111]" />
      </div>

      {/* Contact Form */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 -mt-10 relative z-10 pb-16">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center uppercase mb-8">
          Liên hệ với chúng tôi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            value={form.customer_name}
            onChange={e => setForm({ ...form, customer_name: e.target.value })}
            placeholder="Tên của bạn"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
          />
          <input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
          />
          <input
            value={form.contact_method}
            onChange={e => setForm({ ...form, contact_method: e.target.value })}
            placeholder="Số điện thoại"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <textarea
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          rows={4}
          placeholder="Lời nhắn"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors resize-y mb-6"
        />
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="px-10 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {sending ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </section>

      {/* Company Info */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center uppercase mb-10">
          Công ty TNHH <br className="md:hidden" />Dịch vụ SECOM
        </h2>

        {/* Contact icons */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <a href="mailto:hr@secomvn.com" className="flex flex-col items-center gap-3 group no-underline">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <span className="text-white text-xs md:text-sm text-center">Email</span>
          </a>

          <a href="tel:+84938253801" className="flex flex-col items-center gap-3 group no-underline">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <span className="text-white text-xs md:text-sm text-center">(+84) 093.825.3801</span>
          </a>

          <a href="https://www.facebook.com/secomvn/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group no-underline">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </div>
            <span className="text-white text-xs md:text-sm text-center">Facebook</span>
          </a>
        </div>

        {/* Map + Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.277320428094!2d106.72785627586879!3d10.790059258940376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752700351f8a1d%3A0x4af94fbfff1fdc7a!2sXL%20Building%20167!5e0!3m2!1svi!2s!4v1742973087656!5m2!1svi!2s"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SECOM Office"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-white mb-4">Địa chỉ</h3>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0137">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <p className="text-white/70 text-sm leading-relaxed m-0">
                Tòa nhà XL Building, 167 Trần Não, Phường An Khánh, Thành phố Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
