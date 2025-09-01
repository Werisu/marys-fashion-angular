# 🚀 Configuração do Supabase para Mary's Fashion

Este guia te ajudará a configurar o Supabase como backend para o seu site de catálogo de roupas.

## 📋 Pré-requisitos

- Conta no GitHub ou Google
- Projeto Angular configurado
- Node.js instalado

## 🔧 Passo a Passo

### 1. **Criar Projeto no Supabase**

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou Google
4. Clique em "New Project"
5. Preencha as informações:
   - **Organization**: Selecione ou crie uma
   - **Name**: `marys-fashion`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a mais próxima (ex: São Paulo)
6. Clique em "Create new project"

### 2. **Configurar Banco de Dados**

1. No painel do projeto, vá para **SQL Editor**
2. Copie e cole o conteúdo do arquivo `database-setup.sql`
3. Clique em **Run** para executar os scripts

### 3. **Configurar Storage**

1. No painel, vá para **Storage**
2. Clique em **New Bucket**
3. Nome: `product-images`
4. Public bucket: ✅ **Sim**
5. Clique em **Create bucket**

### 4. **Configurar Políticas de Storage**

No **SQL Editor**, execute:

```sql
-- Política para permitir upload de imagens apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir visualização pública das imagens
CREATE POLICY "Imagens visíveis para todos" ON storage.objects
FOR SELECT USING (true);

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem atualizar" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
```

### 5. **Obter Credenciais**

1. No painel, vá para **Settings** > **API**
2. Copie:
   - **Project URL**
   - **anon public** key

### 6. **Configurar Variáveis de Ambiente**

1. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_projeto
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

2. Atualize `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'sua_url_do_projeto',
    anonKey: 'sua_chave_anonima',
  },
};
```

### 7. **Instalar Dependências**

```bash
npm install @supabase/supabase-js
```

### 8. **Configurar Autenticação**

1. No painel do Supabase, vá para **Authentication** > **Settings**
2. Configure:
   - **Site URL**: `http://localhost:4200`
   - **Redirect URLs**: `http://localhost:4200/login`
3. Em **Email Templates**, personalize as mensagens

### 9. **Testar Configuração**

1. Execute o projeto: `npm start`
2. Acesse: `http://localhost:4200/login`
3. Tente criar uma conta
4. Verifique se recebeu o email de confirmação

## 🗄️ Estrutura do Banco

### Tabelas Principais

- **`categories`**: Categorias de produtos
- **`products`**: Produtos do catálogo
- **`user_profiles`**: Perfis dos usuários

### Campos Importantes

- **`created_at`**: Timestamp de criação
- **`updated_at`**: Timestamp de atualização
- **`featured`**: Produtos em destaque
- **`in_stock`**: Status de estoque

## 🔐 Segurança

### Row Level Security (RLS)

- **Leitura pública** para produtos e categorias
- **Escrita restrita** apenas para usuários autenticados
- **Perfis privados** para cada usuário

### Storage Policies

- **Upload**: Apenas usuários autenticados
- **Visualização**: Pública
- **Modificação**: Apenas usuários autenticados

## 📱 Funcionalidades Implementadas

✅ **Autenticação** com email/senha  
✅ **CRUD de produtos** completo  
✅ **Upload de imagens** para storage  
✅ **Sistema de busca** avançado  
✅ **Filtros por categoria**  
✅ **Painel administrativo** protegido  
✅ **Gestão de usuários**

## 🚨 Solução de Problemas

### Erro de CORS

Se encontrar erros de CORS, verifique:

- URLs configuradas no painel de autenticação
- Configuração das políticas de storage

### Erro de Autenticação

Verifique:

- Chaves do projeto corretas
- Configuração das políticas RLS
- Status do usuário (confirmado por email)

### Erro de Storage

Verifique:

- Bucket criado corretamente
- Políticas de storage aplicadas
- Permissões do usuário

## 🔄 Próximos Passos

1. **Personalizar templates** de email
2. **Configurar webhooks** para notificações
3. **Implementar analytics** com Supabase
4. **Configurar backup** automático
5. **Monitorar performance** do banco

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage API](https://supabase.com/docs/reference/javascript/storage-createbucket)
- [Community](https://github.com/supabase/supabase/discussions)

## 🆘 Suporte

- **Issues**: [GitHub Supabase](https://github.com/supabase/supabase/issues)
- **Discord**: [Comunidade Supabase](https://discord.supabase.com)
- **Documentação**: [supabase.com/docs](https://supabase.com/docs)

---

**🎉 Parabéns! Seu projeto está configurado com Supabase!**
