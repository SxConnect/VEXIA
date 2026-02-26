import { NextResponse } from 'next/server'
import { withAuth, AuthRequest } from '@/middleware/auth'
import { respostaService } from '@/services/respostaService'

async function handleGET(
    req: AuthRequest,
    context: { params: Promise<{ questionarioId: string }> }
) {
    try {
        const params = await context.params
        const respondentes = await respostaService.listRespondentes(
            params.questionarioId,
            req.user!.tenantId
        )

        console.log('📊 API - Retornando respondentes:', respondentes.length)
        if (respondentes.length > 0) {
            console.log('📊 Primeiro respondente:', JSON.stringify(respondentes[0], null, 2))
        }

        return NextResponse.json(respondentes)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao listar respostas' },
            { status: 400 }
        )
    }
}

export const GET = withAuth(handleGET)
