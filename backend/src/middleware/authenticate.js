import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    const err = new Error('Unauthorized')
    err.status = 401
    return next(err)
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    req.user = {
      id: payload.sub,
      employeeNumber: payload.employeeNumber ?? payload.employeeId,
      role: payload.role ?? 'user',
    }
    next()
  } catch {
    const err = new Error('Invalid or expired token')
    err.status = 401
    next(err)
  }
}
