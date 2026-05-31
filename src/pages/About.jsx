import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Phone, Mail, MapPin, Users, ChevronDown } from 'lucide-react'

/* ──────────────────────────────────────────────────────────────────
   ALL KEYFRAMES
────────────────────────────────────────────────────────────────── */
const KEYFRAMES = `
  /* Hero */
  @keyframes heroBgIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes heroPhotoZoom {
    from { opacity: 0; transform: scale(1.12); filter: brightness(0.5) blur(6px); }
    to   { opacity: 1; transform: scale(1);    filter: brightness(1)   blur(0px); }
  }
  @keyframes heroNameSlideUp {
    from { transform: translateY(110%); }
    to   { transform: translateY(0);    }
  }
  @keyframes heroBadgeIn {
    from { opacity: 0; transform: translateX(-28px) scale(0.92); }
    to   { opacity: 1; transform: translateX(0)     scale(1);    }
  }
  @keyframes heroLineDraw {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes heroCtaUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes heroRingReveal {
    from { opacity: 0; transform: scale(0.75); }
    to   { opacity: 1; transform: scale(1);    }
  }
  @keyframes heroRingPulse {
    0%,100% { opacity: 0.18; transform: scale(1);    }
    50%     { opacity: 0.38; transform: scale(1.04); }
  }
  @keyframes heroGlowBreath {
    0%,100% { opacity: 0.45; }
    50%     { opacity: 0.75; }
  }
  @keyframes heroScrollBounce {
    0%,100% { transform: translateY(0);   opacity: 0.7; }
    50%     { transform: translateY(9px); opacity: 0.3; }
  }
  @keyframes heroGridPan {
    from { background-position: 0 0; }
    to   { background-position: 60px 60px; }
  }
  @keyframes shimmerGold {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  /* Leader rows */
  @keyframes leaderSlideLeft {
    from { opacity: 0; transform: translateX(-80px) scale(0.96); }
    to   { opacity: 1; transform: translateX(0)     scale(1);    }
  }
  @keyframes leaderSlideRight {
    from { opacity: 0; transform: translateX(80px)  scale(0.96); }
    to   { opacity: 1; transform: translateX(0)     scale(1);    }
  }
  @keyframes leaderContentReveal {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Mobile styling overrides specifically for hero and leader portraits */
  @media (max-width: 1023px) {
    .mobile-hero-photo-panel {
      height: 48vh !important;
      min-height: 380px !important;
      max-height: 50vh !important;
    }
    .mobile-hero-text-panel {
      padding-top: 3rem !important;
      padding-bottom: 6rem !important;
    }
  }
  @media (max-width: 767px) {
    .mobile-leader-img-container {
      min-height: 300px !important;
      margin-bottom: 1.5rem !important;
    }
    .mobile-leader-img {
      max-height: 380px !important;
    }
  }
`

