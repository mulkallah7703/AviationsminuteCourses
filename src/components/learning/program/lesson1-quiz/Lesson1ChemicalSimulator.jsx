import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { ProgramStepNavigation } from '../ProgramStepNavigation.jsx'
import { computeSafetyScore } from './lesson1QuizScoring'
import { Lesson1Hud } from './Lesson1Hud'
import { Lesson1IntroChrome, Lesson1QuizActions, Lesson1QuizProgress } from './Lesson1QuizChrome.jsx'
import { Lesson1CompletionTransition } from './Lesson1CompletionTransition.jsx'
import { getModuleById } from '../../../../data/programCourse.js'
import {
  BranchView,
  HazardMatchView,
  IntroView,
  McqView,
  OrderView,
  ScenarioView,
  TimedView,
  TrueFalseView,
  useTimedCountdown,
} from './Lesson1StepViews.jsx'
import {
  SCORABLE_STEPS,
  useLesson1QuizFlow,
  useLesson1QuizKeyboard,
} from './useLesson1QuizFlow.js'
import './lesson1-quiz.css'

export function Lesson1ChemicalSimulator({
  title,
  moduleIndex,
  totalModules,
  alreadyCompleted,
  onPrevious,
  onSubmitQuiz,
  isLastQuiz,
  canSubmit,
  moduleId = 1,
  onGoToNextLesson,
  onFinishAndContinue,
  onReturnToCourses,
  onReviewCourse,
  onReturnToOverview,
}) {
  const flow = useLesson1QuizFlow()
  const {
    step,
    scorableIndex,
    isIntro,
    isQuestion,
    current,
    patchCurrent,
    answeredCount,
    progressPercent,
    isStepAnswered,
    goToScorable,
    goNextQuestion,
    goPrevQuestion,
    markScored,
    getElapsed,
    resetFlow,
  } = flow

  const [xp, setXp] = useState(0)
  const [mistakeCount, setMistakeCount] = useState(0)
  const [riskLevel, setRiskLevel] = useState(35)
  const [responseTimes, setResponseTimes] = useState([])
  const [categoryScores, setCategoryScores] = useState({})
  const [showCompletion, setShowCompletion] = useState(false)

  const phase = current.phase
  const selectedId = current.selectedId
  const feedback = current.feedback
  const consequence = current.consequence
  const hazardMatches = current.hazardMatches
  const orderIds = current.orderIds
  const tfIndex = current.tfIndex

  const maxXpVal = 1050
  const scrollRef = useRef(null)

  const recordCategory = useCallback((category, correct) => {
    if (!category) return
    setCategoryScores((prev) => {
      const cur = prev[category] || { correct: 0, total: 0 }
      return {
        ...prev,
        [category]: {
          correct: cur.correct + (correct ? 1 : 0),
          total: cur.total + 1,
        },
      }
    })
  }, [])

  const applyScore = useCallback(
    (correct, xpGain, category) => {
      if (!step?.id || !markScored(step.id)) return
      setResponseTimes((t) => [...t, getElapsed()])
      recordCategory(category, correct)
      if (correct) {
        setXp((x) => x + xpGain)
        setRiskLevel((r) => Math.max(0, r - 8))
      } else {
        setMistakeCount((m) => m + 1)
        setRiskLevel((r) => Math.min(100, r + 12))
      }
    },
    [step?.id, markScored, getElapsed, recordCategory],
  )

  const safetyScore = useMemo(() => {
    const avgMs =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0
    return computeSafetyScore({
      totalXp: xp,
      maxXp: maxXpVal,
      mistakeCount,
      avgResponseMs: avgMs,
    })
  }, [xp, mistakeCount, responseTimes])

  const avgResponseSec =
    responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000).toFixed(1)
      : '0'

  const handleTimedExpire = useCallback(() => {
    if (phase !== 'active' || step?.type !== 'timed') return
    patchCurrent({
      phase: 'feedback',
      selectedId: '_timeout',
      feedback: {
        correct: false,
        text: 'انتهى الوقت — في الطوارئ القرار السريع يحدد السلامة.',
      },
    })
    applyScore(false, 0, step.category)
  }, [phase, step, patchCurrent, applyScore])

  const secondsLeft = useTimedCountdown(
    step?.type === 'timed' && phase === 'active' && isQuestion,
    step?.timedSeconds ?? 12,
    handleTimedExpire,
  )

  const handleStart = () => goToScorable(0)

  const handleScenarioSelect = (opt) => {
    if (phase === 'feedback') return
    patchCurrent({
      selectedId: opt.id,
      phase: 'feedback',
      feedback: { correct: Boolean(opt.correct), text: opt.feedback },
    })
    applyScore(Boolean(opt.correct), step.xp || 100, step.category)
  }

  const handleBranchSelect = (branch) => {
    patchCurrent({
      selectedId: branch.id,
      consequence: branch.consequence,
      phase: 'feedback',
      feedback: { correct: Boolean(branch.correct), text: branch.feedback },
    })
    applyScore(Boolean(branch.correct), step.xp || 100, step.category)
  }

  const handleHazardMatch = (symbolId, label) => {
    patchCurrent((base) => ({
      hazardMatches: { ...base.hazardMatches, [symbolId]: label },
    }))
  }

  const submitHazardMatch = () => {
    const matches = { ...hazardMatches }
    const allCorrect = step.pairs.every((p) => matches[p.symbolId] === p.label)
    patchCurrent({
      phase: 'feedback',
      feedback: {
        correct: allCorrect,
        text: allCorrect
          ? 'مطابقة ممتازة — التعرف على الرموز يمنع سوء التعامل والتخزين.'
          : 'راجع تصنيفات GHS — كل رمز يحدد إجراءات منع وطوارئ مختلفة.',
      },
    })
    applyScore(allCorrect, step.xp || 150, step.category)
  }

  const submitOrder = () => {
    const correct = step.correctOrder.every((id, i) => orderIds[i] === id)
    patchCurrent({
      phase: 'feedback',
      feedback: {
        correct,
        text: correct
          ? 'الاستنشاق هو الأكثر شيوعاً في بيئات العمل الكيميائية.'
          : 'تذكر: الاستنشاق أولاً، ثم الجلد، الابتلاع، والحقن نادر نسبياً.',
      },
    })
    applyScore(correct, step.xp || 120, step.category)
  }

  const handleTfAnswer = (answer) => {
    const stmt = step.statements[tfIndex]
    const correct = answer === stmt.correct
    const tfAnswered = [...(current.tfAnswered || []), { index: tfIndex, correct }]
    patchCurrent({
      tfAnswered,
      phase: 'feedback',
      feedback: { correct, text: stmt.feedback },
    })
    if (markScored(`${step.id}-tf-${tfIndex}`)) {
      setResponseTimes((t) => [...t, getElapsed()])
      recordCategory(step.category, correct)
      if (!correct) setMistakeCount((m) => m + 1)
    }

    if (tfIndex >= step.statements.length - 1) {
      const allCorrect = tfAnswered.every((a) => a.correct)
      if (markScored(`${step.id}-bundle`)) {
        if (allCorrect) {
          setXp((x) => x + (step.xp || 80))
          setRiskLevel((r) => Math.max(0, r - 5))
        } else {
          setRiskLevel((r) => Math.min(100, r + 5))
        }
      }
    }
  }

  const advanceTrueFalse = () => {
    if (tfIndex < step.statements.length - 1) {
      patchCurrent({
        tfIndex: tfIndex + 1,
        phase: 'active',
        feedback: null,
      })
      flow.stepStartedAt.current = Date.now()
    }
  }

  const handleFinishSimulation = () => {
    if (onFinishAndContinue) {
      onFinishAndContinue()
      return
    }
    if (canSubmit && !alreadyCompleted) onSubmitQuiz?.()
    onGoToNextLesson?.()
  }

  const handleProceedToLesson2 = () => {
    if (onFinishAndContinue) {
      onFinishAndContinue()
      return
    }
    onGoToNextLesson?.()
  }

  const handleRetryQuiz = () => {
    if (!canSubmit) return
    setXp(0)
    setMistakeCount(0)
    setRiskLevel(35)
    setResponseTimes([])
    setCategoryScores({})
    setShowCompletion(false)
    resetFlow()
  }

  const lesson2 = getModuleById(2)

  useLesson1QuizKeyboard({
    enabled: isQuestion,
    onNext: () => {
      if (step?.type === 'true-false' && phase === 'feedback' && tfIndex < step.statements.length - 1) {
        advanceTrueFalse()
        return
      }
      goNextQuestion()
    },
    onPrev: goPrevQuestion,
  })

  const quizNavProps = {
    variant: 'quiz',
    moduleId,
    canGoPrevious: true,
    onPrevious,
    quizDone: alreadyCompleted,
    isLastQuiz,
    canSubmitQuiz: canSubmit,
    onSubmitQuiz: handleProceedToLesson2,
    onGoToNextLesson,
    onReturnToCourses,
    onReviewCourse,
    onReturnToOverview,
  }

  const primaryStepAction = useMemo(() => {
    if (!isQuestion || phase === 'feedback') return null
    if (step?.type === 'hazard-match') {
      const allMatched = step.pairs.every((p) => hazardMatches[p.symbolId])
      return (
        <button
          type="button"
          disabled={!allMatched}
          onClick={submitHazardMatch}
          className="w-full rounded-xl bg-amber-500/90 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40"
        >
          تأكيد المطابقة
        </button>
      )
    }
    if (step?.type === 'order') {
      return (
        <button
          type="button"
          disabled={orderIds.length !== step.items.length}
          onClick={submitOrder}
          className="w-full rounded-xl bg-amber-500/90 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40"
        >
          تحقق من الترتيب
        </button>
      )
    }
    if (step?.type === 'true-false' && phase === 'active') {
      return null
    }
    return null
  }, [isQuestion, phase, step, hazardMatches, orderIds, submitHazardMatch, submitOrder])

  // Must run on every render — early returns below must not skip this hook.
  useEffect(() => {
    if (!isQuestion) return
    const el = scrollRef.current
    if (el) {
      el.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
    document.querySelector('main')?.scrollTo?.({ top: 0, behavior: 'smooth' })
    const shell = document.querySelector('.learner-shell-scroll')
    shell?.scrollTo?.({ top: 0, behavior: 'smooth' })
  }, [step?.id, isQuestion])

  if (showCompletion) {
    return (
      <motion.div
        className="lesson1-sim lesson1-sim__grid-bg relative w-full"
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-slate-950" />
        <Lesson1Hud
          xp={xp}
          safetyScore={safetyScore}
          riskLevel={riskLevel}
          stepIndex={SCORABLE_STEPS.length - 1}
          totalSteps={SCORABLE_STEPS.length}
        />
        <Lesson1CompletionTransition
          safetyScore={safetyScore}
          xp={xp}
          mistakeCount={mistakeCount}
          onGoToLesson2={handleProceedToLesson2}
          onRetryQuiz={handleRetryQuiz}
          onReviewLesson={onPrevious}
          onReturnToCourse={onReturnToOverview}
          canRetryQuiz={canSubmit && !alreadyCompleted}
          nextLessonTitle={lesson2?.lessonTitle}
        />
      </motion.div>
    )
  }

  if (alreadyCompleted && !showCompletion) {
    return (
      <motion.div className="lesson1-sim flex min-h-full flex-col" dir="rtl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 px-4 py-16">
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="mt-3 text-slate-400">تم إكمال المحاكاة — يمكنك المتابعة أو المراجعة.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCompletion(true)}
            className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-sm font-semibold text-amber-200"
          >
            عرض ملخص الإنجاز والانتقال للدرس الثاني
          </button>
          <ProgramStepNavigation {...quizNavProps} />
        </div>
      </motion.div>
    )
  }

  const showHud = isQuestion
  const isLastQuestion = scorableIndex === SCORABLE_STEPS.length - 1

  return (
    <motion.div
      className={`lesson1-sim lesson1-sim__grid-bg relative w-full ${
        isQuestion ? 'lesson1-sim--quiz-active' : 'flex min-h-full flex-1 flex-col'
      }`}
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-slate-950" />

      {isQuestion ? (
        <div className="lesson1-sim__sticky-head relative">
          {showHud && !isIntro ? (
            <Lesson1Hud
              xp={xp}
              safetyScore={safetyScore}
              riskLevel={riskLevel}
              stepIndex={scorableIndex >= 0 ? scorableIndex : 0}
              totalSteps={SCORABLE_STEPS.length}
            />
          ) : null}
          <Lesson1QuizProgress
            scorableIndex={scorableIndex}
            answeredCount={answeredCount}
            progressPercent={progressPercent}
            isStepAnswered={isStepAnswered}
            onSelectQuestion={goToScorable}
            onBackToLesson={onPrevious}
          />
        </div>
      ) : (
        <>
          {showHud && !isIntro ? (
            <Lesson1Hud
              xp={xp}
              safetyScore={safetyScore}
              riskLevel={riskLevel}
              stepIndex={scorableIndex >= 0 ? scorableIndex : 0}
              totalSteps={SCORABLE_STEPS.length}
            />
          ) : null}
        </>
      )}

      <div
        ref={scrollRef}
        className={isQuestion ? 'lesson1-sim__scroll-main relative z-10' : 'relative min-h-0 flex-1 overflow-y-auto'}
      >
        <AnimatePresence mode="wait">
          {isIntro && <IntroView key="intro" step={step} onStart={handleStart} />}

          {step?.type === 'scenario' && (
            <ScenarioView
              key={step.id}
              step={step}
              phase={phase}
              selectedId={selectedId}
              feedback={feedback}
              onSelect={handleScenarioSelect}
            />
          )}

          {step?.type === 'mcq' && (
            <McqView
              key={step.id}
              step={step}
              phase={phase}
              selectedId={selectedId}
              feedback={feedback}
              onSelect={handleScenarioSelect}
            />
          )}

          {step?.type === 'branch' && (
            <BranchView
              key={step.id}
              step={step}
              phase={phase}
              selectedId={selectedId}
              feedback={feedback}
              consequence={consequence}
              onSelect={handleBranchSelect}
            />
          )}

          {step?.type === 'hazard-match' && (
            <HazardMatchView
              key={step.id}
              step={step}
              phase={phase}
              matches={hazardMatches}
              feedback={feedback}
              onMatch={handleHazardMatch}
              onSubmit={submitHazardMatch}
              allMatched={step.pairs.every((p) => hazardMatches[p.symbolId])}
            />
          )}

          {step?.type === 'order' && (
            <OrderView
              key={step.id}
              step={step}
              phase={phase}
              order={orderIds}
              onReorder={(ids) => patchCurrent({ orderIds: ids })}
              onSubmit={submitOrder}
              feedback={feedback}
            />
          )}

          {step?.type === 'true-false' && (
            <TrueFalseView
              key={`${step.id}-${tfIndex}`}
              step={step}
              statementIndex={tfIndex}
              phase={phase}
              feedback={feedback}
              onAnswer={handleTfAnswer}
            />
          )}

          {step?.type === 'timed' && (
            <TimedView
              key={step.id}
              step={step}
              phase={phase}
              secondsLeft={secondsLeft}
              selectedId={selectedId}
              feedback={feedback}
              onSelect={handleScenarioSelect}
            />
          )}

        </AnimatePresence>
      </div>

      {isQuestion ? (
        <div className="lesson1-sim__sticky-foot relative">
          <Lesson1QuizActions
            onPrev={goPrevQuestion}
            onNext={() => {
              if (step?.type === 'true-false' && phase === 'feedback' && tfIndex < step.statements.length - 1) {
                advanceTrueFalse()
                return
              }
              if (isLastQuestion && phase === 'feedback') {
                handleFinishSimulation()
                return
              }
              if (isLastQuestion) {
                handleFinishSimulation()
                return
              }
              goNextQuestion()
            }}
            onFinish={handleFinishSimulation}
            canGoPrev={scorableIndex > 0}
            canGoNext
            showFinish={isLastQuestion && phase === 'feedback'}
            primaryAction={primaryStepAction}
          />
        </div>
      ) : null}

      {isIntro ? (
        <Lesson1IntroChrome onBackToLesson={onPrevious} />
      ) : null}

    </motion.div>
  )
}
