import { Pool } from 'pg';

// DEBUG: Log das variáveis de ambiente
console.log('🔍 DEBUG - Variáveis de conexão:');
console.log('  DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('  DB_PORT:', process.env.DB_PORT || '5432');
console.log('  DB_NAME:', process.env.DB_NAME || 'apresentacoes');
console.log('  DB_USER:', process.env.DB_USER || 'postgres');
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET (usando default)');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'apresentacoes',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro no pool do PostgreSQL:', err);
  process.exit(-1);
});

export default pool;
