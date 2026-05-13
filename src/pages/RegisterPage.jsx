import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { mapAuthErrorMessage } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { validateRegisterForm } from '../utils/authValidation'
import '../styles/auth.css'

function passwordStrengthSegments(password) {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  return score
}

export function RegisterPage() {
  const { register, bootstrapping, isAuthenticated, authServiceError } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || bootstrapping) return
    navigate('/dashboard', { replace: true })
  }, [isAuthenticated, bootstrapping, navigate])

  if (bootstrapping) {
    return (
      <div className="auth-loading" dir="rtl">
        <p>جاري التحميل…</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const nm = fullName.trim()
    const emp = employeeNumber.trim()
    const validationMessage = validateRegisterForm({
      fullName: nm,
      employeeNumber: emp,
      password,
      confirmPassword,
    })
    if (validationMessage) {
      setError(validationMessage)
      return
    }
    setSubmitting(true)
    try {
      await register({ fullName: nm, employeeNumber: emp, password, confirmPassword })
      setSuccess(true)
    } catch (err) {
      setError(mapAuthErrorMessage(err, 'تعذر إنشاء الحساب.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page auth-page--split" dir="rtl">
      <aside className="auth-aside" aria-hidden>
        <RegisterAside />
      </aside>

      <div className="auth-panel">
        <div className="auth-card auth-card--large">
          <div className="auth-card__accent" aria-hidden />
          <h1 className="auth-card__title">إنشاء حساب جديد</h1>
          <p className="auth-card__hint">
            أدخل البيانات بدقة. بعد التسجيل ستُسجَّل دخولك تلقائيًا إلى لوحة التحكم.
          </p>

          {authServiceError ? (
            <p className="auth-warning" role="status">
              {authServiceError}
            </p>
          ) : null}

          {success ? (
            <div className="auth-success" role="status">
              <span className="auth-success__icon" aria-hidden>
                ✓
              </span>
              <div>
                <strong className="auth-success__title">تم إنشاء الحساب بنجاح</strong>
                <p className="auth-success__sub">جاري تحويلك إلى لوحة التحكم…</p>
              </div>
            </div>
          ) : null}

          {!success ? (
            <form className="auth-form" onSubmit={onSubmit} noValidate>
              <label className="auth-field">
                <span>الاسم الكامل</span>
                <input
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={submitting}
                />
              </label>
              <label className="auth-field">
                <span>رقم الموظف</span>
                <input
                  autoComplete="username"
                  inputMode="text"
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  required
                  disabled={submitting}
                />
                <span className="auth-field__hint">4–32 حرفًا: أحرف وأرقام، شرطة أو شرطة سفلية.</span>
              </label>
              <RegisterPasswordFields
                password={password}
                confirmPassword={confirmPassword}
                submitting={submitting}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
              />
              {error ? (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              ) : null}
              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting ? 'جاري التسجيل…' : 'تسجيل'}
              </button>
            </form>
          ) : null}

          {!success ? (
            <p className="auth-footer">
              <Link className="auth-link" to="/login">
                العودة لتسجيل الدخول
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function RegisterAside() {
  return (
    <div className="auth-aside__inner">
      <h2 className="auth-aside__title">منصة التدريب التفاعلي</h2>
      <p className="auth-aside__text">
        أنشئ حسابك للوصول إلى المحتوى التدريبي والمسارات المحمية بأمان.
      </p>
    </div>
  )
}

function RegisterPasswordFields({
  password,
  confirmPassword,
  submitting,
  onPasswordChange,
  onConfirmPasswordChange,
}) {
  return (
    <div className="auth-field-row">
      <label className="auth-field">
        <span>كلمة المرور</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          minLength={8}
          disabled={submitting}
        />
        <div className="auth-strength" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`auth-strength__seg ${
                i < passwordStrengthSegments(password) ? 'is-on' : ''
              }`.trim()}
            />
          ))}
        </div>
        <span className="auth-field__hint">
          8 أحرف على الأقل، وحرف كبير وصغير ورقم إنجليزي.
        </span>
      </label>
      <label className="auth-field">
        <span>تأكيد كلمة المرور</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
          minLength={8}
          disabled={submitting}
        />
      </label>
    </div>
  )
}
