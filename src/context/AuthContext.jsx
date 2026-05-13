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

const INIT_TIMEOUT_MS = 14_000

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken())
  const [hasUsers, setHasUsers] = useState(null)
  const [authServiceError, setAuthServiceError] = useState('')
  const [bootstrapping, setBootstrapping] = useState(true)
  const refreshPromiseRef = useRef(null)
  const sessionGenerationRef = useRef(0)

  const isSessionCurrent = useCallback((generation) => generation === sessionGenerationRef.current, [])

  const bumpSessionGeneration = useCallback(() => {
    sessionGenerationRef.current += 1
    return sessionGenerationRef.current
  }, [])

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
    bumpSessionGeneration()
    setUser(null)
    setAccessToken(null)
    clearStoredTokens()
  }, [bumpSessionGeneration])

  const tryRefresh = useCallback(async () => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current

    const generation = sessionGenerationRef.current
    const { refreshToken, refreshJwt } = getStoredRefreshBundle()
    if (!refreshToken && !refreshJwt) {
      if (isSessionCurrent(generation)) {
        setUser(null)
        setAccessToken(null)
        clearStoredTokens()
      }
      return null
    }

    refreshPromiseRef.current = (async () => {
      try {
        const data = await refreshTokens({ refreshToken, refreshJwt })
        if (!isSessionCurrent(generation)) return null
        applySession(data)
        return data.accessToken
      } catch {
        if (isSessionCurrent(generation)) {
          setUser(null)
          setAccessToken(null)
          clearStoredTokens()
        }
        return null
      } finally {
        refreshPromiseRef.current = null
      }
    })()

    return refreshPromiseRef.current
  }, [applySession, isSessionCurrent])

  const loadSession = useCallback(async () => {
    const generation = sessionGenerationRef.current
    const token = getStoredAccessToken()
    const bundle = getStoredRefreshBundle()

    if (!token && !bundle.refreshToken && !bundle.refreshJwt) {
      if (isSessionCurrent(generation)) {
        setUser(null)
        setAccessToken(null)
      }
      return
    }

    if (token) {
      try {
        const data = await fetchMe(token)
        if (!isSessionCurrent(generation)) return
        setUser(data.user)
        setAccessToken(token)
        return
      } catch {
        /* fall through to refresh */
      }
    }

    if (!isSessionCurrent(generation)) return

    const refreshed = await tryRefresh()
    if (!isSessionCurrent(generation)) return

    if (refreshed) {
      try {
        const data = await fetchMe(refreshed)
        if (!isSessionCurrent(generation)) return
        setUser(data.user)
        setAccessToken(refreshed)
      } catch {
        if (isSessionCurrent(generation)) {
          setUser(null)
          setAccessToken(null)
          clearStoredTokens()
        }
      }
    }
  }, [isSessionCurrent, tryRefresh])

  useEffect(() => {
    let cancelled = false

    const finishBootstrap = () => {
      if (!cancelled) setBootstrapping(false)
    }

    const initTimer = window.setTimeout(finishBootstrap, INIT_TIMEOUT_MS)

    ;(async () => {
      const [bootstrapResult] = await Promise.allSettled([
        fetchBootstrap(),
        loadSession(),
      ])

      if (!cancelled && bootstrapResult.status === 'fulfilled') {
        setHasUsers(Boolean(bootstrapResult.value.hasUsers))
        setAuthServiceError('')
      } else if (!cancelled && bootstrapResult.status === 'rejected') {
        setHasUsers(null)
        setAuthServiceError(
          mapAuthErrorMessage(bootstrapResult.reason, 'تعذر الاتصال بالخدمة'),
        )
      }

      window.clearTimeout(initTimer)
      finishBootstrap()
    })()

    return () => {
      cancelled = true
      window.clearTimeout(initTimer)
    }
  }, [loadSession])

  const login = useCallback(
    async ({ employeeNumber, password }) => {
      const data = await loginUser({ employeeNumber, password })
      bumpSessionGeneration()
      applySession(data)
      setUser(data.user)
      setAccessToken(data.accessToken)
      return data
    },
    [applySession, bumpSessionGeneration],
  )

  const register = useCallback(
    async ({ fullName, employeeNumber, password, confirmPassword }) => {
      await registerUser({ fullName, employeeNumber, password, confirmPassword })
      setHasUsers(true)

      const data = await loginUser({
        employeeNumber: employeeNumber.trim(),
        password,
      })
      bumpSessionGeneration()
      applySession(data)
      setUser(data.user)
      setAccessToken(data.accessToken)
      return data
    },
    [applySession, bumpSessionGeneration],
  )

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
        setAuthServiceError('')
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
