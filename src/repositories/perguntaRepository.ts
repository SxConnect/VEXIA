import { prisma } from '@/lib/prisma'

export const perguntaRepository = {
    async create(data: {
        questionarioId: string
        texto: string
        contexto?: string
        tipo: string
        obrigatoria: boolean
        permitirOutro: boolean
        ordem: number
        ativa: boolean
        opcoes?: string[]
        campoCondicional?: boolean
        condicaoOpcoes?: string | null
        campoCondicionalTexto?: string | null
        campoObrigatorio?: boolean
    }) {
        const { opcoes, ...perguntaData } = data

        return prisma.$transaction(async (tx) => {
            const pergunta = await tx.pergunta.create({
                data: perguntaData,
            })

            if (opcoes && opcoes.length > 0) {
                await tx.opcao.createMany({
                    data: opcoes.map((texto, index) => ({
                        perguntaId: pergunta.id,
                        texto,
                        ordem: index + 1,
                    })),
                })
            }

            return tx.pergunta.findUnique({
                where: { id: pergunta.id },
                include: { opcoes: { orderBy: { ordem: 'asc' } } },
            })
        })
    },

    async update(id: string, data: {
        texto?: string
        contexto?: string
        tipo?: string
        obrigatoria?: boolean
        permitirOutro?: boolean
        ordem?: number
        ativa?: boolean
    }) {
        return prisma.pergunta.update({
            where: { id },
            data,
        })
    },

    async delete(id: string) {
        return prisma.pergunta.delete({ where: { id } })
    },
}
