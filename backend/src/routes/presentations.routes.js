const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, isAdmin } = require('../middlewares/auth.middleware');
const { Presentation, Slide, Case, InlineEdit, PresentationCases, sequelize } = require('../models');
const storageService = require('../services/storage.service');

/**
 * GET /api/presentations
 * Lista todas as apresentações de um vendor
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { vendor_id, role } = req.user;

    // Debug: Log user info
    console.log('📊 User info:', { username: req.user.username, role, vendor_id });

    // Verificar se vendor_id existe
    if (!vendor_id) {
      console.error('❌ vendor_id não encontrado no token. Token payload:', req.user);
      return res.status(400).json({
        success: false,
        message: 'Vendor ID não encontrado. Por favor, faça login novamente.',
        error: 'MISSING_VENDOR_ID'
      });
    }

    // Construir query
    const where = role === 'admin' ? {} : { vendor_id };

    const presentations = await Presentation.findAll({
      where,
      include: [
        {
          model: Slide,
          as: 'slides',
          attributes: ['id', 'name', 'template', 'order_index']
        },
        {
          model: Case,
          as: 'cases',
          through: { attributes: ['order_index'] }
        }
      ],
      order: [
        ['created_at', 'DESC'],
        [{ model: Slide, as: 'slides' }, 'order_index', 'ASC']
      ]
    });

    console.log(`✅ Encontradas ${presentations.length} apresentações para ${role === 'admin' ? 'admin' : vendor_id}`);

    res.json({
      success: true,
      presentations
    });
  } catch (error) {
    console.error('Erro ao buscar apresentações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar apresentações',
      error: error.message
    });
  }
});

/**
 * GET /api/presentations/:id
 * Busca uma apresentação específica
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_id } = req.user;

    const presentation = await Presentation.findOne({
      where: { id, vendor_id },
      include: [
        {
          model: Slide,
          as: 'slides',
          order: [['order_index', 'ASC']]
        },
        {
          model: Case,
          as: 'cases',
          through: { attributes: ['order_index'] }
        },
        {
          model: InlineEdit,
          as: 'edits'
        }
      ]
    });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Apresentação não encontrada'
      });
    }

    res.json({
      success: true,
      presentation
    });
  } catch (error) {
    console.error('Erro ao buscar apresentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar apresentação',
      error: error.message
    });
  }
});

/**
 * POST /api/presentations
 * Cria nova apresentação (copia do template)
 */
router.post('/', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { vendor_id } = req.user;
    const { title, description, copy_from_template = true } = req.body;

    // Criar nova apresentação
    const presentation = await Presentation.create({
      vendor_id,
      title: title || `Apresentação ${vendor_id}`,
      description: description || 'Nova apresentação CelPlan',
      is_template: false
    }, { transaction });

    // Se deve copiar do template
    if (copy_from_template) {
      // Buscar template
      const template = await Presentation.findOne({
        where: { is_template: true },
        include: [
          {
            model: Slide,
            as: 'slides'
          }
        ]
      });

      if (template && template.slides) {
        // Copiar slides do template
        for (const templateSlide of template.slides) {
          await Slide.create({
            presentation_id: presentation.id,
            name: templateSlide.name,
            template: templateSlide.template,
            content: templateSlide.content,
            order_index: templateSlide.order_index,
            is_active: templateSlide.is_active,
            metadata: templateSlide.metadata
          }, { transaction });
        }
      }
    }

    await transaction.commit();

    // Buscar apresentação completa
    const fullPresentation = await Presentation.findByPk(presentation.id, {
      include: [
        {
          model: Slide,
          as: 'slides',
          order: [['order_index', 'ASC']]
        }
      ]
    });

    res.status(201).json({
      success: true,
      presentation: fullPresentation
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar apresentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar apresentação',
      error: error.message
    });
  }
});

