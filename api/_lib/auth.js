import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

function requireSecret(name) {
  const v = process.env[name]
  if (!v || v.length < 16) {
    const err = new Error(`${name} is not set or is too short`)
    err.status = 500
    err.code = 'MISSING_SECRET'
    throw err
  }
  return v
}

export function signAccessToken(user) {
  const employeeNumber = user.employeeId ?? user.employee_number ?? user.employeeNumber
  return jwt.sign(
    {
      sub: user.id,
      employeeNumber,
      role: user.role ?? 'user',
    },
    requireSecret('JWT_ACCESS_SECRET'),
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' },
  )
}

export function signRefreshJwt(userId) {
  return jwt.sign({ sub: userId }, requireSecret('JWT_REFRESH_SECRET'), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requireSecret('JWT_ACCESS_SECRET'))
}

export function verifyRefreshJwt(token) {
  return jwt.verify(token, requireSecret('JWT_REFRESH_SECRET'))
}

export function generateOpaqueRefreshToken() {
  return crypto.randomBytes(48).toString('hex')
}

export function hashOpaqueToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex')
}

export function readBearerToken(req) {
  const header = req.headers?.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null
}

export function authenticateRequest(req) {
  const token = readBearerToken(req)
  if (!token) {
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }
  try {
    const payload = verifyAccessToken(token)
    return {
      id: payload.sub,
      employeeNumber: payload.employeeNumber,
      role: payload.role ?? 'user',
    }
  } catch {
    const err = new Error('Invalid or expired token')
    err.status = 401
    throw err
  }
}

export function mapUserRow(row) {
  if (!row) return null
  return {
    id: row.id,
    fullName: row.fullName ?? row.full_name,
    employeeNumber: row.employeeId ?? row.employee_number ?? row.employeeNumber,
    role: row.role ?? 'user',
    createdAt: row.createdAt ?? row.created_at,
  }
}
