import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AuthEntryRedirect() {
  const { isAuthenticated, bootstrapping, hasUsers } = useAuth()

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

  if (hasUsers === null) {
    return <Navigate to="/login" replace />
  }

  if (!hasUsers) {
    return <Navigate to="/register" replace />
  }

  return <Navigate to="/login" replace />
}
