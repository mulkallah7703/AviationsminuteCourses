import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, CheckCircle2, ClipboardList, ListTree, Lock, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PROGRAM_COURSE_TITLE, programModules } from '../../../data/programCourse'
import { useBreakpoint } from '../../../hooks/useBreakpoint'
import { getStepStatus } from '../../../lib/programLocks'

function StepButton({ status, icon: Icon, label, lockReason, onClick }) {
  const locked = status === 'locked'
  const active = status === 'active'
  const completed = status === 'completed'

  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked}
      title={lockReason ?? undefined}
      className={`group relative flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-right transition ${
        locked
          ? 'cursor-not-allowed border-white/5 bg-white/[0.02] opacity-55'
          : active
            ? 'border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_24px_-4px_rgba(34,211,238,0.35)]'
            : completed
              ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
              : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          locked
            ? 'bg-white/5 text-slate-600'
            : active
              ? 'bg-cyan-500/20 text-cyan-300'
              : completed
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-white/5 text-slate-400'
        }`}
      >
        {locked ? <Lock className="h-3.5 w-3.5" /> : <Icon className="h-4 w-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-medium leading-snug ${
            locked ? 'text-slate-500' : active ? 'text-white' : 'text-slate-300'
          }`}
        >
          {label}
        </span>
        {locked && lockReason ? (
          <span className="mt-0.5 block text-[10px] leading-snug text-slate-600">{lockReason}</span>
        ) : null}
      </span>
      {completed ? (
        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-label="مكتمل" />
      ) : null}
    </button>
  )
}

function SidebarPanel({
  progressPercent,
  progressState,
  activeType,
  activeModuleId,
  onNavigateLesson,
  onNavigateQuiz,
  onClose,
  showClose,
}) {
  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-white/10 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/80">مسار التعلم المحمي</p>
          <h2 className="mt-1 text-base font-bold text-white sm:text-lg">{PROGRAM_COURSE_TITLE}</h2>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-indigo-500"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">{progressPercent}% مكتمل</p>
        </div>
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
            aria-label="إغلاق قائمة الدروس"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <nav
        className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth px-3 py-3 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:px-4 sm:py-4 sm:pb-[max(1.75rem,env(safe-area-inset-bottom,0px))]"
        aria-label="دروس واختبارات البرنامج"
      >
        <div className="space-y-3 sm:space-y-4">
          {programModules.map((mod) => {
            const lessonStatus = getStepStatus(
              progressState,
              'lesson',
              mod.id,
              activeType,
              activeModuleId,
            )
            const quizStatus = getStepStatus(progressState, 'quiz', mod.id, activeType, activeModuleId)
            const lessonLock =
              lessonStatus === 'locked' ? `أكمل اختبار الدرس ${mod.id - 1} أولاً` : null
            const quizLock =
              quizStatus === 'locked'
                ? progressState.quizzes.includes(mod.id)
                  ? 'تم إكمال الاختبار'
                  : 'شاهد الدرس بالكامل أولاً'
                : null

            return (
              <motion.div key={mod.id} className="space-y-2">
                <StepButton
                  status={lessonStatus}
                  icon={BookOpen}
                  label={mod.lessonTitle}
                  lockReason={lessonLock}
                  onClick={() => onNavigateLesson(mod.id)}
                />
                <StepButton
                  status={quizStatus}
                  icon={ClipboardList}
                  label={mod.quizTitle}
                  lockReason={quizLock}
                  onClick={() => onNavigateQuiz(mod.id)}
                />
              </motion.div>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export function CourseSidebar({
  progressState,
  activeType,
  activeModuleId,
  progressPercent,
  onNavigateLesson,
  onNavigateQuiz,
}) {
  const { isMobile, isTablet } = useBreakpoint()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [activeModuleId, activeType])

  useEffect(() => {
    if (!menuOpen || !isMobile) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen, isMobile])

  function handleNavigateLesson(id) {
    onNavigateLesson(id)
    setMenuOpen(false)
  }

  function handleNavigateQuiz(id) {
    onNavigateQuiz(id)
    setMenuOpen(false)
  }

  return (
    <>
      {isMobile ? (
        <div className="shrink-0 border-b border-white/10 bg-slate-950/80 px-3 py-2.5 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
            aria-expanded={menuOpen}
            aria-controls="course-sidebar-panel"
          >
            <span className="inline-flex items-center gap-2">
              <ListTree className="h-4 w-4 text-cyan-300" aria-hidden />
              محتوى الدورة
            </span>
            <span className="text-xs font-medium text-cyan-300/90">{progressPercent}%</span>
          </button>
        </div>
      ) : null}

      <AnimatePresence>
        {menuOpen && isMobile ? (
          <motion.button
            key="course-overlay"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-slate-950/65 backdrop-blur-sm"
            aria-label="إغلاق قائمة الدروس"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      {isMobile ? (
        <aside
          id="course-sidebar-panel"
          aria-hidden={!menuOpen}
          className={[
            'fixed z-[70] flex max-h-[calc(100dvh-1rem)] w-[min(20rem,calc(100vw-1rem))] flex-col rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl',
            'end-2 top-2 bottom-2 transition-[transform,opacity,visibility] duration-300 ease-out',
            menuOpen
              ? 'translate-x-0 opacity-100 visible pointer-events-auto'
              : 'pointer-events-none invisible opacity-0 translate-x-[110%] rtl:-translate-x-[110%]',
          ].join(' ')}
          dir="rtl"
        >
          <SidebarPanel
            progressPercent={progressPercent}
            progressState={progressState}
            activeType={activeType}
            activeModuleId={activeModuleId}
            onNavigateLesson={handleNavigateLesson}
            onNavigateQuiz={handleNavigateQuiz}
            onClose={() => setMenuOpen(false)}
            showClose
          />
        </aside>
      ) : (
        <aside
          className={[
            'flex min-h-0 shrink-0 flex-col border-s border-white/10 bg-slate-950/60 backdrop-blur-xl',
            isTablet ? 'w-56' : 'w-72 lg:w-80',
            'lg:h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-4rem)]',
          ].join(' ')}
          dir="rtl"
        >
          <SidebarPanel
            progressPercent={progressPercent}
            progressState={progressState}
            activeType={activeType}
            activeModuleId={activeModuleId}
            onNavigateLesson={onNavigateLesson}
            onNavigateQuiz={onNavigateQuiz}
            showClose={false}
          />
        </aside>
      )}
    </>
  )
}
