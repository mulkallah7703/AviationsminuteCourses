import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ProtectedVideoPlayer } from './ProtectedVideoPlayer.jsx'
import { ProgramStepNavigation } from './ProgramStepNavigation.jsx'
import { PROGRAM_COURSE_TITLE } from '../../../data/programCourse'

export function LessonView({
  module,
  moduleIndex,
  totalModules,
  watchRecord,
  videoComplete,
  onWatchProgress,
  onVideoCompleted,
  onPrevious,
  onNext,
  canGoPrevious,
  quizDoneForModule = false,
  onReturnToCourses,
  onReturnToOverview,
}) {
  const { video, lessonTitle } = module
  const progress = ((moduleIndex + 1) / totalModules) * 100
  const [searchParams] = useSearchParams()
  const autoplay = searchParams.get('autoplay') === '1'
  const videoSectionRef = useRef(null)
  const [completedLocally, setCompletedLocally] = useState(videoComplete)

  useEffect(() => {
    if (!autoplay) return
    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const shell = document.querySelector('.learner-shell-scroll')
    shell?.scrollTo?.({ top: 0, behavior: 'smooth' })
  }, [autoplay, module.id])

  const canGoNext = videoComplete || completedLocally

  const handleCompleted = useCallback(() => {
    setCompletedLocally(true)
    onVideoCompleted?.()
  }, [onVideoCompleted])

  return (
    <motion.div
      className="relative flex min-h-full flex-1 flex-col"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(56,189,248,0.14), transparent)',
        }}
      />

      <motion.div
        className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 md:gap-8 md:px-10 md:py-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="space-y-2">
          <p className="text-sm text-cyan-300/80">{PROGRAM_COURSE_TITLE}</p>
          <motion.h1
            key={module.id}
            className="text-2xl font-bold text-white md:text-3xl"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {lessonTitle}
          </motion.h1>
          <p className="text-sm text-slate-500">
            الدرس {moduleIndex + 1} من {totalModules}
          </p>
          <motion.div className="h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-indigo-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          {!canGoNext ? (
            <p className="text-xs text-amber-400/90">
              شاهد الفيديو بالكامل لتفعيل زر «التالي» وفتح الاختبار
            </p>
          ) : null}
        </header>

        <motion.div
          ref={videoSectionRef}
          key={`video-${module.id}`}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ProtectedVideoPlayer
            src={video.src}
            title={lessonTitle}
            moduleId={module.id}
            initialMaxSeconds={watchRecord?.maxSeconds ?? 0}
            initialLastPosition={watchRecord?.lastPosition ?? 0}
            onWatchProgress={onWatchProgress}
            onCompleted={handleCompleted}
            autoPlay={autoplay}
          />
        </motion.div>

        {video.description ? (
          <p className="text-sm leading-relaxed text-slate-500">{video.description}</p>
        ) : null}

        <ProgramStepNavigation
          variant="lesson"
          moduleId={module.id}
          canGoPrevious={canGoPrevious}
          onPrevious={onPrevious}
          onNext={onNext}
          nextDisabled={!canGoNext}
          nextLabel={canGoNext ? 'التالي — الاختبار' : 'التالي'}
          quizDone={quizDoneForModule}
          onReturnToCourses={onReturnToCourses}
          onReturnToOverview={onReturnToOverview}
        />
      </motion.div>
    </motion.div>
  )
}
