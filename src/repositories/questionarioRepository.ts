import { prisma } from '@/lib/prisma'

export const questionarioRepository = {
    async findByTenant(tenantId: string) {
        return prisma.questionario.findMany({
            where: { tenantId },
            include: {
                perguntas: {
                    where: { ativa: true },
                    orderBy: { ordem: 'asc' },
                    include: { opcoes: { orderBy: { ordem: 'asc' } } },
                },
                _count: { select: { respondentes: true } },
            },
            orderBy: { createdAt: 'desc' },
        })
    },

    async findById(id: string, tenantId?: string) {
        const where: any = { id }

        // Só adiciona filtro de tenant se fornecido
        if (tenantId) {
            where.tenantId = tenantId
        }

        return prisma.questionario.findFirst({
            where,
            include: {
                perguntas: {
                    orderBy: { ordem: 'asc' },
                    include: { opcoes: { orderBy: { ordem: 'asc' } } },
                },
            },
        })
    },

    async create(data: {
        tenantId: string
        titulo: string
        descricao?: string
        status?: string
    }) {
        return prisma.questionario.create({ data })
    },

    async update(id: string, tenantId: string, data: {
        titulo?: string
        descricao?: string
        status?: string
    }) {
        return prisma.questionario.updateMany({
            where: { id, tenantId },
            data,
        })
    },

    async delete(id: string, tenantId: string) {
        return prisma.questionario.deleteMany({
            where: { id, tenantId },
        })
    },
}
