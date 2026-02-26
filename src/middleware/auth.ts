import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export interface AuthRequest extends NextRequest {
    user?: {
        userId: string
        tenantId: string
    }
}

export function withAuth(handler: (req: AuthRequest, context?: any) => Promise<NextResponse>) {
    return async (req: AuthRequest, context?: any) => {
        try {
            const token = req.cookies.get('auth_token')?.value

            if (!token) {
                return NextResponse.json(
                    { error: 'Não autenticado' },
                    { status: 401 }
                )
            }

            const payload = verifyToken(token)

            if (!payload) {
                return NextResponse.json(
                    { error: 'Token inválido' },
                    { status: 401 }
                )
            }

            req.user = payload
            return handler(req, context)
        } catch (error) {
            return NextResponse.json(
                { error: 'Erro de autenticação' },
                { status: 401 }
            )
        }
    }
}

export function getClientIP(req: NextRequest): string | undefined {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0] ||
        req.headers.get('x-real-ip') ||
        undefined
    )
}
