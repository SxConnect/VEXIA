# PowerShell script para Windows
Write-Host "🚀 Inicializando repositório Git para VEXIA v1.0.0" -ForegroundColor Green

# Verificar se já existe um repositório Git
if (Test-Path ".git") {
    Write-Host "⚠️  Repositório Git já existe. Removendo..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .git
}

# Inicializar repositório
Write-Host "📦 Inicializando repositório..." -ForegroundColor Cyan
git init

# Adicionar remote
Write-Host "🔗 Adicionando remote..." -ForegroundColor Cyan
git remote add origin https://github.com/SxConnect/VEXIA.git

# Criar .gitignore se não existir
if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Criando .gitignore..." -ForegroundColor Cyan
    @"
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Next.js
.next/
out/
build
dist

# Production
.vercel

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local
.env.development
.env.test

# Vercel
.vercel

# Typescript
*.tsbuildinfo
next-env.d.ts

# Prisma
prisma/dev.db
prisma/dev.db-journal

# Uploads
public/uploads/*
!public/uploads/.gitkeep

# Logs
logs
*.log

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore
"@ | Out-File -FilePath .gitignore -Encoding UTF8
}

# Adicionar todos os arquivos
Write-Host "➕ Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Commit inicial
Write-Host "💾 Criando commit inicial..." -ForegroundColor Cyan
git commit -m "🎉 Initial release v1.0.0

Features:
- Sistema completo de questionários inteligentes
- Autenticação via WhatsApp (PAPI)
- Lógica condicional em perguntas
- Envio via WhatsApp (botão e card)
- Visualização e exportação de respostas
- Sistema multitenant
- Docker e CI/CD configurados"

# Criar tag v1.0.0
Write-Host "🏷️  Criando tag v1.0.0..." -ForegroundColor Cyan
git tag -a v1.0.0 -m "Release v1.0.0 - VEXIA Data Validation Engine"

# Criar branch main se não existir
Write-Host "🌿 Configurando branch main..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "✅ Repositório inicializado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📤 Para fazer push, execute:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host "   git push origin v1.0.0" -ForegroundColor White
Write-Host ""
Write-Host "🐳 Para fazer build e push da imagem Docker manualmente:" -ForegroundColor Yellow
Write-Host "   docker build -t ghcr.io/sxconnect/vexia:1.0.0 ." -ForegroundColor White
Write-Host "   docker tag ghcr.io/sxconnect/vexia:1.0.0 ghcr.io/sxconnect/vexia:latest" -ForegroundColor White
Write-Host "   docker push ghcr.io/sxconnect/vexia:1.0.0" -ForegroundColor White
Write-Host "   docker push ghcr.io/sxconnect/vexia:latest" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Ou deixe o GitHub Actions fazer automaticamente após o push!" -ForegroundColor Cyan
