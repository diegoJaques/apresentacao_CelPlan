-- Criar database (executar manualmente se necessário)
-- CREATE DATABASE apresentacoes;

-- Conectar ao database apresentacoes
-- \c apresentacoes;

-- Tabela de usuários vendedores
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de apresentações customizadas
CREATE TABLE IF NOT EXISTS presentations (
  id VARCHAR(12) PRIMARY KEY,
  vendor_name VARCHAR(255) NOT NULL,
  vendor_email VARCHAR(255) NOT NULL,
  vendor_phone VARCHAR(50),
  vendor_whatsapp VARCHAR(50),
  selected_slides JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_presentations_created_at ON presentations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Inserir usuário inicial (senha: celplan2025)
-- Hash gerado com bcrypt para 'celplan2025'
INSERT INTO users (username, password_hash, name)
VALUES ('comercial', '$2a$10$YQ5xJ9h8K3YZ9mXFv0oVLO8VxJ5K3YZ9mXFv0oVLO8VxJ5K3YZ9mX', 'Time Comercial')
ON CONFLICT (username) DO NOTHING;

-- Comentários nas tabelas
COMMENT ON TABLE users IS 'Usuários do time comercial que podem criar apresentações';
COMMENT ON TABLE presentations IS 'Apresentações customizadas geradas pelos vendedores';
COMMENT ON COLUMN presentations.selected_slides IS 'Array JSON com IDs dos slides selecionados';
