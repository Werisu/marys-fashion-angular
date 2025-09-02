-- Script para configurar o bucket de imagens de categorias no Supabase Storage
-- Execute este script no SQL Editor do seu projeto Supabase

-- Criar bucket para imagens de categorias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-images',
  'category-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Política para permitir leitura pública das imagens de categorias
CREATE POLICY "Category images are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'category-images');

-- Política para permitir que usuários autenticados façam upload de imagens de categorias
CREATE POLICY "Authenticated users can upload category images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'category-images' 
    AND auth.role() = 'authenticated'
  );

-- Política para permitir que usuários autenticados atualizem imagens de categorias
CREATE POLICY "Authenticated users can update category images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'category-images' 
    AND auth.role() = 'authenticated'
  );

-- Política para permitir que usuários autenticados deletem imagens de categorias
CREATE POLICY "Authenticated users can delete category images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'category-images' 
    AND auth.role() = 'authenticated'
  );

-- Comentários sobre o bucket
COMMENT ON TABLE storage.buckets IS 'Buckets para armazenamento de arquivos';
COMMENT ON COLUMN storage.buckets.id IS 'Identificador único do bucket';
COMMENT ON COLUMN storage.buckets.name IS 'Nome do bucket';
COMMENT ON COLUMN storage.buckets.public IS 'Se o bucket é público';
COMMENT ON COLUMN storage.buckets.file_size_limit IS 'Limite de tamanho do arquivo em bytes';
COMMENT ON COLUMN storage.buckets.allowed_mime_types IS 'Tipos de arquivo permitidos';
