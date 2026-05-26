// TVK Royapuram — Official Whistle Symbol (SVG)
// Matches the classic round-body sports whistle design
export default function WhistleIcon({ size = 32, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="TVK Royapuram Whistle Symbol"
    >
      {/* ── Attachment ring (left loop) ── */}
      <circle cx="14" cy="52" r="8" stroke="currentColor" strokeWidth="4" fill="none" />

      {/* ── Main whistle body (round) ── */}
      <circle cx="52" cy="54" r="30" fill="currentColor" opacity="0.12" />
      <circle cx="52" cy="54" r="30" stroke="currentColor" strokeWidth="4" fill="none" />

      {/* ── Internal ball / pea (shading inside body) ── */}
      <circle cx="46" cy="60" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.5" />
      <circle cx="42" cy="56" r="3" fill="currentColor" opacity="0.3" />

      {/* ── Highlight arc top-left of body ── */}
      <path
        d="M 30 36 Q 38 28 52 26"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* ── Mouthpiece neck (connects body to tube) ── */}
      <path
        d="M 72 32 L 82 18"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* ── Mouthpiece rectangular tube ── */}
      <rect x="78" y="4" width="36" height="18" rx="4" fill="currentColor" />

      {/* ── Mouthpiece opening (darker rectangle inside) ── */}
      <rect x="82" y="8" width="28" height="10" rx="2" fill="currentColor" opacity="0.4" />

      {/* ── Connection line from ring to body ── */}
      <line x1="22" y1="52" x2="22" y2="52" stroke="currentColor" strokeWidth="3" />
      <path
        d="M 22 52 Q 30 54 24 54"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  )
}
