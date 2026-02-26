import { prisma } from '@/lib/prisma'

export const userRepository = {
    async findByWhatsApp(whatsapp: string) {
        return prisma.user.findUnique({
            where: { whatsapp },
            include: { tenant: true },
        })
    },

    async create(data: { nome: string; whatsapp: string }) {
        // Criar tenant e usuário em uma transação
        return prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({ data: {} })

            const user = await tx.user.create({
                data: {
                    nome: data.nome,
                    whatsapp: data.whatsapp,
                    tenantId: tenant.id,
                },
                include: { tenant: true },
            })

            return user
        })
    },

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: { tenant: true },
        })
    },
}
