import { motion } from 'framer-motion'

const SIZE = 112
const STROKE = 8
const R = (SIZE - STROKE) / 2
const C = 2 * Math.PI * R

export function ScoreRing({ ringId, label, value, delay = 0 }) {
  const gid = `ring-${ringId}`
  const pct = Math.min(100, Math.max(0, value))
  const offset = C * (1 - pct / 100)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(148,163,184,0.15)"
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold tabular-nums text-white">{pct}</span>
        </div>
      </div>
      <span className="max-w-[7rem] text-center text-xs font-medium leading-snug text-slate-400">
        {label}
      </span>
    </div>
  )
}
