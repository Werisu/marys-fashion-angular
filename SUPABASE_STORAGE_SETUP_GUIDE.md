# 🗄️ Guia de Configuração do Supabase Storage para Categorias

## ❌ **Problema Encontrado**

O script SQL falhou com o erro:

```
ERROR: 42501: must be owner of table buckets
```

Isso significa que você não tem permissões de administrador para criar buckets via SQL.

## ✅ **Solução: Configuração Manual via Dashboard**

### **Passo 1: Acessar o Supabase Dashboard**

1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto

### **Passo 2: Criar o Bucket de Imagens**

1. No menu lateral, clique em **"Storage"**
2. Clique no botão **"New Bucket"**
3. Preencha os campos:

   - **Name**: `category-images`
   - **Public**: ✅ **Marcado** (permite acesso público às imagens)
   - **File size limit**: `5MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

4. Clique em **"Create bucket"**

### **Passo 3: Configurar Políticas de Segurança**

Após criar o bucket, execute apenas as políticas no SQL Editor:

```sql
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
```

### **Passo 4: Verificar Configuração**

1. Vá para **Storage > category-images**
2. Verifique se o bucket foi criado
3. Teste fazendo upload de uma imagem de teste
4. Verifique se a imagem é acessível publicamente

## 🔧 **Configurações do Bucket**

- **Nome**: `category-images`
- **Visibilidade**: Público
- **Limite de arquivo**: 5MB
- **Tipos permitidos**: JPEG, PNG, GIF, WebP
- **Políticas**: Leitura pública, escrita apenas para usuários autenticados

## 🚀 **Testando o Upload**

Após a configuração:

1. Acesse `/admin/categories` na sua aplicação
2. Tente fazer upload de uma imagem
3. Verifique se a imagem aparece no bucket `category-images`
4. Confirme se a URL pública está funcionando

## 📋 **Arquivos de Configuração**

- **`supabase-storage-categories-setup-alternative.sql`**: Script com políticas (execute após criar o bucket)
- **`SUPABASE_STORAGE_SETUP_GUIDE.md`**: Este guia passo a passo

## ❓ **Precisa de Ajuda?**

Se ainda tiver problemas:

1. Verifique se você é o proprietário do projeto Supabase
2. Entre em contato com o suporte do Supabase
3. Ou solicite ao administrador do projeto para criar o bucket
