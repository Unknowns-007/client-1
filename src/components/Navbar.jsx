import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import WhistleSymbol from './WhistleSymbol'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/blog', label: 'Blog' },
  { to: '/blood', label: 'Blood' },
  { to: '/raise-issue', label: 'Raise Issue' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-tvk-red to-tvk-yellow rounded-xl flex items-center justify-center shadow-lg shadow-tvk-red/30 group-hover:scale-105 transition-transform">
              <WhistleSymbol size={24} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-sm tracking-wide">TVK Royapuram</span>
              <span className="text-gray-400 text-xs">Constituency Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-tvk-yellow bg-tvk-red/10 border border-tvk-red/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Raise Issue CTA — desktop */}
          <div className="hidden md:block">
            <Link to="/raise-issue" className="btn-primary text-sm py-2 px-5">
              Report an Issue
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-border px-4 pb-4 pt-2">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-tvk-yellow bg-tvk-red/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="mt-3 pt-3 border-t border-border">
            <Link
              to="/raise-issue"
              onClick={() => setOpen(false)}
              className="btn-primary text-sm py-2.5 w-full justify-center"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
