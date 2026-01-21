const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Configurações JWT
const JWT_SECRET = process.env.JWT_SECRET || 'celplan-jwt-secret-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Inicializar autenticação (agora apenas log, sem credenciais hardcoded)
const initAuth = async () => {
  try {
    console.log('✅ Sistema de autenticação inicializado');
    console.log('📊 Autenticação usando banco de dados (tabela users)');
  } catch (error) {
    console.error('❌ Erro ao inicializar autenticação:', error);
    throw error;
  }
};

// Gerar token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Verificar token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
};

// Validar credenciais (agora consulta banco de dados)
const validateCredentials = async (username, password) => {
  try {
    // Buscar usuário no banco
    const user = await User.findOne({
      where: { username, is_active: true }
    });

    // Usuário não encontrado
    if (!user) {
      return {
        valid: false,
        message: 'Usuário ou senha inválidos'
      };
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return {
        valid: false,
        message: 'Usuário ou senha inválidos'
      };
    }

    // Atualizar último login
    await user.update({ last_login_at: new Date() });

    // Retornar dados do usuário
    return {
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        vendor_id: user.vendor_id,
        metadata: user.metadata
      }
    };
  } catch (error) {
    console.error('❌ Erro ao validar credenciais:', error);
    return {
      valid: false,
      message: 'Erro ao validar credenciais'
    };
  }
};

// Middleware de autenticação
const authenticate = async (req, res, next) => {
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'Token não fornecido',
          status: 401
        }
      });
    }

    // Extrair token (formato: "Bearer TOKEN")
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: {
          message: 'Formato de token inválido',
          status: 401
        }
      });
    }

    const token = parts[1];

    // Verificar token
    const decoded = verifyToken(token);

    // Adicionar usuário ao request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: error.message || 'Token inválido',
        status: 401
      }
    });
  }
};

// Middleware opcional - não bloqueia se não houver token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(' ');

      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        const decoded = verifyToken(token);
        req.user = decoded;
      }
    }
  } catch (error) {
    // Ignora erros de token inválido
    console.log('Token inválido ignorado:', error.message);
  }

  next();
};

module.exports = {
  initAuth,
  generateToken,
  verifyToken,
  validateCredentials,
  authenticate,
  optionalAuth
};