/**
 * PUT /api/presentations/:id
 * Atualiza apresentação
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_id, role } = req.user;
    const { title, description, metadata, status, published_at, slug } = req.body;

    // Construir where clause
    const where = role === 'admin' ? { id } : { id, vendor_id };

    const presentation = await Presentation.findOne({ where });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Apresentação não encontrada'
      });
    }

    // Preparar dados para atualização
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (status !== undefined) updateData.status = status;
    if (published_at !== undefined) updateData.published_at = published_at;
    if (slug !== undefined) updateData.slug = slug;

    await presentation.update(updateData);

    console.log(`✅ Apresentação ${id} atualizada:`, updateData);

    res.json({
      success: true,
      presentation
    });
  } catch (error) {
    console.error('Erro ao atualizar apresentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar apresentação',
      error: error.message
    });
  }
});

/**
 * DELETE /api/presentations/:id
 * Deleta apresentação
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_id } = req.user;

    const presentation = await Presentation.findOne({
      where: { id, vendor_id, is_template: false }
    });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Apresentação não encontrada ou não pode ser deletada'
      });
    }

    await presentation.destroy();

    res.json({
      success: true,
      message: 'Apresentação deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar apresentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar apresentação',
      error: error.message
    });
  }
});

/**
 * PUT /api/presentations/:id/slides/:slideId
 * Atualiza um slide específico
 */
router.put('/:id/slides/:slideId', authenticateToken, async (req, res) => {
  try {
    const { id, slideId } = req.params;
    const { vendor_id } = req.user;
    const { name, content, template, order_index, is_active, metadata } = req.body;

    // Verificar se a apresentação pertence ao vendor
    const presentation = await Presentation.findOne({
      where: { id, vendor_id }
    });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Apresentação não encontrada'
      });
    }

    // Buscar e atualizar o slide
    const slide = await Slide.findOne({
      where: { id: slideId, presentation_id: id }
    });

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide não encontrado'
      });
    }

    await slide.update({
      name,
      content,
      template,
      order_index,
      is_active,
      metadata
    });

    res.json({
      success: true,
      slide
    });
  } catch (error) {
    console.error('Erro ao atualizar slide:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar slide',
      error: error.message
    });
  }
});

/**
 * POST /api/presentations/:id/inline-edits
 * Salva edição inline
 */
router.post('/:id/inline-edits', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_id } = req.user;
    const { element_id, content, element_type, metadata } = req.body;

    // Verificar se a apresentação pertence ao vendor
    const presentation = await Presentation.findOne({
      where: { id, vendor_id }
    });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Apresentação não encontrada'
      });
    }

    // Criar ou atualizar a edição inline
    const [edit, created] = await InlineEdit.findOrCreate({
      where: {
        presentation_id: id,
        element_id
      },
      defaults: {
        content,
        element_type,
        metadata
      }
    });

    if (!created) {
      await edit.update({
        content,
        element_type,
        metadata
      });
    }

    res.json({
      success: true,
      edit
    });
  } catch (error) {
    console.error('Erro ao salvar edição inline:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao salvar edição',
      error: error.message
    });
  }
});

/**
 * PUT /api/presentations/:id/cases
 * Atualiza os cases selecionados para uma apresentação
 */
router.put('/:id/cases', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { vendor_id } = req.user;
    const { case_ids } = req.body; // Array de IDs de cases

    // Verificar se a apresentação pertence ao vendor
    const presentation = await Presentation.findOne({
      where: { id, vendor_id }
    });

    if (!presentation) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Apresentação não encontrada'
      });
    }

    // Remover associações existentes
    await PresentationCases.destroy({
      where: { presentation_id: id },
      transaction
    });

    // Criar novas associações
    if (case_ids && case_ids.length > 0) {
      const associations = case_ids.map((caseId, index) => ({
        presentation_id: id,
        case_id: caseId,
        order_index: index
      }));

      await PresentationCases.bulkCreate(associations, { transaction });
    }

    await transaction.commit();

    // Buscar apresentação atualizada
    const updatedPresentation = await Presentation.findByPk(id, {
      include: [
        {
          model: Case,
          as: 'cases',
          through: { attributes: ['order_index'] }
        }
      ]
    });

    res.json({
      success: true,
      presentation: updatedPresentation
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao atualizar cases da apresentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cases',
      error: error.message
    });
  }
});

module.exports = router;