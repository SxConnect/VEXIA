import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/authService'
import { verifyCodeSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validated = verifyCodeSchema.parse(body)

        const result = await authService.verifyCode(validated.whatsapp, validated.code)

        const response = NextResponse.json({
            success: true,
            user: result.user,
        })

        // Definir cookie httpOnly
        response.cookies.set('auth_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 dias
            path: '/',
        })

        return response
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro ao verificar código' },
            { status: 400 }
        )
    }
}
