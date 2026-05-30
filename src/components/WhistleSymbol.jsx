/**
 * WhistleSymbol — Official TVK / Tamilaga Vettri Kazhagam Emblem Logo
 * Source: /public/logo.png
 */
export default function WhistleSymbol({
  size = 40,
  className = '',
  style = {},
}) {
  return (
    <img
      src="/logo.png"
      alt="TVK Official Logo"
      width={size}
      height={size}
      className={className}
      draggable={false}
      style={{
        objectFit: 'contain',
        ...style,
      }}
    />
  )
}

