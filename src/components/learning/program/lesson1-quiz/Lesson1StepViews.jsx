import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  Skull,
  XCircle,
} from 'lucide-react'
import { HAZARD_SYMBOLS } from '../../../../data/lesson1ChemicalQuizData.js'

export function IntroView({ step, onStart }) {
  const icons = [Flame, Skull, AlertOctagon]

  return (
    <motion.div
      className="mx-auto flex max-w-2xl flex-col items-center px-4 py-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-8 flex gap-4">
        {icons.map((Icon, i) => (
          <motion.div
            key={`intro-hazard-icon-${i}`}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
          >
            <Icon className="h-7 w-7" />
          </motion.div>
        ))}
      </div>
      <h1 className="text-3xl font-bold text-white md:text-4xl">{step.title}</h1>
      <p className="mt-3 text-slate-400">{step.subtitle}</p>
      <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-500">
        محاكاة تفاعلية للمخاطر الكيميائية — سيناريوهات ميدانية، رموز الخطر، طوارئ موقوتة،
        وتحليلات أداء فورية.
      </p>
      <motion.button
        type="button"
        onClick={onStart}
        className="lesson1-sim__pulse-ring mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-600 px-8 py-4 text-base font-bold text-slate-950 shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Play className="h-5 w-5" />
        ابدأ المحاكاة التفاعلية
      </motion.button>
    </motion.div>
  )
}

export function ScenarioView({ step, phase, selectedId, feedback, onSelect }) {
  return (
    <StepCard step={step}>
      <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-100/90">
        {step.scenario}
      </p>
      <p className="mt-4 text-base font-semibold text-white">{step.prompt}</p>
      <div className="mt-6 space-y-3">
        {step.options.map((opt) => {
          const selected = selectedId === opt.id
          const answered = phase === 'feedback'
          const showResult = answered && selected
          return (
            <motion.button
              key={opt.id}
              type="button"
              disabled={answered}
              onClick={() => onSelect(opt)}
              whileHover={answered ? {} : { scale: 1.01 }}
              whileTap={answered ? {} : { scale: 0.99 }}
              className={`lesson1-sim__option w-full rounded-xl border px-4 py-3.5 text-right text-sm ${
                showResult
                  ? opt.correct
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                    : 'border-red-500/50 bg-red-500/10 text-red-100'
                  : selected
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-white/10 bg-white/[0.03] text-slate-200'
              }`}
            >
              {opt.label}
            </motion.button>
          )
        })}
      </div>
      <FeedbackBlock feedback={feedback} phase={phase} />
    </StepCard>
  )
}

export function McqView(props) {
  return <ScenarioView {...props} />
}

