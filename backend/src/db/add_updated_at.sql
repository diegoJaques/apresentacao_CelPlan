-- Adicionar coluna updated_at na tabela presentations
ALTER TABLE presentations
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Atualizar registros existentes com o valor de created_at
UPDATE presentations
SET updated_at = created_at
WHERE updated_at IS NULL;
