export function MiniSparkline({ data, stroke = '#22d3ee' }) {
  if (!data?.length) return null
  const w = 72
  const h = 28
  const pad = 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = Math.max(1e-6, max - min)
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / span) * (h - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return (
    <svg width={w} height={h} className="shrink-0 overflow-visible" aria-hidden>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(' ')}
        opacity="0.9"
      />
    </svg>
  )
}
