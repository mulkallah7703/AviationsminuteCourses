import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import {
  clearRefreshToken,
  countUsers,
  createUser,
  findByEmployeeNumber,
  findById,
  findByRefreshHash,
  setRefreshTokenHash,
} from '../models/userRepository.js'
import {
  generateOpaqueRefreshToken,
  hashOpaqueToken,
  signAccessToken,
  signRefreshJwt,
  verifyRefreshJwt,
} from '../services/tokenService.js'

export const REFRESH_COOKIE_NAME = 'lms_rt'

function refreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

const SALT_ROUNDS = 12

function mapUser(row) {
  if (!row) return null
  return {
    id: row.id,
    fullName: row.full_name,
    employeeNumber: row.employee_number,
    role: row.role ?? 'user',
    createdAt: row.created_at,
  }
}

export async function bootstrap(req, res, next) {
  try {
    const n = await countUsers()
    res.json({ success: true, hasUsers: n > 0 })
  } catch (e) {
    next(e)
  }
}

export async function register(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const err = new Error('Validation failed')
      err.status = 400
      err.errors = errors.array()
      return next(err)
    }

    const fullName = String(req.body.fullName ?? '').trim()
    const employeeNumber = String(req.body.employeeNumber ?? '').trim()
    const password = String(req.body.password ?? '')
    const confirmPassword = String(req.body.confirmPassword ?? '')

    if (password !== confirmPassword) {
      const err = new Error('تأكيد كلمة المرور غير متطابق')
      err.status = 400
      return next(err)
    }

    const existing = await findByEmployeeNumber(employeeNumber)
    if (existing) {
      const err = new Error('رقم الموظف مسجل مسبقًا')
      err.status = 409
      return next(err)
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    await createUser({ fullName, employeeNumber, passwordHash })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
    })
  } catch (e) {
    next(e)
  }
}

export async function login(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const err = new Error('Validation failed')
      err.status = 400
      err.errors = errors.array()
      return next(err)
    }

    const employeeNumber = String(req.body.employeeNumber ?? '').trim()
    const password = String(req.body.password ?? '')

    const user = await findByEmployeeNumber(employeeNumber)
    if (!user) {
      const err = new Error('رقم الموظف أو كلمة المرور غير صحيحة')
      err.status = 401
      return next(err)
    }

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      const err = new Error('رقم الموظف أو كلمة المرور غير صحيحة')
      err.status = 401
      return next(err)
    }

    const accessToken = signAccessToken(user)
    const opaqueRefresh = generateOpaqueRefreshToken()
    const refreshHash = hashOpaqueToken(opaqueRefresh)
    await setRefreshTokenHash(user.id, refreshHash)

    const refreshJwt = signRefreshJwt(user.id)

    res.cookie(REFRESH_COOKIE_NAME, opaqueRefresh, refreshCookieOptions())

    res.json({
      success: true,
      accessToken,
      refreshJwt,
      user: mapUser(user),
    })
  } catch (e) {
    next(e)
  }
}

export async function me(req, res, next) {
  try {
    const row = await findById(req.user.id)
    if (!row) {
      const err = new Error('User not found')
      err.status = 404
      return next(err)
    }
    res.json({ success: true, user: mapUser(row) })
  } catch (e) {
    next(e)
  }
}

export async function logout(req, res, next) {
  try {
    await clearRefreshToken(req.user.id)
    clearRefreshCookie(res)
    res.json({ success: true, message: 'تم تسجيل الخروج' })
  } catch (e) {
    next(e)
  }
}

export async function refresh(req, res, next) {
  try {
    const fromCookie = String(req.cookies?.[REFRESH_COOKIE_NAME] ?? '').trim()
    const opaque = String(req.body.refreshToken ?? '').trim() || fromCookie
    const jwtRefresh = String(req.body.refreshJwt ?? '').trim()

    if (!opaque && !jwtRefresh) {
      const err = new Error('Refresh token required')
      err.status = 400
      return next(err)
    }

    let userRow = null

    if (opaque) {
      const h = hashOpaqueToken(opaque)
      userRow = await findByRefreshHash(h)
    }

    if (!userRow && jwtRefresh) {
      try {
        const payload = verifyRefreshJwt(jwtRefresh)
        userRow = await findById(payload.sub)
      } catch {
        const err = new Error('Invalid refresh token')
        err.status = 401
        return next(err)
      }
    }

    if (!userRow) {
      const err = new Error('Invalid refresh token')
      err.status = 401
      return next(err)
    }

    const full = await findByEmployeeNumber(userRow.employee_number)
    if (!full) {
      const err = new Error('Invalid refresh token')
      err.status = 401
      return next(err)
    }

    const accessToken = signAccessToken(full)
    const newOpaque = generateOpaqueRefreshToken()
    await setRefreshTokenHash(full.id, hashOpaqueToken(newOpaque))
    const newRefreshJwt = signRefreshJwt(full.id)

    res.cookie(REFRESH_COOKIE_NAME, newOpaque, refreshCookieOptions())

    res.json({
      success: true,
      accessToken,
      refreshJwt: newRefreshJwt,
      user: mapUser(full),
    })
  } catch (e) {
    next(e)
  }
}
