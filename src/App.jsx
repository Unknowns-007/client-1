import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SplashLoader from './components/SplashLoader'

import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Blog from './pages/Blog'
import BloodAvailability from './pages/BloodAvailability'
import RaiseIssue from './pages/RaiseIssue'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading && <SplashLoader onDone={() => setLoading(false)} />}

      <div
        className="flex flex-col min-h-screen w-full overflow-x-hidden"
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1C1C1C',
                color: '#f5f5f5',
                border: '1px solid #333',
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  )
}
