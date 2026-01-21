const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Media = sequelize.define('media', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Nome único do arquivo no storage'
  },
  original_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Nome original do arquivo'
  },
  storage_path: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Caminho no MinIO/storage'
  },
  public_url: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    comment: 'URL pública para acesso'
  },
  thumbnail_url: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    comment: 'URL da thumbnail se for imagem'
  },
  mime_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  size_bytes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Largura se for imagem'
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Altura se for imagem'
  },
  uploaded_by: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Tipo da entidade: case, slide, presentation, etc'
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID da entidade relacionada'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Metadados adicionais'
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'media',
  indexes: [
    {
      fields: ['entity_type', 'entity_id']
    },
    {
      fields: ['uploaded_by']
    },
    {
      fields: ['mime_type']
    }
  ]
});

module.exports = Media;