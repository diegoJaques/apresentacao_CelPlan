const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'celplan-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Middleware para verificar se é admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Permissão de administrador necessária'
    });
  }
  next();
};

/**
 * Middleware para verificar se é o próprio vendor ou admin
 */
const isVendorOrAdmin = (vendorId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    if (req.user.role === 'admin' || req.user.vendor_id === vendorId) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para acessar este recurso'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  isAdmin,
  isVendorOrAdmin
};