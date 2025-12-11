import pool from './connection';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🔄 Iniciando migração do banco de dados...');

    // Ler o arquivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Executar o schema (criar tabelas)
    await client.query(schemaSql);
    console.log('✅ Tabelas criadas com sucesso!');

    // Gerar hash da senha padrão
    const passwordHash = await bcrypt.hash('celplan2025', 10);

    // Inserir usuário padrão (se não existir)
    await client.query(`
      INSERT INTO users (username, password_hash, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO NOTHING
    `, ['comercial', passwordHash, 'Time Comercial']);

    console.log('✅ Usuário padrão criado: comercial / celplan2025');
    console.log('🎉 Migração concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default migrate;
