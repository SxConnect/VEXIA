# 🚀 Guia de Deploy - VEXIA v1.0.0

## Pré-requisitos na VPS

1. Docker e Docker Compose instalados
2. Traefik configurado e rodando
3. Rede `portainer_default` criada
4. DNS configurado: `vexia.sxconnect.com.br` → IP da VPS

## 📦 Opção 1: Deploy Automático (Recomendado)

### Passo 1: Configurar GitHub Actions

O repositório já está configurado com GitHub Actions. Ao fazer push, a imagem será automaticamente construída e enviada para o GHCR.

### Passo 2: Na VPS, criar diretório do projeto

```bash
mkdir -p /opt/vexia
cd /opt/vexia
```

### Passo 3: Baixar o docker-compose.production.yml

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/SxConnect/VEXIA/main/data-validation-engine/docker-compose.production.yml
```

### Passo 4: Configurar variáveis (opcional)

Edite o `docker-compose.yml` se precisar alterar senhas ou configurações:

```bash
nano docker-compose.yml
```

### Passo 5: Fazer login no GHCR

```bash
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### Passo 6: Iniciar os containers

```bash
docker-compose up -d
```

### Passo 7: Verificar logs

```bash
docker-compose logs -f vexia-app
```

## 🔧 Opção 2: Build Manual

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/SxConnect/VEXIA.git
cd VEXIA/data-validation-engine
```

### Passo 2: Build da imagem

```bash
docker build -t ghcr.io/sxconnect/vexia:1.0.0 .
docker tag ghcr.io/sxconnect/vexia:1.0.0 ghcr.io/sxconnect/vexia:latest
```

### Passo 3: Push para o registry

```bash
docker push ghcr.io/sxconnect/vexia:1.0.0
docker push ghcr.io/sxconnect/vexia:latest
```

### Passo 4: Deploy na VPS

Siga os passos 2-7 da Opção 1.

## 🔄 Atualização

### Atualizar para nova versão

```bash
cd /opt/vexia
docker-compose pull
docker-compose up -d
```

### Verificar versão atual

```bash
docker inspect ghcr.io/sxconnect/vexia:latest | grep "org.opencontainers.image.version"
```

## 🗄️ Backup do Banco de Dados

### Criar backup

```bash
docker exec vexia-postgres pg_dump -U vexia_user vexia > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar backup

```bash
cat backup_20260225_120000.sql | docker exec -i vexia-postgres psql -U vexia_user vexia
```

## 📊 Monitoramento

### Ver logs em tempo real

```bash
docker-compose logs -f
```

### Ver apenas logs da aplicação

```bash
docker-compose logs -f vexia-app
```

### Ver apenas logs do banco

```bash
docker-compose logs -f vexia-postgres
```

### Status dos containers

```bash
docker-compose ps
```

### Uso de recursos

```bash
docker stats vexia-app vexia-postgres
```

## 🔐 Segurança

### Alterar senhas padrão

Edite o `docker-compose.yml` e altere:
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `PAPI_API_KEY` (se necessário)

Depois recrie os containers:

```bash
docker-compose down
docker volume rm vexia_postgres_data  # ⚠️ Isso apaga os dados!
docker-compose up -d
```

### Configurar firewall

```bash
# Permitir apenas portas necessárias
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs vexia-app

# Verificar se o banco está pronto
docker-compose logs vexia-postgres | grep "ready to accept connections"
```

### Erro de conexão com banco

```bash
# Verificar se o banco está rodando
docker-compose ps vexia-postgres

# Testar conexão
docker exec vexia-postgres psql -U vexia_user -d vexia -c "SELECT 1;"
```

### Migrations não executam

```bash
# Executar migrations manualmente
docker exec vexia-app npx prisma migrate deploy
```

### Limpar tudo e recomeçar

```bash
docker-compose down -v
docker-compose up -d
```

## 📞 Suporte

Para problemas ou dúvidas:
- WhatsApp: +55 21 98700-0079
- Email: suporte@sxconnect.com.br

## 🔗 Links Úteis

- Aplicação: https://vexia.sxconnect.com.br
- Repositório: https://github.com/SxConnect/VEXIA
- Imagens Docker: https://github.com/orgs/SxConnect/packages?repo_name=VEXIA
