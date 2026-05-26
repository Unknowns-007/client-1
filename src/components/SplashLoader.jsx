import { useEffect, useRef, useState } from 'react'
import WhistleSymbol from './WhistleSymbol'

/* ═══════════════════════════════════════════════════════════════
   "THE RALLY" — TVK Royapuram Splash
   
   Aesthetic: Political rally / civic movement — NOT tech.
   Warm spotlight, ceremonial sweep lines, Tamil slogans.
   
   SEQUENCE
   ─────────────────────────────────────────────────────────────
   0ms    → Deep dark + warm red glow rises from center (torchlight)
   420ms  → Warm golden SPOTLIGHT BURST from above
   540ms  → Logo SLAMS DOWN from above (heavy, powerful)
   640ms  → Chromatic aberration (light-burst effect) 280ms
   920ms  → Ground SHAKE — crowd-stomp feel
   1060ms → Text SCRAMBLE fires (random → resolves to name)
   1650ms → Two ceremonial gold lines SWEEP IN from left+right
   1850ms → Tamil slogan fades in below the lines
   2100ms → Decorative dot row appears
   2350ms → Victory GOLD FLASH
   2580ms → EXIT — TV power-off collapse
   3000ms → onDone()
═══════════════════════════════════════════════════════════════ */

const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const TARGET_NAME   = 'TVK ROYAPURAM'

