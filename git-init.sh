#!/bin/bash

echo "🚀 Inicializando repositório Git para VEXIA v1.0.0"

# Verificar se já existe um repositório Git
if [ -d ".git" ]; then
    echo "⚠️  Repositório Git já existe. Removendo..."
    rm -rf .git
fi

# Inicializar repositório
echo "📦 Inicializando repositório..."
git init

# Adicionar remote
echo "🔗 Adicionando remote..."
git remote add origin https://github.com/SxConnect/VEXIA.git

# Criar .gitignore se não existir
if [ ! -f ".gitignore" ]; then
    echo "📝 Criando .gitignore..."
    cat > .gitignore << 'EOF'
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
EOF
fi

# Adicionar todos os arquivos
echo "➕ Adicionando arquivos..."
git add .

# Commit inicial
echo "💾 Criando commit inicial..."
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
echo "🏷️  Criando tag v1.0.0..."
git tag -a v1.0.0 -m "Release v1.0.0 - VEXIA Data Validation Engine"

# Criar branch main se não existir
echo "🌿 Configurando branch main..."
git branch -M main

echo ""
echo "✅ Repositório inicializado com sucesso!"
echo ""
echo "📤 Para fazer push, execute:"
echo "   git push -u origin main"
echo "   git push origin v1.0.0"
echo ""
echo "🐳 Para fazer build e push da imagem Docker manualmente:"
echo "   docker build -t ghcr.io/sxconnect/vexia:1.0.0 ."
echo "   docker tag ghcr.io/sxconnect/vexia:1.0.0 ghcr.io/sxconnect/vexia:latest"
echo "   docker push ghcr.io/sxconnect/vexia:1.0.0"
echo "   docker push ghcr.io/sxconnect/vexia:latest"
echo ""
echo "⚡ Ou deixe o GitHub Actions fazer automaticamente após o push!"
