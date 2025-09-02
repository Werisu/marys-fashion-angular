# Módulo de Gerenciamento de Categorias

Este módulo permite gerenciar as categorias de produtos de forma completa, incluindo criação, edição e exclusão.

## 🚀 Funcionalidades Implementadas

### ✅ **CRUD Completo de Categorias**

- **Criar**: Adicionar novas categorias com nome, descrição e imagem
- **Ler**: Visualizar todas as categorias em uma tabela organizada
- **Atualizar**: Editar categorias existentes
- **Deletar**: Remover categorias (com confirmação)

### ✅ **Campos da Categoria**

- **Nome**: Nome da categoria (obrigatório, único)
- **Descrição**: Descrição opcional da categoria
- **Imagem**: Upload direto de imagem ou URL da imagem representativa
- **Data de Criação**: Automática
- **Data de Atualização**: Automática

### ✅ **Upload de Imagens**

- **Upload Direto**: Selecione e envie imagens diretamente para o Supabase Storage
- **Preview**: Visualização da imagem antes e depois do upload
- **Fallback**: Campo de URL manual como alternativa
- **Bucket**: `category-images` no Supabase Storage

### ✅ **Interface Administrativa**

- Formulário intuitivo para criar/editar categorias
- Tabela responsiva com todas as categorias
- Botões de ação para editar e excluir
- Navegação entre admin e categorias

## 🏗️ Arquitetura do Módulo

### **Modelos (Models)**

```
modules/data-access/product/src/lib/models/category.model.ts
```

- `Category`: Interface principal da categoria
- `CreateCategoryRequest`: Dados para criar categoria
- `UpdateCategoryRequest`: Dados para atualizar categoria

### **Serviços (Services)**

```
modules/data-access/product/src/lib/category-supabase/category-supabase.service.ts
```

- `CategorySupabaseService`: Serviço para operações CRUD
- Integração com Supabase
- Tratamento de erros robusto

### **Componentes (Components)**

```
src/app/pages/admin/categories/categories.component.ts
```

- `CategoriesComponent`: Interface de gerenciamento
- Formulário de criação/edição
- Tabela de visualização
- Navegação e autenticação

## 📋 Como Usar

### **1. Acessar o Módulo**

1. Faça login no painel administrativo (`/admin`)
2. Clique no botão "Gerenciar Categorias"
3. Você será direcionado para `/admin/categories`

### **2. Criar Nova Categoria**

1. Preencha o formulário:
   - **Nome**: Nome da categoria (ex: "Casacos")
   - **Descrição**: Descrição opcional
   - **Imagem**: URL da imagem (opcional)
2. Clique em "Adicionar"

### **3. Editar Categoria Existente**

1. Clique no botão "Editar" na linha da categoria
2. Modifique os campos desejados
3. Clique em "Atualizar"

### **4. Excluir Categoria**

1. Clique no botão "Excluir" na linha da categoria
2. Confirme a exclusão no popup
3. A categoria será removida

## 🗄️ Configuração do Banco de Dados

### **1. Schema Atual**

Seu banco já possui a tabela `categories` com a seguinte estrutura:

```sql
CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  image text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
```

### **2. Executar o Script SQL**

Execute o arquivo `database-setup-categories-updated.sql` no SQL Editor do Supabase para configurar as políticas RLS:

### **3. Configurar Storage para Imagens**

**⚠️ IMPORTANTE**: Devido a limitações de permissão, você precisa criar o bucket manualmente:

#### **Opção A: Via Dashboard (Recomendado)**

1. Vá para **Supabase Dashboard > Storage > New Bucket**
2. Nome: `category-images`
3. Public: ✅ Marcado
4. File size limit: 5MB
5. Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp`

#### **Opção B: Via SQL (Pode falhar por permissões)**

Execute o arquivo `supabase-storage-categories-setup.sql`

#### **Após criar o bucket, execute as políticas:**

Execute o arquivo `supabase-storage-categories-setup-alternative.sql` para configurar as políticas de segurança.

**📖 Guia completo**: Veja `SUPABASE_STORAGE_SETUP_GUIDE.md` para instruções detalhadas.

```sql
-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública
CREATE POLICY "Categories are publicly viewable" ON public.categories
  FOR SELECT USING (true);

-- Política para usuários autenticados
CREATE POLICY "Authenticated users can manage categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');
```

### **3. Trigger para updated_at**

O script também cria um trigger para atualizar automaticamente o campo `updated_at`:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔧 Integração com Produtos

### **Relacionamento Existente**

Sua tabela `products` já possui uma foreign key para `categories`:

```sql
CONSTRAINT products_category_fkey FOREIGN KEY (category) REFERENCES public.categories(name)
```

### **Atualizar Produtos**

Para usar as categorias dinâmicas nos produtos, atualize o componente admin:

```typescript
// No admin.component.ts
import { CategorySupabaseService } from '@marys-fashion-angular/product-data-access';

export class AdminComponent {
  categories: Category[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }
}
```

### **Template HTML**

```html
<select [(ngModel)]="productForm.category" name="category" required>
  <option value="">Selecione uma categoria</option>
  <option *ngFor="let cat of categories" [value]="cat.name">
    {{ cat.name }}
  </option>
</select>
```

## 🎨 Personalização

### **Estilos CSS**

O componente usa Tailwind CSS. Para personalizar:

```scss
// categories.component.scss
.category-form {
  @apply bg-white rounded-lg shadow p-6;
}

.category-table {
  @apply min-w-full divide-y divide-gray-200;
}
```

### **Validações**

Adicione validações personalizadas no componente:

```typescript
saveCategory() {
  if (!this.categoryForm.name.trim()) {
    alert('Nome da categoria é obrigatório');
    return;
  }

  if (this.categoryForm.name.length < 3) {
    alert('Nome deve ter pelo menos 3 caracteres');
    return;
  }

  // ... resto do código
}
```

## 🚨 Troubleshooting

### **Problema: Categoria não aparece**

- Verifique se a tabela `categories` existe
- Confirme se as políticas RLS estão configuradas
- Verifique o console para erros

### **Problema: Erro ao salvar**

- Verifique se está logado
- Confirme se o Supabase está configurado
- Verifique se o nome é único (constraint UNIQUE)

### **Problema: Erro de foreign key**

- Não delete categorias que estão sendo usadas por produtos
- Primeiro remova ou atualize os produtos que usam a categoria

## 🔮 Próximas Funcionalidades

### **Funcionalidades Planejadas**

1. **Upload de Imagens**: Upload direto para Supabase Storage
2. **Validação de Nomes**: Verificar se o nome já existe antes de salvar
3. **Subcategorias**: Categorias hierárquicas
4. **SEO**: Meta tags e descrições otimizadas
5. **Cache**: Cache de categorias para performance

### **Melhorias Técnicas**

1. **Validação**: Validação mais robusta com Angular Validators
2. **Loading States**: Indicadores de carregamento
3. **Error Handling**: Tratamento de erros mais elegante
4. **Unit Tests**: Testes unitários completos
5. **E2E Tests**: Testes end-to-end

## 📚 Recursos Adicionais

### **Documentação**

- [Supabase Documentation](https://supabase.com/docs)
- [Angular Forms](https://angular.io/guide/forms)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Exemplos de Uso**

- Ver `categories.component.ts` para implementação completa
- Ver `category-supabase.service.ts` para padrões de serviço
- Ver `category.model.ts` para estrutura de dados

---

Para dúvidas ou problemas, consulte a documentação ou abra uma issue no repositório.
