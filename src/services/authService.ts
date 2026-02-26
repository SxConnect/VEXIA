import { userRepository } from '@/repositories/userRepository'
import { loginCodeRepository } from '@/repositories/loginCodeRepository'
import { hashCode, compareCode } from '@/lib/hash'
import { signToken } from '@/lib/jwt'
import { sendWhatsAppCode } from '@/lib/papi'

export const authService = {
    async register(nome: string, whatsapp: string) {
        // Normalizar WhatsApp (adicionar + se não tiver)
        const normalizedWhatsapp = whatsapp.startsWith('+') ? whatsapp : `+${whatsapp}`

        const existingUser = await userRepository.findByWhatsApp(normalizedWhatsapp)

        if (existingUser) {
            throw new Error('WhatsApp já cadastrado')
        }

        const user = await userRepository.create({ nome, whatsapp: normalizedWhatsapp })
        return { success: true, userId: user.id }
    },

    async requestLoginCode(whatsapp: string, ipAddress?: string) {
        // Normalizar WhatsApp (adicionar + se não tiver)
        const normalizedWhatsapp = whatsapp.startsWith('+') ? whatsapp : `+${whatsapp}`

        const user = await userRepository.findByWhatsApp(normalizedWhatsapp)

        if (!user) {
            throw new Error('Usuário não encontrado. Cadastre-se primeiro.')
        }

        // Verificar rate limit (60 segundos)
        const recentCodes = await loginCodeRepository.countRecentCodes(
            user.id,
            new Date(Date.now() - 60 * 1000)
        )

        if (recentCodes > 0) {
            throw new Error('Aguarde 60 segundos antes de solicitar novo código')
        }

        // Gerar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const codeHash = await hashCode(code)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutos

        await loginCodeRepository.create({
            userId: user.id,
            codeHash,
            expiresAt,
            ipAddress,
        })

        // Enviar código via WhatsApp
        const sent = await sendWhatsAppCode(normalizedWhatsapp, code)

        if (!sent) {
            throw new Error('Erro ao enviar código via WhatsApp')
        }

        return { success: true }
    },

    async verifyCode(whatsapp: string, code: string) {
        // Normalizar WhatsApp (adicionar + se não tiver)
        const normalizedWhatsapp = whatsapp.startsWith('+') ? whatsapp : `+${whatsapp}`

        const user = await userRepository.findByWhatsApp(normalizedWhatsapp)

        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        const loginCode = await loginCodeRepository.findValidCode(user.id)

        if (!loginCode) {
            throw new Error('Código inválido ou expirado')
        }

        if (loginCode.attempts >= 3) {
            throw new Error('Número máximo de tentativas excedido')
        }

        const isValid = await compareCode(code, loginCode.codeHash)

        if (!isValid) {
            await loginCodeRepository.incrementAttempts(loginCode.id)
            throw new Error('Código incorreto')
        }

        await loginCodeRepository.markAsUsed(loginCode.id)

        const token = signToken({
            userId: user.id,
            tenantId: user.tenantId,
        })

        return { success: true, token, user }
    },
}
