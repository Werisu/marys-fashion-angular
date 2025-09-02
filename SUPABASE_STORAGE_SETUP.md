# Configuração do Supabase Storage para Upload de Imagens

Este documento explica como configurar o Supabase Storage para permitir o upload de imagens no seu projeto Mary's Fashion.

## 1. Configuração no Supabase Dashboard

### 1.1 Criar Bucket de Storage

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Storage** no menu lateral
4. Clique em **New Bucket**
5. Configure o bucket:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Marque como público
   - **File size limit**: Recomendado 5MB ou mais
   - **Allowed MIME types**: `image/*`

### 1.2 Configurar Políticas de Acesso (RLS)

Após criar o bucket, configure as políticas de Row Level Security:

#### Política para Upload (INSERT)

```sql
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

#### Política para Visualização (SELECT)

```sql
CREATE POLICY "Images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

#### Política para Atualização (UPDATE)

```sql
CREATE POLICY "Users can update their images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

#### Política para Exclusão (DELETE)

```sql
CREATE POLICY "Users can delete their images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

## 2. Configuração no Código

### 2.1 Serviço de Upload

O serviço `FileUploadService` já está implementado e configurado para:

- Upload de imagens únicas ou múltiplas
- Geração automática de nomes únicos para arquivos
- Tratamento de erros
- Obtenção de URLs públicas

### 2.2 Uso no Componente Admin

O componente admin foi atualizado para incluir:

- Input de arquivo para seleção de imagens
- Preview das imagens selecionadas
- Botão de upload
- Gerenciamento de imagens já enviadas
- Fallback para URLs manuais

## 3. Funcionalidades Implementadas

### 3.1 Upload de Imagens

- ✅ Seleção múltipla de arquivos
- ✅ Preview antes do upload
- ✅ Upload para o Supabase Storage
- ✅ URLs públicas automáticas
- ✅ Tratamento de erros

### 3.2 Gerenciamento de Imagens

- ✅ Visualização de imagens enviadas
- ✅ Remoção de imagens
- ✅ Combinação com URLs manuais
- ✅ Integração com o formulário de produtos

## 4. Exemplo de Uso

```typescript
// No componente admin
async uploadImages() {
  if (this.selectedFiles.length === 0) return;

  this.uploading = true;

  try {
    const results = await this.fileUploadService
      .uploadMultipleImages(this.selectedFiles)
      .toPromise();

    if (results) {
      const successfulUploads = results.filter(result => result.success);
      const newImageUrls = successfulUploads.map(result => result.url!);

      this.uploadedImages = [...this.uploadedImages, ...newImageUrls];
      this.selectedFiles = [];
    }
  } catch (error) {
    console.error('Erro ao enviar imagens:', error);
  } finally {
    this.uploading = false;
  }
}
```

## 5. Configurações de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas no seu `environment.ts`:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'SUA_URL_DO_SUPABASE',
    anonKey: 'SUA_CHAVE_ANONIMA',
  },
};
```

## 6. Limitações e Considerações

### 6.1 Tamanho de Arquivo

- Configure o limite de tamanho no bucket do Supabase
- Recomendado: máximo 5MB por imagem
- Considere compressão de imagens no frontend

### 6.2 Tipos de Arquivo

- Apenas imagens são aceitas (`image/*`)
- Formatos suportados: JPG, PNG, GIF, WebP, etc.

### 6.3 Segurança

- Apenas usuários autenticados podem fazer upload
- As imagens são públicas para visualização
- Considere implementar validação adicional se necessário

## 7. Troubleshooting

### 7.1 Erro de Upload

- Verifique se o bucket existe e está configurado corretamente
- Confirme se as políticas RLS estão ativas
- Verifique o console do navegador para erros detalhados

### 7.2 Imagens não aparecem

- Verifique se o bucket está marcado como público
- Confirme se as URLs estão sendo geradas corretamente
- Teste o acesso direto às URLs no navegador

### 7.3 Problemas de Autenticação

- Verifique se o usuário está logado
- Confirme se as políticas RLS estão configuradas corretamente
- Verifique se o token de autenticação está válido

## 8. Próximos Passos

Para melhorar ainda mais o sistema de upload:

1. **Compressão de Imagens**: Implementar compressão automática no frontend
2. **Validação de Arquivos**: Adicionar validação de tamanho e tipo
3. **Progress Bar**: Mostrar progresso do upload
4. **Drag & Drop**: Implementar arrastar e soltar para upload
5. **Crop de Imagens**: Permitir recorte de imagens antes do upload
6. **CDN**: Configurar CDN para melhor performance

---

Para dúvidas ou problemas, consulte a [documentação oficial do Supabase](https://supabase.com/docs/guides/storage) ou abra uma issue no repositório do projeto.
