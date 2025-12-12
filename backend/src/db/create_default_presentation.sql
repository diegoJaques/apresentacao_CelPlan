-- Criar apresentação padrão/default com todos os slides
-- Este registro será usado pela apresentação principal da rota /

INSERT INTO presentations (id, vendor_name, vendor_email, vendor_phone, vendor_whatsapp, selected_slides, created_at, updated_at)
VALUES (
  'default',
  'Diego Jaques',
  'diego.jaques@celplan.com.br',
  '+55 19 98376-0039',
  '5519983760039',
  '["intro","about","markets","projects","celplanner","serbom","cellwireless","oportunidades","rag","visao","tracking","rumo","celphone","moe","methodology","contact"]',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Comentário explicativo
COMMENT ON COLUMN presentations.id IS 'ID único da apresentação. O ID "default" é reservado para a apresentação principal';
