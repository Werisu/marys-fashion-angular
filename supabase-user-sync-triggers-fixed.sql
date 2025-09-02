-- Triggers para sincronização automática entre auth.users e user_profiles
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- IMPORTANTE: Execute primeiro o arquivo supabase-user-profiles-fix.sql

-- 1. Função para criar perfil quando um usuário é criado no auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user
()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles
        (id, email, full_name, role, is_active, phone)
    VALUES
        (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
            COALESCE((NEW.raw_user_meta_data->>'is_active')::boolean, true),
            COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger para executar a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER
INSERT ON
auth.users
FOR EACH ROW
EXECUTE
FUNCTION public.handle_new_user
();

-- 3. Função para atualizar perfil quando user_metadata é atualizado
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update
()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar user_profiles quando user_metadata muda
    UPDATE public.user_profiles
  SET
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
    role = COALESCE(NEW.raw_user_meta_data->>'role', role),
    is_active = COALESCE((NEW.raw_user_meta_data->>'is_active')::boolean, is_active),
    phone = COALESCE(NEW.raw_user_meta_data->>'phone', phone),
    updated_at = NOW()
  WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger para executar a função quando user_metadata é atualizado
DROP TRIGGER IF EXISTS on_auth_user_metadata_updated
ON auth.users;
CREATE TRIGGER on_auth_user_metadata_updated
  AFTER
UPDATE ON auth.users
  FOR EACH ROW
WHEN
(OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
EXECUTE
FUNCTION public.handle_user_metadata_update
();

-- 5. Função para limpar perfil quando usuário é deletado
CREATE OR REPLACE FUNCTION public.handle_user_deleted
()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.user_profiles WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger para executar a função quando usuário é deletado
DROP TRIGGER IF EXISTS on_auth_user_deleted
ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER
DELETE ON auth.users
FOR EACH ROW
EXECUTE
FUNCTION public.handle_user_deleted
();

-- 7. Remover TODAS as políticas existentes para evitar conflitos
DROP POLICY
IF EXISTS "Usuários podem ver apenas seu próprio perfil" ON user_profiles;
DROP POLICY
IF EXISTS "Usuários podem inserir seu próprio perfil" ON user_profiles;
DROP POLICY
IF EXISTS "Usuários podem atualizar seu próprio perfil" ON user_profiles;
DROP POLICY
IF EXISTS "Administradores podem ver todos os perfis" ON user_profiles;
DROP POLICY
IF EXISTS "Administradores podem inserir perfis" ON user_profiles;
DROP POLICY
IF EXISTS "Administradores podem atualizar perfis" ON user_profiles;
DROP POLICY
IF EXISTS "Administradores podem deletar perfis" ON user_profiles;
DROP POLICY
IF EXISTS "Usuários podem ver seu próprio perfil" ON user_profiles;
DROP POLICY
IF EXISTS "Usuários podem atualizar seu próprio perfil" ON user_profiles;

-- 8. Políticas para administradores
CREATE POLICY "Administradores podem ver todos os perfis" ON user_profiles
  FOR
SELECT USING (
    EXISTS (
      SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Administradores podem inserir perfis" ON user_profiles
  FOR
INSERT WITH CHECK
    (
    EXISTS (
    SELEC
 1 FROM auth.us
WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Administradores podem atualizar perfis" ON user_profiles
  FOR
UPDATE USING (
    EXISTS (
      SELECT 1
FROM auth.users
WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Administradores podem deletar perfis" ON user_profiles
  FOR
DELETE USING (
    EXISTS
(
      SELECT 1
FROM auth.users
WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

-- 9. Políticas para usuários comuns (ver apenas seu próprio perfil)
CREATE POLICY "Usuários podem ver seu próprio perfil" ON user_profiles
  FOR
SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON user_profiles
  FOR
UPDATE USING (auth.uid()
= id);

-- 10. Sincronizar usuários existentes
-- Executar para sincronizar usuários que já existem no auth.users
INSERT INTO public.user_profiles
    (id, email, full_name, role, is_active, phone)
SELECT
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', ''),
    COALESCE(raw_user_meta_data->>'role', 'user'),
    COALESCE((raw_user_meta_data->>'is_active')::boolean, true),
    COALESCE(raw_user_meta_data->>'phone', '')
FROM auth.users
WHERE id NOT IN (SELECT id
FROM public.user_profiles)
ON CONFLICT
(id) DO NOTHING;

-- 11. Comentários para documentação
COMMENT ON FUNCTION public.handle_new_user
() IS 'Cria automaticamente um perfil quando um usuário é criado no auth.users';
COMMENT ON FUNCTION public.handle_user_metadata_update
() IS 'Atualiza automaticamente o perfil quando user_metadata é modificado';
COMMENT ON FUNCTION public.handle_user_deleted
() IS 'Remove automaticamente o perfil quando um usuário é deletado';
