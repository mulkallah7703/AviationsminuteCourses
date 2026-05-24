import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Zap } from 'lucide-react'
import { getRank } from './lesson1QuizScoring'

export function Lesson1Hud({ xp, safetyScore, riskLevel, stepIndex, totalSteps }) {
  const rank = getRank(safetyScore)
  const progress = totalSteps > 1 ? ((stepIndex + 1) / totalSteps) * 100 : 0

  return (
    <header className="border-b border-amber-500/15 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-amber-500/80">محاكاة السلامة</p>
            <p className={`text-sm font-bold ${rank.color}`}>{rank.label}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Zap className="h-4 w-4" />
            <span className="font-mono font-semibold">{xp}</span> XP
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Shield className="h-4 w-4" />
            {safetyScore}%
          </span>
          <span className="flex items-center gap-1.5 text-red-400/90">
            <AlertTriangle className="h-4 w-4" />
            خطر: {riskLevel}%
          </span>
        </div>
      </div>
      <div className="h-0.5 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-l from-amber-500 to-orange-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </header>
  )
}
