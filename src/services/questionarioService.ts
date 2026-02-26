import { questionarioRepository } from '@/repositories/questionarioRepository'
import { perguntaRepository } from '@/repositories/perguntaRepository'

export const questionarioService = {
    async list(tenantId: string) {
        return questionarioRepository.findByTenant(tenantId)
    },

    async getById(id: string, tenantId: string) {
        const questionario = await questionarioRepository.findById(id, tenantId)

        if (!questionario) {
            throw new Error('Questionário não encontrado')
        }

        return questionario
    },

    async create(tenantId: string, data: {
        titulo: string
        descricao?: string
        status?: string
    }) {
        return questionarioRepository.create({
            tenantId,
            ...data,
        })
    },

    async update(id: string, tenantId: string, data: {
        titulo?: string
        descricao?: string
        status?: string
    }) {
        const result = await questionarioRepository.update(id, tenantId, data)

        if (result.count === 0) {
            throw new Error('Questionário não encontrado')
        }

        return { success: true }
    },

    async delete(id: string, tenantId: string) {
        const result = await questionarioRepository.delete(id, tenantId)

        if (result.count === 0) {
            throw new Error('Questionário não encontrado')
        }

        return { success: true }
    },

    async addPergunta(questionarioId: string, tenantId: string, data: {
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
        // Verificar se o questionário pertence ao tenant
        const questionario = await questionarioRepository.findById(questionarioId, tenantId)

        if (!questionario) {
            throw new Error('Questionário não encontrado')
        }

        return perguntaRepository.create({
            questionarioId,
            ...data,
        })
    },

    async updatePergunta(perguntaId: string, data: {
        texto?: string
        contexto?: string
        tipo?: string
        obrigatoria?: boolean
        permitirOutro?: boolean
        ordem?: number
        ativa?: boolean
    }) {
        return perguntaRepository.update(perguntaId, data)
    },

    async deletePergunta(perguntaId: string) {
        return perguntaRepository.delete(perguntaId)
    },
}
