/**
 * Script automático para configurar banco de dados PostgreSQL local
 * Tenta senhas comuns automaticamente
 */

const { Client } = require('pg');

const commonPasswords = [
  '',           // Sem senha
  'postgres',   // Senha padrão
  'admin',      // Comum
  '123456',     // Comum
  'password',   // Comum
];

async function tryConnection(password) {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: password || undefined,
    database: 'postgres'
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    return null;
  }
}

async function setupDatabase() {
  console.log('🔧 Configuração Automática do Banco de Dados\n');

  let adminClient = null;
  let workingPassword = null;

  // Tentar senhas comuns
  console.log('🔍 Tentando conectar ao PostgreSQL...');
  for (const password of commonPasswords) {
    const passwordDisplay = password || '(sem senha)';
    process.stdout.write(`   Tentando com: ${passwordDisplay}... `);

    adminClient = await tryConnection(password);
    if (adminClient) {
      console.log('✅ Conectado!');
      workingPassword = password;
      break;
    } else {
      console.log('❌');
    }
  }

  if (!adminClient) {
    console.log('\n❌ Não foi possível conectar com senhas comuns.\n');
    console.log('Por favor, execute manualmente:');
    console.log('  node setup-local-db.js\n');
    console.log('Ou configure o banco manualmente seguindo: INSTRUCOES-SETUP-BANCO.md\n');
    process.exit(1);
  }

  try {
    console.log('\n✅ Conexão estabelecida com sucesso!\n');

    // Verificar se o usuário celplan existe
    console.log('🔍 Verificando usuário "celplan"...');
    const userCheck = await adminClient.query(
      "SELECT 1 FROM pg_roles WHERE rolname='celplan'"
    );

    if (userCheck.rows.length === 0) {
      console.log('➕ Criando usuário "celplan"...');
      await adminClient.query(
        "CREATE USER celplan WITH PASSWORD 'celplan2024'"
      );
      console.log('✅ Usuário "celplan" criado!');
    } else {
      console.log('ℹ️  Usuário "celplan" já existe');
      console.log('🔄 Atualizando senha...');
      await adminClient.query(
        "ALTER USER celplan WITH PASSWORD 'celplan2024'"
      );
      console.log('✅ Senha atualizada!');
    }

    // Verificar se o banco celplan_db existe
    console.log('\n🔍 Verificando banco de dados "celplan_db"...');
    const dbCheck = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname='celplan_db'"
    );

    if (dbCheck.rows.length === 0) {
      console.log('➕ Criando banco "celplan_db"...');
      await adminClient.query('CREATE DATABASE celplan_db');
      console.log('✅ Banco "celplan_db" criado!');
    } else {
      console.log('ℹ️  Banco "celplan_db" já existe');
    }

    // Dar permissões ao usuário celplan
    console.log('\n🔐 Configurando permissões...');
    await adminClient.query('GRANT ALL PRIVILEGES ON DATABASE celplan_db TO celplan');
    console.log('✅ Permissões básicas configuradas!');

    await adminClient.end();

    // Conectar ao banco celplan_db para dar permissões no schema public
    console.log('\n🔄 Configurando permissões avançadas...');
    const celplanClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: workingPassword || undefined,
      database: 'celplan_db'
    });

    await celplanClient.connect();

    try {
      await celplanClient.query('GRANT ALL ON SCHEMA public TO celplan');
      await celplanClient.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO celplan');
      await celplanClient.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO celplan');
      await celplanClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO celplan');
      await celplanClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO celplan');
      console.log('✅ Permissões avançadas configuradas!');
    } catch (err) {
      console.log('⚠️  Algumas permissões podem já estar configuradas');
    }

    await celplanClient.end();

    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║   ✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!     ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
    console.log('Configuração do Banco:');
    console.log('  Host: localhost');
    console.log('  Porta: 5432');
    console.log('  Banco: celplan_db');
    console.log('  Usuário: celplan');
    console.log('  Senha: celplan2024\n');
    console.log('✅ Agora você pode iniciar o backend!\n');

  } catch (error) {
    console.error('\n❌ Erro durante configuração:', error.message);
    console.error('\nTente executar manualmente:');
    console.error('  node setup-local-db.js\n');
  }
}

setupDatabase();