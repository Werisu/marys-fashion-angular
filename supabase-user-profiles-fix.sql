-- Correção da tabela user_profiles para incluir coluna is_active
-- Execute este SQL no Supabase Dashboard → SQL Editor

-- 1. Adicionar coluna is_active à tabela user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN
IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Atualizar valores existentes para true (ativo)
UPDATE public.user_profiles 
SET is_active = true 
WHERE is_active IS NULL;

-- 3. Tornar a coluna NOT NULL após atualizar os valores
ALTER TABLE public.user_profiles 
ALTER COLUMN is_active
SET
NOT NULL;

-- 4. Adicionar coluna phone se não existir
ALTER TABLE public.user_profiles 
ADD COLUMN
IF NOT EXISTS phone TEXT;

-- 5. Verificar estrutura da tabela
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_profiles' AND table_schema = 'public';
