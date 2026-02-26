import { NextResponse } from 'next/server'
import { withAuth, AuthRequest } from '@/middleware/auth'
import { questionarioService } from '@/services/questionarioService'
import { questionarioSchema } from '@/lib/validators'

async function handleGET(
    req: AuthRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        console.log('GET /api/questionarios/[id] - params:', params)
        console.log('GET /api/questionarios/[id] - user:', req.user)

        const questionario = await questionarioService.getById(params.id, req.user!.tenantId)

        console.log('GET /api/questionarios/[id] - questionario found:', !!questionario)

        return NextResponse.json(questionario)
    } catch (error: any) {
        console.error('GET /api/questionarios/[id] - error:', error)
        return NextResponse.json(
            { error: error.message || 'Erro ao buscar questionário' },
            { status: 404 }
        )
    }
}

async function handlePUT(
    req: AuthRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        const body = await req.json()
        const validated = questionarioSchema.partial().parse(body)

        await questionarioService.update(params.id, req.user!.tenantId, validated)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao atualizar questionário' },
            { status: 400 }
        )
    }
}

async function handleDELETE(
    req: AuthRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        await questionarioService.delete(params.id, req.user!.tenantId)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao deletar questionário' },
            { status: 400 }
        )
    }
}

export const GET = withAuth(handleGET)
export const PUT = withAuth(handlePUT)
export const DELETE = withAuth(handleDELETE)
