#!/bin/bash

echo "🚀 Inicializando banco de dados..."

# Aguardar o PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL..."
sleep 5

# Executar migrações
echo "📦 Executando migrações..."
npx prisma migrate deploy

echo "✅ Banco de dados inicializado com sucesso!"