/* ──────────────────────────────────────────────────────────────────
   VIJAY HERO — Full-viewport cinematic hero section
────────────────────────────────────────────────────────────────── */
function VijayHero({ leader }) {
  const contact = leader.contact_details || {}

  // Gracefully parse and split leader names, with a custom layout rule for Thalapathy Vijay
  let firstName = 'தமிழக முதலமைச்சர்'
  let lastName = 'C. ஜோசப் விஜய்'
  let englishSub = '(Thalapathy Vijay)'
  if (leader.name) {
    let nameStr = leader.name
    if (nameStr.includes('(')) {
      const startIdx = nameStr.indexOf('(')
      englishSub = nameStr.substring(startIdx)
      nameStr = nameStr.substring(0, startIdx).trim()
    } else {
      englishSub = ''
    }
    
    if (nameStr.includes('தமிழக முதலமைச்சர்')) {
      firstName = 'தமிழக முதலமைச்சர்'
      lastName = nameStr.replace('தமிழக முதலமைச்சர்', '').trim()
    } else {
      const idx = nameStr.indexOf(' ')
      if (idx !== -1) {
        firstName = nameStr.substring(0, idx)
        lastName = nameStr.substring(idx + 1)
      } else {
        firstName = nameStr
        lastName = ''
      }
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        minHeight: '100vh',
        background: '#060101',
        animation: 'heroBgIn 0.6s ease both',
      }}
    >
      {/* ── Animated grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'heroGridPan 20s linear infinite',
        }}
      />

      {/* ── Atmospheric red glow (right side, near photo) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, right: 0, bottom: 0,
          width: '55%',
          background: 'radial-gradient(ellipse 70% 80% at 80% 55%, rgba(128,0,0,0.55) 0%, rgba(60,0,0,0.25) 45%, transparent 70%)',
          animation: 'heroGlowBreath 5s ease-in-out infinite',
        }}
      />

      {/* ── Top gold accent line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 30%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0.6) 70%, transparent 100%)' }}
      />

      {/* ── Bottom gold accent line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)' }}
      />

      {/* ══════════ MAIN CONTENT ROW ══════════ */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center max-w-none w-full" style={{ minHeight: '100vh' }}>

        {/* ─── LEFT: Text panel ─── */}
        <div
          className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24 lg:py-0 w-full lg:w-[52%] shrink-0 order-2 lg:order-1 mobile-hero-text-panel"
          style={{ zIndex: 2 }}
        >
          {/* Designation badge */}
          <div style={{ animation: 'heroBadgeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s both' }}>
            <span
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] px-4 py-2 rounded-full mb-8"
              style={{
                background: 'rgba(128,0,0,0.35)',
                border: '1px solid rgba(255,90,90,0.25)',
                color: 'rgba(255,170,170,0.95)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" style={{ animation: 'heroGlowBreath 2s ease-in-out infinite' }} />
              {leader.designation}
            </span>
          </div>

          {/* Name — each line in an overflow:hidden clip so it slides up from below */}
          <div style={{ marginBottom: '0.15em' }}>
            <div className="overflow-hidden" style={{ lineHeight: 1.05 }}>
              <div
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.035em',
                  animation: 'heroNameSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 1.15s both',
                }}
              >
                {firstName}
              </div>
            </div>
            {lastName && (
              <div className="overflow-hidden" style={{ lineHeight: 1.05, marginTop: '0.1em' }}>
                <div
                  style={{
                    fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.035em',
                    background: 'linear-gradient(90deg, #c8922a, #f5d97a, #d4af37, #f5d97a, #c8922a)',
                    backgroundSize: '300% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'heroNameSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 1.35s both, shimmerGold 4s linear 2.4s infinite',
                  }}
                >
                  {lastName} {englishSub && (
                    <span className="text-xl md:text-2xl font-bold opacity-85 ml-3 tracking-wide" style={{ WebkitTextFillColor: '#ffffff', color: '#ffffff' }}>
                      {englishSub}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Gold decorative rule */}
          <div
            style={{
              transformOrigin: 'left center',
              animation: 'heroLineDraw 0.7s cubic-bezier(0.16,1,0.3,1) 1.7s both',
              marginBottom: '1.5rem',
              marginTop: '1.2rem',
            }}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: '3rem', height: '2px', background: '#d4af37', borderRadius: '2px' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d4af37' }} />
              <div style={{ width: '1.5rem', height: '2px', background: 'rgba(212,175,55,0.4)', borderRadius: '2px' }} />
            </div>
          </div>

          {/* Tamil Brief Description */}
          {leader.description && (
            <p
              className="text-[#e6dfd0] font-medium leading-relaxed max-w-xl"
              style={{
                color: 'rgba(255,255,255,0.85)',
                lineHeight: '1.75',
                fontSize: '14.5px',
                animation: 'heroCtaUp 0.7s cubic-bezier(0.16,1,0.3,1) 1.85s both',
              }}
            >
              {leader.description}
            </p>
          )}
        </div>

        {/* ─── RIGHT: Full-bleed photo panel ─── */}
        <div
          className="relative w-full lg:w-[48%] order-1 lg:order-2 shrink-0 overflow-hidden mobile-hero-photo-panel"
          style={{ minHeight: '60vw', maxHeight: '100vh', alignSelf: 'stretch' }}
        >
          {/* Full-bleed cover photo with zoom-in reveal */}
          {leader.photo_url ? (
            <img
              src={leader.photo_url}
              alt={leader.name}
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                userSelect: 'none',
                animation: 'heroPhotoZoom 1.4s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                willChange: 'transform, opacity, filter',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(128,0,0,0.3) 0%, rgba(10,2,2,0.8) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={80} style={{ color: 'rgba(128,0,0,0.3)' }} />
            </div>
          )}

          {/* Left vignette — blends photo into the dark text panel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(6,1,1,0.92) 0%, rgba(6,1,1,0.5) 25%, rgba(6,1,1,0.1) 55%, transparent 100%)',
            }}
          />

          {/* Top vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(6,1,1,0.6) 0%, transparent 30%, transparent 65%, rgba(6,1,1,0.7) 100%)',
            }}
          />

          {/* Diagonal gold accent lines (reveals after photo) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ animation: 'heroRingReveal 0.8s ease 1.4s both' }}
          >
            <div style={{
              position: 'absolute',
              top: '12%', right: '10%',
              width: '50px', height: '1px',
              background: 'rgba(212,175,55,0.45)',
              transform: 'rotate(-45deg)',
            }} />
            <div style={{
              position: 'absolute',
              top: '17%', right: '13%',
              width: '24px', height: '1px',
              background: 'rgba(212,175,55,0.25)',
              transform: 'rotate(-45deg)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '18%', right: '12%',
              width: '40px', height: '1px',
              background: 'rgba(212,175,55,0.3)',
              transform: 'rotate(-45deg)',
            }} />
            {/* Corner frame accents */}
            <div style={{
              position: 'absolute',
              top: '8%', right: '8%',
              width: '32px', height: '32px',
              borderTop: '1.5px solid rgba(212,175,55,0.4)',
              borderRight: '1.5px solid rgba(212,175,55,0.4)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '8%', right: '8%',
              width: '32px', height: '32px',
              borderBottom: '1.5px solid rgba(212,175,55,0.35)',
              borderRight: '1.5px solid rgba(212,175,55,0.35)',
            }} />
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ animation: 'heroCtaUp 0.6s ease 2.5s both' }}
      >
        <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: 'rgba(212,175,55,0.4)' }}>
          கீழே செல்லவும்
        </span>
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: '1.5px solid rgba(212,175,55,0.25)' }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{
              background: 'rgba(212,175,55,0.6)',
              animation: 'heroScrollBounce 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────
   LEADER ROW — alternating layout for remaining leaders
   index 0 → image RIGHT, index 1 → image LEFT, etc.
────────────────────────────────────────────────────────────────── */
function LeaderRow({ leader, index }) {
  const contact     = leader.contact_details || {}
  const isImageLeft = index % 2 !== 0
  const rowRef      = useRef(null)
  const observerRef = useRef(null)

  const [phase, setPhase] = useState('idle')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 'idle') {
          setPhase('img')
          observerRef.current?.disconnect()
        }
      },
      { threshold: 0.18 }
    )
    if (rowRef.current) observerRef.current.observe(rowRef.current)
    return () => observerRef.current?.disconnect()
  }, [phase])

  function handleImageAnimEnd() {
    if (phase === 'img') setPhase('content')
  }

  const imgVisible     = phase === 'img' || phase === 'content'
  const contentVisible = phase === 'content'

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full flex flex-col items-center overflow-hidden py-16 px-4 md:px-12"
      style={{
        background: index % 2 === 0
          ? 'linear-gradient(180deg, rgba(250,247,240,1) 0%, rgba(255,253,250,1) 100%)'
          : 'linear-gradient(180deg, rgba(255,254,252,1) 0%, rgba(250,247,240,1) 100%)',
        borderTop: '1px solid rgba(230,223,208,0.6)',
      }}
    >
      {/* CENTERED IMAGE CONTAINER */}
      <div
        className="relative flex items-end justify-center w-full max-w-4xl mobile-leader-img-container"
        style={{
          padding: '0 10px',
          minHeight: 'auto',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            opacity: imgVisible ? 1 : 0,
            animation: imgVisible
              ? `${index % 2 === 0 ? 'leaderSlideLeft' : 'leaderSlideRight'} 0.85s cubic-bezier(0.16,1,0.3,1) both`
              : 'none',
            willChange: 'transform, opacity',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            width: '100%',
            height: 'auto',
          }}
          onAnimationEnd={handleImageAnimEnd}
        >
          {leader.photo_url ? (
            <img
              src={leader.photo_url}
              alt={leader.name}
              draggable={false}
              className="mobile-leader-img"
              style={{
                maxHeight: '800px',
                maxWidth: '120%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                userSelect: 'none',
                filter: isHovered 
                  ? 'drop-shadow(0 25px 70px rgba(128,0,0,0.30))' 
                  : 'drop-shadow(0 15px 50px rgba(128,0,0,0.20))',
                transform: isHovered ? 'scale(1.15)' : 'scale(1.08)',
                transformOrigin: 'bottom center',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ) : (
            <div
              style={{
                width: '180px',
                height: '260px',
                borderRadius: '50% 50% 0 0 / 55% 55% 0 0',
                background: 'linear-gradient(180deg, rgba(128,0,0,0.1) 0%, rgba(212,175,55,0.06) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={56} style={{ color: 'rgba(128,0,0,0.22)', marginTop: '40px' }} />
            </div>
          )}
        </div>
      </div>

      {/* CENTERED CONTENT HALF */}
      <div
        className="relative flex flex-col items-center text-center w-full max-w-3xl px-6 md:px-10"
        style={{
          opacity: contentVisible ? 1 : 0,
          animation: contentVisible ? 'leaderContentReveal 0.7s cubic-bezier(0.16,1,0.3,1) both' : 'none',
          willChange: 'transform, opacity',
        }}
      >
        {/* Designation */}
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] px-3.5 py-2 rounded-full mb-6"
          style={{
            background: 'rgba(128,0,0,0.06)',
            border: '1px solid rgba(128,0,0,0.14)',
            color: '#800000',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-tvk-red animate-pulse" />
          {leader.designation}
        </span>

        {/* Name */}
        <h3
          className="font-black leading-tight mb-4"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#1c0d0d',
            letterSpacing: '-0.025em',
          }}
        >
          {leader.name}
        </h3>

        {/* Gold rule */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-0.5 w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.2), #d4af37, rgba(212,175,55,0.2))' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-tvk-yellow" />
          <div className="h-0.5 w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.2), #d4af37, rgba(212,175,55,0.2))' }} />
        </div>

        {/* Tamil/English 60-40 Description */}
        {leader.description && (
          <p
            className="text-sm font-semibold leading-relaxed mb-6 max-w-2xl text-center"
            style={{
              color: '#5c4e4b',
              lineHeight: '1.75',
              fontSize: '14.5px',
            }}
          >
            {leader.description}
          </p>
        )}

        {/* Vision Quote Callout */}
        {leader.quote && (
          <div
            className="border-y border-[#d4af37]/30 italic my-6 text-[#6e5d59] font-medium text-center"
            style={{
              fontSize: '14px',
              lineHeight: '1.65',
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.03), transparent)',
              padding: '16px 20px',
              maxWidth: '600px',
            }}
          >
            "{leader.quote}"
          </div>
        )}

        {/* Responsibilities List */}
        {leader.responsibilities && leader.responsibilities.length > 0 && (
          <div className="mb-8 w-full max-w-2xl text-left border border-[#e6dfd0] rounded-2xl p-6 md:p-8 bg-white/50 backdrop-blur-sm shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-tvk-red-dark mb-4 flex items-center gap-2 border-b border-[#e6dfd0] pb-2">
              <span className="w-2 h-2 rounded-full bg-tvk-red" />
              முக்கியப் பொறுப்புகள் | Key Responsibilities
            </h4>
            <ul className="space-y-3.5">
              {leader.responsibilities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-[#5c4e4b] font-semibold leading-relaxed">
                  <span className="text-[#d4af37] select-none text-sm leading-none mt-0.5">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact items */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl mt-4">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-3 py-3 px-5 rounded-2xl transition-all duration-300 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(230,223,208,0.7)', backdropFilter: 'blur(6px)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(128,0,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(128,0,0,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.borderColor = 'rgba(230,223,208,0.7)' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(128,0,0,0.06)' }}>
                <Phone size={13} style={{ color: '#800000' }} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#b8a9a4' }}>தொலைபேசி | Phone</p>
                <p className="text-xs font-extrabold" style={{ color: '#3d1a1a' }}>{contact.phone}</p>
              </div>
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 py-3 px-5 rounded-2xl transition-all duration-300 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(230,223,208,0.7)', backdropFilter: 'blur(6px)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.05)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.borderColor = 'rgba(230,223,208,0.7)' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.08)' }}>
                <Mail size={13} style={{ color: '#a6841b' }} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#b8a9a4' }}>மின்னஞ்சல் | Email</p>
                <p className="text-xs font-extrabold truncate" style={{ color: '#3d1a1a' }}>{contact.email}</p>
              </div>
            </a>
          )}
          {contact.address && (
            <div
              className="flex items-center gap-3 py-3 px-5 rounded-2xl shadow-sm"
              style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(230,223,208,0.7)', backdropFilter: 'blur(6px)' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(230,223,208,0.5)' }}>
                <MapPin size={13} style={{ color: '#6e5d59' }} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#b8a9a4' }}>இருப்பிடம் | Location</p>
                <p className="text-xs font-extrabold" style={{ color: '#3d1a1a' }}>{contact.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
/* ──────────────────────────────────────────────────────────────────
   MOCK DATA
────────────────────────────────────────────────────────────────── */
const MOCK_LEADERS = [
  {
    id: 1,
    name: 'தமிழக முதலமைச்சர் C. ஜோசப் விஜய் (Thalapathy Vijay)',
    designation: 'கட்சித் தலைவர் | Party President',
    description: 'தமிழகத்தின் புதிய அரசியல் விடியலுக்காகவும், மக்களின் நலனுக்காகவும் தமிழக வெற்றி கழகத்தை தோற்றுவித்த நமது தலைவர் மற்றும் தமிழக முதலமைச்சர். Our leader who founded Tamilaga Vettri Kazhagam to usher in a new political era of transparent, civic-minded governance across the state.',
    photo_url: '/abt_hero.jpg',
    contact_details: { phone: '+91 98765 43210', email: 'president@tvk.in', address: 'Panaiyur, Chennai' },
  },
  {
    id: 2,
    name: 'புஸ்ஸி N. ஆனந்த் (Bussy N. Anand)',
    designation: 'பொதுச் செயலாளர் | General Secretary',
    description: 'கட்சியின் கட்டமைப்பை வலுப்படுத்தி, அடிமட்ட தொண்டர்கள் வரை கொள்கைகளை கொண்டு சேர்க்கும் மக்கள் பணியில் அர்ப்பணிப்புடன் செயலாற்றுபவர். He works with absolute dedication to fortify state-level party infrastructure and expand grassroots mobilization across Tamil Nadu.',
    quote: 'தலைவர் தளபதியின் வழிகாட்டுதலின்படி, நேர்மையான மற்றும் தூய்மையான அரசியலை தமிழகத்தில் நிலைநிறுத்துவதே நமது லட்சியம்! Following the guidance of our leader, we stand to establish clean, corruption-free governance for the people.',
    responsibilities: [
      'கட்சியின் மாநில அளவிலான உள்கட்டமைப்பை நிர்வகித்தல் | Managing state-level party infrastructure and administration',
      'அடிமட்ட தொண்டர்களின் ஒருங்கிணைப்பு மற்றும் வழிகாட்டுதல் | Grassroots cadre coordination and field mobilization guidance',
      'கட்சி மாநாடுகள் மற்றும் முக்கிய நிகழ்வுகளை திட்டமிடுதல் | Organizing state conferences, public assemblies, and key party events'
    ],
    photo_url: '/anand.png',
    contact_details: { phone: '+91 98765 43211', email: 'gensec@tvk.in' },
  },
  {
    id: 3,
    name: 'ராயபுரம் K.V. தாமோதரன் (K.V. Damodharan)',
    designation: 'தொகுதிப் பொறுப்பாளர் | Constituency Head',
    description: 'ராயபுரம் தொகுதியின் மக்களின் குரலாகவும், கட்சியின் வளர்ச்சிப் பணிகளை முன்னின்று நடத்தும் அர்ப்பணிப்புள்ள மக்கள் பிரதிநிதி. Serving as the dedicated voice of Royapuram constituency, leading grassroots welfare operations and ensuring public requests are met.',
    quote: 'மக்களின் தேவைகளை நேரடியாகக் கண்டறிந்து, உடனடி தீர்வு காண்பதே எங்களின் முதன்மைப் பணி! Identifying local needs directly to deliver swift, transparent civic resolutions is our highest priority.',
    responsibilities: [
      'தொகுதி மக்களின் கோரிக்கைகளை அரசின் கவனத்திற்கு கொண்டு செல்லுதல் | Presenting constituency requests to corporation officials',
      'வட்டார அளவிலான மக்கள் நலத் திட்டங்களை மேற்பார்வையிடுதல் | Supervising local welfare programs and development activities',
      'இளைஞர் அணி மற்றும் மகளிர் அணி செயல்பாடுகளை ஒருங்கிணைத்தல் | Coordinating youth wing and women wing field operations'
    ],
    photo_url: '/kvdamu.png',
    contact_details: { phone: '+91 98765 43212', email: 'royapuram@tvk.in', address: 'Royapuram, Chennai' },
  },
  {
    id: 4,
    name: 'நல அதிகாரி | Welfare Officer',
    designation: 'வார்டு ஒருங்கிணைப்பாளர் | Ward Coordinator',
    description: 'மக்களின் அன்றாடத் தேவைகளைக் கேட்டு அறிந்து, வார்டு அளவில் நலத்திட்ட உதவிகளை வழங்கி வரும் பொறுப்பாளர். Responsible for monitoring ward-level civic issues and executing localized public aid campaigns.',
    contact_details: { phone: '+91 98765 43213' },
  },
]

/* ──────────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────────── */
export default function About() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('about_leads')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setLeaders(MOCK_LEADERS)
        } else {
          // Dynamic mapping to translate values loaded from Database to premium Tamil/English copy
          const mapped = data.map(lead => {
            if (lead.id === 1 || lead.name?.toLowerCase().includes('vijay')) {
              return {
                ...lead,
                name: 'தமிழக முதலமைச்சர் C. ஜோசப் விஜய் (Thalapathy Vijay)',
                designation: 'கட்சித் தலைவர் | Party President',
                description: 'தமிழகத்தின் புதிய அரசியல் விடியலுக்காகவும், மக்களின் நலனுக்காகவும் தமிழக வெற்றி கழகத்தை தோற்றுவித்த நமது தலைவர் மற்றும் தமிழக முதலமைச்சர். Our leader who founded Tamilaga Vettri Kazhagam to usher in a new political era of transparent, civic-minded governance across the state.'
              }
            }
            if (lead.id === 2 || lead.name?.toLowerCase().includes('anand')) {
              return {
                ...lead,
                name: 'புஸ்ஸி N. ஆனந்த் (Bussy N. Anand)',
                designation: 'பொதுச் செயலாளர் | General Secretary',
                description: 'கட்சியின் கட்டமைப்பை வலுப்படுத்தி, அடிமட்ட தொண்டர்கள் வரை கொள்கைகளை கொண்டு சேர்க்கும் மக்கள் பணியில் அர்ப்பணிப்புடன் செயலாற்றுபவர். He works with absolute dedication to fortify state-level party infrastructure and expand grassroots mobilization across Tamil Nadu.',
                quote: 'தலைவர் தளபதியின் வழிகாட்டுதலின்படி, நேர்மையான மற்றும் தூய்மையான அரசியலை தமிழகத்தில் நிலைநிறுத்துவதே நமது லட்சியம்! Following the guidance of our leader, we stand to establish clean, corruption-free governance for the people.',
                responsibilities: [
                  'கட்சியின் மாநில அளவிலான உள்கட்டமைப்பை நிர்வகித்தல் | Managing state-level party infrastructure and administration',
                  'அடிமட்ட தொண்டர்களின் ஒருங்கிணைப்பு மற்றும் வழிகாட்டுதல் | Grassroots cadre coordination and field mobilization guidance',
                  'கட்சி மாநாடுகள் மற்றும் முக்கிய நிகழ்வுகளை திட்டமிடுதல் | Organizing state conferences, public assemblies, and key party events'
                ]
              }
            }
            if (lead.id === 3 || lead.name?.toLowerCase().includes('damu') || lead.name?.toLowerCase().includes('royapuram')) {
              return {
                ...lead,
                name: 'ராயபுரம் K.V. தாமோதரன் (K.V. Damodharan)',
                designation: 'தொகுதிப் பொறுப்பாளர் | Constituency Head',
                description: 'ராயபுரம் தொகுதியின் மக்களின் குரலாகவும், கட்சியின் வளர்ச்சிப் பணிகளை முன்னின்று நடத்தும் அர்ப்பணிப்புள்ள மக்கள் பிரதிநிதி. Serving as the dedicated voice of Royapuram constituency, leading grassroots welfare operations and ensuring public requests are met.',
                quote: 'மக்களின் தேவைகளை நேரடியாகக் கண்டறிந்து, உடனடி தீர்வு காண்பதே எங்களின் முதன்மைப் பணி! Identifying local needs directly to deliver swift, transparent civic resolutions is our highest priority.',
                responsibilities: [
                  'தொகுதி மக்களின் கோரிக்கைகளை அரசின் கவனத்திற்கு கொண்டு செல்லுதல் | Presenting constituency requests to corporation officials',
                  'வட்டார அளவிலான மக்கள் நலத் திட்டங்களை மேற்பார்வையிடுதல் | Supervising local welfare programs and development activities',
                  'இளைஞர் அணி மற்றும் மகளிர் அணி செயல்பாடுகளை ஒருங்கிணைத்தல் | Coordinating youth wing and women wing field operations'
                ]
              }
            }
            return lead
          })
          setLeaders(mapped)
        }
        setLoading(false)
      })
      .catch(() => {
        setLeaders(MOCK_LEADERS)
        setLoading(false)
      })
  }, [])

  // Slicing to first 3 items to completely hide the 4th card
  const activeLeaders = leaders.slice(0, 3)
  const [heroLeader, ...restLeaders] = activeLeaders

  return (
    <div className="pb-24">
      {/* Inject all keyframes */}
      <style>{KEYFRAMES}</style>

      {loading ? (
        /* ── Loading skeleton ── */
        <div>
          {/* Hero skeleton */}
          <div
            className="w-full flex items-end justify-center animate-pulse"
            style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0202, #180606)' }}
          >
            <div className="text-center pb-20 space-y-4">
              <div className="w-28 h-5 rounded-full bg-white/10 mx-auto" />
              <div className="w-72 h-16 rounded-2xl bg-white/10 mx-auto" />
              <div className="w-48 h-16 rounded-2xl bg-white/10 mx-auto" />
            </div>
          </div>
          {/* Rows skeleton */}
          <div className="border-t border-[#e6dfd0]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex animate-pulse border-t border-[#e6dfd0]" style={{ minHeight: '340px', background: '#faf7f0' }}>
                <div className="w-1/2 flex items-center justify-center p-12">
                  <div className="w-40 h-56 rounded-3xl bg-gray-200" style={{ borderRadius: '50% 50% 0 0 / 55% 55% 0 0' }} />
                </div>
                <div className="w-1/2 flex flex-col justify-center p-12 gap-4">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded w-3/5" />
                  <div className="h-px bg-gray-100 w-14" />
                  <div className="h-10 bg-gray-100 rounded-2xl w-60" />
                  <div className="h-10 bg-gray-100 rounded-2xl w-60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-40" style={{ color: '#8c7b77' }}>
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold text-sm">தலைவர்கள் விபரம் விரைவில் வெளியிடப்படும்.</p>
        </div>
      ) : (
        <>
          {/* ══ HERO: Thalapathy Vijay ══ */}
          {heroLeader && <VijayHero leader={heroLeader} />}

          {/* ══ Section transition label ══ */}
          {restLeaders.length > 0 && (
            <div
              className="flex items-center gap-4 px-8 md:px-16 py-6 border-b border-[#e6dfd0]"
              style={{ background: 'linear-gradient(90deg, #faf7f0, #fff, #faf7f0)' }}
            >
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(128,0,0,0.1), transparent)' }} />
              <div className="section-badge" style={{ margin: 0 }}>
                <Users size={11} />
                நமது மக்கள் பிரதிநிதிகள்
              </div>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(128,0,0,0.1))' }} />
            </div>
          )}

          {/* ══ Alternating rows: remaining leaders ══ */}
          {restLeaders.length > 0 && (
            <div className="w-full">
              {restLeaders.map((leader, i) => (
                <LeaderRow key={leader.id} leader={leader} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ══ Visual Symbolism & Ideology Section ══ */}
      <section className="mt-24 pt-20 border-t border-[#e6dfd0] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div
            className="section-badge mx-auto w-fit"
            style={{ borderColor: 'rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.06)', color: '#a6841b' }}
          >
            கொடி மற்றும் கொள்கை | Flag &amp; Ideology
          </div>
          <h2 className="section-title">நமது இயக்கத்தின் சின்னங்கள் | Symbols of Our Movement</h2>
          <p className="section-subtitle mx-auto text-center font-medium mt-3 max-w-4xl leading-relaxed">
            தமிழக வெற்றி கழகத்தின் காட்சி அடையாளம், வரலாற்று மரபு மற்றும் அடிப்படைக் கொள்கைகளைப் புரிந்துகொள்ளுதல்.
            <span className="block text-xs text-[#8c7b77] mt-1 font-semibold uppercase tracking-wider">
              Understanding the visual identity, historical lineage, and core principles of Tamilaga Vettri Kazhagam.
            </span>
          </p>
        </div>

        <div className="card w-full p-8 md:p-12 mb-16 bg-white border border-[#e6dfd0] shadow-sm relative overflow-hidden flex flex-col items-center gap-10">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#800000] via-[#d4af37] to-[#800000]" />
          
          {/* Flag Center Showcase */}
          <div className="w-full max-w-4xl flex flex-col items-center">
            <div className="relative group/flag w-full max-w-2xl">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-tvk-red to-tvk-yellow rounded-2xl blur-xl opacity-25 group-hover/flag:opacity-40 transition duration-500" />
              <img
                src="/tvk_flag.jpg"
                alt="TVK Official Flag"
                className="relative w-full border border-border/85 rounded-2xl shadow-xl object-cover select-none transition-all duration-500 group-hover/flag:scale-[1.01]"
              />
            </div>
            <div className="mt-5 text-center">
              <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#800000] bg-[rgba(128,0,0,0.06)] px-4 py-1.5 rounded-full border border-tvk-red/15">
                தமிழக வெற்றி கழகத்தின் அதிகாரப்பூர்வ கொடி 
              </span>
            </div>
          </div>

          {/* Details below flag, spanning full container */}
          <div className="w-full space-y-8 text-center max-w-5xl">
            <div className="space-y-2">
              <h3 className="text-gray-900 font-black text-3xl lg:text-4xl tracking-tight leading-none"> The TVK Party Flag</h3>
              <p className="text-sm font-extrabold text-tvk-yellow-dark tracking-wide uppercase">பெருமை, வீரம் மற்றும் வெற்றியின் அடையாளம் | Symbolism of Pride, Valour &amp; Victory</p>
            </div>
            <p className="text-sm md:text-base font-semibold leading-relaxed text-[#5c4e4b] max-w-3xl mx-auto">
              **தமிழக வெற்றி கழகத்தின் அதிகாரப்பூர்வ கொடி சிவப்பு-மஞ்சள்-சிவப்பு ஆகிய மூன்று கிடைமட்ட பட்டைகளைக் கொண்டது, இது பண்டைய தமிழ் மரபின் சிறந்த சின்னங்களை உள்ளடக்கியது. ஒவ்வொரு சின்னமும் நமது அர்ப்பணிப்பின் தூணைக் குறிக்கிறது:**
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4">
              {[
                { color: '#800000', bg: 'rgba(128,0,0,0.02)', border: 'rgba(128,0,0,0.1)', title: 'புரட்சிகர சிவப்பு | Revolutionary Red', desc: 'மக்களுக்கான சமூக ஒழுக்கம் மற்றும் நியாயமான உரிமைகளைக் கோருவதற்கான போராட்டம், தியாகம் மற்றும் அறிவுசார் தெளிவு.', engDesc: 'Struggle, sacrifice, and intellectual clarity to demand civic discipline and fair resources.' },
                { color: '#a6841b', bg: 'rgba(212,175,55,0.03)', border: 'rgba(212,175,55,0.2)', title: 'வெற்றி மஞ்சள் | Victory Yellow', desc: 'வளமை, நம்பிக்கை மற்றும் தமிழகத்தில் ஒரு பொற்கால ஆட்சியை உருவாக்குவதற்கான நமது தொலைநோக்கு பார்வை.', engDesc: 'Prosperity, hope, and our vision of a golden era of governance in Tamil Nadu.' },
                { color: '#374151', bg: 'rgba(55,65,81,0.03)', border: 'rgba(55,65,81,0.1)', title: 'வாகை மற்றும் யானைகள் | Vaagai & Elephants', desc: 'வாகை பூவை இருபுறமும் தாங்கி நிற்கும் போர் யானைகள் — சங்க காலத்து வெற்றியின் அடையாளம்.', engDesc: 'Rearing elephants flanking the Vaagai flower — the Sangam symbol of resilience.' },
              ].map(({ color, bg, border, title, desc, engDesc }) => (
                <div key={title} className="p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: color }}>
                      <span className="w-3.5 h-3.5 rounded-full bg-white" />
                    </div>
                    <h4 className="font-extrabold text-base mb-2.5" style={{ color }}>{title}</h4>
                    <p className="text-xs font-semibold text-[#6e5d59] leading-relaxed mb-2">{desc}</p>
                  </div>
                  <p className="text-[10px] font-bold text-[#8c7b77] italic leading-relaxed border-t border-[#e6dfd0] pt-2 mt-2">{engDesc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { title: 'மதச்சார்பற்ற சமூக நீதி | Secular Social Justice', desc: 'சமூகத்தில் சாதி, மதப் பிரிவினைகள் அற்ற, சமத்துவ மற்றும் மதச்சார்பற்ற கொள்கைகளை நிலைநிறுத்தி, தமிழ் பாரம்பரியப் பெருமையைப் பாதுகாத்தல்.', engDesc: 'TVK stands for equal treatment across communities, working for a society free from casteism and religious division, honoring regional Tamil pride.' },
            { title: 'மக்களுக்கான பொறுப்புடைமை | Grassroots Accountability', desc: 'நமது செயலி மூலம் மக்கள் எழுப்பும் ஒவ்வொரு பிரச்சினையும் அடிமட்ட அளவில் உள்ள ஒருங்கிணைப்பாளர்களால் நேரடியாகக் கண்காணிக்கப்பட்டு தீர்க்கப்படும்.', engDesc: 'Every civic issue raised through our portal is tracked and validated directly by welfare coordinators to ensure true grassroots feedback.' },
            { title: 'தலைவர் விஜயின் தொலைநோக்குத் திட்டம் | CM Vijay\'s Agenda', desc: 'நமது தலைவர் விஜய் அவர்களின் வழிகாட்டுதலின்படி, 200 யூனிட் இலவச மின்சாரம், போதைப்பொருள் ஒழிப்பு மற்றும் பெண்களுக்கான பாதுகாப்புப் படைகள் உறுதி செய்யப்படுகின்றன.', engDesc: 'Guided by President Thalapathy Vijay, our governing blueprint guarantees 200 units of free power, anti-drug programs, and women protection squads.' },
          ].map(({ title, desc, engDesc }) => (
            <div key={title} className="card p-6 bg-white border border-[#e6dfd0] text-left hover:border-tvk-red/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                <h4 className="text-tvk-red-dark font-extrabold text-base mb-3">{title}</h4>
                <p className="text-xs font-semibold leading-relaxed mb-3" style={{ color: '#5c4e4b' }}>{desc}</p>
              </div>
              <p className="text-[10px] font-bold text-[#8c7b77] italic leading-relaxed border-t border-[#e6dfd0] pt-2 mt-2">{engDesc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
