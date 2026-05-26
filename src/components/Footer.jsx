import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import WhistleSymbol from './WhistleSymbol'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-tvk-red to-tvk-yellow rounded-xl flex items-center justify-center shadow-lg shadow-tvk-red/20">
                <WhistleSymbol size={26} />
              </div>
              <div>
                <p className="text-white font-bold text-base">TVK Royapuram</p>
                <p className="text-gray-500 text-xs">Tamilaga Vettri Kazhagam</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting citizens with their community leaders. Transparent governance at the grassroots level.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'Our Leaders' },
                { to: '/events', label: 'Events & Work' },
                { to: '/blood', label: 'Blood Availability' },
                { to: '/raise-issue', label: 'Raise an Issue' },
                { to: '/blog', label: 'Press Releases' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-tvk-yellow text-sm transition-colors flex items-center gap-2"
                  >
                    <ExternalLink size={12} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-tvk-red mt-0.5 shrink-0" />
                <span>TVK Local Office, Constituency Ward, Tamil Nadu</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="text-tvk-red shrink-0" />
                <span>+91 00000 00000</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="text-tvk-red shrink-0" />
                <span>office@tvk-constituency.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} TVK Royapuram · Tamilaga Vettri Kazhagam. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Built for grassroots democracy · Powered by TVK
          </p>
        </div>
      </div>
    </footer>
  )
}
