import { authenticateRequest, mapUserRow } from '../_lib/auth.js'
import { handleError, methodNotAllowed, ok } from '../_lib/http.js'
import { findById } from '../_lib/users.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const principal = authenticateRequest(req)
    const row = await findById(principal.id)
    if (!row) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    return ok(res, { user: mapUserRow(row) })
  } catch (err) {
    return handleError(req, res, err)
  }
}
