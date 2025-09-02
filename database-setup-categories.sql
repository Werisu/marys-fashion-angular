-- Script para criar a tabela de categorias no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública das categorias ativas
CREATE POLICY "Categories are publicly viewable" ON categories
  FOR SELECT USING (is_active = true);

-- Política para permitir que usuários autenticados criem categorias
CREATE POLICY "Authenticated users can create categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados atualizem categorias
CREATE POLICY "Authenticated users can update categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados deletem categorias
CREATE POLICY "Authenticated users can delete categories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir algumas categorias de exemplo
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Vestidos', 'vestidos', 'Vestidos elegantes para todas as ocasiões', 1),
  ('Blazers', 'blazers', 'Blazers sofisticados para o trabalho e eventos', 2),
  ('Calças', 'calcas', 'Calças confortáveis e estilosas', 3),
  ('Blusas', 'blusas', 'Blusas femininas e versáteis', 4),
  ('Saias', 'saias', 'Saias elegantes para diferentes estilos', 5),
  ('Esportivo', 'esportivo', 'Roupas esportivas confortáveis', 6)
ON CONFLICT (slug) DO NOTHING;

-- Comentários sobre a tabela
COMMENT ON TABLE categories IS 'Tabela para armazenar categorias de produtos';
COMMENT ON COLUMN categories.id IS 'Identificador único da categoria';
COMMENT ON COLUMN categories.name IS 'Nome da categoria';
COMMENT ON COLUMN categories.slug IS 'Slug único para URLs amigáveis';
COMMENT ON COLUMN categories.description IS 'Descrição da categoria';
COMMENT ON COLUMN categories.image_url IS 'URL da imagem representativa da categoria';
COMMENT ON COLUMN categories.is_active IS 'Indica se a categoria está ativa';
COMMENT ON COLUMN categories.sort_order IS 'Ordem de exibição da categoria';
COMMENT ON COLUMN categories.created_at IS 'Data de criação da categoria';
COMMENT ON COLUMN categories.updated_at IS 'Data da última atualização da categoria';
