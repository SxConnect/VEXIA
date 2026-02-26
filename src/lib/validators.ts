import { z } from 'zod'

export const whatsappSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'WhatsApp inválido')

export const registerSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    whatsapp: whatsappSchema,
})

export const loginSchema = z.object({
    whatsapp: whatsappSchema,
})

export const verifyCodeSchema = z.object({
    whatsapp: whatsappSchema,
    code: z.string().length(6, 'Código deve ter 6 dígitos'),
})

export const questionarioSchema = z.object({
    titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    descricao: z.string().optional(),
    status: z.enum(['ativo', 'inativo']).default('ativo'),
    imagemUrl: z.string().url().optional().nullable(),
})

export const perguntaSchema = z.object({
    texto: z.string().min(3, 'Texto da pergunta é obrigatório'),
    contexto: z.string().optional(),
    tipo: z.enum(['unica', 'multipla', 'texto']),
    obrigatoria: z.boolean().default(true),
    permitirOutro: z.boolean().default(false),
    ordem: z.number().int().positive(),
    ativa: z.boolean().default(true),
    opcoes: z.array(z.string()).optional(),
    campoCondicional: z.boolean().default(false),
    condicaoOpcoes: z.string().nullable().optional(),
    campoCondicionalTexto: z.string().nullable().optional(),
    campoObrigatorio: z.boolean().default(false),
})
