const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InlineEdit = sequelize.define('inline_edits', {
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
  element_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'ID do elemento editável na interface'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Conteúdo editado'
  },
  element_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'text',
    comment: 'Tipo: text, image, color, etc'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Dados adicionais da edição'
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'inline_edits',
  indexes: [
    {
      unique: true,
      fields: ['presentation_id', 'element_id']
    },
    {
      fields: ['element_type']
    }
  ]
});

module.exports = InlineEdit;