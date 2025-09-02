-- Script alternativo para configurar o bucket de imagens de categorias no Supabase Storage
-- Este script funciona com permissões limitadas do usuário

-- NOTA: Se você receber erro de permissão para criar buckets, você pode:
-- 1. Criar o bucket manualmente pela interface do Supabase Dashboard
-- 2. Ou solicitar ao administrador do projeto para criar o bucket

-- Opção 1: Criar bucket manualmente (recomendado)
-- Vá para: Supabase Dashboard > Storage > New Bucket
-- Nome: category-images
-- Public: ✓ (marcado)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

-- Opção 2: Tentar criar via SQL (pode falhar por permissões)
-- Descomente as linhas abaixo se você tiver permissões de administrador:

/*
-- Criar bucket para imagens de categorias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-images',
  'category-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;
*/

-- Após criar o bucket (manualmente ou via SQL), execute as políticas abaixo:

-- Política para permitir leitura pública das imagens de categorias
CREATE POLICY "Category images are publicly viewable" ON storage.objects
  FOR
SELECT USING (bucket_id = 'category-images');

-- Política para permitir que usuários autenticados façam upload de imagens de categorias
CREATE POLICY "Authenticated users can upload category images" ON storage.objects
  FOR
INSERT WITH CHECK
    (
    bucket_i
    =
ategory-images'
    AND auth.role
    () = 'authenticated'
  );

-- Política para permitir que usuários autenticados atualizem imagens de categorias
CREATE POLICY "Authenticated users can update category images" ON storage.objects
  FOR
UPDATE USING (
    bucket_id = 'category-images'
AND auth.role
() = 'authenticated'
  );

-- Política para permitir que usuários autenticados deletem imagens de categorias
CREATE POLICY "Authenticated users can delete category images" ON storage.objects
  FOR
DELETE USING (
    bucket_id
= 'category-images' 
    AND auth.role
() = 'authenticated'
  );

-- Verificar se as políticas foram criadas
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'objects'
    AND schemaname = 'storage';
