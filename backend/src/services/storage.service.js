const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {
  minioClient,
  uploadFile,
  deleteFile,
  listFiles,
  getPublicUrl,
  BUCKET_NAME
} = require('../config/minio');
const Media = require('../models/Media');

class StorageService {
  /**
   * Upload e processa imagem
   */
  async uploadImage(file, options = {}) {
    const {
      folder = 'general',
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 85,
      generateThumbnail = true,
      uploadedBy = 'system',
      entityType = null,
      entityId = null
    } = options;

    try {
      // Validações
      if (!file || !file.buffer) {
        throw new Error('Arquivo inválido');
      }

      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.mimetype)) {
        throw new Error('Tipo de arquivo não suportado. Use: JPEG, PNG, GIF ou WebP');
      }

      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo: 10MB');
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const uniqueId = uuidv4().substring(0, 8);
      const extension = this.getFileExtension(file.originalname);
      const fileName = `${folder}/${timestamp}-${uniqueId}.${extension}`;

      // Obter metadata da imagem original
      const metadata = await sharp(file.buffer).metadata();

      // Otimizar imagem principal
      const optimizedBuffer = await sharp(file.buffer)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality, progressive: true })
        .toBuffer();

      // Upload da imagem principal para MinIO
      const uploadResult = await uploadFile(
        fileName,
        optimizedBuffer,
        'image/jpeg',
        {
          'x-amz-meta-original-name': file.originalname,
          'x-amz-meta-uploaded-by': uploadedBy
        }
      );

      // Gerar e fazer upload da thumbnail se solicitado
      let thumbnailUrl = null;
      if (generateThumbnail) {
        const thumbFileName = `${folder}/thumb-${timestamp}-${uniqueId}.jpg`;
        const thumbnailBuffer = await sharp(file.buffer)
          .resize(300, 200, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 70 })
          .toBuffer();

        await uploadFile(thumbFileName, thumbnailBuffer, 'image/jpeg');
        thumbnailUrl = getPublicUrl(thumbFileName);
      }

      // Salvar informações no banco de dados
      const mediaRecord = await Media.create({
        filename: fileName,
        original_name: file.originalname,
        storage_path: fileName,
        public_url: uploadResult.url,
        thumbnail_url: thumbnailUrl,
        mime_type: 'image/jpeg',
        size_bytes: optimizedBuffer.length,
        width: metadata.width,
        height: metadata.height,
        uploaded_by: uploadedBy,
        entity_type: entityType,
        entity_id: entityId,
        metadata: {
          original_size: file.size,
          optimized: true,
          quality,
          format: metadata.format
        }
      });

      return {
        success: true,
        media: {
          id: mediaRecord.id,
          url: uploadResult.url,
          thumbnailUrl,
          size: optimizedBuffer.length,
          dimensions: {
            width: metadata.width,
            height: metadata.height
          }
        }
      };
    } catch (error) {
      console.error('Erro no upload de imagem:', error);
      throw error;
    }
  }

  /**
   * Upload de arquivo genérico (não imagem)
   */
  async uploadFile(file, options = {}) {
    const {
      folder = 'documents',
      uploadedBy = 'system',
      entityType = null,
      entityId = null
    } = options;

    try {
      // Validar tamanho (máximo 50MB para documentos)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo: 50MB');
      }

      // Gerar nome único
      const timestamp = Date.now();
      const uniqueId = uuidv4().substring(0, 8);
      const extension = this.getFileExtension(file.originalname);
      const fileName = `${folder}/${timestamp}-${uniqueId}.${extension}`;

      // Upload para MinIO
      const uploadResult = await uploadFile(
        fileName,
        file.buffer,
        file.mimetype,
        {
          'x-amz-meta-original-name': file.originalname,
          'x-amz-meta-uploaded-by': uploadedBy
        }
      );

      // Salvar no banco
      const mediaRecord = await Media.create({
        filename: fileName,
        original_name: file.originalname,
        storage_path: fileName,
        public_url: uploadResult.url,
        mime_type: file.mimetype,
        size_bytes: file.size,
        uploaded_by: uploadedBy,
        entity_type: entityType,
        entity_id: entityId
      });

      return {
        success: true,
        media: {
          id: mediaRecord.id,
          url: uploadResult.url,
          size: file.size
        }
      };
    } catch (error) {
      console.error('Erro no upload de arquivo:', error);
      throw error;
    }
  }

  /**
   * Deletar arquivo
   */
  async deleteMedia(mediaId) {
    try {
      // Buscar registro no banco
      const media = await Media.findByPk(mediaId);

      if (!media) {
        throw new Error('Arquivo não encontrado');
      }

      // Deletar do MinIO
      await deleteFile(media.filename);

      // Deletar thumbnail se existir
      if (media.thumbnail_url) {
        const thumbPath = this.extractPathFromUrl(media.thumbnail_url);
        await deleteFile(thumbPath).catch(console.error);
      }

      // Deletar do banco
      await media.destroy();

      return {
        success: true,
        message: 'Arquivo deletado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  /**
   * Listar arquivos por entidade
   */
  async listMediaByEntity(entityType, entityId) {
    try {
      const mediaList = await Media.findAll({
        where: {
          entity_type: entityType,
          entity_id: entityId
        },
        order: [['created_at', 'DESC']]
      });

      return {
        success: true,
        media: mediaList
      };
    } catch (error) {
      console.error('Erro ao listar mídia:', error);
      throw error;
    }
  }

  /**
   * Listar todos os arquivos
   */
  async listAllMedia(options = {}) {
    const {
      limit = 100,
      offset = 0,
      entityType = null,
      uploadedBy = null
    } = options;

    try {
      const where = {};

      if (entityType) where.entity_type = entityType;
      if (uploadedBy) where.uploaded_by = uploadedBy;

      const { count, rows } = await Media.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      return {
        success: true,
        total: count,
        media: rows,
        pagination: {
          limit,
          offset,
          totalPages: Math.ceil(count / limit),
          currentPage: Math.floor(offset / limit) + 1
        }
      };
    } catch (error) {
      console.error('Erro ao listar mídia:', error);
      throw error;
    }
  }

  /**
   * Helpers
   */
  getFileExtension(filename) {
    const parts = filename.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

  extractPathFromUrl(url) {
    // Extrai o path do arquivo da URL completa
    const urlParts = url.split('/');
    const bucketIndex = urlParts.indexOf(BUCKET_NAME);
    if (bucketIndex !== -1) {
      return urlParts.slice(bucketIndex + 1).join('/');
    }
    return urlParts[urlParts.length - 1];
  }

  /**
   * Gerar URL assinada (para downloads privados)
   */
  async getSignedUrl(mediaId, expirySeconds = 3600) {
    try {
      const media = await Media.findByPk(mediaId);

      if (!media) {
        throw new Error('Arquivo não encontrado');
      }

      // Gerar URL assinada com MinIO
      const signedUrl = await minioClient.presignedGetObject(
        BUCKET_NAME,
        media.filename,
        expirySeconds
      );

      return {
        success: true,
        url: signedUrl,
        expiresIn: expirySeconds
      };
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error);
      throw error;
    }
  }
}

module.exports = new StorageService();