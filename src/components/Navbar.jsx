import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, AlertTriangle } from 'lucide-react'
import WhistleSymbol from './WhistleSymbol'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/blog', label: 'Blog' },
  { to: '/blood', label: 'Blood' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pulsing, setPulsing] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const triggerPulse = () => {
      setPulsing(true)
      const timer = setTimeout(() => setPulsing(false), 6000)
      return () => clearTimeout(timer)
    }
    window.addEventListener('trigger-header-pulse', triggerPulse)
    return () => window.removeEventListener('trigger-header-pulse', triggerPulse)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        pulsing ? 'header-heartbeat-active' : ''
      }`}
      style={{
        background: scrolled
          ? 'rgba(28, 13, 13, 0.96)'
          : 'rgba(28, 13, 13, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(212, 175, 55, 0.35)'
          : '1px solid rgba(212, 175, 55, 0.2)',
        boxShadow: scrolled
          ? '0 4px 30px rgba(28, 13, 13, 0.45), 0 1px 0 rgba(212, 175, 55, 0.15)'
          : 'none',
      }}
    >
      {/* Top glow line */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(128,0,0,0.8) 30%, rgba(212,175,55,0.6) 70%, transparent)',
          opacity: scrolled ? 1 : 0.6,
          transition: 'opacity 0.5s',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, #800000 0%, #5c0000 60%, #800000 100%)',
                boxShadow: '0 4px 16px rgba(128,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                border: '1px solid rgba(212,175,55,0.25)',
              }}
            >
              <WhistleSymbol size={36} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-sm tracking-wide">TVK Royapuram</span>
              <span className="text-xs font-medium" style={{ color: 'rgba(212,175,55,0.85)' }}>Constituency Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
                style={({ isActive }) => isActive ? {
                  background: 'rgba(128, 0, 0, 0.18)',
                  color: '#f3e1a0',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 0 12px rgba(128, 0, 0, 0.15)',
                } : {}}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* CTA Button — desktop */}
          <div className="hidden md:block">
            <Link to="/raise-issue" className="btn-primary text-sm py-2 px-5" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
              Report an Issue
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          className="md:hidden px-4 pb-5 pt-2"
          style={{
            background: 'rgba(28, 13, 13, 0.98)',
            borderTop: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div className="space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
                style={({ isActive }) => isActive ? {
                  background: 'rgba(128,0,0,0.18)',
                  color: '#f3e1a0',
                  border: '1px solid rgba(212,175,55,0.25)',
                } : {}}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}>
            <Link
              to="/raise-issue"
              className="btn-primary text-sm py-2.5 w-full justify-center"
              style={{ border: '1px solid rgba(212,175,55,0.3)' }}
            >
              Report an Issue
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
