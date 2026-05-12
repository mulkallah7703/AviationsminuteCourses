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

export function validatePasswordStrength(password) {
  const p = String(password ?? '')
  if (p.length < 8) return 'كلمة المرور يجب ألا تقل عن 8 أحرف'
  if (p.length > 128) return 'كلمة المرور طويلة جدًا'
  if (!/[a-z]/.test(p)) return 'كلمة المرور يجب أن تحتوي على حرف صغير إنجليزي'
  if (!/[A-Z]/.test(p)) return 'كلمة المرور يجب أن تحتوي على حرف كبير إنجليزي'
  if (!/[0-9]/.test(p)) return 'كلمة المرور يجب أن تحتوي على رقم'
  return null
}

export function validateRegisterForm({ fullName, employeeNumber, password, confirmPassword }) {
  const name = String(fullName ?? '').trim()
  if (!name) return 'الاسم الكامل مطلوب'
  if (name.length > 255) return 'الاسم طويل جدًا'

  const emp = normalizeEmployeeNumber(employeeNumber)
  if (!emp) return 'رقم الموظف مطلوب'
  if (!EMPLOYEE_NUMBER_RE.test(emp)) {
    return 'صيغة رقم الموظف غير صحيحة (4–32 حرفًا: أحرف وأرقام، شرطة أو شرطة سفلية)'
  }

  const pwMsg = validatePasswordStrength(password)
  if (pwMsg) return pwMsg

  if (password !== confirmPassword) return 'تأكيد كلمة المرور غير متطابق'
  return null
}
