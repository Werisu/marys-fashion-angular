# 🔐 Configuração da API de Administração do Supabase

## ⚠️ Problema Identificado

Você está recebendo o erro `"code":"not_admin","message":"User not allowed"` porque o módulo de usuários precisa de permissões de administrador para acessar a API de administração do Supabase.

## 🛠️ Solução

### 1. Obter a Service Role Key

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a **"service_role"** key (não a "anon public" key)

### 2. Configurar no Projeto

Abra o arquivo `src/environments/environment.ts` e substitua:

```typescript
serviceRoleKey: 'SUA_SERVICE_ROLE_KEY_AQUI', // ⚠️ ADICIONE SUA SERVICE ROLE KEY AQUI
```

Pela sua service role key real:

```typescript
serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dXZsaWFoZnNybmV2ZWV6emdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc0Nzg2OSwiZXhwIjoyMDcyMzIzODY5fQ.SUA_CHAVE_AQUI',
```

### 3. ⚠️ IMPORTANTE - Segurança

**NUNCA** commite a service role key no Git! Ela tem permissões totais no seu banco de dados.

Para produção, use variáveis de ambiente:

```typescript
serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] || '',
```

### 4. Testar a Configuração

Após configurar a service role key:

1. Reinicie o servidor de desenvolvimento
2. Acesse o módulo de usuários
3. O erro "User not allowed" deve desaparecer

## 🔒 Diferenças entre as Chaves

| Chave            | Permissões          | Uso             |
| ---------------- | ------------------- | --------------- |
| **anon**         | Limitadas (RLS)     | Cliente público |
| **service_role** | Totais (bypass RLS) | Administração   |

## 📋 Checklist

- [ ] Service role key configurada no `environment.ts`
- [ ] Servidor reiniciado
- [ ] Módulo de usuários funcionando
- [ ] Service role key não commitada no Git

## 🆘 Se Ainda Não Funcionar

1. Verifique se a service role key está correta
2. Confirme que o projeto Supabase está ativo
3. Verifique se não há erros no console do navegador
4. Teste a API diretamente no Supabase Dashboard

---

**Nota**: A service role key é muito poderosa. Use apenas em ambientes seguros e nunca a exponha publicamente.
