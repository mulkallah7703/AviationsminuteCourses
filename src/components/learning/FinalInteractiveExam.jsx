import { useEffect, useState } from 'react'
import { useCourseProgress } from '../../context/CourseProgressContext'
import { HAZARDS_DATA, Q1_CONNECTION_TARGETS, getHazardData } from '../../data/finalExamHazardsData'

const Q2_QUESTIONS = [
  {
    id: 'wire',
    text: 'عامل يقف قريبًا من كابل كهربائي مكشوف',
    answerId: 'electric',
    explanation: 'الكابل المكشوف يمثل خطرًا كهربائيًا مباشرًا.',
  },
  {
    id: 'vibration-tool',
    text: 'أداة اهتزاز قيد التشغيل بلا تثبيت مناسب',
    answerId: 'vibration',
    explanation: 'الأداة غير المثبتة تزيد من خطر الاهتزاز وفقدان التحكم.',
  },
  {
    id: 'heat-barrier',
    text: 'حاجز حراري بجانب مصدر حرارة مرتفع',
    answerId: 'thermal',
    explanation: 'هذا السياق يرتبط بخطر حراري ويحتاج تقييم حماية الحرارة.',
  },
  {
    id: 'loud-sound',
    text: 'صوت أداة مرتفع داخل الورشة',
    answerId: 'noise',
    explanation: 'الصوت المرتفع المستمر يمثل خطر ضوضاء مهني على السمع.',
  },
]

const Q2_SORT_ITEMS = [
  { id: 'aqi', label: 'AQI مرتفع', tone: 'blue', zone: 'environmental' },
  { id: 'skin', label: 'تهيج جلدي', tone: 'red', zone: 'physical' },
  { id: 'cooling', label: 'تبريد مناولة', tone: 'green', zone: 'physical' },
  { id: 'dust', label: 'غبار/جسيمات', tone: 'yellow', zone: 'environmental' },
  { id: 'sunburn', label: 'حروق شمس', tone: 'orange', zone: 'physical' },
]

/** RTL: first column renders on the right — environmental. */
const Q2_DROP_ZONES = [
  { id: 'environmental', title: 'صندوق المخاطر البيئية', boxClass: 'final-exam__drop-box--env' },
  { id: 'physical', title: 'صندوق المخاطر الجسدية/التشغيلية', boxClass: 'final-exam__drop-box--phys' },
]

const EXAM_QUESTIONS = [
  {
    id: 'q1',
    type: 'scenario',
    title: 'سيناريو ميداني',
    scenario:
      'عامل يستخدم أداة تهتز لفترة طويلة دون قفازات مضادة للاهتزاز، ويبدأ بالشعور بتنميل في اليدين مع ضعف في التحكم.',
    prompt: 'ما الخطر الحقيقي هنا؟',
    insight: '💡 تذكر: التعرض الطويل للاهتزازات يؤثر مباشرة على الأعصاب والدورة الدموية.',
    options: [
      { id: 'vibration', label: 'اهتزازات', icon: '📳' },
      { id: 'temperature', label: 'حرارة', icon: '🌡️' },
      { id: 'electricity', label: 'صدمة كهربائية', icon: '⚡' },
      { id: 'chemical', label: 'مواد كيميائية', icon: '🧪' },
    ],
    correctId: 'vibration',
    explanation:
      'الخطر الأساسي هنا هو الاهتزازات؛ لأن الأعراض المذكورة (تنميل وضعف التحكم) ترتبط مباشرة بالتعرض المستمر للاهتزاز.',
  },
  {
    id: 'q2',
    type: 'visual',
    title: 'قرار بصري',
    scenario: 'لاحظ هذا المشهد داخل ورشة عمل قبل بدء المهمة:',
    prompt: 'ما الخطأ الأكثر خطورة في المشهد؟',
    visualLines: [
      'عامل يقف قريبًا من كابل كهربائي مكشوف.',
      'أداة اهتزاز قيد التشغيل بلا تثبيت مناسب.',
      'حاجز حراري موجود بجانب مصدر حرارة مرتفع.',
    ],
    insight: '💡 تذكر: الخطر الأعلى هو ما يجمع احتمال وقوع مرتفع وتأثيرًا مباشرًا شديدًا.',
    options: [
      { id: 'wire', label: 'الكابل الكهربائي المكشوف', icon: '⚡' },
      { id: 'tool', label: 'صوت الأداة المرتفع', icon: '🔊' },
      { id: 'barrier', label: 'وجود حاجز حراري', icon: '🧱' },
      { id: 'sign', label: 'لافتة التحذير', icon: '🚩' },
    ],
    correctId: 'wire',
    explanation:
      'الكابل المكشوف يمثل خطورة فورية لاحتمال الصعق الكهربائي، وهو خطر مباشر أعلى من العناصر الأخرى في هذا المشهد.',
  },
  {
    id: 'q3',
    type: 'action',
    title: 'قرار الإجراء الصحيح',
    scenario: 'أنت تعمل في بيئة تحتوي على اهتزازات عالية بشكل مستمر.',
    prompt: 'ما الإجراء الصحيح؟',
    insight: '💡 تذكر: إدارة الخطر تعتمد على تقليل التعرض + معدات الحماية + الالتزام بالإجراءات.',
    options: [
      { id: 'no-protection', label: 'الاستمرار بدون حماية', icon: '⛔' },
      {
        id: 'safe-action',
        label: 'تقليل مدة التعرض واستخدام معدات الوقاية',
        icon: '✅',
      },
      { id: 'ignore', label: 'تجاهل المشكلة', icon: '🙈' },
      { id: 'rush', label: 'العمل بسرعة لإنهاء المهمة', icon: '🏃' },
    ],
    correctId: 'safe-action',
    explanation:
      'الإجراء الصحيح هو تقليل مدة التعرض مع استخدام معدات الوقاية لأن ذلك يقلل التأثير التراكمي ويحافظ على السلامة.',
  },
]

