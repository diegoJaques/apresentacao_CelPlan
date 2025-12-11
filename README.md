# CelPlan International - Sistema de Apresentações Customizadas

Uma apresentação web moderna e interativa com sistema completo de autenticação e customização para vendedores.

## Funcionalidades

### Modo Padrão (Original)
Apresentação interativa completa com 32 anos de inovação tecnológica da CelPlan.

### Modo Customizado (Novo)
- **Time Comercial:** Login, customização de slides e dados de contato
- **Cliente:** Acesso via URL única com palavra de segurança
- **Personalização:** Última página mostra dados do vendedor responsável

## Tecnologias

### Frontend
- React 19 + TypeScript
- Vite
- React Router DOM
- Framer Motion
- Tailwind CSS
- Axios

### Backend
- Node.js + Express + TypeScript
- PostgreSQL
- JWT + bcryptjs

### Infraestrutura
- Docker + Traefik

## Controles da Apresentação

### Navegação Básica
- `←` / `→` - Navegar entre slides
- `Space` - Próximo slide
- `1-9` - Ir diretamente ao slide
- `F` - Modo tela cheia

### Recursos Avançados (apenas modo padrão)
- `T` - Toggle timer de apresentação
- `N` - Toggle notas do apresentador
- `P` - Alternar perfis de apresentação
- `Menu` (canto superior esquerdo) - Navegação por slides

## Rotas do Sistema

### Frontend
- `/` - Apresentação padrão (funcionamento original)
- `/login` - Login do time comercial
- `/admin` - Painel administrativo (protegido)
- `/apresentacao/:id` - Acesso do cliente
- `/apresentacao/:id/view` - Apresentação customizada

### Backend API
- `POST /api/auth/login` - Login vendedor
- `POST /api/presentations` - Criar apresentação (requer auth)
- `GET /api/presentations/:id` - Buscar apresentação
- `POST /api/client/validate` - Validar palavra do cliente

## Instalação Local

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+ (ou Docker)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variáveis no .env
npm run migrate
npm run dev
```

### Frontend
```bash
npm install
cp .env.example .env
# Configurar VITE_API_URL no .env
npm run dev
```

Acesse: http://localhost:5173

## Deploy em Produção

Consulte **[DEPLOY.md](./DEPLOY.md)** para instruções completas de deploy com Docker, Traefik e PostgreSQL.

## Credenciais Padrão

**Vendedor:**
- Usuário: `comercial`
- Senha: `celplan2025`

**Cliente:**
- Palavra: `celplan`

IMPORTANTE: Altere em produção!

## Fluxo de Uso

### Vendedor:
1. Acessa `/login`
2. Faz login
3. Vai para `/admin`
4. Preenche dados e seleciona slides
5. Gera URL única
6. Compartilha com cliente

### Cliente:
1. Acessa URL recebida
2. Digita palavra de segurança
3. Visualiza apresentação customizada
4. Vê dados do vendedor na última página

## Estrutura do Projeto

```
celplan-presentation/
├── backend/              # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── routes/      # Auth, Presentations, Client
│   │   ├── db/          # PostgreSQL & migrations
│   │   ├── middleware/  # JWT auth
│   │   └── index.ts
│   └── Dockerfile
│
├── src/                  # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── slides/      # Componentes de slides
│   │   └── PresentationApp.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── ClientAccessPage.tsx
│   │   └── PresentationView.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── api.ts
│   └── App.tsx          # React Router
│
├── DEPLOY.md            # Guia de deploy
└── README.md            # Este arquivo
```

## Slides Disponíveis

1. **Introdução** - Logo animado + estatísticas
2. **Sobre a CelPlan** - História, certificações, presença global
3. **Mercados** - Áreas de atuação
4. **Projetos** - Portfolio de projetos
5. **Cases de Sucesso:**
   - CelPlanner™ - Planejamento RF
   - CelPhone™ - Medição QoE
   - CellWireless - ANATEL
   - Sistema Multiagentes
   - Plataforma RAG
   - Sistema VISÃO
   - Tracking/ReID
   - GeoInsight (Rumo)
   - Serbom pLTE
6. **MOE** - Mão de Obra Especializada
7. **Metodologia** - Processo de trabalho
8. **Contato** - Informações de contato (personalizável)

## Banco de Dados

### `users`
Credenciais dos vendedores com bcrypt

### `presentations`
Apresentações customizadas:
- ID único (12 caracteres)
- Dados do vendedor
- Slides selecionados (JSONB)
- Data de criação

## Desenvolvimento

### Build
```bash
npm run build
```

### Preview Produção
```bash
npm run preview
```

### Linter
```bash
npm run lint
```

## Segurança

- JWT com expiração 24h
- Bcrypt (salt 10) para senhas
- Validação de palavra de segurança
- Rotas protegidas
- CORS configurado
- HTTPS via Traefik

## Suporte

Para problemas:

1. Consulte [DEPLOY.md](./DEPLOY.md)
2. Logs: `docker logs apresentacao-api`
3. Health check: `curl https://apresentacao-api.celintelligence.com/health`

---

**CelPlan International** - Transformando Dados em Inteligência desde 1992
