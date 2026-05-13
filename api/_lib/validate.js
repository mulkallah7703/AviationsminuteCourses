export function normalizeEmployeeNumber(input) {
  if (input == null) return ''
  let s = String(input).trim()
  const arabicIndic = '٠١٢٣٤٥٦٧٨٩'
  const easternArabic = '۰۱۲۳۴۵۶۷۸۹'
  for (let i = 0; i < 10; i += 1) {
    s = s.split(arabicIndic[i]).join(String(i))
    s = s.split(easternArabic[i]).join(String(i))
  }
  return s
}

export const EMPLOYEE_NUMBER_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{3,31}$/

export function validateEmployeeNumber(raw) {
  const normalized = normalizeEmployeeNumber(raw)
  if (!normalized) return { ok: false, normalized, message: 'رقم الموظف مطلوب' }
  if (!EMPLOYEE_NUMBER_RE.test(normalized)) {
    return {
      ok: false,
      normalized,
      message: 'صيغة رقم الموظف غير صحيحة (4–32 حرفًا: أحرف وأرقام أو شرطة)',
    }
  }
  return { ok: true, normalized, message: '' }
}

export function validatePassword(password) {
  const p = String(password ?? '')
  if (p.length < 8) return 'كلمة المرور يجب ألا تقل عن 8 أحرف'
  if (p.length > 128) return 'كلمة المرور طويلة جدًا'
  if (!/[a-z]/.test(p)) return 'كلمة المرور يجب أن تحتوي على حرف صغير إنجليزي'
  if (!/[A-Z]/.test(p)) return 'كلمة المرور يجب أن تحتوي على حرف كبير إنجليزي'
  if (!/[0-9]/.test(p)) return 'كلمة المرور يجب أن تحتوي على رقم'
  return null
}

export function validateFullName(raw) {
  const v = String(raw ?? '').trim()
  if (!v) return { ok: false, value: '', message: 'الاسم الكامل مطلوب' }
  if (v.length > 255) return { ok: false, value: v, message: 'الاسم طويل جدًا' }
  return { ok: true, value: v, message: '' }
}
