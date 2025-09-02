-- Script para configurar a tabela de categorias no Supabase
-- Este script é compatível com o schema atual do seu banco

-- A tabela categories já existe, mas vamos verificar se tem as políticas RLS corretas

-- Habilitar Row Level Security (RLS) se não estiver habilitado
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Categories are publicly viewable" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;

-- Política para permitir leitura pública das categorias
CREATE POLICY "Categories are publicly viewable" ON public.categories
  FOR SELECT USING (true);

-- Política para permitir que usuários autenticados criem categorias
CREATE POLICY "Authenticated users can create categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados atualizem categorias
CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados deletem categorias
CREATE POLICY "Authenticated users can delete categories" ON public.categories
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
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir algumas categorias de exemplo se a tabela estiver vazia
INSERT INTO public.categories (name, description, image) 
SELECT 'Vestidos', 'Vestidos elegantes para todas as ocasiões', 'https://exemplo.com/vestidos.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Vestidos');

INSERT INTO public.categories (name, description, image) 
SELECT 'Blazers', 'Blazers sofisticados para o trabalho e eventos', 'https://exemplo.com/blazers.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Blazers');

INSERT INTO public.categories (name, description, image) 
SELECT 'Calças', 'Calças confortáveis e estilosas', 'https://exemplo.com/calcas.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Calças');

INSERT INTO public.categories (name, description, image) 
SELECT 'Blusas', 'Blusas femininas e versáteis', 'https://exemplo.com/blusas.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Blusas');

INSERT INTO public.categories (name, description, image) 
SELECT 'Saias', 'Saias elegantes para diferentes estilos', 'https://exemplo.com/saias.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Saias');

INSERT INTO public.categories (name, description, image) 
SELECT 'Esportivo', 'Roupas esportivas confortáveis', 'https://exemplo.com/esportivo.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Esportivo');

-- Comentários sobre a tabela
COMMENT ON TABLE public.categories IS 'Tabela para armazenar categorias de produtos';
COMMENT ON COLUMN public.categories.id IS 'Identificador único da categoria';
COMMENT ON COLUMN public.categories.name IS 'Nome da categoria (deve ser único)';
COMMENT ON COLUMN public.categories.description IS 'Descrição da categoria';
COMMENT ON COLUMN public.categories.image IS 'URL da imagem representativa da categoria';
COMMENT ON COLUMN public.categories.created_at IS 'Data de criação da categoria';
COMMENT ON COLUMN public.categories.updated_at IS 'Data da última atualização da categoria';
