import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function SessionToolbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="session-toolbar" dir="rtl">
      <span className="session-toolbar__user">{user.fullName ?? user.name}</span>
      <button
        type="button"
        className="session-toolbar__logout"
        onClick={async () => {
          await logout()
          navigate('/login', { replace: true })
        }}
      >
        تسجيل الخروج
      </button>
    </div>
  )
}
