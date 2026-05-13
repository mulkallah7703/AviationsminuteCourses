import { ensureDbReady } from './_lib/db.js'
import { handleError, methodNotAllowed } from './_lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    await ensureDbReady()
    return res.status(200).json({ ok: true, database: 'up' })
  } catch (err) {
    return handleError(req, res, err)
  }
}
