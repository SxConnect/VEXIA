import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...')

    // Criar tenant de exemplo
    const tenant = await prisma.tenant.create({
        data: {},
    })

    console.log('✅ Tenant criado:', tenant.id)

    // Criar usuário de exemplo
    const user = await prisma.user.create({
        data: {
            tenantId: tenant.id,
            nome: 'Usuário Demo',
            whatsapp: '+5511999999999',
        },
    })

    console.log('✅ Usuário criado:', user.nome)

    // Criar questionário de exemplo
    const questionario = await prisma.questionario.create({
        data: {
            tenantId: tenant.id,
            titulo: 'Pesquisa de Satisfação',
            descricao: 'Queremos saber sua opinião sobre nossos serviços.',
            status: 'ativo',
        },
    })

    console.log('✅ Questionário criado:', questionario.titulo)

    // Criar perguntas
    const pergunta1 = await prisma.pergunta.create({
        data: {
            questionarioId: questionario.id,
            texto: 'Como você avalia nosso atendimento?',
            contexto: 'Considere a qualidade, rapidez e cordialidade.',
            tipo: 'unica',
            obrigatoria: true,
            permitirOutro: false,
            ordem: 1,
            ativa: true,
            opcoes: {
                create: [
                    { texto: 'Excelente', ordem: 1 },
                    { texto: 'Bom', ordem: 2 },
                    { texto: 'Regular', ordem: 3 },
                    { texto: 'Ruim', ordem: 4 },
                ],
            },
        },
    })

    const pergunta2 = await prisma.pergunta.create({
        data: {
            questionarioId: questionario.id,
            texto: 'Quais recursos você mais utiliza?',
            tipo: 'multipla',
            obrigatoria: true,
            permitirOutro: true,
            ordem: 2,
            ativa: true,
            opcoes: {
                create: [
                    { texto: 'Dashboard', ordem: 1 },
                    { texto: 'Relatórios', ordem: 2 },
                    { texto: 'Integrações', ordem: 3 },
                    { texto: 'API', ordem: 4 },
                ],
            },
        },
    })

    const pergunta3 = await prisma.pergunta.create({
        data: {
            questionarioId: questionario.id,
            texto: 'Deixe seus comentários e sugestões',
            tipo: 'texto',
            obrigatoria: false,
            permitirOutro: false,
            ordem: 3,
            ativa: true,
        },
    })

    console.log('✅ Perguntas criadas:', 3)

    // Criar respondente de exemplo
    const respondente = await prisma.respondente.create({
        data: {
            questionarioId: questionario.id,
            nome: 'João Silva',
            whatsapp: '+5511988888888',
            tipoEmpresa: 'Tecnologia',
            dataFinal: new Date(),
        },
    })

    // Criar respostas de exemplo
    await prisma.resposta.createMany({
        data: [
            {
                respondenteId: respondente.id,
                perguntaId: pergunta1.id,
                resposta: 'Excelente',
            },
            {
                respondenteId: respondente.id,
                perguntaId: pergunta2.id,
                resposta: JSON.stringify(['Dashboard', 'Relatórios']),
            },
            {
                respondenteId: respondente.id,
                perguntaId: pergunta3.id,
                respostaTexto: 'Excelente plataforma! Muito intuitiva e fácil de usar.',
            },
        ],
    })

    console.log('✅ Respostas de exemplo criadas')

    console.log('\n🎉 Seed concluído com sucesso!')
    console.log('\n📝 Dados criados:')
    console.log(`   - Tenant ID: ${tenant.id}`)
    console.log(`   - Usuário: ${user.nome} (${user.whatsapp})`)
    console.log(`   - Questionário: ${questionario.titulo}`)
    console.log(`   - Perguntas: 3`)
    console.log(`   - Respondentes: 1`)
    console.log('\n💡 Use estas credenciais para fazer login:')
    console.log(`   WhatsApp: ${user.whatsapp}`)
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
