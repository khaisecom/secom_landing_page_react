import { useState, useEffect } from 'react'
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from 'react-router-dom'

const Layout = () => {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div
            className="bg-black text-white min-h-screen w-screen"
        >

            {/* Header */}
            <Header />

            {/* Main content */}
            <main className="pt-16">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />

            {/* Scroll to top — mobile only */}
            <button
                onClick={scrollToTop}
                className={`md:hidden fixed bottom-6 right-4 z-50 w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                aria-label="Scroll to top"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            </button>
        </div>
    )
}

export default Layout