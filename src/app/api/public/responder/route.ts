import { NextRequest, NextResponse } from 'next/server'
import { respostaService } from '@/services/respostaService'
import { z } from 'zod'

const responderSchema = z.object({
    questionarioId: z.string(),
    nome: z.string().min(3),
    whatsapp: z.string(),
    tipoEmpresa: z.string().optional(),
    respostas: z.array(z.object({
        perguntaId: z.string(),
        resposta: z.string().nullable().optional(),
        respostaTexto: z.string().nullable().optional(),
    })),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log('📝 Recebendo respostas:', JSON.stringify(body, null, 2))

        const validated = responderSchema.parse(body)
        console.log('✅ Dados validados:', JSON.stringify(validated, null, 2))

        // Criar respondente
        const respondente = await respostaService.createRespondente({
            questionarioId: validated.questionarioId,
            nome: validated.nome,
            whatsapp: validated.whatsapp,
            tipoEmpresa: validated.tipoEmpresa,
        })
        console.log('👤 Respondente criado:', respondente.id)

        // Salvar respostas
        for (const resposta of validated.respostas) {
            const dadosResposta = {
                respondenteId: respondente.id,
                perguntaId: resposta.perguntaId,
                resposta: resposta.resposta || undefined,
                respostaTexto: resposta.respostaTexto || undefined,
            }

            console.log('💾 Salvando resposta:', JSON.stringify(dadosResposta, null, 2))

            const respostaSalva = await respostaService.saveResposta(dadosResposta)
            console.log('✅ Resposta salva:', JSON.stringify(respostaSalva, null, 2))
        }

        // Finalizar
        await respostaService.finalizarRespondente(respondente.id)
        console.log('✅ Respostas salvas com sucesso!')

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('❌ Erro ao salvar respostas:', error)
        return NextResponse.json(
            { error: error.message || 'Erro ao salvar respostas' },
            { status: 400 }
        )
    }
}
