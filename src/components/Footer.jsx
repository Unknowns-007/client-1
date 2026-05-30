import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ExternalLink, Flame } from 'lucide-react'
import WhistleSymbol from './WhistleSymbol'

const footerLinks = [
  { to: '/about', label: 'Our Leaders' },
  { to: '/events', label: 'Events & Work' },
  { to: '/blood', label: 'Blood Availability' },
  { to: '/raise-issue', label: 'Raise an Issue' },
  { to: '/blog', label: 'Press Releases' },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden" style={{ background: '#1c0d0d' }}>

      {/* Top gradient border */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(128,0,0,0.8) 20%, rgba(212,175,55,0.6) 50%, rgba(128,0,0,0.8) 80%, transparent)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: '0 20%',
          filter: 'blur(8px)',
          background: 'linear-gradient(90deg, rgba(128,0,0,0.5), rgba(212,175,55,0.4), rgba(128,0,0,0.5))',
          opacity: 0.6,
        }} />
      </div>

      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '200px',
        background: 'radial-gradient(ellipse at top, rgba(128,0,0,0.08), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #800000 0%, #5c0000 100%)',
                  boxShadow: '0 4px 20px rgba(128,0,0,0.35)',
                  border: '1px solid rgba(212,175,55,0.25)',
                }}
              >
                <WhistleSymbol size={42} />
              </div>
              <div>
                <p className="text-white font-bold text-base">TVK Royapuram</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(212,175,55,0.85)' }}>Tamilaga Vettri Kazhagam</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,235,0.75)' }}>
              Connecting citizens with their community leaders. Transparent governance at the grassroots level.
            </p>

            {/* Tagline chip */}
            <div
              className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.25)',
                color: 'rgba(212,175,55,0.95)',
              }}
            >
              <Flame size={11} />
              பிறப்பொக்கும் எல்லா உயிர்க்கும்
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="font-extrabold mb-5 text-xs uppercase tracking-widest"
              style={{ color: '#d4af37', letterSpacing: '0.15em' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm transition-all duration-200 group"
                    style={{ color: 'rgba(245,240,235,0.75)' }}
                  >
                    <ExternalLink
                      size={11}
                      className="transition-colors duration-200 group-hover:text-tvk-yellow"
                      style={{ color: 'rgba(212,175,55,0.6)' }}
                    />
                    <span className="group-hover:text-white transition-colors duration-200 font-medium">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="font-extrabold mb-5 text-xs uppercase tracking-widest"
              style={{ color: '#d4af37', letterSpacing: '0.15em' }}
            >
              Contact
            </h3>
            <ul className="space-y-4">
              {[
                { Icon: MapPin, text: 'TVK Local Office, Royapuram, Chennai, Tamil Nadu' },
                { Icon: Phone, text: '+91 00000 00000' },
                { Icon: Mail, text: 'office@tvk-constituency.in' },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(245,240,235,0.75)' }}>
                  <Icon size={15} style={{ color: '#d4af37', marginTop: '2px' }} className="shrink-0" />
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(245,240,235,0.45)' }}>
            © {new Date().getFullYear()} TVK Royapuram · Tamilaga Vettri Kazhagam. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(245,240,235,0.45)' }}>
            Built for grassroots democracy · Powered by TVK
          </p>
        </div>
      </div>
    </footer>
  )
}
