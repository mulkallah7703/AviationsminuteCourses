import { query } from '../config/database.js'

export async function countUsers() {
  const { rows } = await query('SELECT COUNT(*)::int AS n FROM users')
  return rows[0]?.n ?? 0
}

export async function findByEmployeeNumber(employeeNumber) {
  const { rows } = await query(
    `SELECT id, employee_number, full_name, password_hash, role, created_at
     FROM users WHERE employee_number = $1`,
    [employeeNumber],
  )
  return rows[0] ?? null
}

export async function findById(id) {
  const { rows } = await query(
    `SELECT id, employee_number, full_name, role, created_at FROM users WHERE id = $1`,
    [id],
  )
  return rows[0] ?? null
}

export async function findByRefreshHash(refreshTokenHash) {
  const { rows } = await query(
    `SELECT id, employee_number, full_name, role, created_at FROM users WHERE refresh_token_hash = $1`,
    [refreshTokenHash],
  )
  return rows[0] ?? null
}

export async function createUser({ fullName, employeeNumber, passwordHash }) {
  const { rows } = await query(
    `INSERT INTO users (full_name, employee_number, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, employee_number, full_name, role, created_at`,
    [fullName, employeeNumber, passwordHash],
  )
  return rows[0]
}

export async function setRefreshTokenHash(userId, refreshTokenHash) {
  await query(`UPDATE users SET refresh_token_hash = $2 WHERE id = $1`, [
    userId,
    refreshTokenHash,
  ])
}

export async function clearRefreshToken(userId) {
  await query(`UPDATE users SET refresh_token_hash = NULL WHERE id = $1`, [userId])
}
