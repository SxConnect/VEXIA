import { prisma } from '@/lib/prisma'

export const respostaRepository = {
    async createRespondente(data: {
        questionarioId: string
        nome: string
        whatsapp: string
        tipoEmpresa?: string
    }) {
        return prisma.respondente.create({ data })
    },

    async updateRespondente(id: string, data: { dataFinal?: Date }) {
        return prisma.respondente.update({
            where: { id },
            data,
        })
    },

    async createResposta(data: {
        respondenteId: string
        perguntaId: string
        resposta?: string
        respostaTexto?: string
    }) {
        console.log('🗄️ Repository - Criando resposta no banco:', JSON.stringify(data, null, 2))
        const resultado = await prisma.resposta.create({ data })
        console.log('🗄️ Repository - Resposta criada:', JSON.stringify(resultado, null, 2))
        return resultado
    },

    async findRespondentes(questionarioId: string, tenantId: string) {
        return prisma.respondente.findMany({
            where: {
                questionarioId,
                questionario: { tenantId },
            },
            include: {
                respostas: {
                    include: {
                        pergunta: {
                            include: { opcoes: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { dataInicio: 'desc' },
        })
    },

    async findRespostasByRespondente(respondenteId: string) {
        return prisma.resposta.findMany({
            where: { respondenteId },
            include: {
                pergunta: {
                    include: { opcoes: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        })
    },

    async getRespostasStats(questionarioId: string, tenantId: string) {
        const respondentes = await prisma.respondente.findMany({
            where: {
                questionarioId,
                questionario: { tenantId },
            },
            orderBy: { dataInicio: 'asc' },
        })

        return {
            total: respondentes.length,
            primeiraResposta: respondentes[0]?.dataInicio || null,
            ultimaResposta: respondentes[respondentes.length - 1]?.dataInicio || null,
        }
    },
}
