# 📤 Instruções para Push - VEXIA v1.0.0

## ✅ Repositório Git Inicializado

O repositório já foi inicializado e está pronto para push!

## 🔑 Passo 1: Configurar Credenciais GitHub

Se ainda não configurou suas credenciais Git:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

## 📤 Passo 2: Fazer Push do Código

```bash
# Push da branch main
git push -u origin main

# Push da tag v1.0.0
git push origin v1.0.0
```

## 🐳 Passo 3: Configurar GitHub Actions (Automático)

Após o push, o GitHub Actions irá automaticamente:
1. Fazer build da imagem Docker
2. Fazer push para `ghcr.io/sxconnect/vexia:1.0.0`
3. Fazer push para `ghcr.io/sxconnect/vexia:latest`

Você pode acompanhar o progresso em:
https://github.com/SxConnect/VEXIA/actions

## 🔐 Passo 4: Configurar Permissões do GHCR

1. Acesse: https://github.com/orgs/SxConnect/packages
2. Encontre o pacote `vexia`
3. Vá em "Package settings"
4. Em "Danger Zone" → "Change visibility" → Selecione "Public" (se quiser público)
5. Ou mantenha "Private" e configure access tokens para pull

## 🚀 Passo 5: Deploy na VPS

### Opção A: Pull Automático (Recomendado)

Na VPS, execute:

```bash
# Criar diretório
mkdir -p /opt/vexia
cd /opt/vexia

# Baixar docker-compose
curl -o docker-compose.yml https://raw.githubusercontent.com/SxConnect/VEXIA/main/data-validation-engine/docker-compose.production.yml

# Login no GHCR (se o pacote for privado)
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Opção B: Build e Push Manual

Se preferir fazer build manual:

```bash
# Build
docker build -t ghcr.io/sxconnect/vexia:1.0.0 .
docker tag ghcr.io/sxconnect/vexia:1.0.0 ghcr.io/sxconnect/vexia:latest

# Login no GHCR
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Push
docker push ghcr.io/sxconnect/vexia:1.0.0
docker push ghcr.io/sxconnect/vexia:latest
```

## 🔍 Verificar Status

### Verificar se o push foi bem-sucedido

```bash
git remote -v
git log --oneline
git tag
```

### Verificar GitHub Actions

Acesse: https://github.com/SxConnect/VEXIA/actions

### Verificar imagem no GHCR

Acesse: https://github.com/orgs/SxConnect/packages?repo_name=VEXIA

## 🐛 Troubleshooting

### Erro: "remote: Repository not found"

Verifique se:
1. O repositório existe: https://github.com/SxConnect/VEXIA
2. Você tem permissão de escrita
3. Suas credenciais estão corretas

### Erro: "failed to push some refs"

```bash
# Forçar push (cuidado!)
git push -u origin main --force
```

### GitHub Actions falha no build

1. Verifique os logs em: https://github.com/SxConnect/VEXIA/actions
2. Certifique-se que o Dockerfile está correto
3. Verifique se há erros de sintaxe no código

### Não consegue fazer pull da imagem na VPS

```bash
# Verificar se está logado
docker login ghcr.io

# Tentar pull manual
docker pull ghcr.io/sxconnect/vexia:latest

# Ver logs de erro
docker-compose logs
```

## 📞 Suporte

Problemas? Entre em contato:
- WhatsApp: +55 21 98700-0079
- Email: suporte@sxconnect.com.br

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Acesse: https://vexia.sxconnect.com.br
2. ✅ Faça login com WhatsApp
3. ✅ Crie seu primeiro questionário
4. ✅ Teste o envio via WhatsApp
5. ✅ Colete respostas
6. ✅ Exporte para CSV

## 📚 Documentação Adicional

- [README.md](README.md) - Visão geral do projeto
- [DEPLOY.md](DEPLOY.md) - Guia completo de deploy
- [CHANGELOG.md](CHANGELOG.md) - Histórico de versões
