import {
  API_MAX_RETRIES,
  API_REQUEST_TIMEOUT_MS,
  joinApiUrl,
} from './config.js'

const STORAGE_ACCESS = 'lms_auth_access_token'
const STORAGE_REFRESH = 'lms_auth_refresh_token'
const STORAGE_REFRESH_JWT = 'lms_auth_refresh_jwt'

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.details = options.details
    this.requestId = options.requestId
  }
}

export function getStoredAccessToken() {
  try {
    return localStorage.getItem(STORAGE_ACCESS)
  } catch {
    return null
  }
}

export function getStoredRefreshBundle() {
  try {
    return {
      refreshToken: localStorage.getItem(STORAGE_REFRESH),
      refreshJwt: localStorage.getItem(STORAGE_REFRESH_JWT),
    }
  } catch {
    return { refreshToken: null, refreshJwt: null }
  }
}

export function persistTokens({ accessToken, refreshToken, refreshJwt }) {
  try {
    if (accessToken) localStorage.setItem(STORAGE_ACCESS, accessToken)
    if (refreshToken) localStorage.setItem(STORAGE_REFRESH, refreshToken)
    if (refreshJwt) localStorage.setItem(STORAGE_REFRESH_JWT, refreshJwt)
    if (!refreshToken) {
      try {
        localStorage.removeItem(STORAGE_REFRESH)
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }
}

export function clearStoredTokens() {
  try {
    localStorage.removeItem(STORAGE_ACCESS)
    localStorage.removeItem(STORAGE_REFRESH)
    localStorage.removeItem(STORAGE_REFRESH_JWT)
  } catch {
    /* ignore */
  }
}

async function parseJsonSafe(res) {
  const text = await res.text()
  if (!text) return {}

  const contentType = res.headers.get('content-type') || ''
  const looksLikeHtml =
    contentType.includes('text/html') || /^\s*</.test(text)

  if (looksLikeHtml) {
    return { _htmlResponse: true, message: 'الخدمة غير متاحة حالياً' }
  }

  try {
    return JSON.parse(text)
  } catch {
    return { message: text.slice(0, 200) }
  }
}

function rejectMisroutedResponse(data) {
  if (data?._htmlResponse) {
    throw new ApiError(
      'واجهة البرنامج تستقبل طلبات API بدل الخادم — راجع إعداد Nginx وعملية PM2',
      {
        status: 503,
        code: 'SERVICE_UNAVAILABLE',
      },
    )
  }
}

function classifyNetworkError(error) {
  if (error?.name === 'AbortError') {
    return new ApiError('انتهت مهلة الاتصال — جاري إعادة المحاولة', {
      code: 'TIMEOUT',
    })
  }
  return new ApiError('تعذر الاتصال بالخادم', {
    code: 'NETWORK',
  })
}

function mapHttpError(status, data, fallback) {
  if (data?._htmlResponse) {
    return new ApiError('الخدمة غير متاحة حالياً', {
      status: 503,
      code: 'SERVICE_UNAVAILABLE',
    })
  }

  const message =
    data?.message ||
    (status === 401
      ? 'رقم الموظف أو كلمة المرور غير صحيحة'
      : status === 503 || status === 502 || status === 504
        ? 'الخدمة غير متاحة حالياً'
        : fallback)

  return new ApiError(message, {
    status,
    code: data?.code || null,
    details: data?.errors,
    requestId: data?.requestId,
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryable(error) {
  return (
    error?.code === 'NETWORK' ||
    error?.code === 'TIMEOUT' ||
    error?.code === 'SERVICE_UNAVAILABLE' ||
    error?.status === 503 ||
    error?.status === 502 ||
    error?.status === 504
  )
}

async function request(path, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(joinApiUrl(path), {
      ...options,
      credentials: options.credentials ?? 'include',
      headers: {
        Accept: 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    })
    const data = await parseJsonSafe(res)
    rejectMisroutedResponse(data)
    if (!res.ok) {
      throw mapHttpError(res.status, data, 'حدث خطأ أثناء معالجة الطلب.')
    }
    return data
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw classifyNetworkError(error)
  } finally {
    clearTimeout(timer)
  }
}

async function requestWithRetry(path, options = {}, maxAttempts = API_MAX_RETRIES) {
  let lastErr
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await request(path, options)
    } catch (error) {
      lastErr = error
      if (!isRetryable(error) || attempt === maxAttempts) throw error
      await sleep(320 * attempt)
    }
  }
  throw lastErr
}

function assertSessionPayload(data, fallbackMessage) {
  if (!data?.accessToken || !data?.user?.id) {
    throw new ApiError(fallbackMessage, {
      status: 502,
      code: 'INVALID_AUTH_RESPONSE',
    })
  }
  return data
}

export async function fetchBootstrap() {
  const data = await requestWithRetry('/api/auth/bootstrap', { method: 'GET' }, 4)
  if (typeof data?.hasUsers !== 'boolean') {
    throw new ApiError('استجابة bootstrap غير صالحة من الخادم', {
      status: 502,
      code: 'INVALID_AUTH_RESPONSE',
    })
  }
  return data
}

export async function registerUser({ fullName, employeeNumber, password, confirmPassword }) {
  return request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, employeeNumber, password, confirmPassword }),
  })
}

