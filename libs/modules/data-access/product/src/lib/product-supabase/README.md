# ProductSupabaseService

Este serviço de **Data Access** gerencia todas as operações de produtos via Supabase, seguindo a arquitetura NX com separação clara de responsabilidades.

## 🏗️ **Arquitetura NX**

- **DATA ACCESS**: Este serviço (operações de banco)
- **FEATURE**: Lógica de negócio dos componentes
- **UI**: Componentes de interface

## 🔧 **Configuração**

### 1. **Importar o Serviço**

```typescript
import { ProductSupabaseService } from '@marys-fashion-angular/product-data-access';
```

### 2. **Configurar o SupabaseService**

```typescript
import { SupabaseService } from 'src/app/services/supabase.service';

export class MeuComponente {
  private productService = inject(ProductSupabaseService);
  private supabaseService = inject(SupabaseService);

  ngOnInit() {
    // Configurar o serviço antes de usar
    this.productService.setSupabaseService(this.supabaseService);
  }
}
```

## 📋 **Funcionalidades Disponíveis**

### **Leitura de Dados**

- `getProducts()` - Todos os produtos
- `getProductById(id)` - Produto específico
- `getProductsByCategory(category)` - Produtos por categoria
- `getFeaturedProducts()` - Produtos em destaque
- `getCategories()` - Todas as categorias
- `searchProducts(query)` - Busca por texto

### **Operações de Escrita (Autenticadas)**

- `createProduct(product)` - Criar produto
- `updateProduct(id, updates)` - Atualizar produto
- `deleteProduct(id)` - Deletar produto
- `uploadImage(file, path)` - Upload de imagem

## 🚨 **Importante**

- **SEMPRE** chame `setSupabaseService()` antes de usar qualquer método
- O serviço verifica automaticamente se está configurado
- Operações de escrita requerem autenticação
- Tratamento de erros robusto com fallbacks seguros

## 💡 **Exemplo de Uso Completo**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ProductSupabaseService } from '@marys-fashion-angular/product-data-access';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-produtos',
  template: '...',
})
export class ProdutosComponent implements OnInit {
  private productService = inject(ProductSupabaseService);
  private supabaseService = inject(SupabaseService);

  products: Product[] = [];

  ngOnInit() {
    // 1. Configurar o serviço
    this.productService.setSupabaseService(this.supabaseService);

    // 2. Usar as funcionalidades
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      },
    });
  }
}
```

## 🔒 **Segurança**

- Todas as operações de escrita verificam autenticação
- Row Level Security (RLS) configurado no Supabase
- Validação de dados antes das operações
- Logs de erro para debugging

## 📊 **Performance**

- Queries otimizadas com ordenação
- Paginação automática para grandes datasets
- Cache de dados quando apropriado
- Tratamento assíncrono com RxJS
