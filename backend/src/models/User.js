const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Nome de usuário para login'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      },
      comment: 'Email do usuário'
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Hash bcrypt da senha'
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nome completo do usuário'
    },
    role: {
      type: DataTypes.ENUM('admin', 'vendor'),
      defaultValue: 'vendor',
      allowNull: false,
      comment: 'Papel do usuário: admin (acesso total) ou vendor (apresentações próprias)'
    },
    vendor_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      comment: 'ID único do vendedor para associar às apresentações'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Se o usuário está ativo'
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data do último login'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Dados adicionais (telefone, cargo, etc)'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['username'], unique: true },
      { fields: ['email'], unique: true },
      { fields: ['vendor_id'], unique: true },
      { fields: ['role'] },
      { fields: ['is_active'] }
    ]
  });

  // Métodos de instância
  User.prototype.toSafeObject = function() {
    const { password_hash, ...safeUser } = this.toJSON();
    return safeUser;
  };

  return User;
};
