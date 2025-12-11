import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import pool from '../db/connection';
import { authMiddleware } from '../middleware/auth';
import { CreatePresentationRequest, Presentation, AuthRequest } from '../types';

const router = Router();

// POST /api/presentations - Criar nova apresentação (protegida)
router.post(
  '/',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { vendorInfo, selectedSlides }: CreatePresentationRequest = req.body;

      // Validação
      if (!vendorInfo || !vendorInfo.name || !vendorInfo.email) {
        res.status(400).json({ error: 'Dados do vendedor incompletos' });
        return;
      }

      if (!selectedSlides || selectedSlides.length === 0) {
        res.status(400).json({ error: 'Selecione pelo menos um slide' });
        return;
      }

      // Gerar ID único (12 caracteres)
      const presentationId = nanoid(12);

      // Inserir no banco
      const result = await pool.query<Presentation>(
        `INSERT INTO presentations
         (id, vendor_name, vendor_email, vendor_phone, vendor_whatsapp, selected_slides)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          presentationId,
          vendorInfo.name,
          vendorInfo.email,
          vendorInfo.phone || '',
          vendorInfo.whatsapp || '',
          JSON.stringify(selectedSlides),
        ]
      );

      const presentation = result.rows[0];

      res.status(201).json({
        id: presentation.id,
        url: `${process.env.FRONTEND_URL || 'https://apresentacao.celintelligence.com'}/apresentacao/${presentation.id}`,
        createdAt: presentation.created_at,
      });
    } catch (error) {
      console.error('Erro ao criar apresentação:', error);
      res.status(500).json({ error: 'Erro ao criar apresentação' });
    }
  }
);

// GET /api/presentations/:id - Buscar apresentação por ID (pública)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validar formato do ID (12 caracteres alfanuméricos)
    if (!id || id.length !== 12) {
      res.status(400).json({ error: 'ID de apresentação inválido' });
      return;
    }

    // Buscar no banco
    const result = await pool.query<Presentation>(
      'SELECT * FROM presentations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Apresentação não encontrada' });
      return;
    }

    const presentation = result.rows[0];

    // Retornar dados da apresentação
    res.json({
      id: presentation.id,
      vendorInfo: {
        name: presentation.vendor_name,
        email: presentation.vendor_email,
        phone: presentation.vendor_phone,
        whatsapp: presentation.vendor_whatsapp,
      },
      selectedSlides: presentation.selected_slides,
      createdAt: presentation.created_at,
    });
  } catch (error) {
    console.error('Erro ao buscar apresentação:', error);
    res.status(500).json({ error: 'Erro ao buscar apresentação' });
  }
});

// GET /api/presentations - Listar todas apresentações (protegida)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query<Presentation>(
      'SELECT * FROM presentations ORDER BY created_at DESC LIMIT 50'
    );

    const presentations = result.rows.map(p => ({
      id: p.id,
      vendorName: p.vendor_name,
      vendorEmail: p.vendor_email,
      createdAt: p.created_at,
      slidesCount: (p.selected_slides as any).length,
    }));

    res.json(presentations);
  } catch (error) {
    console.error('Erro ao listar apresentações:', error);
    res.status(500).json({ error: 'Erro ao listar apresentações' });
  }
});

export default router;
