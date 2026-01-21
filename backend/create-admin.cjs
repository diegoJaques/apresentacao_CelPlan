const { User } = require('./src/models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Verificar se admin já existe
    const existing = await User.findOne({ where: { username: 'admin' } });

    if (existing) {
      console.log('⚠️ Usuário admin já existe!');
      console.log('Deletando usuário antigo...');
      await existing.destroy();
    }

    // Criar hash da senha
    const password = 'ceplan2024';
    const password_hash = await bcrypt.hash(password, 10);

    // Criar usuário admin
    const admin = await User.create({
      username: 'admin',
      email: 'admin@celplan.com',
      password_hash,
      full_name: 'Administrador CelPlan',
      role: 'admin',
      vendor_id: 'celplan-admin',
      is_active: true,
      metadata: {
        created_by: 'setup-script',
        created_at: new Date().toISOString()
      }
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log({
      username: admin.username,
      email: admin.email,
      role: admin.role,
      vendor_id: admin.vendor_id
    });
    console.log('\n🔑 Credenciais:');
    console.log('   Username: admin');
    console.log('   Password: ceplan2024');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createAdmin();
