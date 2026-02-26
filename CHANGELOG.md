# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-02-25

### Adicionado
- Sistema completo de questionários inteligentes
- Autenticação via WhatsApp usando PAPI
- Criação e edição de questionários
- Perguntas com tipos: texto, única escolha, múltipla escolha
- Campo "Outro" personalizável em perguntas de escolha
- Lógica condicional: campos que aparecem baseados em respostas
- Campos condicionais obrigatórios
- Envio de questionários via WhatsApp (botão e card)
- Captura automática de dados do respondente via URL
- Visualização de respostas coletadas
- Exportação de respostas para CSV
- Sistema multitenant com isolamento de dados
- Interface responsiva com TailwindCSS
- Docker e Docker Compose para deploy
- GitHub Actions para CI/CD automático
- Suporte a multi-arquitetura (amd64, arm64)

### Tecnologias
- Next.js 14 (App Router)
- React 18
- TypeScript
- PostgreSQL 15
- Prisma ORM
- TailwindCSS
- Docker
- GitHub Container Registry (GHCR)

### Segurança
- Autenticação JWT
- Isolamento multitenant
- Validação de dados com Zod
- Sanitização de inputs
- CORS configurado

### Infraestrutura
- Dockerfile otimizado multi-stage
- Health checks para PostgreSQL
- Migrations automáticas no startup
- Volumes persistentes para dados e uploads
- Integração com Traefik para SSL/TLS
