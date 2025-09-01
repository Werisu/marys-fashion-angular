-- Script de configuração do banco de dados Supabase para Mary's Fashion

-- 1. Criar tabela de categorias
CREATE TABLE
IF NOT EXISTS categories
(
  id SERIAL PRIMARY KEY,
  name VARCHAR
(100) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
()
);

-- 2. Criar tabela de produtos
CREATE TABLE
IF NOT EXISTS products
(
  id SERIAL PRIMARY KEY,
  name VARCHAR
(255) NOT NULL,
  description TEXT,
  price DECIMAL
(10,2) NOT NULL,
  category VARCHAR
(100) NOT NULL REFERENCES categories
(name),
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
()
);

-- 3. Criar tabela de usuários (extensão da tabela auth.users do Supabase)
CREATE TABLE
IF NOT EXISTS user_profiles
(
  id UUID REFERENCES auth.users
(id) ON
DELETE CASCADE PRIMARY KEY,
  email TEXT
UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
()
);

-- 4. Inserir categorias padrão
INSERT INTO categories
    (name, description, image)
VALUES
    ('vestidos', 'Vestidos elegantes para todas as ocasiões', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop'),
    ('blazers', 'Blazers sofisticados para o trabalho e eventos', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop'),
    ('calcas', 'Calças confortáveis e estilosas', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'),
    ('blusas', 'Blusas versáteis para qualquer look', 'https://images.unsplash.com/photo-1564257631407-3deb25f7d8c9?w=300&h=400&fit=crop'),
    ('saias', 'Saias femininas e elegantes', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop'),
    ('esportivo', 'Roupas confortáveis para atividades físicas', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop')
ON CONFLICT
(name) DO NOTHING;

-- 5. Inserir produtos de exemplo
INSERT INTO products
    (name, description, price, category, images, sizes, colors, featured)
VALUES
    ('Vestido Floral Elegante', 'Vestido lindo com estampa floral, perfeito para ocasiões especiais. Tecido leve e confortável.', 89.90, 'vestidos', ARRAY
['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'], ARRAY['P', 'M', 'G', 'GG'], ARRAY['Azul', 'Rosa'], true),
('Blazer Feminino Clássico', 'Blazer elegante e versátil, ideal para o trabalho ou eventos formais. Corte moderno e confortável.', 129.90, 'blazers', ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop'], ARRAY['P', 'M', 'G'], ARRAY['Preto', 'Bege'], true),
('Calça Jeans Skinny', 'Calça jeans skinny de alta qualidade, com elastano para máximo conforto e movimento.', 79.90, 'calcas', ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop'], ARRAY['36', '38', '40', '42', '44'], ARRAY['Azul', 'Preto'], false),
('Blusa de Seda Premium', 'Blusa de seda natural, leve e elegante. Perfeita para combinar com calças ou saias.', 69.90, 'blusas', ARRAY['https://images.unsplash.com/photo-1564257631407-3deb25f7d8c9?w=400&h=500&fit=crop'], ARRAY['P', 'M', 'G'], ARRAY['Branco', 'Azul', 'Rosa'], false),
('Saia Midi Plissada', 'Saia midi plissada com movimento elegante. Ideal para criar looks sofisticados e femininos.', 59.90, 'saias', ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop'], ARRAY['P', 'M', 'G'], ARRAY['Preto', 'Azul Marinho'], false),
('Conjunto Esportivo', 'Conjunto esportivo confortável e estiloso, perfeito para atividades físicas ou uso casual.', 99.90, 'esportivo', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop'], ARRAY['P', 'M', 'G'], ARRAY['Preto', 'Azul'], false)
ON CONFLICT DO NOTHING;

-- 6. Criar função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column
()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW
();
RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Criar triggers para atualizar timestamp
CREATE TRIGGER update_categories_updated_at BEFORE
UPDATE ON categories
  FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

CREATE TRIGGER update_products_updated_at BEFORE
UPDATE ON products
  FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

CREATE TRIGGER update_user_profiles_updated_at BEFORE
UPDATE ON user_profiles
  FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

-- 8. Configurar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 9. Políticas para categorias (leitura pública, escrita apenas para usuários autenticados)
CREATE POLICY "Categorias visíveis para todos" ON categories
  FOR
SELECT USING (true);

CREATE POLICY "Apenas usuários autenticados podem criar categorias" ON categories
  FOR
INSERT WITH CHECK (auth.role() = 'authenticated')
;

CREATE POLICY "Apenas usuários autenticados podem atualizar categorias" ON categories
  FOR
UPDATE USING (auth.role()
= 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem deletar categorias" ON categories
  FOR
DELETE USING (auth.role
() = 'authenticated');

-- 10. Políticas para produtos (leitura pública, escrita apenas para usuários autenticados)
CREATE POLICY "Produtos visíveis para todos" ON products
  FOR
SELECT USING (true);

CREATE POLICY "Apenas usuários autenticados podem criar produtos" ON products
  FOR
INSERT WITH CHECK (auth.role() = 'authenticated')
;

CREATE POLICY "Apenas usuários autenticados podem atualizar produtos" ON products
  FOR
UPDATE USING (auth.role()
= 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem deletar produtos" ON products
  FOR
DELETE USING (auth.role
() = 'authenticated');

-- 11. Políticas para perfis de usuário
CREATE POLICY "Usuários podem ver apenas seu próprio perfil" ON user_profiles
  FOR
SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" ON user_profiles
  FOR
INSERT WITH CHECK (auth.uid() =
id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON user_profiles
  FOR
UPDATE USING (auth.uid()
= id);

-- 12. Criar bucket de storage para imagens
-- (Execute no painel do Supabase: Storage > New Bucket > product-images)

-- 13. Configurar storage policies
-- (Execute no painel do Supabase após criar o bucket)

-- 14. Criar índices para melhor performance
CREATE INDEX
IF NOT EXISTS idx_products_category ON products
(category);
CREATE INDEX
IF NOT EXISTS idx_products_featured ON products
(featured);
CREATE INDEX
IF NOT EXISTS idx_products_in_stock ON products
(in_stock);
CREATE INDEX
IF NOT EXISTS idx_products_created_at ON products
(created_at);

-- 15. Função para buscar produtos com filtros
CREATE OR REPLACE FUNCTION search_products
(search_query TEXT)
RETURNS TABLE
(
  id INTEGER,
  name TEXT,
  description TEXT,
  price DECIMAL,
  category TEXT,
  images TEXT[],
  sizes TEXT[],
  colors TEXT[],
  in_stock BOOLEAN,
  featured BOOLEAN,
  created_at TIMESTAMP
WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.*
    FROM products p
    WHERE 
    p.name ILIKE '%' || search_query || '%'
        OR p.description
    ILIKE '%' || search_query || '%'
    OR p.category ILIKE '%' || search_query || '%'
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;
