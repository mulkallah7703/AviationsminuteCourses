import { prisma } from '../lib/prisma.js'

export async function countUsers() {
  return prisma.user.count()
}

export async function findByEmployeeNumber(employeeNumber) {
  return prisma.user.findUnique({
    where: { employeeId: employeeNumber },
  })
}

export async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function findByRefreshHash(refreshTokenHash) {
  return prisma.user.findFirst({
    where: { refreshTokenHash },
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function createUser({ fullName, employeeNumber, passwordHash }) {
  return prisma.user.create({
    data: {
      fullName,
      employeeId: employeeNumber,
      password: passwordHash,
    },
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function setRefreshTokenHash(userId, refreshTokenHash) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash },
  })
}

export async function clearRefreshToken(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash: null },
  })
}
