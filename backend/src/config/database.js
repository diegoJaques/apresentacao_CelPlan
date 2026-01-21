const { Sequelize } = require('sequelize');

// Criar instância do Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'celplan_db',
  username: process.env.DB_USER || 'celplan',
  password: process.env.DB_PASSWORD || 'celplan2024',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    // PostgreSQL client encoding
    client_encoding: 'UTF8'
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection
};