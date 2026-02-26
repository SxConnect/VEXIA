import { NextResponse } from 'next/server'
import { withAuth, AuthRequest } from '@/middleware/auth'
import { questionarioService } from '@/services/questionarioService'
import { questionarioSchema } from '@/lib/validators'

async function handleGET(req: AuthRequest) {
    try {
        const questionarios = await questionarioService.list(req.user!.tenantId)
        return NextResponse.json(questionarios)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao listar questionários' },
            { status: 400 }
        )
    }
}

async function handlePOST(req: AuthRequest) {
    try {
        const body = await req.json()
        const validated = questionarioSchema.parse(body)

        const questionario = await questionarioService.create(req.user!.tenantId, validated)

        return NextResponse.json(questionario, { status: 201 })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao criar questionário' },
            { status: 400 }
        )
    }
}

export const GET = withAuth(handleGET)
export const POST = withAuth(handlePOST)
