const Minio = require('minio');

// Criar cliente MinIO
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'celplanadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'celplan2024secure'
});

// Nome do bucket padrão
const BUCKET_NAME = process.env.MINIO_BUCKET || 'celplan-media';

// Política para tornar o bucket público para leitura
const publicReadPolicy = {
  Version: '2012-10-17',
  Statement: [{
    Sid: 'PublicRead',
    Effect: 'Allow',
    Principal: { AWS: ['*'] },
    Action: ['s3:GetObject'],
    Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
  }]
};

// Inicializar MinIO e criar bucket se não existir
const initMinio = async () => {
  try {
    // Verificar se o bucket existe
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);

    if (!bucketExists) {
      // Criar bucket
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ Bucket '${BUCKET_NAME}' criado com sucesso`);

      // Aplicar política de leitura pública
      await minioClient.setBucketPolicy(
        BUCKET_NAME,
        JSON.stringify(publicReadPolicy)
      );
      console.log(`✅ Política de leitura pública aplicada ao bucket`);
    } else {
      console.log(`✅ Bucket '${BUCKET_NAME}' já existe`);
    }

    // Testar conexão fazendo upload de arquivo teste
    const testBuffer = Buffer.from('MinIO test file');
    const testFileName = '.test/connection-test.txt';

    await minioClient.putObject(
      BUCKET_NAME,
      testFileName,
      testBuffer,
      testBuffer.length,
      { 'Content-Type': 'text/plain' }
    );

    // Remover arquivo teste
    await minioClient.removeObject(BUCKET_NAME, testFileName);

    console.log('✅ MinIO conectado e funcionando');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar MinIO:', error.message);

    // Se for erro de conexão, dar dicas
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Dica: Execute "docker-compose up -d" para iniciar MinIO');
    }

    throw error;
  }
};

// Função para gerar URL pública
const getPublicUrl = (fileName) => {
  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  const port = process.env.MINIO_PORT || 9000;

  return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${fileName}`;
};

// Função para fazer upload
const uploadFile = async (fileName, buffer, contentType = 'application/octet-stream', metadata = {}) => {
  try {
    await minioClient.putObject(
      BUCKET_NAME,
      fileName,
      buffer,
      buffer.length,
      {
        'Content-Type': contentType,
        ...metadata
      }
    );

    return {
      success: true,
      fileName,
      url: getPublicUrl(fileName),
      size: buffer.length
    };
  } catch (error) {
    console.error('Erro no upload para MinIO:', error);
    throw error;
  }
};

// Função para deletar arquivo
const deleteFile = async (fileName) => {
  try {
    await minioClient.removeObject(BUCKET_NAME, fileName);
    return { success: true, message: 'Arquivo deletado com sucesso' };
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw error;
  }
};

// Função para listar arquivos
const listFiles = async (prefix = '', limit = 100) => {
  try {
    const files = [];
    const stream = minioClient.listObjectsV2(BUCKET_NAME, prefix, true);

    return new Promise((resolve, reject) => {
      stream.on('data', obj => {
        files.push({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          url: getPublicUrl(obj.name)
        });
      });

      stream.on('error', reject);

      stream.on('end', () => {
        resolve(files.slice(0, limit));
      });
    });
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    throw error;
  }
};

module.exports = {
  minioClient,
  initMinio,
  uploadFile,
  deleteFile,
  listFiles,
  getPublicUrl,
  BUCKET_NAME
};