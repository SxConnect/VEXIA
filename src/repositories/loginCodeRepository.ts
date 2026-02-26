import { prisma } from '@/lib/prisma'

export const loginCodeRepository = {
    async create(data: {
        userId: string
        codeHash: string
        expiresAt: Date
        ipAddress?: string
    }) {
        return prisma.loginCode.create({ data })
    },

    async findValidCode(userId: string) {
        return prisma.loginCode.findFirst({
            where: {
                userId,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        })
    },

    async incrementAttempts(id: string) {
        return prisma.loginCode.update({
            where: { id },
            data: { attempts: { increment: 1 } },
        })
    },

    async markAsUsed(id: string) {
        return prisma.loginCode.update({
            where: { id },
            data: { used: true },
        })
    },

    async countRecentCodes(userId: string, since: Date) {
        return prisma.loginCode.count({
            where: {
                userId,
                createdAt: { gte: since },
            },
        })
    },
}
