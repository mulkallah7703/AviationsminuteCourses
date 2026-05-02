/** Q1 connection columns (labels only; choices come per hazard). */
export const Q1_CONNECTION_TARGETS = [
  { id: 'cause', title: 'السبب' },
  { id: 'effect', title: 'التأثير' },
  { id: 'solution', title: 'الحل' },
]

/**
 * Per-hazard scenario + linked cause / effect / solution distractors.
 * Keys match EXAM_QUESTIONS q1 option ids: vibration | temperature | electricity | chemical
 */
export const HAZARDS_DATA = {
  vibration: {
    id: 'vibration',
    label: 'اهتزازات',
    analyzeLine: 'أنت الآن تحلل خطر: اهتزازات',
    icon: '📳',
    themeClass: 'final-exam--hazard-vibration',
    scenarioLead:
      'عامل يستخدم أداة تهتز لمدة طويلة دون قفازات مضادة للاهتزاز، ويشعر بتنميل في اليدين مع ضعف في التحكم.',
    insight: '💡 تذكر: التعرض الطويل للاهتزازات يؤثر مباشرة على الأعصاب والدورة الدموية.',
    explanation:
      'الخطر هنا اهتزازات مهنية؛ الأعراض (تنميل وضعف تحكم) ترتبط بالتعرض المستمر للاهتزاز، والوقاية تتطلب تقليل الزمن ومعدات مناسبة.',
    connections: {
      cause: [
        { id: 'v-c-ok', label: 'استخدام أداة تهتز لفترة طويلة', correct: true },
        { id: 'v-c-bad', label: 'التعرض لحرارة مرتفعة لفترات طويلة', correct: false },
      ],
      effect: [
        { id: 'v-e-ok', label: 'تنميل وتلف تدريجي للأعصاب', correct: true },
        { id: 'v-e-bad', label: 'تهيج جلدي أو تسمم كيميائي حاد', correct: false },
      ],
      solution: [
        { id: 'v-s-ok', label: 'استخدام قفازات وتقليل مدة التعرض', correct: true },
        { id: 'v-s-bad', label: 'الاستمرار بنفس أسلوب العمل', correct: false },
      ],
    },
    q3: {
      headline: 'أنت في بيئة عمل تحتوي على اهتزازات عالية بشكل مستمر',
      cardLead: 'ما هو الإجراء الأكثر أمانًا في هذا الموقف؟',
      icon: '👷📳',
    },
  },
  temperature: {
    id: 'temperature',
    label: 'حرارة',
    analyzeLine: 'أنت الآن تحلل خطر: حرارة',
    icon: '🌡️',
    themeClass: 'final-exam--hazard-temperature',
    scenarioLead:
      'عامل يقضي ورديات طويلة بجانب مصدر حرارة مرتفع دون فترات راحة كافية، ويشعر بدوار وجفاف وتعب شديد.',
    insight: '💡 تذكر: الإجهاد الحراري يتفاقم مع الزمن دون ماء وراحة وتبريد مناسب.',
    explanation:
      'الخطر هنا حرارة بيئية/مهنية؛ الأعراض تشير إلى إجهاد حراري محتمل، والوقاية تشمل الترطيب والراحة الدورية وتقليل التعرض.',
    connections: {
      cause: [
        { id: 't-c-ok', label: 'التعرض لحرارة مرتفعة لفترات طويلة', correct: true },
        { id: 't-c-bad', label: 'استخدام أداة تهتز لفترة طويلة', correct: false },
      ],
      effect: [
        { id: 't-e-ok', label: 'إجهاد حراري أو حروق سطحية', correct: true },
        { id: 't-e-bad', label: 'صدمة كهربائية مفاجئة', correct: false },
      ],
      solution: [
        { id: 't-s-ok', label: 'شرب الماء وأخذ فترات راحة في مكان أبرد', correct: true },
        { id: 't-s-bad', label: 'تجاهل العطش والاستمرار بنفس الإيقاع', correct: false },
      ],
    },
    q3: {
      headline: 'أنت في بيئة عمل تحتوي على حرارة مرتفعة بشكل مستمر',
      cardLead: 'ما هو الإجراء الأكثر أمانًا في هذا الموقف؟',
      icon: '👷🌡️',
    },
  },
  electricity: {
    id: 'electricity',
    label: 'صدمة كهربائية',
    analyzeLine: 'أنت الآن تحلل خطر: صدمة كهربائية',
    icon: '⚡',
    themeClass: 'final-exam--hazard-electricity',
    scenarioLead:
      'فني يقترب من كابل كهربائي مكشوف أثناء الصيانة دون عزل مصدر الطاقة، وتظهر شرارات صغيرة من نقطة التماس.',
    insight: '💡 تذكر: الكابلات المكشوفة ترفع احتمال الصعق بشكل حاد؛ عزل الطاقة هو الخطوة الأولى.',
    explanation:
      'الخطر هنا كهربائي مباشر؛ أي تماس مع موصل مكشوف قد يسبب صدمة خطيرة، والحل يبدأ بقطع التيار ومعدات العزل.',
    connections: {
      cause: [
        { id: 'e-c-ok', label: 'التعامل مع كابل كهربائي مكشوف دون عزل', correct: true },
        { id: 'e-c-bad', label: 'التعرض لمواد كيميائية سائلة', correct: false },
      ],
      effect: [
        { id: 'e-e-ok', label: 'صدمة كهربائية خطيرة قد تهدد الحياة', correct: true },
        { id: 'e-e-bad', label: 'تنميل بسبب الاهتزاز فقط', correct: false },
      ],
      solution: [
        { id: 'e-s-ok', label: 'فصل التيار واستخدام معدات العزل المناسبة', correct: true },
        { id: 'e-s-bad', label: 'الاستمرار بالعمل بسرعة لإنهاء المهمة', correct: false },
      ],
    },
    q3: {
      headline: 'أنت في بيئة عمل تحتوي على مخاطر كهربائية مرتفعة',
      cardLead: 'ما هو الإجراء الأكثر أمانًا في هذا الموقف؟',
      icon: '👷⚡',
    },
  },
  chemical: {
    id: 'chemical',
    label: 'مواد كيميائية',
    analyzeLine: 'أنت الآن تحلل خطر: مواد كيميائية',
    icon: '🧪',
    themeClass: 'final-exam--hazard-chemical',
    scenarioLead:
      'عامل يخلط موادًا كيميائية في مساحة ضيقة دون قناع مناسب، ويشعر بحرقة في العينين وسعال متكرر.',
    insight: '💡 تذكر: الاستنشاق والملامسة قد تسبب تهيجًا فوريًا أو أضرارًا متراكمة.',
    explanation:
      'الخطر هنا كيميائي؛ الأعراض تشير إلى تهيج تنفسي/ocular، والوقاية تشمل التهوية ومعدات الوقاية والتعامل الآمن.',
    connections: {
      cause: [
        { id: 'c-c-ok', label: 'التعرض لمادة كيميائية بدون حماية كافية', correct: true },
        { id: 'c-c-bad', label: 'الوقوف بجانب أداة تهتز بلا تثبيت', correct: false },
      ],
      effect: [
        { id: 'c-e-ok', label: 'تهيج تنفسي أو تسمم تدريجي', correct: true },
        { id: 'c-e-bad', label: 'صعق كهربائي مباشر', correct: false },
      ],
      solution: [
        { id: 'c-s-ok', label: 'ارتداء معدات الوقاية وتحسين التهوية', correct: true },
        { id: 'c-s-bad', label: 'فتح النوافذ فقط دون قناع مناسب', correct: false },
      ],
    },
    q3: {
      headline: 'أنت في بيئة عمل تحتوي على تعامل مستمر مع مواد كيميائية',
      cardLead: 'ما هو الإجراء الأكثر أمانًا في هذا الموقف؟',
      icon: '👷🧪',
    },
  },
}

export function getHazardData(hazardId) {
  return HAZARDS_DATA[hazardId] ?? null
}
