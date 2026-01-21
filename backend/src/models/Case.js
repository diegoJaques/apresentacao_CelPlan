const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Case = sequelize.define('cases', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  client: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  segment: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Segmento: Telecom, Energia, Governo, etc'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  results: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
    comment: 'Array de resultados alcançados'
  },
  technologies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Array de tecnologias utilizadas'
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: new Date().getFullYear()
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metrics: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Métricas e KPIs do case'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Tags para busca e filtragem'
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'cases',
  indexes: [
    {
      fields: ['segment']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['year']
    },
    {
      fields: ['order_index']
    }
  ]
});

module.exports = Case;