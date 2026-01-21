const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Presentation = sequelize.define('presentations', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vendor_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Identificador do vendedor'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_template: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Se é um template base'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
    comment: 'Status da apresentação: draft (rascunho), published (publicada), archived (arquivada)'
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data de publicação (null = não publicada)'
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    comment: 'URL amigável (opcional): /v3/vendedor-joao-2024'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Metadados adicionais'
  },
  theme: {
    type: DataTypes.JSONB,
    defaultValue: {
      primaryColor: '#7c3aed',
      secondaryColor: '#3b82f6',
      accentColor: '#f97316',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      autoPlay: false,
      autoPlayInterval: 5000,
      enableKeyboardNav: true,
      enableSwipeNav: true,
      showNavigation: true,
      showProgress: true
    }
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'presentations',
  indexes: [
    {
      fields: ['vendor_id']
    },
    {
      fields: ['is_template']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['status']
    },
    {
      fields: ['slug'],
      unique: true
    },
    {
      fields: ['published_at']
    }
  ]
});

module.exports = Presentation;