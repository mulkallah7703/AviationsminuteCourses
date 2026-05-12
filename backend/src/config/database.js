import pg from 'pg'

const { Pool } = pg

let poolInstance = null

function createPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    const err = new Error('DATABASE_URL is not set')
    err.status = 503
    err.code = 'DB_CONFIG_MISSING'
    throw err
  }
  return new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8000,
  })
}

function getPool() {
  if (!poolInstance) {
    poolInstance = createPool()
  }
  return poolInstance
}

export async function query(text, params) {
  try {
    const pool = getPool()
    return await pool.query(text, params)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[db]', err.code || err.message, err.message)
    }
    throw err
  }
}

export async function checkDatabaseConnection() {
  const pool = getPool()
  await pool.query('SELECT 1')
}
