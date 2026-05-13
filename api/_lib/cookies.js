export const REFRESH_COOKIE_NAME = 'lms_rt'

const REFRESH_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

export function readCookie(req, name) {
  if (req.cookies && typeof req.cookies === 'object') {
    const v = req.cookies[name]
    if (typeof v === 'string') return v
  }
  const header = req.headers?.cookie
  if (!header) return null
  const parts = header.split(';')
  for (const raw of parts) {
    const idx = raw.indexOf('=')
    if (idx === -1) continue
    const k = raw.slice(0, idx).trim()
    if (k === name) {
      return decodeURIComponent(raw.slice(idx + 1).trim())
    }
  }
  return null
}

function buildCookie(name, value, { maxAge, clear } = {}) {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL)
  const segs = [
    `${name}=${encodeURIComponent(value ?? '')}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ]
  if (isProd) segs.push('Secure')
  if (clear) {
    segs.push('Max-Age=0')
    segs.push('Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  } else if (Number.isFinite(maxAge)) {
    segs.push(`Max-Age=${Math.floor(maxAge)}`)
  }
  return segs.join('; ')
}

export function setRefreshCookie(res, value) {
  res.setHeader('Set-Cookie', buildCookie(REFRESH_COOKIE_NAME, value, { maxAge: REFRESH_MAX_AGE_SECONDS }))
}

export function clearRefreshCookie(res) {
  res.setHeader('Set-Cookie', buildCookie(REFRESH_COOKIE_NAME, '', { clear: true }))
}
