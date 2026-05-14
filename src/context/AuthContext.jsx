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
  const bootstrapStartedRef = useRef(false)

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
      return null
    }

    refreshPromiseRef.current = (async () => {
      try {
        const data = await refreshTokens({ refreshToken, refreshJwt })
        if (!isSessionCurrent(generation)) return null
        applySession(data)
        return data
      } catch {
        if (isSessionCurrent(generation)) {
          clearSession()
        }
        return null
      } finally {
        refreshPromiseRef.current = null
      }
    })()

    return refreshPromiseRef.current
  }, [applySession, clearSession, isSessionCurrent])

  const loadSession = useCallback(async () => {
    const generation = sessionGenerationRef.current
    const token = getStoredAccessToken()
    const bundle = getStoredRefreshBundle()

    if (!token && !bundle.refreshToken && !bundle.refreshJwt) {
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
    if (!isSessionCurrent(generation) || !refreshed) return

    setUser(refreshed.user)
    setAccessToken(refreshed.accessToken)
  }, [isSessionCurrent, tryRefresh])

  useEffect(() => {
    if (bootstrapStartedRef.current) return undefined
    bootstrapStartedRef.current = true

    let cancelled = false

    const finishBootstrap = () => {
      if (!cancelled) setBootstrapping(false)
    }

    const initTimer = window.setTimeout(finishBootstrap, INIT_TIMEOUT_MS)

    ;(async () => {
      const bootstrapGeneration = sessionGenerationRef.current

      const [bootstrapResult] = await Promise.allSettled([
        fetchBootstrap(),
        loadSession(),
      ])

      if (cancelled) return

      if (bootstrapResult.status === 'fulfilled') {
        setHasUsers(Boolean(bootstrapResult.value.hasUsers))
        setAuthServiceError('')
      } else {
        const storedToken = getStoredAccessToken()
        const sessionAlive =
          bootstrapGeneration === sessionGenerationRef.current && Boolean(storedToken)

        setHasUsers(sessionAlive ? true : null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstrap runs once on mount
  }, [])

  const login = useCallback(
    async ({ employeeNumber, password }) => {
      const data = await loginUser({ employeeNumber, password })
      bumpSessionGeneration()
      applySession(data)
      setUser(data.user)
      setAccessToken(data.accessToken)
      setHasUsers(true)
      setAuthServiceError('')
      return data
    },
    [applySession, bumpSessionGeneration],
  )

  const register = useCallback(
    async ({ fullName, employeeNumber, password, confirmPassword }) => {
      await registerUser({ fullName, employeeNumber, password, confirmPassword })

      const data = await loginUser({
        employeeNumber: employeeNumber.trim(),
        password,
      })
      bumpSessionGeneration()
      applySession(data)
      setUser(data.user)
      setAccessToken(data.accessToken)
      setHasUsers(true)
      setAuthServiceError('')
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
