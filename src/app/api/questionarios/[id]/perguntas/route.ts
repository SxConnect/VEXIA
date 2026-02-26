import { NextResponse } from 'next/server'
import { withAuth, AuthRequest } from '@/middleware/auth'
import { questionarioService } from '@/services/questionarioService'
import { perguntaSchema } from '@/lib/validators'

async function handlePOST(
    req: AuthRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        const body = await req.json()
        const validated = perguntaSchema.parse(body)

        const pergunta = await questionarioService.addPergunta(
            params.id,
            req.user!.tenantId,
            validated
        )

        return NextResponse.json(pergunta, { status: 201 })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao criar pergunta' },
            { status: 400 }
        )
    }
}

export const POST = withAuth(handlePOST)
