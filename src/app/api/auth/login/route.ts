import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/authService'
import { loginSchema } from '@/lib/validators'
import { getClientIP } from '@/middleware/auth'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validated = loginSchema.parse(body)
        const ipAddress = getClientIP(req)

        const result = await authService.requestLoginCode(validated.whatsapp, ipAddress)

        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao solicitar código' },
            { status: 400 }
        )
    }
}
