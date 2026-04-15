import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuth } from './store/authSlice.js'
import Home from './pages/home/Home.jsx'
import Admin from './pages/admin/Admin.jsx'
import RecruitmentPage from './pages/recruitment/Recruitment.jsx'
import JobDetail from './pages/recruitment/JobDetail.jsx'
import ManageCV from './pages/recruitment/ManageCV.jsx'
import News from './pages/news/News.jsx'
import Product from './pages/product/Product.jsx'
import Contact from './pages/contact/Contact.jsx'
import AllNews from './pages/news/AllNews.jsx'
import PostDetail from './pages/news/PostDetail.jsx'
import './App.css'
import MainLayout from './pages/layouts/MainLayout.jsx'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <Routes>

      <Route element={<MainLayout />}  >

        {/* Home - Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Product */}
        <Route path="/product" element={<Product />} />

        {/* Recruitment */}
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/recruitment/cv" element={<ManageCV />} />
        <Route path="/recruitment/:id" element={<JobDetail />} />

        {/* News */}
        <Route path="/news" element={<News />} />
        <Route path="/news/all" element={<AllNews />} />
        <Route path="/news/:slug" element={<PostDetail />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Admin - Login / Register */}
        <Route path="/admin" element={<Admin />} />

        {/* Catch all routes: redirect to home */}
        <Route path="*" element={<Home />} />

      </Route>

    </Routes>
  )
}

export default App
