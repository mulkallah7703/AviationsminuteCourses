import { Router } from 'express'
import { body } from 'express-validator'
import * as auth from '../controllers/authController.js'
import { authenticate } from '../middleware/authenticate.js'
import {
  EMPLOYEE_NUMBER_RE,
  normalizeEmployeeNumber,
  validatePasswordStrength,
} from '../utils/authValidation.js'

const router = Router()

const registerRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('الاسم الكامل مطلوب')
    .isLength({ min: 1, max: 255 })
    .withMessage('الاسم طويل جدًا أو غير صالح'),
  body('employeeNumber')
    .trim()
    .customSanitizer(normalizeEmployeeNumber)
    .notEmpty()
    .withMessage('رقم الموظف مطلوب')
    .matches(EMPLOYEE_NUMBER_RE)
    .withMessage('صيغة رقم الموظف غير صحيحة'),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .custom((value) => {
      const msg = validatePasswordStrength(value)
      if (msg) throw new Error(msg)
      return true
    }),
  body('confirmPassword')
    .notEmpty()
    .withMessage('تأكيد كلمة المرور مطلوب'),
]

const loginRules = [
  body('employeeNumber')
    .trim()
    .customSanitizer(normalizeEmployeeNumber)
    .notEmpty()
    .withMessage('رقم الموظف مطلوب')
    .isLength({ min: 1, max: 128 }),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
]

router.get('/bootstrap', auth.bootstrap)
router.post('/register', registerRules, auth.register)
router.post('/login', loginRules, auth.login)
router.post('/refresh', auth.refresh)
router.get('/me', authenticate, auth.me)
router.post('/logout', authenticate, auth.logout)

export default router
