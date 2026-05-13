import bcrypt from 'bcryptjs'
import {
  badRequest,
  conflict,
  created,
  handleError,
  methodNotAllowed,
  readJsonBody,
} from '../_lib/http.js'
import {
  validateEmployeeNumber,
  validateFullName,
  validatePassword,
} from '../_lib/validate.js'
import { createUser, findByEmployeeNumber } from '../_lib/users.js'

const SALT_ROUNDS = 12

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const body = await readJsonBody(req)

    const name = validateFullName(body.fullName)
    if (!name.ok) return badRequest(res, name.message)

    const emp = validateEmployeeNumber(body.employeeNumber)
    if (!emp.ok) return badRequest(res, emp.message)

    const password = String(body.password ?? '')
    const confirmPassword = String(body.confirmPassword ?? '')
    const pwdError = validatePassword(password)
    if (pwdError) return badRequest(res, pwdError)
    if (password !== confirmPassword) {
      return badRequest(res, 'تأكيد كلمة المرور غير متطابق')
    }

    const existing = await findByEmployeeNumber(emp.normalized)
    if (existing) return conflict(res, 'رقم الموظف مسجل مسبقًا')

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    await createUser({
      fullName: name.value,
      employeeNumber: emp.normalized,
      passwordHash,
    })

    return created(res, { message: 'تم إنشاء الحساب بنجاح' })
  } catch (err) {
    return handleError(req, res, err)
  }
}