export function FinalInteractiveExam({ onExitToCourse }) {
  const { recordInteractive, recordQuizPassed, recordLessonComplete } = useCourseProgress()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [q1DropId, setQ1DropId] = useState('')
  const [q1Connections, setQ1Connections] = useState({ cause: '', effect: '', solution: '' })
  const [q1ActionInput, setQ1ActionInput] = useState('')
  const [q2Matches, setQ2Matches] = useState({})
  const [q2Checked, setQ2Checked] = useState(false)
  const [q2DragId, setQ2DragId] = useState('')
  const [q2DragOverZone, setQ2DragOverZone] = useState('')
  const [q2WrongItemId, setQ2WrongItemId] = useState('')
  const [q2ZoneFlash, setQ2ZoneFlash] = useState(null)
  const [q2ShakeZone, setQ2ShakeZone] = useState(null)

  const current = EXAM_QUESTIONS[stepIndex]
  const currentAnswer = answers[current.id]
  const q1Completed =
    Boolean(q1DropId) &&
    Boolean(q1Connections.cause) &&
    Boolean(q1Connections.effect) &&
    Boolean(q1Connections.solution) &&
    q1ActionInput.trim().length > 0
  const q2CorrectCount = Q2_SORT_ITEMS.reduce(
    (acc, item) => acc + (q2Matches[item.id] === item.zone ? 1 : 0),
    0,
  )
  const q2DoneCount = Object.keys(q2Matches).length
  const q2AllSorted = q2CorrectCount === Q2_SORT_ITEMS.length
  const answered =
    current.id === 'q1' ? q1Completed : current.id === 'q2' ? q2Checked : Boolean(currentAnswer)
  const isCorrect =
    current.id === 'q1'
      ? answers.q1 === 'correct'
      : current.id === 'q2'
        ? answers.q2 === 'correct'
      : answered && currentAnswer === current.correctId

  useEffect(() => {
    if (!showResult) return
    recordQuizPassed()
    recordLessonComplete('interactive-assessment')
  }, [showResult, recordQuizPassed, recordLessonComplete])

  useEffect(() => {
    if (answers.q1 === 'correct') recordInteractive('exam-q1')
  }, [answers.q1, recordInteractive])

  useEffect(() => {
    if (answers.q2 === 'correct') recordInteractive('exam-sort')
  }, [answers.q2, recordInteractive])

  useEffect(() => {
    if (answers.q3 === 'safe-action') recordInteractive('exam-q3')
  }, [answers.q3, recordInteractive])

  const onChoose = (optionId) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }))
  }

  const applyQ1Hazard = (optionId) => {
    if (!optionId || !getHazardData(optionId)) return
    if (optionId === q1DropId) return
    setQ1DropId(optionId)
    setDragOver(false)
    setQ1Connections({ cause: '', effect: '', solution: '' })
    setQ1ActionInput('')
    setAnswers((prev) => {
      const next = { ...prev }
      delete next.q1
      return next
    })
  }

  const onDropQ1 = (optionId) => {
    applyQ1Hazard(optionId)
  }

  const onChooseConnection = (targetId, choiceId) => {
    setQ1Connections((prev) => ({ ...prev, [targetId]: choiceId }))
  }

  const finalizeQ1 = () => {
    if (!q1Completed) return
    const hazard = getHazardData(q1DropId)
    if (!hazard) return
    const connectionIsCorrect = Q1_CONNECTION_TARGETS.every((target) => {
      const selected = q1Connections[target.id]
      const choices = hazard.connections[target.id]
      const selectedObj = choices?.find((item) => item.id === selected)
      return selectedObj?.correct
    })
    const fullCorrect = connectionIsCorrect
    setAnswers((prev) => ({ ...prev, q1: fullCorrect ? 'correct' : 'wrong' }))
  }

  const finalizeQ2 = () => {
    if (!q2AllSorted) return
    const fullCorrect = q2CorrectCount === Q2_SORT_ITEMS.length
    setAnswers((prev) => ({ ...prev, q2: fullCorrect ? 'correct' : 'wrong' }))
    setQ2Checked(true)
  }

  const resetQ2 = () => {
    setQ2Matches({})
    setQ2Checked(false)
    setQ2DragId('')
    setQ2DragOverZone('')
    setQ2WrongItemId('')
    setQ2ZoneFlash(null)
    setQ2ShakeZone(null)
    setAnswers((prev) => ({ ...prev, q2: '' }))
  }

  const applyQ2ItemToZone = (zoneId, rawItemId) => {
    const itemId = rawItemId || q2DragId
    const item = Q2_SORT_ITEMS.find((i) => i.id === itemId)
    setQ2DragOverZone('')
    setQ2DragId('')
    if (!item) return
    if (item.zone === zoneId) {
      setQ2Matches((prev) => ({ ...prev, [item.id]: zoneId }))
      setQ2WrongItemId('')
      setQ2ZoneFlash(zoneId)
      window.setTimeout(() => setQ2ZoneFlash(null), 700)
      return
    }
    setQ2WrongItemId(item.id)
    setQ2ShakeZone(zoneId)
    window.setTimeout(() => setQ2ShakeZone(null), 480)
    window.setTimeout(() => setQ2WrongItemId(''), 520)
  }

  const onNext = () => {
    if (!answered) return
    if (stepIndex === EXAM_QUESTIONS.length - 1) {
      setShowResult(true)
      return
    }
    setStepIndex((n) => n + 1)
  }

  const onRetry = () => {
    setStepIndex(0)
    setAnswers({})
    setShowResult(false)
    setQ1DropId('')
    setQ1Connections({ cause: '', effect: '', solution: '' })
    setQ1ActionInput('')
    setDragOver(false)
    setQ2Matches({})
    setQ2Checked(false)
    setQ2DragId('')
    setQ2DragOverZone('')
    setQ2WrongItemId('')
    setQ2ZoneFlash(null)
    setQ2ShakeZone(null)
  }

  const q1Hazard = current.id === 'q1' && q1DropId ? getHazardData(q1DropId) : null
  const hazardThemeClass = q1DropId ? (getHazardData(q1DropId)?.themeClass ?? '') : ''
  const decisionContext = getHazardData(q1DropId) ?? HAZARDS_DATA.vibration

  if (showResult) {
    return (
      <section className="final-exam final-exam--result fade-slide-in" dir="rtl">
        <h1>🎉 تهانينا! لقد أكملت الاختبار والكورس بنجاح</h1>
        <p className="final-exam__result-msg">
          أنت الآن جاهز لتطبيق ما تعلمته والتعامل مع المخاطر بوعي وثقة.
        </p>
        <div className="final-exam__actions">
          <button type="button" className="ghost" onClick={onExitToCourse}>
            العودة للدورة
          </button>
          <button type="button" className="primary" onClick={onRetry}>
            إعادة الاختبار
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={`final-exam fade-slide-in ${hazardThemeClass}`.trim()} dir="rtl">
      <header className="final-exam__head">
        <h1>التقييم التفاعلي النهائي</h1>
        <p>{`السؤال ${stepIndex + 1} من 3`}</p>
        <div className="final-exam__progress" aria-hidden>
          <span style={{ width: `${((stepIndex + 1) / 3) * 100}%` }} />
        </div>
      </header>

      {current.id !== 'q2' ? (
        <article className="final-exam__scenario">
          <h2>{current.title}</h2>
          {current.id === 'q1' ? (
            q1Hazard ? (
              <div key={q1DropId} className="final-exam__scenario-swap">
                <p className="final-exam__analyze-banner" role="status">
                  {q1Hazard.analyzeLine}
                </p>
                <div className="final-exam__scenario-animated final-exam__scenario-animated--dynamic">
                  <p>{q1Hazard.scenarioLead}</p>
                  <span className="final-exam__tool-vibe" aria-hidden>
                    {q1Hazard.icon}
                  </span>
                </div>
              </div>
            ) : (
              <p className="final-exam__scenario-prompt">
                اسحب أحد أنواع المخاطر إلى المربع أو اضغط عليه لتظهر السيناريو والأسئلة المرتبطة به.
              </p>
            )
          ) : (
            <p>{current.scenario}</p>
          )}
          {current.visualLines ? (
            <ul className="final-exam__visual-list">
              {current.visualLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
          <strong>{current.prompt}</strong>
        </article>
      ) : null}

      {current.id === 'q1' ? (
        <>
          <section className="final-exam__drag-layout">
            <div className="final-exam__options" role="list">
              {current.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('text/plain', option.id)}
                  className={`final-exam__option ${q1DropId === option.id ? 'is-selected is-hazard-picked' : ''}`}
                  onClick={() => onDropQ1(option.id)}
                >
                  <span className="final-exam__option-icon" aria-hidden>
                    {option.icon}
                  </span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
            <div
              className={`final-exam__drop-zone ${dragOver ? 'is-over' : ''} ${q1DropId ? 'is-filled' : ''}`}
              onDragOver={(event) => {
                event.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault()
                onDropQ1(event.dataTransfer.getData('text/plain'))
              }}
            >
              {q1DropId
                ? `تم اختيار: ${current.options.find((o) => o.id === q1DropId)?.label}`
                : 'اسحب الخطر الصحيح إلى هنا'}
            </div>
          </section>

          {q1DropId && q1Hazard ? (
            <section key={q1DropId} className="final-exam__connect">
              <h3>اربط السبب والتأثير والحل</h3>
              <div className="final-exam__connect-grid">
                {Q1_CONNECTION_TARGETS.map((target) => (
                  <article key={target.id} className="final-exam__connect-card">
                    <h4>{target.title}</h4>
                    <div className="final-exam__connect-choices">
                      {(q1Hazard.connections[target.id] ?? []).map((choice) => (
                        <button
                          key={choice.id}
                          type="button"
                          className={q1Connections[target.id] === choice.id ? 'is-selected' : ''}
                          onClick={() => onChooseConnection(target.id, choice.id)}
                        >
                          {choice.label}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <label className="final-exam__input-wrap">
                اكتب إجراء وقائي إضافي:
                <input
                  type="text"
                  value={q1ActionInput}
                  onChange={(event) => setQ1ActionInput(event.target.value)}
                  placeholder="مثال: إجراء صيانة دورية للأداة"
                />
              </label>

              <button type="button" className="primary final-exam__check-btn" onClick={finalizeQ1}>
                تحقق من الإجابة
              </button>
            </section>
          ) : null}
        </>
      ) : current.id === 'q2' ? (
        <>
          <section className="final-exam__sort">
            <header className="final-exam__sort-head">
              <h3>تحدي فرز المخاطر الذكية</h3>
              <p>
                صنّف العوامل التالية عن طريق سحبها وإفلاتها داخل الصندوق المناسب (بيئية أو جسدية/تشغيلية).
              </p>
            </header>

            <section className="final-exam__sort-pool" aria-label="بطاقات جاهزة للفرز">
              {Q2_SORT_ITEMS.filter((item) => !q2Matches[item.id]).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', item.id)
                    event.dataTransfer.effectAllowed = 'move'
                    setQ2DragId(item.id)
                  }}
                  onDragEnd={() => {
                    setQ2DragId('')
                    setQ2DragOverZone('')
                  }}
                  className={`final-exam__sort-pool-card final-exam__sort-pool-card--${item.tone} ${
                    q2WrongItemId === item.id ? 'is-shake-wrong' : ''
                  } ${q2DragId === item.id ? 'is-lifted' : ''}`}
                  onClick={() => setQ2DragId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </section>

            <div className="final-exam__sort-layout" dir="rtl">
              {Q2_DROP_ZONES.map((zone) => {
                const inZone = Q2_SORT_ITEMS.filter((item) => q2Matches[item.id] === zone.id)
                const isEmpty = inZone.length === 0
                return (
                  <article
                    key={zone.id}
                    className={`final-exam__drop-box ${zone.boxClass} ${
                      q2DragOverZone === zone.id ? 'is-over' : ''
                    } ${q2ZoneFlash === zone.id ? 'is-success-flash' : ''} ${
                      q2ShakeZone === zone.id ? 'is-shake' : ''
                    }`.trim()}
                    onDragOver={(event) => {
                      event.preventDefault()
                      event.dataTransfer.dropEffect = 'move'
                      setQ2DragOverZone(zone.id)
                    }}
                    onDragLeave={(event) => {
                      const { relatedTarget } = event
                      if (relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) return
                      setQ2DragOverZone((z) => (z === zone.id ? '' : z))
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      const itemId = event.dataTransfer.getData('text/plain') || q2DragId
                      applyQ2ItemToZone(zone.id, itemId)
                    }}
                  >
                    <header className="final-exam__drop-box__head">{zone.title}</header>
                    <div
                      className={`final-exam__drop-box__body ${q2DragId ? 'is-droppable' : ''}`.trim()}
                      role="list"
                      onClick={() => {
                        if (!q2DragId) return
                        applyQ2ItemToZone(zone.id, q2DragId)
                      }}
                    >
                      {isEmpty ? (
                        <p className="final-exam__drop-empty">اسحب العناصر هنا</p>
                      ) : (
                        inZone.map((item) => (
                          <div
                            key={item.id}
                            role="listitem"
                            className={`final-exam__drop-chip final-exam__drop-chip--${item.tone}`}
                          >
                            <span>{item.label}</span>
                            <span className="final-exam__drop-chip__ok" aria-hidden>
                              ✓
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                )
              })}
            </div>

            <footer className="final-exam__sort-progress">
              <span className="final-exam__sort-progress-label">
                تم الفرز <strong>{q2DoneCount}</strong>
                <span className="final-exam__sort-progress-sep">/</span>
                <strong>{Q2_SORT_ITEMS.length}</strong>
              </span>
              <div className="final-exam__sort-progress-track" aria-hidden>
                <span style={{ width: `${(q2DoneCount / Q2_SORT_ITEMS.length) * 100}%` }} />
              </div>
            </footer>
          </section>

          <div className="final-exam__actions final-exam__actions--check">
            {!q2AllSorted ? (
              <p className="final-exam__sort-hint">اسحب كل بطاقة إلى الصندوق المناسب ثم تحقق من الإجابات.</p>
            ) : null}
            <button type="button" className="primary" onClick={finalizeQ2} disabled={!q2AllSorted}>
              تحقق من الإجابات
            </button>
          </div>

          {q2Checked ? (
            <section className={`final-exam__feedback ${answers.q2 === 'correct' ? 'is-ok' : 'is-bad'}`}>
              <h3>{`النتيجة: ${q2CorrectCount}/${Q2_SORT_ITEMS.length}`}</h3>
              <div className="final-exam__match-explanations">
                {Q2_SORT_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`final-exam__match-explain ${q2Matches[item.id] === item.zone ? 'is-ok' : 'is-bad'}`}
                  >
                    <span>{item.label}</span>
                    <span>
                      {q2Matches[item.id] === item.zone
                        ? 'تصنيف صحيح'
                        : `التصنيف الأدق: ${
                            item.zone === 'environmental' ? 'صندوق المخاطر البيئية' : 'صندوق المخاطر الجسدية/التشغيلية'
                          }`}
                    </span>
                  </button>
                ))}
                {Q2_QUESTIONS.map((item) => (
                  <p key={item.id}>{item.explanation}</p>
                ))}
              </div>
              {answers.q2 === 'wrong' ? (
                <div className="final-exam__actions">
                  <button type="button" className="ghost" onClick={resetQ2}>
                    إعادة المحاولة
                  </button>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      ) : (
        current.id === 'q3' ? (
          <section className="final-decision">
            <header className="final-decision__head">
              <span className="final-decision__badge">قرار يؤثر على سلامتك</span>
              <h2>اتخذ القرار الصحيح</h2>
              <p>{decisionContext.q3.headline}</p>
            </header>

            <article className="final-decision__scenario-card">
              <span className="final-decision__scenario-icon" aria-hidden>
                {decisionContext.q3.icon}
              </span>
              <strong>{decisionContext.q3.cardLead}</strong>
            </article>

            <section className="final-decision__options" role="list">
              {current.options.map((option) => {
                const selected = currentAnswer === option.id
                const stateClass = !answered
                  ? ''
                  : option.id === current.correctId
                    ? 'is-correct'
                    : selected
                      ? 'is-wrong'
                      : ''
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`final-decision__option ${selected ? 'is-selected' : ''} ${stateClass}`.trim()}
                    onClick={() => onChoose(option.id)}
                  >
                    <span className="final-decision__option-icon" aria-hidden>
                      {option.icon}
                    </span>
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </section>
          </section>
        ) : (
          <section className="final-exam__options" role="list">
            {current.options.map((option) => {
              const selected = currentAnswer === option.id
              const stateClass = !answered
                ? ''
                : option.id === current.correctId
                  ? 'is-correct'
                  : selected
                    ? 'is-wrong'
                    : ''
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`final-exam__option ${selected ? 'is-selected' : ''} ${stateClass}`.trim()}
                  onClick={() => onChoose(option.id)}
                >
                  <span className="final-exam__option-icon" aria-hidden>
                    {option.icon}
                  </span>
                  <span>{option.label}</span>
                </button>
              )
            })}
          </section>
        )
      )}

      {answered && (current.id === 'q3' || (current.id === 'q1' && answers.q1)) ? (
        <section className={`final-exam__feedback ${isCorrect ? 'is-ok' : 'is-bad'}`}>
          <h3>{isCorrect ? '✔ قرار ذكي!' : 'إجابة تحتاج تصحيح'}</h3>
          <p>
            <strong>لماذا هذا صحيح؟ </strong>
            {current.id === 'q1' && !isCorrect
              ? q1Hazard
                ? `راجع الربط لنوع الخطر (${q1Hazard.label}): تأكد أن السبب والتأثير والحل يصفون نفس المخاطر التي اخترتها.`
                : 'اختر نوع الخطر أولاً ثم اربط السبب والتأثير والحل بما يطابقه.'
              : current.id === 'q1' && isCorrect && q1Hazard
                ? q1Hazard.explanation
                : current.id === 'q3' && !isCorrect
                  ? 'فكر في التأثير طويل المدى على صحتك: القرار الآمن هو تقليل التعرض واستخدام معدات الوقاية.'
                  : current.explanation}
          </p>
          <p className="final-exam__insight">
            {current.id === 'q1'
              ? q1Hazard?.insight ??
                '💡 اختر نوع الخطر لعرض تلميح مخصص يوضح كيفية تحليل هذا السياق.'
              : current.insight}
          </p>
        </section>
      ) : null}

      <footer className="final-exam__actions">
        <button type="button" className="ghost" onClick={onExitToCourse}>
          العودة للدورة
        </button>
        {answered ? (
          <button type="button" className="primary" onClick={onNext}>
            التالي
          </button>
        ) : null}
      </footer>
    </section>
  )
}