export async function loginUser({ employeeNumber, password }) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeNumber, password }),
  })
  return assertSessionPayload(data, 'استجابة تسجيل الدخول غير صالحة من الخادم')
}

export async function fetchMe(accessToken) {
  const data = await request('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!data?.user?.id) {
    throw new ApiError('استجابة الملف الشخصي غير صالحة من الخادم', {
      status: 502,
      code: 'INVALID_AUTH_RESPONSE',
    })
  }
  return data
}

export async function logoutRequest(accessToken) {
  try {
    await request('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  } catch (error) {
    if (error.status !== 401) throw error
  }
}

export async function refreshTokens({ refreshToken, refreshJwt }) {
  const data = await request('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken: refreshToken ?? '',
      refreshJwt: refreshJwt ?? '',
    }),
  })
  return assertSessionPayload(data, 'استجابة تجديد الجلسة غير صالحة من الخادم')
}

export function mapAuthErrorMessage(error, fallback = 'حدث خطأ غير متوقع') {
  if (!error) return fallback

  if (error.code === 'INVALID_AUTH_RESPONSE') {
    return 'استجابة المصادقة غير صالحة — تحقق من تشغيل خادم API وإعداد Nginx'
  }
  if (error.code === 'DB_UNAVAILABLE') {
    return 'تعذر الاتصال بقاعدة البيانات حالياً'
  }
  if (error.code === 'SERVICE_UNAVAILABLE') {
    return 'الخدمة غير متاحة حالياً'
  }
  if (error.code === 'TIMEOUT') {
    return 'انتهت مهلة الاتصال — جاري إعادة المحاولة'
  }
  if (error.code === 'NETWORK') {
    return 'تعذر الاتصال بالخادم'
  }
  if (error.status === 502 || error.status === 503 || error.status === 504) {
    return 'الخدمة غير متاحة حالياً'
  }
  if (error.status === 401) return 'رقم الموظف أو كلمة المرور غير صحيحة'
  if (error.status === 409) return 'رقم الموظف مسجل مسبقًا'
  if (error.status === 400 && Array.isArray(error.details)) {
    return error.details.map((x) => x.msg || x.message).join(' ')
  }
  if (typeof error.message === 'string' && error.message.trim()) {
    const m = error.message
    if (m.includes('Password confirmation')) return 'تأكيد كلمة المرور غير متطابق'
    if (m.includes('Employee number already')) return 'رقم الموظف مسجل مسبقًا'
    return m
  }
  return fallback
}
