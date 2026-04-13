import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import './App.css'
import MainLayout from './pages/layouts/MainLayout.jsx'

function App() {
  return (
    <Routes>

      <Route element={<MainLayout />}  >

        {/* Home - Landing Page */}
        <Route path="/" element={<Home />} />


        {/* Catch all routes: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>

    </Routes>
  )
}

export default App
