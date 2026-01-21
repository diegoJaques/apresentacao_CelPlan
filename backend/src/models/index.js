const { sequelize } = require('../config/database');
const User = require('./User')(sequelize);
const Presentation = require('./Presentation');
const Slide = require('./Slide');
const Case = require('./Case');
const Media = require('./Media');
const InlineEdit = require('./InlineEdit');

// Associações
// Nota: Associação User <-> Presentation comentada temporariamente
// até criar a tabela users no banco

// Presentation -> Slides (1:N)
Presentation.hasMany(Slide, {
  foreignKey: 'presentation_id',
  as: 'slides',
  onDelete: 'CASCADE'
});

Slide.belongsTo(Presentation, {
  foreignKey: 'presentation_id',
  as: 'presentation'
});

// Presentation -> InlineEdits (1:N)
Presentation.hasMany(InlineEdit, {
  foreignKey: 'presentation_id',
  as: 'edits',
  onDelete: 'CASCADE'
});

InlineEdit.belongsTo(Presentation, {
  foreignKey: 'presentation_id',
  as: 'presentation'
});

// Presentation <-> Cases (N:N) - Cases selecionados para cada apresentação
const PresentationCases = sequelize.define('presentation_cases', {
  presentation_id: {
    type: sequelize.Sequelize.UUID,
    references: {
      model: Presentation,
      key: 'id'
    }
  },
  case_id: {
    type: sequelize.Sequelize.UUID,
    references: {
      model: Case,
      key: 'id'
    }
  },
  order_index: {
    type: sequelize.Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'presentation_cases'
});

Presentation.belongsToMany(Case, {
  through: PresentationCases,
  foreignKey: 'presentation_id',
  otherKey: 'case_id',
  as: 'cases'
});

Case.belongsToMany(Presentation, {
  through: PresentationCases,
  foreignKey: 'case_id',
  otherKey: 'presentation_id',
  as: 'presentations'
});

// Media pode estar relacionada a qualquer entidade (polimórfica)
// Não criamos associações diretas, usamos entity_type e entity_id

// Método auxiliar para associar mídia a uma entidade
Media.prototype.associateWith = async function(entity_type, entity_id) {
  this.entity_type = entity_type;
  this.entity_id = entity_id;
  return await this.save();
};

// Métodos auxiliares para buscar mídia de uma entidade
Media.findByEntity = async function(entity_type, entity_id) {
  return await Media.findAll({
    where: {
      entity_type,
      entity_id
    },
    order: [['created_at', 'DESC']]
  });
};

// Sincronização do banco
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Banco de dados sincronizado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    throw error;
  }
};

// Seed de dados iniciais
const seedDatabase = async () => {
  try {
    const bcrypt = require('bcrypt');

    // Verificar se já existem dados
    const userCount = await User.count();
    const presentationCount = await Presentation.count();

    // Criar usuários se não existirem
    if (userCount === 0) {
      console.log('🌱 Inserindo usuários iniciais...');

      // Admin
      await User.create({
        username: 'admin',
        email: 'admin@celplan.com',
        password_hash: await bcrypt.hash('celplan2024', 10),
        full_name: 'Administrador CelPlan',
        role: 'admin',
        vendor_id: 'admin',
        is_active: true
      });

      // Vendedor 1
      await User.create({
        username: 'joao.silva',
        email: 'joao.silva@celplan.com',
        password_hash: await bcrypt.hash('vendor123', 10),
        full_name: 'João Silva',
        role: 'vendor',
        vendor_id: 'vendor-001',
        is_active: true,
        metadata: {
          phone: '+55 11 98765-4321',
          position: 'Gerente de Contas'
        }
      });

      // Vendedor 2
      await User.create({
        username: 'maria.santos',
        email: 'maria.santos@celplan.com',
        password_hash: await bcrypt.hash('vendor123', 10),
        full_name: 'Maria Santos',
        role: 'vendor',
        vendor_id: 'vendor-002',
        is_active: true,
        metadata: {
          phone: '+55 21 98765-1234',
          position: 'Executiva de Vendas'
        }
      });

      console.log('✅ Usuários criados com sucesso');
    }

    if (presentationCount === 0) {
      console.log('🌱 Inserindo dados iniciais...');

      // Criar apresentação template
      const template = await Presentation.create({
        vendor_id: 'template',
        title: 'CelPlan - Apresentação Template',
        description: 'Template base para apresentações CelPlan',
        is_template: true
      });

      // Criar slides padrão
      const defaultSlides = [
        { name: 'Capa', template: 'cover', order_index: 0 },
        { name: 'Quem Somos', template: 'grid', order_index: 1 },
        { name: 'Capital Intelectual', template: 'grid', order_index: 2 },
        { name: 'Desafios', template: 'grid', order_index: 3 },
        { name: 'Proposta de Valor', template: 'grid', order_index: 4 },
        { name: '7 Pilares', template: 'pillars', order_index: 5 },
        { name: 'Conectividade', template: 'content', order_index: 6 },
        { name: 'IA e Dados', template: 'content', order_index: 7 },
        { name: 'IoT Low Power', template: 'content', order_index: 8 },
        { name: 'Video Analytics', template: 'content', order_index: 9 },
        { name: 'Serviços', template: 'services', order_index: 10 },
        { name: 'Cases de Sucesso', template: 'cases', order_index: 11 },
        { name: 'Contato', template: 'contact', order_index: 12 }
      ];

      for (const slideData of defaultSlides) {
        await Slide.create({
          ...slideData,
          presentation_id: template.id,
          content: {
            title: slideData.name,
            subtitle: `Subtítulo do ${slideData.name}`,
            description: `Descrição do slide ${slideData.name}`
          }
        });
      }

      // Criar cases de exemplo
      const sampleCases = [
        {
          client: 'Vivo',
          segment: 'Telecom',
          title: 'Otimização de Rede 5G',
          description: 'Implementação completa de planejamento e otimização de rede 5G em São Paulo',
          results: ['40% de melhoria em cobertura', 'Redução de 25% em interferências', 'ROI em 8 meses'],
          technologies: ['5G NR', 'AI/ML', 'Cloud RAN'],
          year: 2024
        },
        {
          client: 'TIM Brasil',
          segment: 'Telecom',
          title: 'Expansão Rural 4G',
          description: 'Projeto de expansão de cobertura 4G em áreas rurais',
          results: ['500+ sites planejados', '95% de acurácia de predição', '30% redução de custos'],
          technologies: ['LTE', 'Propagação', 'Drive Test'],
          year: 2023
        },
        {
          client: 'Petrobras',
          segment: 'Energia',
          title: 'Conectividade Offshore',
          description: 'Solução de conectividade para plataformas de petróleo',
          results: ['100% uptime garantido', 'Latência < 20ms', 'Backup satelital integrado'],
          technologies: ['Microondas', 'Satélite', 'LTE Privado'],
          year: 2023
        }
      ];

      for (const caseData of sampleCases) {
        await Case.create(caseData);
      }

      console.log('✅ Dados iniciais inseridos com sucesso');
    }
  } catch (error) {
    console.error('❌ Erro ao inserir dados iniciais:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Presentation,
  Slide,
  Case,
  Media,
  InlineEdit,
  PresentationCases,
  syncDatabase,
  seedDatabase
};