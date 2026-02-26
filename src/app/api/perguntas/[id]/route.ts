import { NextResponse } from 'next/server'
import { withAuth, AuthRequest } from '@/middleware/auth'
import { questionarioService } from '@/services/questionarioService'

async function handleDELETE(
    req: AuthRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        await questionarioService.deletePergunta(params.id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao deletar pergunta' },
            { status: 400 }
        )
    }
}

export const DELETE = withAuth(handleDELETE)
