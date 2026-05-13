import { prisma } from '../lib/prisma.js'

export async function query() {
  throw new Error('Raw SQL query() is deprecated — use Prisma via userRepository')
}

export async function checkDatabaseConnection() {
  await prisma.$queryRaw`SELECT 1`
}
