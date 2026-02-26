# VEXIA - Data Validation Engine

Sistema de questionários inteligentes com autenticação via WhatsApp e lógica condicional.

## 🚀 Versão 1.0.0

### Funcionalidades

- ✅ Autenticação via WhatsApp (PAPI)
- ✅ Criação de questionários com perguntas condicionais
- ✅ Múltiplos tipos de perguntas (texto, única escolha, múltipla escolha)
- ✅ Campo "Outro" personalizável
- ✅ Campos condicionais baseados em respostas
- ✅ Envio via WhatsApp (botão e card)
- ✅ Visualização de respostas
- ✅ Exportação para CSV
- ✅ Sistema multitenant
- ✅ Interface responsiva

## 🐳 Deploy com Docker

### Pré-requisitos

- Docker e Docker Compose instalados
- Traefik configurado na rede `portainer_default`
- Domínio configurado: `vexia.sxconnect.com.br`

### Deploy Rápido

1. Clone o repositório:
```bash
git clone https://github.com/SxConnect/VEXIA.git
cd VEXIA
```

2. Configure as variáveis de ambiente (opcional):
```bash
cp .env.production.example .env.production
# Edite .env.production se necessário
```

3. Inicie os containers:
```bash
docker-compose -f docker-compose.production.yml up -d
```

4. Verifique os logs:
```bash
docker-compose -f docker-compose.production.yml logs -f vexia-app
```

### Atualização

```bash
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

## 🔧 Desenvolvimento Local

### Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/SxConnect/VEXIA.git
cd VEXIA/data-validation-engine
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
docker-compose up -d
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas configurações
```

5. Execute as migrações:
```bash
npm run prisma:migrate
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse: http://localhost:3000

## 📦 Build Manual

```bash
# Build da imagem
docker build -t ghcr.io/sxconnect/vexia:1.0.0 .

# Push para o registry
docker push ghcr.io/sxconnect/vexia:1.0.0
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Chave secreta para JWT | `your-secret-key` |
| `PAPI_API_URL` | URL da API PAPI | `https://papi.sxconnect.com.br` |
| `PAPI_INSTANCE_ID` | ID da instância PAPI | `sxconnect` |
| `PAPI_API_KEY` | Chave de API PAPI | `your-api-key` |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação | `https://vexia.sxconnect.com.br` |

## 📊 Estrutura do Banco de Dados

- `tenants` - Tenants (isolamento multitenant)
- `users` - Usuários do sistema
- `login_codes` - Códigos de autenticação WhatsApp
- `questionarios` - Questionários criados
- `perguntas` - Perguntas dos questionários
- `opcoes` - Opções de resposta
- `respondentes` - Pessoas que responderam
- `respostas` - Respostas coletadas

## 🔄 CI/CD

O projeto usa GitHub Actions para build e deploy automático:

- Push na branch `main` → Build e push da imagem `latest`
- Tags `v*` → Build e push com versionamento semântico
- Suporte para multi-arquitetura (amd64, arm64)

## 📝 Licença

Proprietary - SxConnect © 2024

## 🤝 Suporte

Para suporte, entre em contato através do WhatsApp: +55 21 98700-0079
