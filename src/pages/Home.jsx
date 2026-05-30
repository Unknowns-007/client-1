import { Link } from 'react-router-dom'
import { AlertTriangle, Droplets, CalendarDays, FileText, Users, ChevronRight } from 'lucide-react'

const quickLinks = [
  { to: '/raise-issue', label: 'மக்கள் குரல் | Civic Whistle', desc: 'புகார் தெரிவிக்க மற்றும் வார்டு தீர்வுகளைக் கோர. Report negligence and request local ward resolutions.', icon: AlertTriangle, color: '#800000', glow: 'rgba(128,0,0,0.06)' },
  { to: '/blood', label: 'குருதி கொடை | Blood Registry', desc: 'குருதி அலகுகளைக் கோர அல்லது கொடையாளராகப் பதிய. Request blood units or register as an active donor.', icon: Droplets, color: '#a81c1c', glow: 'rgba(168,28,28,0.05)' },
  { to: '/events', label: 'மக்கள் நலப்பணிகள் | Welfare Work', desc: 'நடைபெறும் மக்கள் நல முகாம்களில் பங்கேற்க. Explore and participate in upcoming constituency welfare camps.', icon: CalendarDays, color: '#a6841b', glow: 'rgba(166,132,27,0.05)' },
  { to: '/about', label: 'நமது பிரதிநிதிகள் | Meet Leaders', desc: 'வார்டு ஒருங்கிணைப்பாளர்களைச் சந்திக்க. Meet your local representatives and organizers.', icon: Users, color: '#2563eb', glow: 'rgba(37,99,235,0.05)' },
  { to: '/blog', label: 'செய்தி வெளியீடுகள் | Press Briefs', desc: 'அதிகாரப்பூர்வ கொள்கை அறிக்கைகளைப் படிக்க. Read official press briefs, statements, and manifestos.', icon: FileText, color: '#7c3aed', glow: 'rgba(124,58,237,0.05)' },
]

const stats = [
  { label: 'தீர்க்கப்பட்டவை | Issues Resolved', value: '1,200+' },
  { label: 'நடத்தப்பட்டவை | Events Conducted', value: '84' },
  { label: 'குருதி அலகுகள் | Blood Units Tracked', value: '300+' },
  { label: 'பயன்பெற்ற மக்கள் | Citizens Served', value: '50,000+' },
]

