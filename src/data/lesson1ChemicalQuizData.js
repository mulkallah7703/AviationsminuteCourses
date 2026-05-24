/** Lesson 1 only — chemical hazards interactive assessment content */

export const RANKS = [
  { min: 0, label: 'مبتدئ', color: 'text-slate-400' },
  { min: 40, label: 'آمن', color: 'text-cyan-400' },
  { min: 60, label: 'محترف السلامة', color: 'text-emerald-400' },
  { min: 80, label: 'قائد السلامة', color: 'text-amber-400' },
]

export const HAZARD_SYMBOLS = [
  { id: 'flammable', icon: '🔥', label: 'قابل للاشتعال' },
  { id: 'explosive', icon: '💥', label: 'متفجر' },
  { id: 'toxic', icon: '☠️', label: 'سام' },
  { id: 'oxidizing', icon: '⭕', label: 'مؤكسد' },
  { id: 'corrosive', icon: '🧪', label: 'آكل / مسبب للتآكل' },
  { id: 'environmental', icon: '🌍', label: 'خطير بيئياً' },
  { id: 'gas', icon: '🛢️', label: 'غاز مضغوط' },
]

export const LESSON1_STEPS = [
  {
    id: 'intro',
    type: 'intro',
    title: 'محاكاة المخاطر الكيميائية',
    subtitle: 'وحدة التدريب التفاعلي — الدرس الأول',
  },
  {
    id: 'scenario-leak',
    type: 'scenario',
    category: 'emergency',
    title: 'سيناريو ميداني',
    scenario:
      'أثناء جولة تفتيش داخل مستودع، تلاحظ حاوية كيميائية تتسرب منها سائل غير معروف مع رائحة حادة. العمال يعملون على بعد 5 أمتار.',
    prompt: 'ما الإجراء الأول والأكثر أماناً؟',
    xp: 120,
    options: [
      {
        id: 'evacuate',
        label: 'إخلاء المنطقة وإبلاغ مسؤول السلامة فوراً',
        correct: true,
        feedback:
          'صحيح — العزل والإبلاغ يمنع التعرض ويُفعّل خطة الطوارئ قبل أي تدخل قد يزيد الخطر.',
      },
      {
        id: 'smell',
        label: 'الاقتراب لتحديد الرائحة والمادة',
        correct: false,
        feedback: 'خطير — الاستنشاق قد يسبب تسمماً حاداً؛ لا تقترب دون معدات وحماية معتمدة.',
      },
      {
        id: 'contain',
        label: 'سد التسرب بيديك دون معدات',
        correct: false,
        feedback: 'مرفوض — التعامل المباشر دون تحليل المادة ومعدات الحماية يعرّضك لحروق أو تسمم.',
      },
      {
        id: 'continue',
        label: 'متابعة العمل لأن التسرب بسيط',
        correct: false,
        feedback: 'لا يُقدَّر التسرب البسيط بأنه آمناً — أي تسرب قد يتصاعد أو يشتعل.',
      },
    ],
  },
  {
    id: 'hazard-match',
    type: 'hazard-match',
    category: 'classification',
    title: 'تعرّف رموز الخطر',
    prompt: 'اسحب كل رمز إلى التصنيف الصحيح (أو انقر الرمز ثم التصنيف)',
    xp: 150,
    pairs: HAZARD_SYMBOLS.map((s) => ({ symbolId: s.id, label: s.label })),
  },
  {
    id: 'classification-mcq',
    type: 'mcq',
    category: 'classification',
    title: 'تصنيف المخاطر',
    prompt: 'أي من التالي يصف «المؤكسد» بدقة؟',
    xp: 100,
    options: [
      {
        id: 'a',
        label: 'مادة تزيد من احتراق مواد أخرى دون أن تشتعل ذاتياً بسهولة',
        correct: true,
        feedback: 'المؤكسدات تُغذي الحريق — لذلك تُفصل عن المواد القابلة للاشتعال.',
      },
      {
        id: 'b',
        label: 'مادة آمنة للشرب بعد التخفيف',
        correct: false,
        feedback: 'التخفيف لا يُلغي خطر المؤكسدات — التصنيف يحدد التعامل والتخزين.',
      },
      {
        id: 'c',
        label: 'غاز خامل لا يتفاعل أبداً',
        correct: false,
        feedback: 'المؤكسد عكس الخامل — يشارك في تفاعلات احتراق.',
      },
    ],
  },
  {
    id: 'health-effects',
    type: 'scenario',
    category: 'health',
    title: 'تأثيرات صحية',
    scenario: 'عامل تعرّض لأبخرة مذيبات عضوية بلا قناع مناسب لسنوات.',
    prompt: 'أي تأثير صحي الأرجح على المدى الطويل؟',
    xp: 100,
    options: [
      {
        id: 'cancer',
        label: 'سرطان / مشاكل تنفسية مزمنة',
        correct: true,
        feedback: 'التعرض المزمن للمذيبات يرتبط بأمراض تنفسية وسرطانات مهنية.',
      },
      {
        id: 'hair',
        label: 'تساقط الشعر فقط دون مخاطر أخرى',
        correct: false,
        feedback: 'التأثيرات الجهازية أعمق من التجميلية — الجهاز التنفسي والكبد معرّضان.',
      },
      {
        id: 'none',
        label: 'لا تأثير إن لم تظهر أعراض فورية',
        correct: false,
        feedback: 'الأعراض المتأخرة شائعة في التعرض الكيميائي — الوقاية قبل الظهور.',
      },
    ],
  },
  {
    id: 'exposure-order',
    type: 'order',
    category: 'exposure',
    title: 'مسارات التعرض',
    prompt: 'رتّب مسارات التعرض من الأكثر شيوعاً في بيئة العمل إلى الأقل (حسب الدرس)',
    xp: 120,
    correctOrder: ['inhalation', 'skin', 'ingestion', 'injection'],
    items: [
      { id: 'inhalation', label: 'الاستنشاق' },
      { id: 'skin', label: 'الامتصاص عبر الجلد' },
      { id: 'ingestion', label: 'الابتلاع' },
      { id: 'injection', label: 'الحقن / الثقب الجلدي' },
    ],
  },
  {
    id: 'environment-tf',
    type: 'true-false',
    category: 'environment',
    title: 'تأثيرات بيئية',
    statements: [
      {
        id: 'bio',
        text: 'التراكم الحيوي (Bioaccumulation) يعني تراكم الملوثات في سلسلة غذائية.',
        correct: true,
        feedback: 'صحيح — الملوثات تنتقل من كائن لآخر وتتركز في المفترسات.',
      },
      {
        id: 'soil',
        text: 'تلوث التربة لا يؤثر على المياه الجوفية.',
        correct: false,
        feedback: 'التربة المتدهورة تسرب ملوثات إلى المياه — خطر بيئي مزدوج.',
      },
    ],
    xp: 80,
  },
  {
    id: 'physical-fire',
    type: 'mcq',
    category: 'fire',
    title: 'مخاطر الحريق',
    prompt: 'أي مجموعة تزيد خطر حريق كيميائي في المستودع؟',
    xp: 100,
    options: [
      {
        id: 'combo',
        label: 'مواد قابلة للاشتعال + مؤكسدات مخزنة معاً',
        correct: true,
        feedback: 'الجمع بين وقود ومؤكسد يخلق ظروف اشتعال عنيف — فصل التخزين إلزامي.',
      },
      {
        id: 'water',
        label: 'الماء فقط بالقرب من المواد',
        correct: false,
        feedback: 'الماء لا يُعالج كل المواد — بعض الكيماويات تتفاعل مع الماء.',
      },
      {
        id: 'open',
        label: 'فتح النوافذ دون تهوية مقاسة',
        correct: false,
        feedback: 'التهوية يجب أن تُصمم — التهوية العشوائية قد ت分散 vapors خطرة.',
      },
    ],
  },
  {
    id: 'emergency-timed',
    type: 'timed',
    category: 'emergency',
    title: 'وضع الطوارئ',
    timedSeconds: 12,
    scenario: 'انفجار صغير في مختبر — إنذار يعمل والدخان يتصاعد.',
    prompt: 'اختر فوراً:',
    xp: 150,
    options: [
      {
        id: 'exit',
        label: 'اتبع مسار الإخلاء — لا تستخدم المصعد',
        correct: true,
        feedback: 'الإخلاء المنضبط يحفظ الأرواح — المصاعد خطرة عند الحريق.',
      },
      {
        id: 'gear',
        label: 'أعد ارتداء معداتك أولاً',
        correct: false,
        feedback: 'في الطوارئ — الإخلاء أولاً؛ المعدات الثانوية إن أمكن بسرعة.',
      },
      {
        id: 'photo',
        label: 'وثّق الحادث بالتصوير',
        correct: false,
        feedback: 'التصوير يُؤجل لما بعد السلامة — الأولوية للإخلاء.',
      },
    ],
  },
  {
    id: 'branch-decision',
    type: 'branch',
    category: 'judgment',
    title: 'حكم السلامة',
    scenario: 'زميلك يريد نقل حاوية متآكلة بدون بطاقة بيانات السلامة (SDS).',
    prompt: 'ماذا تفعل؟',
    xp: 130,
    branches: [
      {
        id: 'stop',
        label: 'إيقاف العملية حتى توفر SDS والتصريح',
        correct: true,
        consequence: 'تم احتواء المخاطر — الإدارة راجعت التخزين.',
        feedback: 'قرار قيادي — SDS ضرورية لمعرفة التعامل والطوارئ.',
      },
      {
        id: 'help',
        label: 'المساعدة لتسريع النقل',
        correct: false,
        consequence: 'سقوط الحاوية — تعرض محتمل للتسرب.',
        feedback: 'التسرع دون بيانات يعرّض الجميع — الواجب إيقاف العمل غير الآمن.',
      },
    ],
  },
  {
    id: 'results',
    type: 'results',
    title: 'لوحة التحليلات',
  },
]
