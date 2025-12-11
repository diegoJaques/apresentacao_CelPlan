import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/connection';
import { generateToken } from '../middleware/auth';
import { LoginRequest, LoginResponse, User } from '../types';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
      res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
      return;
    }

    // Buscar usuário no banco
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const user = result.rows[0];

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    // Gerar token JWT
    const token = generateToken(user.id, user.username);

    // Retornar resposta
    const response: LoginResponse = {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/auth/verify (verificar se token é válido)
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    // O middleware authMiddleware já faz essa validação,
    // mas aqui é um endpoint simples para o frontend verificar
    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

export default router;
