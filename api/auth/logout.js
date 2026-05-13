import { authenticateRequest } from '../_lib/auth.js'
import { clearRefreshCookie } from '../_lib/cookies.js'
import { handleError, methodNotAllowed, ok } from '../_lib/http.js'
import { clearRefreshToken } from '../_lib/users.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const principal = authenticateRequest(req)
    await clearRefreshToken(principal.id)
    clearRefreshCookie(res)
    return ok(res, { message: 'تم تسجيل الخروج' })
  } catch (err) {
    return handleError(req, res, err)
  }
}
