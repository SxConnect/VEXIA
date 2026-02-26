import axios from 'axios'

const PAPI_API_URL = process.env.PAPI_API_URL || 'http://localhost:3000'
const PAPI_INSTANCE_ID = process.env.PAPI_INSTANCE_ID || 'default'
const PAPI_API_KEY = process.env.PAPI_API_KEY

export async function sendWhatsAppCode(whatsapp: string, code: string): Promise<boolean> {
    try {
        const message = `Seu código de acesso é: ${code}. Válido por 5 minutos.`

        // Normalizar número para formato WhatsApp (sem + e com @s.whatsapp.net)
        const normalizedNumber = whatsapp.replace(/\D/g, '') // Remove tudo que não é dígito
        const jid = `${normalizedNumber}@s.whatsapp.net`

        const response = await axios.post(
            `${PAPI_API_URL}/api/instances/${PAPI_INSTANCE_ID}/send-text`,
            {
                jid: jid,
                text: message,
                validateNumber: false  // Desabilitar validação - permite enviar para qualquer número
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': PAPI_API_KEY || '',
                },
            }
        )

        console.log('Código enviado via WhatsApp:', response.data)
        return true
    } catch (error: any) {
        console.error('Erro ao enviar código via WhatsApp:', error.response?.data || error.message)
        return false
    }
}

export async function sendWhatsAppButton(params: {
    destinatario: string
    mensagem: string
    textoBotao: string
    link: string
}): Promise<boolean> {
    try {
        const { destinatario, mensagem, textoBotao, link } = params

        // Normalizar número
        const normalizedNumber = destinatario.replace(/\D/g, '')
        const jid = normalizedNumber.includes('@') ? normalizedNumber : `${normalizedNumber}@s.whatsapp.net`

        const response = await axios.post(
            `${PAPI_API_URL}/api/instances/${PAPI_INSTANCE_ID}/send-buttons`,
            {
                jid: jid,
                text: mensagem,
                buttons: [
                    {
                        buttonId: '1',
                        buttonText: { displayText: textoBotao },
                        type: 1
                    }
                ],
                footer: link,
                validateNumber: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': PAPI_API_KEY || '',
                },
            }
        )

        console.log('Botão enviado via WhatsApp:', response.data)
        return true
    } catch (error: any) {
        console.error('Erro ao enviar botão via WhatsApp:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || 'Erro ao enviar mensagem')
    }
}

export async function sendWhatsAppCard(params: {
    destinatario: string
    titulo: string
    descricao: string
    imagemUrl: string
    link: string
}): Promise<boolean> {
    try {
        const { destinatario, titulo, descricao, imagemUrl, link } = params

        // Normalizar número
        const normalizedNumber = destinatario.replace(/\D/g, '')
        const jid = normalizedNumber.includes('@') ? normalizedNumber : `${normalizedNumber}@s.whatsapp.net`

        const response = await axios.post(
            `${PAPI_API_URL}/api/instances/${PAPI_INSTANCE_ID}/send-media`,
            {
                jid: jid,
                media: imagemUrl,
                caption: `*${titulo}*\n\n${descricao}\n\n🔗 ${link}`,
                validateNumber: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': PAPI_API_KEY || '',
                },
            }
        )

        console.log('Card enviado via WhatsApp:', response.data)
        return true
    } catch (error: any) {
        console.error('Erro ao enviar card via WhatsApp:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || 'Erro ao enviar mensagem')
    }
}
