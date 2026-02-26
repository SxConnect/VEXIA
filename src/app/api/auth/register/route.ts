import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/authService'
import { registerSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validated = registerSchema.parse(body)

        const result = await authService.register(validated.nome, validated.whatsapp)

        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao registrar' },
            { status: 400 }
        )
    }
}
