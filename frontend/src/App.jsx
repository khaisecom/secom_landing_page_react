import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuth } from './store/authSlice.js'
import Home from './pages/home/Home.jsx'
import Admin from './pages/admin/Admin.jsx'
import RecruitmentPage from './pages/recruitment/Recruitment.jsx'
import JobDetail from './pages/recruitment/JobDetail.jsx'
import News from './pages/news/News.jsx'
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

        {/* Recruitment */}
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/recruitment/:id" element={<JobDetail />} />

        {/* News */}
        <Route path="/news" element={<News />} />

        {/* Admin - Login / Register */}
        <Route path="/admin" element={<Admin />} />

        {/* Catch all routes: redirect to home */}
        <Route path="*" element={<Home />} />

      </Route>

    </Routes>
  )
}

export default App