function useTextScramble(active) {
  const [display, setDisplay] = useState(TARGET_NAME.replace(/[^ ]/g, '▪'))
  const rafRef = useRef(null)
  const frame  = useRef(0)

  useEffect(() => {
    if (!active) return
    const chars = TARGET_NAME.split('')
    frame.current = 0

    const tick = () => {
      frame.current++
      const t = frame.current / 58
      const result = chars.map((ch, i) => {
        if (ch === ' ') return ' '
        const ct = Math.max(0, (t - i * 0.055) / 0.65)
        if (ct >= 1) return ch
        if (ct <= 0) return SCRAMBLE_POOL[~~(Math.random() * SCRAMBLE_POOL.length)]
        return Math.random() > ct
          ? SCRAMBLE_POOL[~~(Math.random() * SCRAMBLE_POOL.length)]
          : ch
      })
      setDisplay(result.join(''))
      if (t < 1.5) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return display
}

/* ── Keyframes ── */
const STYLES = `
  /* Warm glow rises from center bottom */
  @keyframes glowRise {
    from { opacity: 0; transform: scale(0.6) translateY(40px); }
    to   { opacity: 1; transform: scale(1)   translateY(0);    }
  }

  /* Spotlight burst — warm white-gold */
  @keyframes spotlight {
    0%   { opacity: 0;   transform: translate(-50%,-50%) scale(0.2); }
    30%  { opacity: 0.7; transform: translate(-50%,-50%) scale(1);   }
    100% { opacity: 0;   transform: translate(-50%,-50%) scale(2.5); }
  }

  /* Heavy gravity slam */
  @keyframes slam {
    0%   { transform: translateY(-280px) scaleY(1.08); opacity: 0; }
    62%  { transform: translateY(8px)    scaleY(0.94); opacity: 1; }
    78%  { transform: translateY(-4px)   scaleY(1.03); }
    90%  { transform: translateY(2px)    scaleY(0.99); }
    100% { transform: translateY(0)      scaleY(1);    opacity: 1; }
  }

  /* Chromatic aberration (light burst, not tech glitch) */
  @keyframes lightBurst {
    0%   { filter: drop-shadow(-6px 0 0 rgba(255,60,0,0.8))
                   drop-shadow(6px 0 0 rgba(255,210,0,0.6))
                   brightness(1.4); }
    50%  { filter: drop-shadow(-9px 0 0 rgba(255,60,0,0.6))
                   drop-shadow(9px 0 0 rgba(255,210,0,0.4))
                   brightness(1.7); }
    100% { filter: drop-shadow(0 0 0 transparent) brightness(1); }
  }

  /* Badge warm glow pulse */
  @keyframes badgePulse {
    0%,100% { box-shadow: 0 0 28px rgba(220,38,38,0.45), 0 12px 40px rgba(0,0,0,0.8); }
    50%     { box-shadow: 0 0 55px rgba(220,38,38,0.75), 0 12px 40px rgba(0,0,0,0.8), 0 0 80px rgba(251,191,36,0.15); }
  }

  /* Crowd stomp shake */
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    15%     { transform: translateX(-8px); }
    35%     { transform: translateX(7px);  }
    55%     { transform: translateX(-5px); }
    75%     { transform: translateX(3px);  }
    90%     { transform: translateX(-1px); }
  }

  /* Warm spotlight flash */
  @keyframes warmFlash {
    0%   { opacity: 0; }
    20%  { opacity: 0.55; }
    100% { opacity: 0; }
  }

  /* Gold victory flash */
  @keyframes goldFlash {
    0%   { opacity: 0; }
    18%  { opacity: 0.38; }
    100% { opacity: 0; }
  }

  /* Ceremonial line sweep left→right */
  @keyframes sweepFromLeft {
    from { width: 0;    opacity: 0; }
    20%  { opacity: 1; }
    to   { width: 100%; opacity: 1; }
  }
  @keyframes sweepFromRight {
    from { width: 0;    opacity: 0; margin-left: auto; }
    20%  { opacity: 1; }
    to   { width: 100%; opacity: 1; }
  }

  /* Slogan fade + rise */
  @keyframes sloganIn {
    from { opacity: 0; transform: translateY(14px) scale(0.97); letter-spacing: 6px; }
    to   { opacity: 1; transform: translateY(0)    scale(1);    letter-spacing: 2px; }
  }

  /* Dot row pop in stagger (handled via delay) */
  @keyframes dotPop {
    0%   { transform: scale(0); opacity: 0; }
    60%  { transform: scale(1.3); opacity: 1; }
    100% { transform: scale(1); opacity: 0.6; }
  }

  /* Name scramble container */
  @keyframes nameAppear {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* TV power-off collapse */
  @keyframes tvOff {
    0%   { transform: scaleY(1)     scaleX(1);   filter: brightness(1); }
    10%  { transform: scaleY(1.03)  scaleX(1);   filter: brightness(2.5); }
    25%  { transform: scaleY(0.006) scaleX(1.8); filter: brightness(5); }
    55%  { transform: scaleY(0.003) scaleX(0.9); filter: brightness(2); }
    100% { transform: scaleY(0)     scaleX(0);   filter: brightness(0); }
  }
`

/* ── Decorative dot row ── */
const DotRow = ({ visible }) => (
  <div style={{
    display: 'flex', gap: '8px',
    marginTop: '16px',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.3s ease',
  }}>
    {[0,1,2,3,4].map(i => (
      <div key={i} style={{
        width: i === 2 ? 10 : 6,
        height: i === 2 ? 10 : 6,
        borderRadius: '50%',
        background: i === 2 ? '#FBBF24' : '#DC2626',
        opacity: 0,
        animation: visible
          ? `dotPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms forwards`
          : 'none',
      }} />
    ))}
  </div>
)

/* ── Main component ── */
export default function SplashLoader({ onDone }) {
  const [p, setP] = useState(0)
  const [glitch, setGlitch]   = useState(false)
  const [shake,  setShake]    = useState(false)
  const [exiting, setExiting] = useState(false)

  const scrambledText = useTextScramble(p >= 5)

  useEffect(() => {
    const T = [
      [80,   () => setP(1)],              // glow rises
      [420,  () => setP(2)],              // spotlight flash
      [540,  () => setP(3)],              // logo slams in
      [580,  () => setGlitch(true)],      // light burst
      [860,  () => setGlitch(false)],     // burst clears
      [920,  () => {                       // crowd shake
        setShake(true)
        setTimeout(() => setShake(false), 360)
      }],
      [1060, () => setP(5)],              // scramble
      [1650, () => setP(6)],              // sweep lines
      [1850, () => setP(7)],              // slogan
      [2100, () => setP(8)],              // dots
      [2350, () => setP(9)],              // gold flash
      [2580, () => setExiting(true)],     // tv off
      [3050, () => onDone()],
    ]
    const timers = T.map(([ms, fn]) => setTimeout(fn, ms))
    return () => timers.forEach(clearTimeout)
  }, [])

  const glowVisible    = p >= 1
  const logoIn         = p >= 3
  const nameVisible    = p >= 5
  const linesVisible   = p >= 6
  const sloganVisible  = p >= 7
  const dotsVisible    = p >= 8
  const goldFlash      = p >= 9

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Warm spotlight flash (not harsh tech red) ── */}
      {p >= 2 && p < 3 && (
        <div style={{
          position:'fixed', inset:0, zIndex:99998, pointerEvents:'none',
          background:'radial-gradient(ellipse at 50% 30%, rgba(255,200,80,0.6) 0%, rgba(220,38,38,0.3) 40%, transparent 70%)',
          animation:'warmFlash 0.4s ease forwards',
        }} />
      )}

      {/* ── Gold victory flash ── */}
      {goldFlash && (
        <div style={{
          position:'fixed', inset:0, zIndex:99998, pointerEvents:'none',
          background:'rgba(251,191,36,1)',
          animation:'goldFlash 0.55s ease forwards',
        }} />
      )}

      {/* ── MAIN PANEL ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'#060402',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        overflow:'hidden',
        animation: exiting ? 'tvOff 0.52s cubic-bezier(0.55,0,1,0.45) forwards' : 'none',
        willChange: exiting ? 'transform,filter' : 'auto',
      }}>

        {/* Warm vignette — torchlight from center */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse 65% 65% at 50% 50%, rgba(180,30,0,0.18) 0%, rgba(120,20,0,0.08) 50%, transparent 100%)',
          opacity: glowVisible ? 1 : 0,
          transition: 'opacity 0.9s ease',
          animation: glowVisible ? 'glowRise 0.9s ease forwards' : 'none',
        }} />

        {/* Top-center spotlight cone */}
        <div style={{
          position:'absolute', top:0, left:'50%',
          width:'300px', height:'200px',
          background:'linear-gradient(180deg, rgba(251,191,36,0.07) 0%, transparent 100%)',
          transform:'translateX(-50%)',
          clipPath:'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
          opacity: logoIn ? 1 : 0,
          transition:'opacity 0.8s ease',
          pointerEvents:'none',
        }} />

        {/* ── CENTER CONTENT ── */}
        <div style={{
          position:'relative', zIndex:10,
          display:'flex', flexDirection:'column',
          alignItems:'center',
          animation: shake ? 'shake 0.36s ease' : 'none',
          willChange: shake ? 'transform' : 'auto',
        }}>

          {/* ── LOGO BADGE ── */}
          <div style={{
            width:'112px', height:'112px', borderRadius:'28px',
            background:'linear-gradient(145deg, #DC2626 0%, #B91C1C 50%, #92400E 100%)',
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative',
            opacity: logoIn ? 1 : 0,
            animation: logoIn
              ? [
                  'slam 0.55s cubic-bezier(0.87,0,0.13,1) forwards',
                  glitch ? 'lightBurst 0.28s ease forwards' : '',
                  'badgePulse 2.8s ease-in-out 0.9s infinite',
                ].filter(Boolean).join(', ')
              : 'none',
            willChange:'transform,filter',
          }}>
            {/* Inner gold rim */}
            <div style={{
              position:'absolute', inset:'2px', borderRadius:'26px',
              border:'1px solid rgba(251,191,36,0.2)',
              pointerEvents:'none',
            }} />
            {/* Soft top-left highlight */}
            <div style={{
              position:'absolute', top:10, left:10,
              width:32, height:8, borderRadius:4,
              background:'rgba(255,255,255,0.12)',
              transform:'rotate(-28deg)',
              pointerEvents:'none',
            }} />
            <WhistleSymbol size={64} />
          </div>

          {/* ── SCRAMBLE NAME ── */}
          <div style={{
            marginTop:'24px', textAlign:'center',
            opacity: nameVisible ? 1 : 0,
            transition:'opacity 0.25s',
          }}>
            <div style={{
              fontFamily:"'Inter', sans-serif",
              fontSize:'30px', fontWeight:900,
              letterSpacing:'3px',
              color:'#fff',
              textShadow:'0 0 24px rgba(220,38,38,0.55), 0 2px 8px rgba(0,0,0,0.8)',
              transition:'letter-spacing 0.4s ease',
            }}>
              {scrambledText}
            </div>
            <div style={{
              marginTop:'6px',
              fontFamily:"'Inter', sans-serif",
              fontSize:'10px',
              color:'rgba(255,255,255,0.28)',
              letterSpacing:'4px',
              textTransform:'uppercase',
            }}>
              Tamilaga Vettri Kazhagam
            </div>
          </div>

          {/* ── CEREMONIAL SWEEP LINES ── */}
          {linesVisible && (
            <div style={{
              width:'280px', marginTop:'14px',
              display:'flex', flexDirection:'column', gap:'3px',
            }}>
              <div style={{
                height:'1.5px',
                background:'linear-gradient(90deg, transparent, #FBBF24 40%, #DC2626 60%, transparent)',
                animation:'sweepFromLeft 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
                width:0,
              }} />
              <div style={{
                height:'1px',
                background:'linear-gradient(90deg, transparent, rgba(251,191,36,0.4) 40%, rgba(220,38,38,0.4) 60%, transparent)',
                animation:'sweepFromLeft 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s forwards',
                width:0,
              }} />
            </div>
          )}

          {/* ── TAMIL SLOGAN ── */}
          {sloganVisible && (
            <p style={{
              marginTop:'14px', marginBottom:0,
              fontFamily:"'Inter', sans-serif",
              fontSize:'13px',
              color:'rgba(251,191,36,0.85)',
              animation:'sloganIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
              textAlign:'center',
              lineHeight:1.6,
            }}>
              மக்களுக்காக &nbsp;·&nbsp; For the People
            </p>
          )}

          {/* ── DECORATIVE DOTS ── */}
          <DotRow visible={dotsVisible} />
        </div>

        {/* ── PROGRESS BAR ── */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          height:'3px',
          background:'rgba(255,255,255,0.04)',
          zIndex:2,
        }}>
          <div style={{
            height:'100%',
            background:'linear-gradient(90deg, #DC2626, #FBBF24, #DC2626)',
            boxShadow:'0 0 10px rgba(220,38,38,0.6)',
            width:
              exiting ? '100%' :
              p >= 9   ? '100%' :
              p >= 8   ? '88%'  :
              p >= 7   ? '74%'  :
              p >= 6   ? '60%'  :
              p >= 5   ? '44%'  :
              p >= 3   ? '24%'  : '0%',
            transition:'width 0.45s ease',
          }} />
        </div>
      </div>
    </>
  )
}
