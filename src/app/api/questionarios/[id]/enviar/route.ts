import { NextResponse } from 'next/server'
import { withAuth, AuthRequest } from '@/middleware/auth'
import { sendWhatsAppButton, sendWhatsAppCard } from '@/lib/papi'

async function handlePOST(
    req: AuthRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        const body = await req.json()
        const { tipo, destinatario, mensagem, imagemUrl, tituloCard, descricaoCard } = body

        // Gerar link do questionário
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const link = `${baseUrl}/q/${params.id}`

        if (tipo === 'botao') {
            // Enviar com botão
            await sendWhatsAppButton({
                destinatario,
                mensagem: mensagem || 'Responda nossa pesquisa:',
                textoBotao: 'Responder Pesquisa',
                link,
            })
        } else if (tipo === 'card') {
            // Enviar com card
            await sendWhatsAppCard({
                destinatario,
                titulo: tituloCard || 'Pesquisa',
                descricao: descricaoCard || mensagem || 'Clique para responder',
                imagemUrl: imagemUrl || `${baseUrl}/default-survey.jpg`,
                link,
            })
        } else {
            throw new Error('Tipo de envio inválido')
        }

        return NextResponse.json({ success: true, message: 'Enviado com sucesso!' })
    } catch (error: any) {
        console.error('Erro ao enviar questionário:', error)
        return NextResponse.json(
            { error: error.message || 'Erro ao enviar questionário' },
            { status: 400 }
        )
    }
}

export const POST = withAuth(handlePOST)
