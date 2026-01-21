const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Slide = sequelize.define('slides', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  presentation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'presentations',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  template: {
    type: DataTypes.STRING(50),
    defaultValue: 'default',
    comment: 'Template do slide: default, cover, grid, contact, cases, etc'
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Conteúdo flexível do slide em JSON'
  },
  animations: {
    type: DataTypes.JSONB,
    defaultValue: {
      entry: 'fadeIn',
      exit: 'fadeOut',
      duration: 500
    }
  },
  custom_css: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'CSS customizado para o slide'
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'slides',
  indexes: [
    {
      fields: ['presentation_id', 'order_index']
    },
    {
      fields: ['is_visible']
    },
    {
      fields: ['template']
    }
  ]
});

module.exports = Slide;