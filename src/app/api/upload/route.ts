import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
        }

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Apenas imagens são permitidas' }, { status: 400 })
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Imagem muito grande (máx 5MB)' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Criar pasta uploads se não existir
        const uploadsDir = join(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
        }

        // Gerar nome único
        const timestamp = Date.now()
        const ext = file.name.split('.').pop()
        const filename = `${timestamp}.${ext}`
        const filepath = join(uploadsDir, filename)

        await writeFile(filepath, buffer)

        const url = `/uploads/${filename}`

        return NextResponse.json({ url })
    } catch (error: any) {
        console.error('Erro no upload:', error)
        return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
    }
}
