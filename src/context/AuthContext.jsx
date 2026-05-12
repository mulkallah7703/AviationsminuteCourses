import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  clearStoredTokens,
  fetchBootstrap,
  fetchMe,
  getStoredAccessToken,
  getStoredRefreshBundle,
  loginUser,
  logoutRequest,
  persistTokens,
  refreshTokens,
  registerUser,
  mapAuthErrorMessage,
} from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken())
  const [hasUsers, setHasUsers] = useState(null)
  const [authServiceError, setAuthServiceError] = useState('')
  const [bootstrapping, setBootstrapping] = useState(true)
  const refreshPromiseRef = useRef(null)

  const applySession = useCallback((payload) => {
    if (payload?.accessToken) {
      setAccessToken(payload.accessToken)
      persistTokens({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        refreshJwt: payload.refreshJwt,
      })
    }
    if (payload?.user) {
      setUser(payload.user)
    }
  }, [])

  const clearSession = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    clearStoredTokens()
  }, [])

  const tryRefresh = useCallback(async () => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current

    const { refreshToken, refreshJwt } = getStoredRefreshBundle()
    if (!refreshToken && !refreshJwt) {
      clearSession()
      return null
    }

    refreshPromiseRef.current = (async () => {
      try {
        const data = await refreshTokens({ refreshToken, refreshJwt })
        applySession(data)
        return data.accessToken
      } catch {
        clearSession()
        return null
      } finally {
        refreshPromiseRef.current = null
      }
    })()

    return refreshPromiseRef.current
  }, [applySession, clearSession])

  const loadSession = useCallback(async () => {
    const token = getStoredAccessToken()
    const bundle = getStoredRefreshBundle()
    if (!token && !bundle.refreshToken && !bundle.refreshJwt) {
      setUser(null)
      setAccessToken(null)
      return
    }

    if (token) {
      try {
        const data = await fetchMe(token)
        setUser(data.user)
        setAccessToken(token)
        return
      } catch {
        /* fall through to refresh */
      }
    }

    const refreshed = await tryRefresh()
    if (refreshed) {
      try {
        const data = await fetchMe(refreshed)
        setUser(data.user)
        setAccessToken(refreshed)
      } catch {
        clearSession()
      }
    }
  }, [clearSession, tryRefresh])

  useEffect(() => {
    let cancelled = false

      ; (async () => {
        try {
          const b = await fetchBootstrap()
          if (!cancelled) {
            setHasUsers(Boolean(b.hasUsers))
            setAuthServiceError('')
          }
        } catch (error) {
          if (!cancelled) {
            /* Unknown — do not assume users exist (would block /register when API is down). */
            setHasUsers(null)
            setAuthServiceError(mapAuthErrorMessage(error, 'تعذر الاتصال بالخدمة'))
          }
        }

        await loadSession()
        if (!cancelled) setBootstrapping(false)
      })()

    return () => {
      cancelled = true
    }
  }, [loadSession])

  const login = useCallback(
    async ({ employeeNumber, password }) => {
      const data = await loginUser({ employeeNumber, password })
      applySession(data)
      setUser(data.user)
      setAccessToken(data.accessToken)
    },
    [applySession],
  )

  const register = useCallback(async ({ fullName, employeeNumber, password, confirmPassword }) => {
    await registerUser({ fullName, employeeNumber, password, confirmPassword })
    try {
      const b = await fetchBootstrap()
      setHasUsers(Boolean(b.hasUsers))
    } catch {
      /* Account exists even if follow-up bootstrap fails (e.g. transient network). */
      setHasUsers(true)
    }
  }, [])

  const logout = useCallback(async () => {
    const token = getStoredAccessToken()
    try {
      if (token) await logoutRequest(token)
    } catch {
      /* still clear locally */
    }
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      hasUsers,
      authServiceError,
      bootstrapping,
      isAuthenticated: Boolean(user && accessToken),
      login,
      register,
      logout,
      tryRefresh,
      reloadBootstrap: async () => {
        const b = await fetchBootstrap()
        setHasUsers(Boolean(b.hasUsers))
      },
    }),
    [
      user,
      accessToken,
      hasUsers,
      authServiceError,
      bootstrapping,
      login,
      register,
      logout,
      tryRefresh,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is tied to AuthProvider in this module
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
