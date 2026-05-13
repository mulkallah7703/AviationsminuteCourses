import pg from 'pg'

const { Pool } = pg

let poolPromise = null

function buildPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    const err = new Error('DATABASE_URL is not set')
    err.status = 503
    err.code = 'DB_CONFIG_MISSING'
    throw err
  }

  const isLocal = /@(localhost|127\.0\.0\.1|::1)(:|\/)/i.test(connectionString)
  const ssl = isLocal ? false : { rejectUnauthorized: false }

  return new Pool({
    connectionString,
    ssl,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
  })
}

const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  employee_number VARCHAR(128) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'user',
  refresh_token_hash VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_employee_number ON users (employee_number);
`

async function bootstrapSchema(pool) {
  await pool.query(SCHEMA_SQL)
  return pool
}

function getPool() {
  if (!poolPromise) {
    const pool = buildPool()
    poolPromise = bootstrapSchema(pool).catch((err) => {
      poolPromise = null
      throw err
    })
  }
  return poolPromise
}

export async function query(text, params) {
  const pool = await getPool()
  return pool.query(text, params)
}

export async function ensureDbReady() {
  await getPool()
}
