# 🔑 Como Obter a Service Role Key do Supabase

## 📋 Passo a Passo Detalhado

### 1. Acessar o Supabase Dashboard

1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione o projeto **marys-fashion-angular** (ou o nome do seu projeto)

### 2. Navegar para as Configurações da API

1. No menu lateral esquerdo, clique em **Settings** (Configurações)
2. Clique em **API** no submenu

### 3. Localizar a Service Role Key

Na página de API, você verá várias chaves:

```
Project URL: https://sxuvliahfsrneveezzgb.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← ESTA É A QUE VOCÊ PRECISA
```

### 4. Copiar a Service Role Key

1. Clique no botão **"Copy"** ao lado da **service_role** key
2. **IMPORTANTE**: Esta chave é diferente da anon public key
3. A service role key geralmente começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` mas tem conteúdo diferente

### 5. Configurar no Projeto

1. Abra o arquivo `src/environments/environment.ts`
2. Substitua esta linha:

   ```typescript
   serviceRoleKey: 'SUA_SERVICE_ROLE_KEY_AQUI', // ⚠️ ADICIONE SUA SERVICE ROLE KEY AQUI
   ```

   Por:

   ```typescript
   serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SUA_CHAVE_REAL_AQUI',
   ```

### 6. Exemplo de Como Deve Ficar

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://sxuvliahfsrneveezzgb.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dXZsaWFoZnNybmV2ZWV6emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDc4NjksImV4cCI6MjA3MjMyMzg2OX0.rHIgjnJMACyMjeaqmlC0k1Zxn9nvTz01Hy6YWPuCz74',
    serviceRoleKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dXZsaWFoZnNybmV2ZWV6emdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc0Nzg2OSwiZXhwIjoyMDcyMzIzODY5fQ.SUA_CHAVE_REAL_AQUI',
  },
};
```

## ⚠️ Diferenças Importantes

| Chave            | Propósito       | Permissões               |
| ---------------- | --------------- | ------------------------ |
| **anon public**  | Cliente público | Limitadas (respeita RLS) |
| **service_role** | Administração   | Totais (bypass RLS)      |

## 🔒 Segurança

- **NUNCA** commite a service role key no Git
- Ela tem acesso total ao seu banco de dados
- Use apenas em desenvolvimento local

## 🧪 Testar a Configuração

Após configurar:

1. Salve o arquivo
2. Reinicie o servidor: `npm start`
3. Acesse o módulo de usuários
4. O erro "Invalid API key" deve desaparecer

## 🆘 Se Ainda Não Funcionar

1. Verifique se copiou a chave correta (service_role, não anon)
2. Confirme que não há espaços extras na chave
3. Verifique se o projeto Supabase está ativo
4. Teste a API no Supabase Dashboard primeiro
