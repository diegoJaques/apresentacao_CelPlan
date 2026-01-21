const router = require('express').Router();
const multer = require('multer');
const { authenticateToken, isAdmin } = require('../middlewares/auth.middleware');
const { Media } = require('../models');
const storageService = require('../services/storage.service');

// Configurar multer para uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB máximo
  }
});

/**
 * GET /api/media
 * Lista todos os arquivos de mídia
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      entity_type,
      entity_id,
      uploaded_by,
      limit = 100,
      offset = 0
    } = req.query;

    const result = await storageService.listAllMedia({
      entityType: entity_type,
      uploadedBy: uploaded_by,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao listar mídia:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar arquivos',
      error: error.message
    });
  }
});

/**
 * GET /api/media/entity/:entityType/:entityId
 * Lista mídia de uma entidade específica
 */
router.get('/entity/:entityType/:entityId', authenticateToken, async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const result = await storageService.listMediaByEntity(entityType, entityId);

    res.json(result);
  } catch (error) {
    console.error('Erro ao listar mídia da entidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar mídia da entidade',
      error: error.message
    });
  }
});

/**
 * GET /api/media/:id
 * Busca um arquivo de mídia específico
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findByPk(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    res.json({
      success: true,
      media
    });
  } catch (error) {
    console.error('Erro ao buscar arquivo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar arquivo',
      error: error.message
    });
  }
});

/**
 * POST /api/media/upload/image
 * Upload de imagem com otimização
 */
router.post('/upload/image', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo fornecido'
      });
    }

    const {
      folder = 'general',
      entity_type,
      entity_id,
      max_width,
      max_height,
      quality,
      generate_thumbnail
    } = req.body;

    const result = await storageService.uploadImage(req.file, {
      folder,
      maxWidth: max_width ? parseInt(max_width) : 1920,
      maxHeight: max_height ? parseInt(max_height) : 1080,
      quality: quality ? parseInt(quality) : 85,
      generateThumbnail: generate_thumbnail !== 'false',
      uploadedBy: req.user.vendor_id,
      entityType: entity_type,
      entityId: entity_id
    });

    res.json(result);
  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no upload de imagem',
      error: error.message
    });
  }
});

/**
 * POST /api/media/upload/file
 * Upload de arquivo genérico
 */
router.post('/upload/file', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo fornecido'
      });
    }

    const {
      folder = 'documents',
      entity_type,
      entity_id
    } = req.body;

    const result = await storageService.uploadFile(req.file, {
      folder,
      uploadedBy: req.user.vendor_id,
      entityType: entity_type,
      entityId: entity_id
    });

    res.json(result);
  } catch (error) {
    console.error('Erro no upload de arquivo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no upload de arquivo',
      error: error.message
    });
  }
});

/**
 * POST /api/media/upload/multiple
 * Upload de múltiplos arquivos
 */
router.post('/upload/multiple', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo fornecido'
      });
    }

    const {
      folder = 'general',
      entity_type,
      entity_id
    } = req.body;

    const results = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Determinar se é imagem pelo mimetype
        const isImage = file.mimetype.startsWith('image/');

        if (isImage) {
          const result = await storageService.uploadImage(file, {
            folder,
            uploadedBy: req.user.vendor_id,
            entityType: entity_type,
            entityId: entity_id
          });
          results.push(result.media);
        } else {
          const result = await storageService.uploadFile(file, {
            folder,
            uploadedBy: req.user.vendor_id,
            entityType: entity_type,
            entityId: entity_id
          });
          results.push(result.media);
        }
      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    res.json({
      success: errors.length === 0,
      uploaded: results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no upload múltiplo',
      error: error.message
    });
  }
});

/**
 * DELETE /api/media/:id
 * Deleta um arquivo
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o arquivo existe e pertence ao vendor
    const media = await Media.findByPk(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    // Só admin ou o próprio uploader pode deletar
    if (req.user.role !== 'admin' && media.uploaded_by !== req.user.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para deletar este arquivo'
      });
    }

    const result = await storageService.deleteMedia(id);

    res.json(result);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar arquivo',
      error: error.message
    });
  }
});

/**
 * GET /api/media/:id/signed-url
 * Gera URL assinada para download privado
 */
router.get('/:id/signed-url', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { expires = 3600 } = req.query;

    const result = await storageService.getSignedUrl(id, parseInt(expires));

    res.json(result);
  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar URL assinada',
      error: error.message
    });
  }
});

/**
 * PUT /api/media/:id/associate
 * Associa arquivo a uma entidade
 */
router.put('/:id/associate', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { entity_type, entity_id } = req.body;

    const media = await Media.findByPk(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    // Verificar permissões
    if (req.user.role !== 'admin' && media.uploaded_by !== req.user.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para modificar este arquivo'
      });
    }

    await media.associateWith(entity_type, entity_id);

    res.json({
      success: true,
      media
    });
  } catch (error) {
    console.error('Erro ao associar arquivo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao associar arquivo',
      error: error.message
    });
  }
});

module.exports = router;