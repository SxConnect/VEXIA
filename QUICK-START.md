# 🚀 Quick Start - VEXIA v1.0.0

## Para fazer push agora:

```bash
cd data-validation-engine

# Push do código
git push -u origin main

# Push da tag
git push origin v1.0.0
```

## Deploy na VPS (após push):

```bash
# Na VPS
mkdir -p /opt/vexia && cd /opt/vexia

# Baixar docker-compose
curl -o docker-compose.yml https://raw.githubusercontent.com/SxConnect/VEXIA/main/data-validation-engine/docker-compose.production.yml

# Login no GHCR (use um Personal Access Token com permissão packages:read)
echo "YOUR_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f vexia-app
```

## Acessar aplicação:

https://vexia.sxconnect.com.br

## Documentação completa:

- [PUSH-INSTRUCTIONS.md](PUSH-INSTRUCTIONS.md) - Instruções detalhadas de push
- [DEPLOY.md](DEPLOY.md) - Guia completo de deploy
- [README.md](README.md) - Documentação do projeto
