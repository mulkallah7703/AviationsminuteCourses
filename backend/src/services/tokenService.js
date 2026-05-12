import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export function hashOpaqueToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex')
}

export function generateOpaqueRefreshToken() {
  return crypto.randomBytes(48).toString('hex')
}

export function signAccessToken(user) {
  const secret = process.env.JWT_ACCESS_SECRET
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not set')

  const expiresIn = process.env.JWT_ACCESS_EXPIRES || '15m'

  return jwt.sign(
    {
      sub: user.id,
      employeeNumber: user.employee_number,
      role: user.role ?? 'user',
    },
    secret,
    { expiresIn },
  )
}

export function verifyRefreshJwt(token) {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set')
  return jwt.verify(token, secret)
}

export function signRefreshJwt(userId) {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set')
  const expiresIn = process.env.JWT_REFRESH_EXPIRES || '7d'
  return jwt.sign({ sub: userId }, secret, { expiresIn })
}
