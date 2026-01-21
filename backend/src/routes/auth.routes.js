const router = require('express').Router();
const { validateCredentials, generateToken, initAuth } = require('../config/auth');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Inicializar autenticação quando o módulo carregar
initAuth().catch(console.error);

/**
 * POST /api/auth/login
 * Login do usuário admin
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos
    if (!username || !password) {
      return res.status(400).json({
        error: {
          message: 'Username e password são obrigatórios',
          status: 400
        }
      });
    }

    // Validar credenciais
    const result = await validateCredentials(username, password);

    if (!result.valid) {
      return res.status(401).json({
        error: {
          message: result.message,
          status: 401
        }
      });
    }

    // Gerar token
    const token = generateToken(result.user);

    // Retornar sucesso
    res.json({
      success: true,
      token,
      user: result.user,
      expiresIn: '24h'
    });

    console.log(`✅ Login bem-sucedido: ${username}`);
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno no servidor',
        status: 500
      }
    });
  }
});

/**
 * POST /api/auth/verify
 * Verificar se o token é válido
 */
router.post('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    valid: true,
    user: req.user
  });
});

/**
 * POST /api/auth/refresh
 * Renovar token (gera novo token)
 */
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    // Gerar novo token com os mesmos dados
    const newToken = generateToken({
      username: req.user.username,
      role: req.user.role
    });

    res.json({
      success: true,
      token: newToken,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('❌ Erro ao renovar token:', error);
    res.status(500).json({
      error: {
        message: 'Erro ao renovar token',
        status: 500
      }
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout (apenas para registro, token continua válido até expirar)
 */
router.post('/logout', authenticateToken, (req, res) => {
  // Em uma aplicação real, você poderia adicionar o token a uma blacklist
  console.log(`👋 Logout: ${req.user.username}`);

  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

/**
 * GET /api/auth/me
 * Obter informações do usuário atual
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;