export default function Home() {
  return (
    <div className="pt-16">

      {/* ── Hero ── */}
      <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, #faf7f0, #f5f1e8)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 30%, rgba(128,0,0,0.04), transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 70%, rgba(212,175,55,0.03), transparent 60%)' }} />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(128,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(128,0,0,0.15) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '500px', height: '500px',
            top: '-100px', left: '-100px',
            background: 'radial-gradient(circle, rgba(128,0,0,0.03) 0%, transparent 70%)',
            animation: 'orb-drift 15s ease-in-out infinite',
            borderRadius: '50%',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: '400px', height: '400px',
            bottom: '-80px', right: '-80px',
            background: 'radial-gradient(circle, rgba(212,175,55,0.02) 0%, transparent 70%)',
            animation: 'orb-drift 18s ease-in-out infinite reverse',
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 md:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Left Column: Text & CTAs */}
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start pb-4 lg:pb-10">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8"
              style={{
                background: 'rgba(128,0,0,0.05)',
                border: '1px solid rgba(128,0,0,0.18)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shrink-0" style={{ background: '#800000' }} />
              <span className="text-[10px] sm:text-xs md:text-sm font-extrabold tracking-wide uppercase" style={{ color: '#800000' }}>ராயபுரம் த.வெ.க இணையதளம் | Official TVK Royapuram Portal</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-4 sm:mb-6" style={{ color: '#1c0d0d', letterSpacing: '-0.03em' }}>
              <span
                className="block mb-1"
                style={{
                  background: 'linear-gradient(135deg, #800000 0%, #d4af37 50%, #800000 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 5s linear infinite',
                }}
              >
                தமிழக வெற்றிக் கழகம்
              </span>
              <span className="block text-xl sm:text-3xl md:text-4xl font-extrabold tracking-wide uppercase mt-2 sm:mt-3" style={{ color: '#5c4e4b' }}>
                TVK Royapuram
              </span>
            </h1>

            <p className="text-xs sm:text-base font-bold italic mb-6 sm:mb-8 text-center lg:text-left w-full" style={{ color: '#a6841b' }}>
              "பிறப்பொக்கும் எல்லா உயிர்க்கும்" | "All beings are born equal"
            </p>

            {/* Mobile-Only Hero Image (Organically Placed) */}
            <div className="block lg:hidden w-full max-w-[280px] sm:max-w-sm mx-auto mb-6 relative">
              {/* Soft background ambient glow */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(128,0,0,0.15) 0%, rgba(212,175,55,0.08) 70%, transparent 100%)',
                }}
              />
              <img
                src="/tvk_hero.png"
                alt="TVK Official Campaign"
                loading="eager"
                decoding="async"
                className="w-full h-auto object-contain rounded-2xl relative z-10 hero-image-reveal"
              />
            </div>

            <p className="text-sm sm:text-lg md:text-xl max-w-xl lg:max-w-none mb-6 sm:mb-8 leading-relaxed font-medium" style={{ color: '#5c4e4b' }}>
              உள்ளூர் த.வெ.க அலுவலகம் — மக்களை இணைத்தல், பிரச்சினைகளைத் தீர்த்தல் மற்றும் வெளிப்படையான நலத்திட்டங்கள். Connecting communities, resolving local issues, and delivering transparent welfare for every citizen.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full max-w-sm sm:max-w-none px-4 sm:px-0">
              <Link to="/raise-issue" className="btn-primary w-full sm:w-auto justify-center text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
                <AlertTriangle size={18} />
                புகார் செய் | Report an Issue
              </Link>
              <Link to="/about" className="btn-outline w-full sm:w-auto justify-center text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4">
                <Users size={18} />
                தலைவர்கள் | Meet Our Leaders
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image (Desktop Only) */}
          <div className="hidden lg:flex flex-1 w-full max-w-xs sm:max-w-md lg:max-w-xl justify-center items-center relative">
            {/* Soft background ambient glow */}
            <div
              className="absolute -inset-4 rounded-3xl opacity-25 blur-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(128,0,0,0.15) 0%, rgba(212,175,55,0.08) 70%, transparent 100%)',
              }}
            />
            <img
              src="/tvk_hero.png"
              alt="TVK Official Campaign"
              loading="eager"
              decoding="async"
              className="w-full h-auto object-contain rounded-2xl relative z-10 transition-transform duration-500 hover:scale-[1.01] pb-7 pl-6 hero-image-reveal"
            />
          </div>

        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, #faf7f0, transparent)' }} />
      </section>

      {/* ── Quick Access ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-badge mx-auto w-fit">
            <ChevronRight size={13} />
            உடனடி சேவைகள் | Quick Access
          </div>
          <h2 className="section-title">தேவையான சேவைகள் | Everything You Need</h2>
          <p className="section-subtitle mx-auto text-center font-medium">அனைத்து அத்தியாவசிய சேவைகளும் ஒரு கிளிக்கில். One click away from every essential welfare service.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickLinks.map(({ to, label, desc, icon: Icon, color, glow }) => (
            <Link
              key={to}
              to={to}
              className="group relative rounded-2xl p-6 flex flex-col items-center gap-3 text-center transition-all duration-300 overflow-hidden"
              style={{
                background: '#ffffff',
                border: '1px solid #e6dfd0',
                boxShadow: '0 4px 16px rgba(35,25,23,0.02)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = color + '66'
                e.currentTarget.style.boxShadow = `0 12px 30px ${glow.replace('0.05', '0.12')}, 0 4px 12px rgba(35,25,23,0.03)`
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e6dfd0'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(35,25,23,0.02)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Top shimmer on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }}
              />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-1 shrink-0"
                style={{ background: `${color}0b`, border: `1px solid ${color}25` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <span className="text-gray-800 font-extrabold text-sm transition-colors duration-200 group-hover:text-[#800000]">{label}</span>
              <p className="text-[11px] text-gray-500 font-semibold leading-normal">{desc}</p>
              <div className="flex items-center gap-1 mt-auto pt-2 text-xs font-bold transition-colors duration-200" style={{ color }}>
                <span>அணுகுக | Access</span>
                <ChevronRight
                  size={12}
                  className="transition-all duration-300 group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Movement in Action ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#e6dfd0]">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: GIF Campaign Box */}
          <div className="flex-1 w-full max-w-md lg:max-w-xl flex justify-center items-center relative group">
            {/* Soft background ambient glow */}
            <div
              className="absolute -inset-4 rounded-3xl opacity-15 group-hover:opacity-25 transition-opacity duration-700 blur-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #800000 0%, #d4af37 70%, transparent 100%)',
              }}
            />
            {/* Elegant double border frames for editorial styling */}
            <div
              className="relative w-full aspect-[4/3] rounded-3xl p-1 overflow-hidden transition-all duration-700 shadow-xl group-hover:shadow-[0_20px_50px_rgba(128,0,0,0.12)]"
              style={{
                background: 'linear-gradient(135deg, rgba(128,0,0,0.2) 0%, rgba(212,175,55,0.15) 50%, rgba(128,0,0,0.1) 100%)',
              }}
            >
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-[#1c0d0d] relative">
                <img
                  src="/tvk_gif.gif"
                  alt="TVK Welfare in Action"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="flex-1 text-center lg:text-left">
            <div className="section-badge w-fit mx-auto lg:mx-0">
              களப்பணிகள் | Grassroots Work
            </div>
            <h2 className="section-title mb-6">மக்கள் நலப்பணி மற்றும் தலைமை | Welfare &amp; Leadership in Action</h2>
            <p className="text-base md:text-lg mb-6 leading-relaxed font-medium" style={{ color: '#5c4e4b' }}>
              தமிழக வெற்றி கழகம் மக்களின் நலனுக்காக நேரடியாக களத்தில் செயல்படுகிறது. From distributing essential resources to conducting free medical checkups, our local leaders and volunteers are dedicated to making a direct difference in every household.
            </p>
            <div className="w-full h-px my-6" style={{ background: 'linear-gradient(90deg, #e6dfd0, transparent)' }} />
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/events" className="btn-primary" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
                பணிகளை காண்க | View Welfare Activities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Announcement Banner ── */}
      <section className="py-16 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(128,0,0,0.04) 0%, rgba(212,175,55,0.02) 50%, rgba(128,0,0,0.03) 100%)',
            borderTop: '1px solid rgba(212,175,55,0.22)',
            borderBottom: '1px solid rgba(212,175,55,0.22)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#d4af37' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a6841b', letterSpacing: '0.15em' }}>நேரடி அறிவிப்பு | Live Announcement</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-tvk-red-dark mb-2">இரத்த தான முகாம் | Blood Donation Camp</h2>
              <p className="font-medium" style={{ color: '#5c4e4b' }}>
                இந்த ஞாயிற்றுக்கிழமை நடைபெறும் முகாமில் பங்கேற்க அழைக்கிறோம். Join us this Sunday at the Community Hall — all blood groups needed urgently.
              </p>
            </div>
            <Link to="/blood" className="btn-yellow shrink-0">
              <Droplets size={18} />
              இருப்பைச் சரிபார் | Check Blood Stock
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="card text-center"
            >
              <p
                className="text-3xl md:text-4xl font-black mb-2"
                style={{
                  background: 'linear-gradient(135deg, #800000 0%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}
              </p>
              <p className="text-sm font-bold" style={{ color: '#6e5d59' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
