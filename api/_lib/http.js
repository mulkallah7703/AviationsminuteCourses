import crypto from 'node:crypto'

const DB_INFRA_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
  'ECONNRESET',
  '57P01',
  '28P01',
  '08006',
  '08003',
  '08001',
  'DB_CONFIG_MISSING',
  'DB_UNAVAILABLE',
])

function isDbInfra(err) {
  return err?.code != null && DB_INFRA_CODES.has(String(err.code))
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.length > 0) {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
    if (chunks.reduce((n, c) => n + c.length, 0) > 65_536) break
  }
  if (chunks.length === 0) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return {}
  }
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '))
  return res.status(405).json({ success: false, message: 'Method not allowed' })
}

export function ok(res, payload) {
  return res.status(200).json({ success: true, ...payload })
}

export function created(res, payload) {
  return res.status(201).json({ success: true, ...payload })
}

export function badRequest(res, message, extra = {}) {
  return res.status(400).json({ success: false, message, ...extra })
}

export function unauthorized(res, message = 'Unauthorized') {
  return res.status(401).json({ success: false, message })
}

export function conflict(res, message) {
  return res.status(409).json({ success: false, message })
}

export function handleError(req, res, err) {
  const requestId = req.headers?.['x-request-id'] || crypto.randomUUID()
  const dbInfra = isDbInfra(err)
  const status = Number(err?.status) || (dbInfra ? 503 : 500)

  const message =
    status === 503
      ? 'الخدمة غير متاحة حالياً'
      : status >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err?.message || 'Internal server error'

  if (process.env.NODE_ENV !== 'production' || status >= 500) {
    console.error('[api]', {
      requestId,
      path: req.url,
      method: req.method,
      status,
      code: err?.code,
      message: err?.message,
    })
  }

  return res.status(status).json({
    success: false,
    message,
    code: dbInfra ? 'DB_UNAVAILABLE' : err?.code || null,
    requestId,
    ...(err?.errors ? { errors: err.errors } : {}),
  })
}
