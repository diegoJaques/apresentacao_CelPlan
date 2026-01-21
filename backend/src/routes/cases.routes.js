const router = require('express').Router();
const { authenticateToken, isAdmin } = require('../middlewares/auth.middleware');
const { Case, Media, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/cases
 * Lista todos os cases disponíveis
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      segment,
      is_active,
      limit = 50,
      offset = 0,
      search
    } = req.query;

    const where = {};

    // Filtros
    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    if (segment) {
      where.segment = segment;
    }

    if (search) {
      where[Op.or] = [
        { client: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: cases } = await Case.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['order_index', 'ASC'],
        ['year', 'DESC'],
        ['created_at', 'DESC']
      ]
    });

    res.json({
      success: true,
      cases,
      total: count,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        totalPages: Math.ceil(count / limit),
        currentPage: Math.floor(offset / limit) + 1
      }
    });
  } catch (error) {
    console.error('Erro ao buscar cases:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cases',
      error: error.message
    });
  }
});

/**
 * GET /api/cases/:id
 * Busca um case específico
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const caseItem = await Case.findByPk(id);

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case não encontrado'
      });
    }

    // Buscar mídia associada
    const media = await Media.findAll({
      where: {
        entity_type: 'case',
        entity_id: id
      }
    });

    res.json({
      success: true,
      case: {
        ...caseItem.toJSON(),
        media
      }
    });
  } catch (error) {
    console.error('Erro ao buscar case:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar case',
      error: error.message
    });
  }
});

/**
 * POST /api/cases
 * Cria novo case
 */
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      client,
      segment,
      title,
      description,
      results = [],
      technologies = [],
      image_url,
      logo_url,
      year,
      is_active = true,
      metrics = {},
      tags = []
    } = req.body;

    // Validações
    if (!client || !segment || !title) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cliente, segmento e título são obrigatórios'
      });
    }

    // Determinar próximo order_index
    const maxOrder = await Case.max('order_index');
    const order_index = (maxOrder || 0) + 1;

    // Criar case
    const caseItem = await Case.create({
      client,
      segment,
      title,
      description,
      results,
      technologies,
      image_url,
      logo_url,
      year: year || new Date().getFullYear(),
      is_active,
      order_index,
      metrics,
      tags
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      case: caseItem
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar case:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar case',
      error: error.message
    });
  }
});

/**
 * PUT /api/cases/:id
 * Atualiza um case
 */
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client,
      segment,
      title,
      description,
      results,
      technologies,
      image_url,
      logo_url,
      year,
      is_active,
      order_index,
      metrics,
      tags
    } = req.body;

    const caseItem = await Case.findByPk(id);

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case não encontrado'
      });
    }

    await caseItem.update({
      client,
      segment,
      title,
      description,
      results,
      technologies,
      image_url,
      logo_url,
      year,
      is_active,
      order_index,
      metrics,
      tags
    });

    res.json({
      success: true,
      case: caseItem
    });
  } catch (error) {
    console.error('Erro ao atualizar case:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar case',
      error: error.message
    });
  }
});

/**
 * DELETE /api/cases/:id
 * Deleta um case
 */
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const caseItem = await Case.findByPk(id);

    if (!caseItem) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Case não encontrado'
      });
    }

    // Deletar mídia associada
    const media = await Media.findAll({
      where: {
        entity_type: 'case',
        entity_id: id
      }
    });

    for (const item of media) {
      await item.destroy({ transaction });
    }

    // Deletar case
    await caseItem.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Case deletado com sucesso'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao deletar case:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar case',
      error: error.message
    });
  }
});

/**
 * PUT /api/cases/reorder
 * Reordena múltiplos cases
 */
router.put('/reorder', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { cases } = req.body; // Array de { id, order_index }

    if (!Array.isArray(cases)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Formato inválido. Esperado um array de cases'
      });
    }

    // Atualizar order_index de cada case
    for (const item of cases) {
      await Case.update(
        { order_index: item.order_index },
        {
          where: { id: item.id },
          transaction
        }
      );
    }

    await transaction.commit();

    // Buscar cases atualizados
    const updatedCases = await Case.findAll({
      order: [['order_index', 'ASC']]
    });

    res.json({
      success: true,
      cases: updatedCases
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao reordenar cases:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao reordenar cases',
      error: error.message
    });
  }
});

/**
 * GET /api/cases/segments
 * Lista todos os segmentos disponíveis
 */
router.get('/segments/list', authenticateToken, async (req, res) => {
  try {
    const segments = await Case.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('segment')), 'segment'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['segment'],
      raw: true
    });

    res.json({
      success: true,
      segments: segments.map(s => ({
        name: s.segment,
        count: parseInt(s.count)
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar segmentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar segmentos',
      error: error.message
    });
  }
});

module.exports = router;