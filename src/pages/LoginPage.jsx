import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { mapAuthErrorMessage } from '../api/authApi'
import '../styles/auth.css'

export function LoginPage() {
  const { login, hasUsers, bootstrapping, isAuthenticated, authServiceError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [employeeNumber, setEmployeeNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!bootstrapping && hasUsers === false) {
      navigate('/register', { replace: true })
    }
  }, [bootstrapping, hasUsers, navigate])

  if (bootstrapping) {
    return (
      <div className="auth-loading" dir="rtl">
        <p>جاري التحميل…</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={from.startsWith('/') ? from : '/dashboard'} replace />
  }

  async function submitLogin() {
    setError('')
    setErrorType('')
    const emp = employeeNumber.trim()
    if (!emp || !password) {
      setError('يرجى إدخال رقم الموظف وكلمة المرور.')
      return
    }
    setSubmitting(true)
    try {
      await login({ employeeNumber: emp, password })
      navigate(from.startsWith('/') ? from : '/dashboard', { replace: true })
    } catch (err) {
      setErrorType(err?.code ? String(err.code) : String(err?.status ?? 'unknown'))
      setError(mapAuthErrorMessage(err, 'حدث خطأ أثناء تسجيل الدخول'))
    } finally {
      setSubmitting(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    await submitLogin()
  }

  return (
    <div className="auth-page auth-page--split" dir="rtl">
      <aside className="auth-aside auth-aside--alt" aria-hidden>
        <div className="auth-aside__inner">
          <h2 className="auth-aside__title">مرحبًا بعودتك</h2>
          <p className="auth-aside__text">سجّل الدخول للمتابعة إلى لوحة الدورة والمحتوى المحمي.</p>
        </div>
      </aside>

      <div className="auth-panel">
        <div className="auth-card auth-card--large">
          <div className="auth-card__accent" aria-hidden />
          <h1 className="auth-card__title">تسجيل الدخول</h1>
          <p className="auth-card__hint">أدخل رقم الموظف وكلمة المرور للمتابعة.</p>

          {authServiceError ? (
            <p className="auth-warning" role="status">
              {authServiceError}
            </p>
          ) : null}

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <label className="auth-field">
              <span>رقم الموظف</span>
              <input
                autoComplete="username"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                required
                disabled={submitting}
              />
            </label>
            <label className="auth-field">
              <span>كلمة المرور</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
            </label>
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}
            {(errorType === 'NETWORK' ||
              errorType === 'TIMEOUT' ||
              errorType === '503' ||
              errorType === '502' ||
              errorType === '504') && (
              <button
                type="button"
                className="auth-retry"
                onClick={submitLogin}
                disabled={submitting}
              >
                إعادة المحاولة
              </button>
            )}
            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? 'جاري الدخول…' : 'دخول'}
            </button>
          </form>

          <p className="auth-footer">
            <Link className="auth-link" to="/register">
              تسجيل حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
