/**
 * Script para configurar banco de dados PostgreSQL local
 * Use este script quando já tiver um PostgreSQL instalado localmente
 */

const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log('🔧 Configuração do Banco de Dados Local\n');
  console.log('Este script configurará o banco para o backend CelPlan\n');

  // Perguntar pela senha do postgres
  const postgresPassword = await question('Digite a senha do usuário "postgres" (deixe vazio se não tiver senha): ');

  // Tentar conectar como postgres
  const adminClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: postgresPassword || undefined,
    database: 'postgres'
  });

  try {
    console.log('\n🔄 Conectando ao PostgreSQL...');
    await adminClient.connect();
    console.log('✅ Conectado com sucesso!\n');

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
    console.log('✅ Permissões configuradas!');

    await adminClient.end();

    // Conectar ao banco celplan_db para dar permissões no schema public
    console.log('\n🔄 Configurando permissões no schema...');
    const celplanClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: postgresPassword || undefined,
      database: 'celplan_db'
    });

    await celplanClient.connect();
    await celplanClient.query('GRANT ALL ON SCHEMA public TO celplan');
    await celplanClient.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO celplan');
    await celplanClient.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO celplan');
    await celplanClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO celplan');
    await celplanClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO celplan');
    await celplanClient.end();

    console.log('✅ Permissões no schema configuradas!');

    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║   ✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!     ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
    console.log('Credenciais configuradas:');
    console.log('  Banco: celplan_db');
    console.log('  Usuário: celplan');
    console.log('  Senha: celplan2024');
    console.log('  Host: localhost');
    console.log('  Porta: 5432\n');
    console.log('Agora você pode iniciar o backend com: npm start\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error('\nPossíveis soluções:');
    console.error('1. Verifique se o PostgreSQL está rodando');
    console.error('2. Verifique se a senha do usuário postgres está correta');
    console.error('3. Tente executar como administrador');
  } finally {
    rl.close();
  }
}

setupDatabase();