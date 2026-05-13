import app from './app.js'
import { checkDatabaseConnection } from './config/database.js'

const port = Number(process.env.PORT) || 4000

app.listen(port, () => {
  console.log(`Auth API listening on http://127.0.0.1:${port}`)
  checkDatabaseConnection()
    .then(() => console.log('[db] PostgreSQL connection OK'))
    .catch((e) => {
      console.error('[db] PostgreSQL connection FAILED:', e.message)
      console.error(
        '[db] Check DATABASE_URL in the repo root .env (Neon pooled URL with sslmode=require)',
      )
    })
})