export function BranchView({ step, phase, selectedId, feedback, consequence, onSelect }) {
  return (
    <StepCard step={step}>
      <p className="text-sm text-slate-300">{step.scenario}</p>
      <p className="mt-4 font-semibold text-white">{step.prompt}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {step.branches.map((b) => (
          <button
            key={b.id}
            type="button"
            disabled={phase === 'feedback'}
            onClick={() => onSelect(b)}
            className={`lesson1-sim__option rounded-xl border p-4 text-sm ${
              selectedId === b.id && phase === 'feedback'
                ? b.correct
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-red-500/50 bg-red-500/10'
                : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
      {phase === 'feedback' && consequence ? (
        <motion.p
          className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <strong className="text-amber-400">النتيجة: </strong>
          {consequence}
        </motion.p>
      ) : null}
      <FeedbackBlock feedback={feedback} phase={phase} />
    </StepCard>
  )
}

export function HazardMatchView({
  step,
  phase,
  matches,
  feedback,
  onMatch,
  onSubmit,
  allMatched,
}) {
  const [selectedSymbol, setSelectedSymbol] = useState(null)
  const symbols = HAZARD_SYMBOLS
  const labels = step.pairs.map((p) => p.label)

  const handleLabelClick = (label) => {
    if (phase === 'feedback' || !selectedSymbol) return
    onMatch(selectedSymbol, label)
    setSelectedSymbol(null)
  }

  return (
    <StepCard step={step}>
      <p className="text-sm text-slate-400">{step.prompt}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs text-amber-500/80">الرموز</p>
          <div className="flex flex-wrap gap-2">
            {symbols.map((s) => {
              const done = Object.keys(matches).includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={done || phase === 'feedback'}
                  onClick={() => setSelectedSymbol(s.id)}
                  className={`lesson1-sim__symbol-card flex h-16 w-16 flex-col items-center justify-center rounded-xl border text-center text-xs ${
                    selectedSymbol === s.id
                      ? 'border-amber-500 bg-amber-500/20'
                      : done
                        ? 'border-emerald-500/30 opacity-50'
                        : 'border-white/15 bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-cyan-500/80">التصنيفات</p>
          <div className="space-y-2">
            {labels.map((label) => (
              <button
                key={label}
                type="button"
                disabled={phase === 'feedback'}
                onClick={() => handleLabelClick(label)}
                className={`lesson1-sim__drop-target w-full rounded-xl border px-3 py-2.5 text-right text-sm transition ${
                  selectedSymbol ? 'lesson1-sim__drop-target--active' : 'border-white/10'
                }`}
              >
                {label}
                {Object.entries(matches).find(([, l]) => l === label) ? (
                  <span className="me-2 text-lg">
                    {symbols.find((s) => s.id === Object.entries(matches).find(([, l]) => l === label)?.[0])?.icon}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
      <FeedbackBlock feedback={feedback} phase={phase} />
    </StepCard>
  )
}

export function OrderView({ step, phase, order, onReorder, onSubmit, feedback }) {
  const toggle = (id) => {
    if (phase === 'feedback') return
    if (order.includes(id)) {
      onReorder(order.filter((x) => x !== id))
    } else {
      onReorder([...order, id])
    }
  }

  return (
    <StepCard step={step}>
      <p className="text-sm text-slate-400">{step.prompt}</p>
      <p className="mt-2 text-xs text-amber-500/70">انقر بالترتيب من الأكثر شيوعاً إلى الأقل</p>
      <ol className="mt-4 space-y-2">
        {step.items.map((item) => {
          const pos = order.indexOf(item.id)
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={phase === 'feedback'}
                onClick={() => toggle(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                  pos >= 0 ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                  {pos >= 0 ? pos + 1 : '—'}
                </span>
                {item.label}
              </button>
            </li>
          )
        })}
      </ol>
      <FeedbackBlock feedback={feedback} phase={phase} />
    </StepCard>
  )
}

export function TrueFalseView({ step, statementIndex, phase, feedback, onAnswer }) {
  const stmt = step.statements[statementIndex]
  if (!stmt) return null

  return (
    <StepCard step={step} subtitle={`عبارة ${statementIndex + 1} من ${step.statements.length}`}>
      <p className="text-lg font-medium text-white">{stmt.text}</p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={phase === 'feedback'}
          onClick={() => onAnswer(true)}
          className="lesson1-sim__option flex-1 rounded-xl border border-white/10 py-4 text-sm font-semibold"
        >
          صحيح
        </button>
        <button
          type="button"
          disabled={phase === 'feedback'}
          onClick={() => onAnswer(false)}
          className="lesson1-sim__option flex-1 rounded-xl border border-white/10 py-4 text-sm font-semibold"
        >
          خطأ
        </button>
      </div>
      <FeedbackBlock feedback={feedback} phase={phase} />
    </StepCard>
  )
}

export function TimedView({ step, phase, secondsLeft, selectedId, feedback, onSelect }) {
  const urgent = secondsLeft <= 4 && phase === 'active'

  return (
    <StepCard step={step}>
      <div
        className={`mb-4 flex items-center justify-between rounded-xl border px-4 py-3 ${
          urgent ? 'lesson1-sim__countdown-urgent border-red-500/50 bg-red-500/10' : 'border-amber-500/30 bg-amber-500/10'
        }`}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-amber-200">
          <Clock className="h-4 w-4" />
          وضع الطوارئ
        </span>
        <span className={`font-mono text-2xl font-bold ${urgent ? 'text-red-400' : 'text-amber-300'}`}>
          {secondsLeft}s
        </span>
      </div>
      <p className="text-sm text-red-200/90">{step.scenario}</p>
      <p className="mt-4 font-semibold text-white">{step.prompt}</p>
      <div className="mt-4 space-y-2">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={phase === 'feedback'}
            onClick={() => onSelect(opt)}
            className="lesson1-sim__option w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-right"
          >
            {opt.label}
          </button>
        ))}
      </div>
      <FeedbackBlock feedback={feedback} phase={phase} />
    </StepCard>
  )
}

function StepCard({ step, subtitle, children }) {
  return (
    <motion.div
      className="mx-auto w-full max-w-2xl px-3 py-5 pb-8 sm:px-4 sm:py-6 sm:pb-10"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-amber-500/80">مرحلة تفاعلية</p>
      <h2 className="mt-1 text-xl font-bold text-white md:text-2xl">{step.title}</h2>
      {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </motion.div>
  )
}

function FeedbackBlock({ feedback, phase }) {
  if (phase !== 'feedback' || !feedback) return null

  return (
    <motion.div
      className={`lesson1-feedback-panel mt-6 rounded-xl border bg-slate-900/90 p-4 ${
        feedback.correct ? 'border-emerald-500/30' : 'border-red-500/30'
      }`}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-200">
        {feedback.correct ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
        )}
        {feedback.text}
      </p>
      <p className="mt-3 text-xs text-amber-500/80">استخدم «السؤال التالي» بالأسفل للمتابعة</p>
    </motion.div>
  )
}

export function useTimedCountdown(active, seconds, onExpire) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (!active) return undefined
    setLeft(seconds)
    const t = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t)
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [active, seconds, onExpire])

  return left
}
