import { Router, Request, Response } from 'express';
import { ClientValidationRequest } from '../types';

const router = Router();

// Palavra de segurança fixa (pode ser configurada via env)
const CLIENT_PASSWORD = process.env.CLIENT_PASSWORD || 'celplan';

// POST /api/client/validate - Validar palavra de segurança
router.post('/validate', async (req: Request<{}, {}, ClientValidationRequest>, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ error: 'Palavra de segurança não fornecida' });
      return;
    }

    // Comparação case-insensitive
    const isValid = password.toLowerCase() === CLIENT_PASSWORD.toLowerCase();

    if (!isValid) {
      res.status(401).json({
        error: 'Palavra de segurança incorreta',
        valid: false
      });
      return;
    }

    res.json({
      valid: true,
      message: 'Acesso autorizado'
    });
  } catch (error) {
    console.error('Erro na validação do cliente:', error);
    res.status(500).json({ error: 'Erro ao validar acesso' });
  }
});

export default router;
