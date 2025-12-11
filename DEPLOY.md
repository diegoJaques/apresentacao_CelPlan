# Guia de Deploy - Sistema de Apresentações Customizadas

## Visão Geral

Este sistema adiciona autenticação e customização de apresentações, permitindo que vendedores criem apresentações personalizadas para clientes.

## Arquitetura

```
Frontend (React + Vite)
    ↓
Backend API (Node.js + Express + TypeScript)
    ↓
PostgreSQL (container existente)
```

## Modificações no docker-compose.yml

Adicione o seguinte serviço ao seu `docker-compose.yml`:

```yaml
  # Backend API para sistema de apresentações
  apresentacao-api:
    build:
      context: ./apresentacao_CelPlan/backend
      dockerfile: Dockerfile
    container_name: apresentacao-api
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=apresentacoes
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - JWT_SECRET=celplan_jwt_secret_2025_change_in_production
      - CLIENT_PASSWORD=celplan
      - FRONTEND_URL=https://apresentacao.celintelligence.com
      - CORS_ORIGIN=https://apresentacao.celintelligence.com
    networks:
      - proxy
    depends_on:
      - postgres
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.apresentacao-api.rule=Host(`apresentacao-api.celintelligence.com`)"
      - "traefik.http.routers.apresentacao-api.entrypoints=websecure"
      - "traefik.http.routers.apresentacao-api.tls.certresolver=leresolver"
      - "traefik.http.services.apresentacao-api.loadbalancer.server.port=3000"
```

**IMPORTANTE:** Modifique também o serviço `apresentacao` existente para adicionar a variável de ambiente da API:

```yaml
  apresentacao:
      build:
        context: ./apresentacao_CelPlan
        dockerfile: Dockerfile
        args:  # Adicionar esta seção
          - VITE_API_URL=https://apresentacao-api.celintelligence.com
      container_name: apresentacao
      restart: always
      networks:
        - proxy
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.apresentacao.rule=Host(`apresentacao.celintelligence.com`)"
        - "traefik.http.routers.apresentacao.entrypoints=websecure"
        - "traefik.http.routers.apresentacao.tls.certresolver=leresolver"
        - "traefik.http.services.apresentacao.loadbalancer.server.port=80"
```

## Modificações no Dockerfile do Frontend

Adicione a variável de ambiente no Dockerfile do frontend (pasta raiz):

```dockerfile
FROM node:20-alpine as build

WORKDIR /app

# Aceitar ARG para build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Passo a Passo de Deploy

### 1. Preparar Backend

```bash
# No servidor, dentro da pasta do projeto
cd ~/apresentacao_CelPlan

# Criar pasta do backend (caso não exista)
mkdir -p backend

# Fazer upload dos arquivos do backend para ~/apresentacao_CelPlan/backend/
# Estrutura:
# backend/
# ├── src/
# ├── package.json
# ├── tsconfig.json
# ├── Dockerfile
# └── .env.example
```

### 2. Criar Database

```bash
# Conectar ao PostgreSQL
docker exec -it postgres psql -U postgres

# Dentro do psql:
CREATE DATABASE apresentacoes;

# Verificar
\l

# Sair
\q
```

### 3. Executar Migrations

```bash
# Construir e executar migração (primeira vez)
cd ~/apresentacao_CelPlan/backend
docker build -t apresentacao-api-temp .
docker run --rm --network jaques_proxy \
  -e DB_HOST=postgres \
  -e DB_NAME=apresentacoes \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  apresentacao-api-temp npm run migrate
```

### 4. Atualizar docker-compose.yml

```bash
# Editar docker-compose.yml
nano ~/docker-compose.yml

# Adicionar o serviço apresentacao-api conforme mostrado acima
# Modificar o serviço apresentacao existente

# Salvar (Ctrl+O, Enter, Ctrl+X)
```

### 5. Deploy

```bash
# Rebuild e restart dos containers
cd ~
docker-compose up -d --build apresentacao apresentacao-api

# Verificar logs
docker logs -f apresentacao-api
docker logs -f apresentacao
```

### 6. Verificar

```bash
# Testar backend
curl https://apresentacao-api.celintelligence.com/health

# Deve retornar: {"status":"ok",...}

# Testar frontend
# Acessar: https://apresentacao.celintelligence.com/login
```

## Credenciais Padrão

### Vendedor (Admin)
- URL: `https://apresentacao.celintelligence.com/login`
- Usuário: `comercial`
- Senha: `celplan2025`

### Cliente
- Palavra de segurança: `celplan`

## Fluxo de Uso

