# 🚀 Deploy Rápido - VEXIA v1.0.0

## ✅ Status do Repositório

- ✅ Código enviado para: https://github.com/SxConnect/VEXIA
- ✅ Tag v1.0.0 criada
- ✅ GitHub Actions configurado
- ✅ Build automático ativado

## 📦 Imagem Docker

Após o GitHub Actions terminar o build (5-10 minutos), a imagem estará disponível em:

```
ghcr.io/sxconnect/vexia:1.0.0
ghcr.io/sxconnect/vexia:latest
```

Acompanhe o build em: https://github.com/SxConnect/VEXIA/actions

## 🚀 Deploy na VPS (3 comandos)

```bash
# 1. Criar diretório e baixar docker-compose
mkdir -p /opt/vexia && cd /opt/vexia
curl -o docker-compose.yml https://raw.githubusercontent.com/SxConnect/VEXIA/main/data-validation-engine/docker-compose.production.yml

# 2. Login no GHCR (se o pacote for privado)
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# 3. Iniciar
docker-compose up -d
```

## 🔍 Verificar Status

```bash
# Ver logs
docker-compose logs -f vexia-app

# Status dos containers
docker-compose ps

# Testar aplicação
curl https://vexia.sxconnect.com.br
```

## 🔐 Configurações Importantes

No `docker-compose.yml`, você pode alterar:

- `POSTGRES_PASSWORD`: Senha do banco de dados
- `JWT_SECRET`: Chave secreta para tokens JWT
- `PAPI_API_KEY`: Chave da API do PAPI (WhatsApp)

## 📊 Estrutura do Sistema

```
vexia-postgres (PostgreSQL 15)
  ↓
vexia-app (Next.js + Prisma)
  ↓
Traefik (SSL/TLS)
  ↓
https://vexia.sxconnect.com.br
```

## 🔄 Atualizar para Nova Versão

```bash
cd /opt/vexia
docker-compose pull
docker-compose up -d
```

## 📞 Suporte

- WhatsApp: +55 21 98700-0079
- Email: suporte@sxconnect.com.br
- Docs: https://github.com/SxConnect/VEXIA

## 🎯 Próximos Passos

1. ⏳ Aguardar GitHub Actions terminar o build
2. 🚀 Fazer deploy na VPS com os 3 comandos acima
3. ✅ Acessar https://vexia.sxconnect.com.br
4. 🎉 Começar a usar!
