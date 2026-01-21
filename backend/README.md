# 🚀 CelPlan Backend - PostgreSQL + MinIO

## 📋 Visão Geral
Backend completo com autenticação JWT, PostgreSQL para dados e MinIO para armazenamento de arquivos (compatível com S3).

## 🛠️ Stack Tecnológica
- **Node.js + Express** - Servidor API
- **PostgreSQL** - Banco de dados relacional
- **MinIO** - Storage de objetos (S3 compatível)
- **JWT** - Autenticação
- **Docker** - Containerização

## 📦 Pré-requisitos
- Node.js 16+ instalado
- Docker e Docker Compose instalados
- 4GB RAM livre para os containers

## 🚀 Como Iniciar

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Iniciar PostgreSQL e MinIO com Docker
```bash
# Iniciar containers
docker-compose up -d

# Verificar se estão rodando
docker ps

# Ver logs
docker-compose logs -f
```

### 3. Iniciar o servidor backend
```bash
# Modo desenvolvimento
npm run dev

# Ou modo produção
npm start
```

## 🔗 URLs de Acesso

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **API Backend** | http://localhost:3001 | - |
| **MinIO Console** | http://localhost:9001 | User: `celplanadmin`<br>Pass: `celplan2024secure` |
| **pgAdmin** | http://localhost:5050 | Email: `admin@celplan.com`<br>Pass: `celplan2024` |
| **PostgreSQL** | localhost:5432 | User: `celplan`<br>Pass: `celplan2024`<br>DB: `celplan_db` |

## 🔐 Autenticação Admin

Login único para o sistema:
- **Username:** `admin`
- **Password:** `celplan2024`

### Testar Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"celplan2024"}'
```

## 📝 Endpoints Principais

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verificar token
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Dados do usuário

### Apresentações
- `GET /api/presentations` - Listar apresentações
- `POST /api/presentations` - Criar apresentação
- `PUT /api/presentations/:id` - Atualizar apresentação
- `DELETE /api/presentations/:id` - Deletar apresentação

### Cases
- `GET /api/cases` - Listar cases
- `POST /api/cases` - Criar case
- `PUT /api/cases/:id` - Atualizar case
- `DELETE /api/cases/:id` - Deletar case

### Upload de Mídia
- `POST /api/media/upload` - Upload de imagem
- `GET /api/media` - Listar arquivos
- `DELETE /api/media/:id` - Deletar arquivo

## 🐳 Comandos Docker Úteis

```bash
# Parar containers
docker-compose down

# Parar e remover volumes (limpa dados)
docker-compose down -v

# Ver logs de um serviço específico
docker-compose logs -f postgres
docker-compose logs -f minio

# Executar comandos no container
docker exec -it celplan_postgres psql -U celplan -d celplan_db
```

## 🔧 Solução de Problemas

### Erro: "ECONNREFUSED"
```bash
# Certifique-se que os containers estão rodando
docker-compose up -d
docker ps
```

### Erro: "Database does not exist"
```bash
# Recriar containers e volumes
docker-compose down -v
docker-compose up -d
```

### MinIO não acessível
```bash
# Verificar se a porta 9001 está livre
netstat -an | findstr 9001

# Se ocupada, mude no docker-compose.yml:
# ports:
#   - "9002:9001"  # Nova porta
```

## 📊 Estrutura do Banco

```sql
-- Tabelas principais
presentations    -- Apresentações dos vendedores
slides          -- Slides de cada apresentação
cases           -- Cases de sucesso
media           -- Arquivos de mídia
inline_edits    -- Edições inline salvas
```

## 🔄 Próximos Passos

1. **Criar modelos Sequelize** para as tabelas
2. **Implementar rotas** de apresentações e cases
3. **Integrar com Frontend** React
4. **Adicionar validações** e segurança
5. **Deploy** em produção

## 📝 Variáveis de Ambiente

Todas as configurações estão no arquivo `.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=celplan_db
DB_USER=celplan
DB_PASSWORD=celplan2024

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=celplanadmin
MINIO_SECRET_KEY=celplan2024secure
MINIO_BUCKET=celplan-media

# Auth
JWT_SECRET=celplan-jwt-secret-key-2024
ADMIN_USERNAME=admin
ADMIN_PASSWORD=celplan2024
```

## 🚨 Importante para Produção

1. **Trocar todas as senhas** padrão
2. **Usar HTTPS** em produção
3. **Configurar backup** automático do PostgreSQL
4. **Monitoramento** com Grafana/Prometheus
5. **Rate limiting** nas APIs

## 💡 Dicas

- Use **pgAdmin** para visualizar e gerenciar o banco
- Use **MinIO Console** para ver arquivos uploaded
- Mantenha **Docker Desktop** aberto no Windows para melhor performance
- Use **Postman** ou **Insomnia** para testar APIs

## 📧 Suporte

Em caso de dúvidas, verifique:
- Logs do Docker: `docker-compose logs`
- Logs do servidor: Console do terminal
- Status dos containers: `docker ps`