### Vendedor:
1. Acessa `/login`
2. Faz login com usuário e senha
3. Vai para `/admin`
4. Preenche dados (nome, email, telefone, WhatsApp)
5. Seleciona slides desejados
6. Clica em "Gerar Apresentação"
7. Copia URL gerada e envia para cliente

### Cliente:
1. Acessa URL recebida (ex: `/apresentacao/AbC123XyZ`)
2. Digita palavra de segurança: `celplan`
3. Visualiza apresentação customizada
4. Última página mostra dados do vendedor responsável

## URLs do Sistema

- **Frontend (apresentação padrão):** https://apresentacao.celintelligence.com/
- **Login vendedor:** https://apresentacao.celintelligence.com/login
- **Painel admin:** https://apresentacao.celintelligence.com/admin (requer login)
- **API Backend:** https://apresentacao-api.celintelligence.com
- **Health Check API:** https://apresentacao-api.celintelligence.com/health

## Troubleshooting

### Backend não conecta ao banco
```bash
# Verificar se database foi criado
docker exec -it postgres psql -U postgres -c "\l"

# Verificar network
docker inspect apresentacao-api | grep Networks

# Ver logs
docker logs apresentacao-api
```

### Frontend não conecta no backend
```bash
# Verificar variável de ambiente
docker exec apresentacao-api env | grep VITE_API_URL

# Reconstruir frontend
docker-compose up -d --build apresentacao
```

### CORS Error
```bash
# Verificar CORS_ORIGIN no backend
docker exec apresentacao-api env | grep CORS_ORIGIN

# Deve ser: https://apresentacao.celintelligence.com
```

## Segurança

**PRODUÇÃO:** Alterar as seguintes senhas/secrets:

```yaml
# docker-compose.yml
- JWT_SECRET=GERAR_SECRET_FORTE_AQUI  # Use: openssl rand -base64 32
- CLIENT_PASSWORD=palavra_secreta_sua  # Palavra que cliente usa
```

```sql
-- Alterar senha do usuário comercial
-- Conectar ao banco
docker exec -it postgres psql -U postgres apresentacoes

-- Gerar hash (usando bcrypt com salt 10)
-- Usar ferramenta online ou Node.js: bcrypt.hash('sua_senha', 10)

UPDATE users
SET password_hash = '$2a$10$HASH_GERADO_AQUI'
WHERE username = 'comercial';
```

## Backup do Banco

```bash
# Backup da database apresentacoes
docker exec postgres pg_dump -U postgres apresentacoes > backup_apresentacoes.sql

# Restaurar
cat backup_apresentacoes.sql | docker exec -i postgres psql -U postgres apresentacoes
```

## Monitoramento

```bash
# Ver status
docker-compose ps | grep apresentacao

# Logs em tempo real
docker logs -f apresentacao-api
docker logs -f apresentacao

# Ver uso de recursos
docker stats apresentacao-api apresentacao
```

## Estrutura do Banco de Dados

### Tabela: `users`
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `name` (VARCHAR)
- `created_at` (TIMESTAMP)

### Tabela: `presentations`
- `id` (VARCHAR PRIMARY KEY) - ID único da apresentação
- `vendor_name` (VARCHAR) - Nome do vendedor
- `vendor_email` (VARCHAR) - Email do vendedor
- `vendor_phone` (VARCHAR) - Telefone do vendedor
- `vendor_whatsapp` (VARCHAR) - WhatsApp do vendedor
- `selected_slides` (JSONB) - Array de IDs dos slides
- `created_at` (TIMESTAMP)

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login vendedor
  ```json
  {
    "username": "comercial",
    "password": "celplan2025"
  }
  ```

### Apresentações (requer autenticação)
- `POST /api/presentations` - Criar apresentação
  ```json
  {
    "vendorInfo": {
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "phone": "(11) 98765-4321",
      "whatsapp": "5511987654321"
    },
    "selectedSlides": ["intro", "about", "markets", "contact"]
  }
  ```

- `GET /api/presentations/:id` - Buscar apresentação (público)

### Cliente
- `POST /api/client/validate` - Validar palavra de segurança
  ```json
  {
    "password": "celplan"
  }
  ```

## Suporte

Caso tenha problemas:

1. Verifique os logs: `docker logs apresentacao-api`
2. Verifique conectividade com banco: `docker exec apresentacao-api npm run migrate`
3. Teste endpoints manualmente: `curl https://apresentacao-api.celintelligence.com/health`
4. Verifique Traefik dashboard: `https://traefik.celintelligence.com`
