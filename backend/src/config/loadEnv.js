import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const backendDir = path.resolve(rootDir, 'backend')

dotenv.config({ path: path.join(rootDir, '.env') })
dotenv.config({ path: path.join(backendDir, '.env'), override: true })
