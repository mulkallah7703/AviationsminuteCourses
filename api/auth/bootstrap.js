import { countUsers } from '../_lib/users.js'
import { handleError, methodNotAllowed, ok } from '../_lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const n = await countUsers()
    return ok(res, { hasUsers: n > 0 })
  } catch (err) {
    return handleError(req, res, err)
  }
}
