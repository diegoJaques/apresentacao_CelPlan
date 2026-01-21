require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar configurações
const { testConnection, sequelize } = require('./config/database');
const { initMinio } = require('./config/minio');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const presentationsRoutes = require('./routes/presentations.routes');
const casesRoutes = require('./routes/cases.routes');
const mediaRoutes = require('./routes/media.routes');

const app = express();

// Middlewares
// CORS configurado para aceitar qualquer porta localhost em desenvolvimento
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);

    // Em produção, verificar FRONTEND_URL
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [process.env.FRONTEND_URL];
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Em desenvolvimento, permitir qualquer localhost
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/presentations', presentationsRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/media', mediaRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      database: 'PostgreSQL',
      storage: 'MinIO',
      auth: 'JWT'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
      path: req.originalUrl
    }
  });
});

// Função de inicialização
const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor CelPlan Backend...\n');

    // Testar conexão com PostgreSQL
    console.log('🔄 Conectando ao PostgreSQL...');
    await testConnection();

    // Sincronizar modelos do banco
    console.log('🔄 Sincronizando modelos do banco...');
    await sequelize.sync({ alter: false }); // Desabilitado alter para evitar erros de migração
    console.log('✅ Modelos sincronizados\n');

    // Inicializar MinIO
    console.log('🔄 Configurando MinIO...');
    await initMinio();
    console.log('✅ MinIO configurado\n');

    // Iniciar servidor
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log('╔═══════════════════════════════════════════════╗');
      console.log('║       CelPlan Backend - Servidor Ativo        ║');
      console.log('╠═══════════════════════════════════════════════╣');
      console.log(`║ 🌐 API:        http://localhost:${PORT}          ║`);
      console.log(`║ 📦 MinIO:      http://localhost:9001          ║`);
      console.log(`║ 🗄️  PostgreSQL: localhost:5432                 ║`);
      console.log(`║ 📊 pgAdmin:    http://localhost:5050          ║`);
      console.log('╚═══════════════════════════════════════════════╝');
      console.log('\n📝 Use Ctrl+C para parar o servidor');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Se for executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = app;