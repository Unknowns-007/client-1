import { Link } from 'react-router-dom'
import { AlertTriangle, Droplets, CalendarDays, FileText, Users, ChevronRight } from 'lucide-react'

const quickLinks = [
  { to: '/raise-issue', label: 'Raise an Issue', icon: AlertTriangle, color: 'text-tvk-red', bg: 'bg-tvk-red/10 border-tvk-red/20' },
  { to: '/blood', label: 'Blood Availability', icon: Droplets, color: 'text-red-400', bg: 'bg-red-900/20 border-red-700/20' },
  { to: '/events', label: 'Local Events', icon: CalendarDays, color: 'text-tvk-yellow', bg: 'bg-tvk-yellow/10 border-tvk-yellow/20' },
  { to: '/about', label: 'Our Leaders', icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700/20' },
  { to: '/blog', label: 'Press Releases', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-700/20' },
]

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0000] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.08),transparent_60%)]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-tvk-red/10 border border-tvk-red/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-tvk-red rounded-full animate-pulse" />
            <span className="text-tvk-red text-sm font-medium">Official TVK Royapuram Constituency Portal</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            <span className="block">TVK Royapuram</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-tvk-red via-tvk-yellow to-tvk-red">
              வெற்றி தமிழகம்
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            Your local TVK office — connecting communities, resolving issues, and delivering transparent welfare for every citizen.
          </p>

          <p className="text-tvk-yellow/80 text-base font-medium italic mb-10">
            "மக்களுக்காக · For the People"
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Link to="/raise-issue" className="btn-primary w-full sm:w-auto justify-center text-base px-8 py-4">
              <AlertTriangle size={18} />
              Report an Issue
            </Link>
            <Link to="/about" className="btn-outline w-full sm:w-auto justify-center text-base px-8 py-4">
              <Users size={18} />
              Meet Our Leaders
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </section>

      {/* Quick Access */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Quick Access</h2>
          <p className="section-subtitle mx-auto">Everything your constituency needs, one click away.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickLinks.map(({ to, label, icon: Icon, color, bg }) => (
            <Link
              key={to}
              to={to}
              className={`group border ${bg} rounded-xl p-6 flex flex-col items-center gap-4 text-center hover:scale-[1.03] transition-all duration-300 hover:shadow-xl`}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} border flex items-center justify-center`}>
                <Icon size={22} className={color} />
              </div>
              <span className="text-white font-medium text-sm">{label}</span>
              <ChevronRight size={16} className={`${color} group-hover:translate-x-1 transition-transform`} />
            </Link>
          ))}
        </div>
      </section>

      {/* Announcements Banner */}
      <section className="py-16 bg-gradient-to-r from-tvk-red/10 via-tvk-yellow/5 to-tvk-red/10 border-y border-tvk-red/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-tvk-yellow rounded-full animate-pulse" />
                <span className="text-tvk-yellow text-sm font-semibold uppercase tracking-wider">Live Announcement</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Blood Donation Camp</h2>
              <p className="text-gray-400 mt-2">Join us this Sunday at the Community Hall — all blood groups needed urgently.</p>
            </div>
            <Link to="/blood" className="btn-yellow shrink-0">
              <Droplets size={18} />
              Check Blood Stock
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Issues Resolved', value: '1,200+' },
            { label: 'Events Conducted', value: '84' },
            { label: 'Blood Units Tracked', value: '300+' },
            { label: 'Citizens Served', value: '50,000+' },
          ].map(({ label, value }) => (
            <div key={label} className="card text-center">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-tvk-red to-tvk-yellow">
                {value}
              </p>
              <p className="text-gray-400 text-sm mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
