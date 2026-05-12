import { motion } from 'framer-motion'
import { useId } from 'react'

export function MiniRing({ value, size = 44, stroke = 5 }) {
  const gid = useId().replace(/:/g, '')
  const pct = Math.min(100, Math.max(0, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - pct / 100)
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: off }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  )
}
