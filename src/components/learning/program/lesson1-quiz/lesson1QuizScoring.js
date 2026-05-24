import { RANKS } from '../../../../data/lesson1ChemicalQuizData.js'

export function getRank(safetyScore) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (safetyScore >= r.min) rank = r
  }
  return rank
}

export function computeSafetyScore({ totalXp, maxXp, mistakeCount, avgResponseMs }) {
  const accuracy = maxXp > 0 ? totalXp / maxXp : 0
  const speedBonus = avgResponseMs > 0 && avgResponseMs < 8000 ? 0.08 : 0
  const mistakePenalty = Math.min(0.35, mistakeCount * 0.06)
  const raw = accuracy * 100 + speedBonus * 100 - mistakePenalty * 100
  return Math.max(0, Math.min(100, Math.round(raw)))
}

export function categoryInsight(scores) {
  const weak = Object.entries(scores)
    .filter(([, v]) => v.total > 0 && v.correct / v.total < 0.6)
    .map(([k]) => k)

  if (weak.length === 0) {
    return 'أداء ممتاز عبر جميع محاور المخاطر الكيميائية — استمر في تطبيق إجراءات الوقاية.'
  }
  const labels = {
    emergency: 'إجراءات الطوارئ',
    classification: 'تصنيف الرموز',
    health: 'التأثيرات الصحية',
    exposure: 'مسارات التعرض',
    environment: 'الأثر البيئي',
    fire: 'مخاطر الحريق',
    judgment: 'حكم السلامة',
  }
  const names = weak.map((k) => labels[k] || k).join('، ')
  return `نوصي بمراجعة: ${names} — ركّز على التطبيق الميداني والـ SDS.`
}
