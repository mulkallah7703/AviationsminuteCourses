import './config/loadEnv.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import helmet from 'helmet'
import authRoutes from './routes/authRoutes.js'
import { checkDatabaseConnection } from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'

function validateEnvOrExit() {
  const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']
  const missing = required.filter((k) => !process.env[k]?.trim())
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }
}

validateEnvOrExit()

const app = express()
app.disable('x-powered-by')

app.use((req, _res, next) => {
  req.id = crypto.randomUUID()
  next()
})

const corsOrigin = process.env.CORS_ORIGIN
app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(',').map((s) => s.trim()) : true,
    credentials: true,
  }),
)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(express.json({ limit: '64kb' }))
app.use(cookieParser())

app.use((req, res, next) => {
  const startedAt = Date.now()
  res.on('finish', () => {
    const durationMs = Date.now() - startedAt
    if (req.path.startsWith('/api/auth')) {
      console.info(
        `[${req.id}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`,
      )
    }
  })
  next()
})

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/health/db', async (_req, res, next) => {
  try {
    await checkDatabaseConnection()
    res.json({ ok: true, database: 'up' })
  } catch (error) {
    const err = new Error(error.message || 'Database unavailable')
    err.status = 503
    err.code = error.code || 'DB_UNAVAILABLE'
    next(err)
  }
})

app.use('/api/auth', authRoutes)

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' })
})

app.use(errorHandler)

const port = Number(process.env.PORT) || 4000

app.listen(port, () => {
  console.log(`Auth API listening on http://localhost:${port}`)
  checkDatabaseConnection()
    .then(() => console.log('[db] PostgreSQL connection OK'))
    .catch((e) => {
      console.error('[db] PostgreSQL connection FAILED:', e.message)
      console.error('[db] Check DATABASE_URL in the repo root .env (Neon pooled URL with sslmode=require)')
    })
})
