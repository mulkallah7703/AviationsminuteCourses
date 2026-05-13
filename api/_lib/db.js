import { prisma } from './prisma.js'

export async function ensureDbReady() {
  await prisma.$queryRaw`SELECT 1`
}

export { prisma }
