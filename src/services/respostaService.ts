import { respostaRepository } from '@/repositories/respostaRepository'
import { questionarioRepository } from '@/repositories/questionarioRepository'

export const respostaService = {
    async createRespondente(data: {
        questionarioId: string
        nome: string
        whatsapp: string
        tipoEmpresa?: string
    }) {
        return respostaRepository.createRespondente(data)
    },

    async saveResposta(data: {
        respondenteId: string
        perguntaId: string
        resposta?: string
        respostaTexto?: string
    }) {
        return respostaRepository.createResposta(data)
    },

    async finalizarRespondente(respondenteId: string) {
        return respostaRepository.updateRespondente(respondenteId, {
            dataFinal: new Date(),
        })
    },

    async listRespondentes(questionarioId: string, tenantId: string) {
        // Verificar se o questionário pertence ao tenant
        const questionario = await questionarioRepository.findById(questionarioId, tenantId)

        if (!questionario) {
            throw new Error('Questionário não encontrado')
        }

        return respostaRepository.findRespondentes(questionarioId, tenantId)
    },

    async getRespostasByRespondente(respondenteId: string, tenantId: string) {
        const respostas = await respostaRepository.findRespostasByRespondente(respondenteId)

        if (respostas.length === 0) {
            throw new Error('Respondente não encontrado')
        }

        // Verificar se pertence ao tenant
        const firstResposta = respostas[0]
        const respondente = await respostaRepository.findRespondentes(
            firstResposta.pergunta.questionarioId,
            tenantId
        )

        if (!respondente.find(r => r.id === respondenteId)) {
            throw new Error('Acesso negado')
        }

        return respostas
    },

    async getStats(questionarioId: string, tenantId: string) {
        // Verificar se o questionário pertence ao tenant
        const questionario = await questionarioRepository.findById(questionarioId, tenantId)

        if (!questionario) {
            throw new Error('Questionário não encontrado')
        }

        return respostaRepository.getRespostasStats(questionarioId, tenantId)
    },
}
