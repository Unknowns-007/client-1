/**
 * WhistleSymbol — Official TVK / Indian Election Commission Whistle Symbol
 * Source: https://commons.wikimedia.org/wiki/File:Indian_Election_Symbol_Whistle.svg
 * License: CC0 (Public Domain)
 * Saved at: /public/tvk-whistle.svg
 */
export default function WhistleSymbol({
  size = 40,
  className = '',
  style = {},
  dark = true, // true = white icon (for dark/coloured backgrounds)
}) {
  return (
    <img
      src="/tvk-whistle.svg"
      alt="TVK Royapuram Whistle Symbol"
      width={size}
      height={size}
      className={className}
      draggable={false}
      style={{
        objectFit: 'contain',
        // The official SVG is black on transparent.
        // Invert makes it white — perfect on dark red/yellow gradient badges.
        filter: dark
          ? 'invert(1) brightness(1.15)'
          : 'none',
        ...style,
      }}
    />
  )
}
