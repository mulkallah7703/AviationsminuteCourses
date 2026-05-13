import bcrypt from 'bcryptjs'
import {
  generateOpaqueRefreshToken,
  hashOpaqueToken,
  mapUserRow,
  signAccessToken,
  signRefreshJwt,
} from '../_lib/auth.js'
import { setRefreshCookie } from '../_lib/cookies.js'
import {
  badRequest,
  handleError,
  methodNotAllowed,
  ok,
  readJsonBody,
  unauthorized,
} from '../_lib/http.js'
import { validateEmployeeNumber } from '../_lib/validate.js'
import { findByEmployeeNumber, setRefreshTokenHash } from '../_lib/users.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const body = await readJsonBody(req)

    const emp = validateEmployeeNumber(body.employeeNumber)
    if (!emp.ok) return badRequest(res, emp.message)

    const password = String(body.password ?? '')
    if (!password) return badRequest(res, 'كلمة المرور مطلوبة')

    const user = await findByEmployeeNumber(emp.normalized)
    if (!user) return unauthorized(res, 'رقم الموظف أو كلمة المرور غير صحيحة')

    const matches = await bcrypt.compare(password, user.password)
    if (!matches) return unauthorized(res, 'رقم الموظف أو كلمة المرور غير صحيحة')

    const accessToken = signAccessToken(user)
    const opaqueRefresh = generateOpaqueRefreshToken()
    await setRefreshTokenHash(user.id, hashOpaqueToken(opaqueRefresh))
    const refreshJwt = signRefreshJwt(user.id)

    setRefreshCookie(res, opaqueRefresh)

    return ok(res, {
      accessToken,
      refreshJwt,
      user: mapUserRow(user),
    })
  } catch (err) {
    return handleError(req, res, err)
  }
}
