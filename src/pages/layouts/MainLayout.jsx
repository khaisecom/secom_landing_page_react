import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from 'react-router-dom'

const Layout = () => {
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
        </div>
    )
}

export default Layout