import {
  generateOpaqueRefreshToken,
  hashOpaqueToken,
  mapUserRow,
  signAccessToken,
  signRefreshJwt,
  verifyRefreshJwt,
} from '../_lib/auth.js'
import { REFRESH_COOKIE_NAME, readCookie, setRefreshCookie } from '../_lib/cookies.js'
import {
  badRequest,
  handleError,
  methodNotAllowed,
  ok,
  readJsonBody,
  unauthorized,
} from '../_lib/http.js'
import {
  findByEmployeeNumber,
  findById,
  findByRefreshHash,
  setRefreshTokenHash,
} from '../_lib/users.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const body = await readJsonBody(req)
    const cookieToken = readCookie(req, REFRESH_COOKIE_NAME) ?? ''
    const opaque = String(body.refreshToken ?? '').trim() || cookieToken
    const jwtRefresh = String(body.refreshJwt ?? '').trim()

    if (!opaque && !jwtRefresh) return badRequest(res, 'Refresh token required')

    let userRow = null

    if (opaque) {
      userRow = await findByRefreshHash(hashOpaqueToken(opaque))
    }

    if (!userRow && jwtRefresh) {
      try {
        const payload = verifyRefreshJwt(jwtRefresh)
        userRow = await findById(payload.sub)
      } catch {
        return unauthorized(res, 'Invalid refresh token')
      }
    }

    if (!userRow) return unauthorized(res, 'Invalid refresh token')

    const full = await findByEmployeeNumber(userRow.employee_number)
    if (!full) return unauthorized(res, 'Invalid refresh token')

    const accessToken = signAccessToken(full)
    const newOpaque = generateOpaqueRefreshToken()
    await setRefreshTokenHash(full.id, hashOpaqueToken(newOpaque))
    const newRefreshJwt = signRefreshJwt(full.id)

    setRefreshCookie(res, newOpaque)

    return ok(res, {
      accessToken,
      refreshJwt: newRefreshJwt,
      user: mapUserRow(full),
    })
  } catch (err) {
    return handleError(req, res, err)
  }
}
