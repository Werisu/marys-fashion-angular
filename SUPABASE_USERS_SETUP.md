# 🗄️ Configuração do Banco de Dados para Módulo de Usuários

## 📋 Status Atual

✅ **Já configurado:**

- Tabela `user_profiles` criada
- Políticas RLS básicas configuradas
- Triggers para timestamps
- Índices de performance

## ⚠️ Configurações Necessárias para o Módulo de Usuários

### 1. **Configurar Políticas RLS para Administração**

O módulo de usuários precisa de permissões especiais para administrar outros usuários. Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Políticas para administração de usuários
-- Permitir que administradores vejam todos os perfis
CREATE POLICY "Administradores podem ver todos os perfis" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Permitir que administradores atualizem perfis
CREATE POLICY "Administradores podem atualizar perfis" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Permitir que administradores insiram perfis
CREATE POLICY "Administradores podem inserir perfis" ON user_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### 2. **Configurar o Usuário Atual como Administrador**

Você precisa definir seu usuário atual como administrador. Execute este SQL:

```sql
-- Atualizar seu usuário para ter role de admin
-- Substitua 'seu-email@exemplo.com' pelo seu email real
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'seu-email@exemplo.com';

-- Criar perfil de usuário se não existir
INSERT INTO user_profiles (id, email, full_name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Administrador'),
  'admin'
FROM auth.users
WHERE email = 'seu-email@exemplo.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();
```

### 3. **Configurar Storage para Imagens de Usuários (Opcional)**

Se você quiser permitir upload de fotos de perfil:

```sql
-- Criar bucket para imagens de usuários
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de avatares
CREATE POLICY "Usuários podem fazer upload de seus próprios avatares" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para permitir visualização de avatares
CREATE POLICY "Avatares são públicos" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

-- Política para permitir atualização de avatares
CREATE POLICY "Usuários podem atualizar seus próprios avatares" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 4. **Verificar Configurações de Autenticação**

No **Supabase Dashboard** → **Authentication** → **Settings**:

1. **Email Confirmation**: Desabilite se quiser criar usuários sem confirmação
2. **User Signups**: Habilite se quiser permitir registro público
3. **Email Templates**: Configure se necessário

### 5. **Testar as Configurações**

Após executar os SQLs acima:

1. **Reinicie seu servidor Angular:**

   ```bash
   npm start
   ```

2. **Acesse o módulo de usuários:**

   - Vá para `/admin/users`
   - Deve carregar a lista de usuários sem erros

3. **Teste as funcionalidades:**
   - ✅ Listar usuários
   - ✅ Criar novo usuário
   - ✅ Editar usuário existente
   - ✅ Ativar/desativar usuários

## 🔧 Comandos SQL Resumidos

Execute estes comandos no **SQL Editor** do Supabase:

```sql
-- 1. Políticas de administração
CREATE POLICY "Administradores podem ver todos os perfis" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 2. Definir seu usuário como admin (substitua o email)
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'seu-email@exemplo.com';

-- 3. Criar perfil de admin
INSERT INTO user_profiles (id, email, full_name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Administrador'),
  'admin'
FROM auth.users
WHERE email = 'seu-email@exemplo.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();
```

## 🆘 Se Ainda Não Funcionar

1. **Verifique se a service role key está configurada** (conforme guia anterior)
2. **Confirme que executou os SQLs** no Supabase Dashboard
3. **Verifique se seu email está correto** nos comandos SQL
4. **Teste a API diretamente** no Supabase Dashboard → API

## 📝 Notas Importantes

- As políticas RLS são essenciais para segurança
- O módulo usa a **Supabase Auth Admin API**, não a tabela `user_profiles` diretamente
- A tabela `user_profiles` é para dados adicionais dos usuários
- A service role key é necessária para operações administrativas

---

**Após executar essas configurações, o módulo de usuários funcionará perfeitamente!** 🚀✨
