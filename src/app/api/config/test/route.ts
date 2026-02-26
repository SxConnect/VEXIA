import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthRequest } from '@/middleware/auth'
import axios from 'axios'

async function handlePOST(req: AuthRequest) {
    try {
        const body = await req.json()
        const { papiUrl, papiInstanceId, papiApiKey } = body

        if (!papiUrl || !papiInstanceId) {
            return NextResponse.json(
                { error: 'URL e Instance ID são obrigatórios' },
                { status: 400 }
            )
        }

        // Testar conexão com a PAPI API
        const headers: any = {
            'Content-Type': 'application/json',
        }

        if (papiApiKey) {
            headers['x-api-key'] = papiApiKey
        }

        const response = await axios.get(
            `${papiUrl}/api/instances/${papiInstanceId}/status`,
            {
                headers,
                timeout: 10000
            }
        )

        if (response.data) {
            return NextResponse.json({
                success: true,
                status: response.data.status,
                message: 'Conexão estabelecida com sucesso!'
            })
        }

        return NextResponse.json(
            { error: 'Resposta inválida da PAPI API' },
            { status: 500 }
        )
    } catch (error: any) {
        console.error('Erro ao testar PAPI:', error.response?.data || error.message)

        if (error.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { error: 'Não foi possível conectar. Verifique a URL.' },
                { status: 500 }
            )
        }

        if (error.response?.status === 401) {
            return NextResponse.json(
                { error: 'API Key inválida ou não autorizada' },
                { status: 401 }
            )
        }

        if (error.response?.status === 404) {
            return NextResponse.json(
                { error: 'Instância não encontrada. Verifique o Instance ID.' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: error.response?.data?.error || error.message || 'Erro ao testar conexão' },
            { status: 500 }
        )
    }
}

export const POST = withAuth(handlePOST)
