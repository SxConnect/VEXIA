import { NextResponse } from 'next/server'
import { withAuth, AuthRequest } from '@/middleware/auth'
import fs from 'fs'
import path from 'path'

async function handleGET(req: AuthRequest) {
    try {
        // Retornar configurações atuais (sem expor a API Key completa)
        const config = {
            papiUrl: process.env.PAPI_API_URL || '',
            papiInstanceId: process.env.PAPI_INSTANCE_ID || '',
            papiApiKey: process.env.PAPI_API_KEY ? '***' : '',
        }

        return NextResponse.json(config)
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Erro ao carregar configurações' },
            { status: 500 }
        )
    }
}

async function handlePOST(req: AuthRequest) {
    try {
        const body = await req.json()
        const { papiUrl, papiInstanceId, papiApiKey } = body

        // Ler o arquivo .env atual
        const envPath = path.join(process.cwd(), '.env')
        let envContent = ''

        try {
            envContent = fs.readFileSync(envPath, 'utf-8')
        } catch {
            // Se não existir, criar novo
            envContent = ''
        }

        // Atualizar ou adicionar as variáveis
        const updateEnvVar = (content: string, key: string, value: string) => {
            const regex = new RegExp(`^${key}=.*$`, 'm')
            if (regex.test(content)) {
                return content.replace(regex, `${key}="${value}"`)
            } else {
                return content + `\n${key}="${value}"`
            }
        }

        envContent = updateEnvVar(envContent, 'PAPI_API_URL', papiUrl)
        envContent = updateEnvVar(envContent, 'PAPI_INSTANCE_ID', papiInstanceId)
        envContent = updateEnvVar(envContent, 'PAPI_API_KEY', papiApiKey)

        // Salvar arquivo
        fs.writeFileSync(envPath, envContent.trim() + '\n')

        return NextResponse.json({
            success: true,
            message: 'Configurações salvas. Reinicie o servidor para aplicar.'
        })
    } catch (error: any) {
        console.error('Erro ao salvar configurações:', error)
        return NextResponse.json(
            { error: 'Erro ao salvar configurações' },
            { status: 500 }
        )
    }
}

export const GET = withAuth(handleGET)
export const POST = withAuth(handlePOST)
