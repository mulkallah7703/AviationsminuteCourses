import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { CinematicVideoPlayer } from './CinematicVideoPlayer.jsx'

const AUTOPLAY_LS_KEY = 'lms-chemical-autoplay-next'

function loadAutoplayPref() {
  try {
    return localStorage.getItem(AUTOPLAY_LS_KEY) === '1'
  } catch {
    return false
  }
}

function saveAutoplayPref(value) {
  try {
    localStorage.setItem(AUTOPLAY_LS_KEY, value ? '1' : '0')
  } catch {
    /* ignore */
  }
}

export function VideoLessonExperience({
  courseTitle,
  lessons,
  currentIndex,
  onPrevious,
  onNext,
  onSelectLesson,
  onLessonComplete,
}) {
  const lesson = lessons[currentIndex]
  const total = lessons.length
  const progress = ((currentIndex + 1) / total) * 100
  const [autoplayNext, setAutoplayNext] = useState(loadAutoplayPref)

  const goNext = useCallback(() => {
    onLessonComplete?.(lesson.id)
    onNext()
  }, [lesson.id, onLessonComplete, onNext])

  const handleVideoEnded = useCallback(() => {
    if (autoplayNext && currentIndex < total - 1) {
      window.setTimeout(goNext, 1200)
    }
  }, [autoplayNext, currentIndex, total, goNext])

  useEffect(() => {
    saveAutoplayPref(autoplayNext)
  }, [autoplayNext])

  if (!lesson) return null

  return (
    <motion.div
      className="relative min-h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-slate-950 via-[#070b14] to-slate-950 text-white"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56,189,248,0.18), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99,102,241,0.12), transparent)',
        }}
      />

      <motion.div
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-28 pt-6 md:gap-8 md:px-8 md:pb-24 md:pt-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        {/* Top — course title + lesson counter + progress */}
        <header className="space-y-3">
          <p className="text-sm font-medium tracking-wide text-cyan-300/80">{courseTitle}</p>
          <motion.h1
            key={lesson.id}
            className="text-2xl font-bold tracking-tight text-white md:text-3xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {lesson.title}
          </motion.h1>
          <p className="text-sm text-slate-400">
            الدرس {currentIndex + 1} من {total}
          </p>
          <motion.div
            className="h-1 overflow-hidden rounded-full bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </header>

        {/* Video — cinematic center stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <CinematicVideoPlayer
              provider={lesson.provider}
              videoId={lesson.videoId}
              src={lesson.src}
              title={lesson.title}
              onEnded={handleVideoEnded}
            />
          </motion.div>
        </AnimatePresence>

        {/* Optional description + attachment */}
        <motion.div
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          key={`meta-${lesson.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {lesson.description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              {lesson.description}
            </p>
          ) : (
            <span />
          )}

          <div className="flex flex-wrap items-center gap-3">
            {lesson.attachment ? (
              <a
                href={lesson.attachment.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10"
                download
              >
                <Download className="h-4 w-4 text-cyan-300" />
                {lesson.attachment.label}
              </a>
            ) : null}

            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                className="rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/40"
                checked={autoplayNext}
                onChange={(e) => setAutoplayNext(e.target.checked)}
              />
              الانتقال تلقائياً للدرس التالي
            </label>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav
          className="flex items-center justify-between gap-4 border-t border-white/10 pt-6"
          aria-label="تنقل الدروس"
        >
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition enabled:hover:border-white/25 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= total - 1}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </button>
        </nav>
      </motion.div>

      {/* Floating minimal lesson navigator */}
      <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
        <motion.div
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {lessons.map((item, index) => {
            const active = index === currentIndex
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectLesson(index)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
                aria-label={`الدرس ${index + 1}`}
                aria-current={active ? 'step' : undefined}
              >
                {index + 1}
              </button>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
