import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SplashLoader from './components/SplashLoader'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Blog from './pages/Blog'
import BloodAvailability from './pages/BloodAvailability'
import RaiseIssue from './pages/RaiseIssue'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AuthProvider>
      {loading && <SplashLoader onDone={() => setLoading(false)} />}

      <div
        className={`flex flex-col min-h-screen w-full overflow-x-hidden ${!loading ? 'loaded' : ''}`}
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <BrowserRouter>
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#231917',
                border: '1px solid #e6dfd0',
                fontWeight: '600',
              },
            }}
          />
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blood" element={<BloodAvailability />} />
              <Route path="/raise-issue" element={<RaiseIssue />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}
