/** Infrastructure / DB connectivity — return 503 so clients show Arabic “service unavailable”. */
function isDatabaseConnectivityError(err) {
  const c = err?.code
  return (
    c === 'ECONNREFUSED' ||
    c === 'ENOTFOUND' ||
    c === 'ETIMEDOUT' ||
    c === 'ECONNRESET' ||
    c === '57P01' ||
    c === '28P01' ||
    c === '08006' ||
    c === '08003' ||
    c === '08001' ||
    c === 'DB_CONFIG_MISSING' ||
    c === 'DB_UNAVAILABLE'
  )
}

export function errorHandler(err, req, res, _next) {
  const dbInfra = isDatabaseConnectivityError(err)
  const status = Number(err.status) || (dbInfra ? 503 : 500)
  const requestId = req.id
  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : dbInfra
        ? 'الخادم غير متاح حالياً'
        : err.message || 'Internal server error'

  if (process.env.NODE_ENV !== 'production') {
    console.error({
      requestId,
      method: req.method,
      path: req.originalUrl,
      status,
      code: err.code,
      message: err.message,
      stack: err.stack,
    })
  }

  res.status(status).json({
    success: false,
    message,
    code: dbInfra ? 'DB_UNAVAILABLE' : err.code || null,
    requestId,
    ...(err.errors ? { errors: err.errors } : {}),
  })
}
