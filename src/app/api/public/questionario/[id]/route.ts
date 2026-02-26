import { NextRequest, NextResponse } from 'next/server'
import { questionarioRepository } from '@/repositories/questionarioRepository'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        // Buscar questionário sem verificar tenant (público)
        const questionario = await questionarioRepository.findById(params.id)

        if (!questionario || questionario.status !== 'ativo') {
            return NextResponse.json(
                { error: 'Questionário não encontrado' },
                { status: 404 }
            )
        }

        // Retornar apenas perguntas ativas
        const questionarioPublico = {
            ...questionario,
            perguntas: questionario.perguntas.filter(p => p.ativa),
        }

        return NextResponse.json(questionarioPublico)
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Erro ao buscar questionário' },
            { status: 500 }
        )
    }
}
