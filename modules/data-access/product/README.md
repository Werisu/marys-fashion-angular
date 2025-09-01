# Product Data Access Library

Esta biblioteca segue a arquitetura NX com separação clara de responsabilidades entre as camadas **DATA ACCESS**, **FEATURE** e **UI**.

## 🏗️ **Estrutura da Biblioteca**

```
modules/data-access/product/src/lib/
├── models/                    # Modelos de dados (Product, Category)
├── mocks/                     # Dados mock para testes
├── product-search/            # Serviço de busca de produtos
├── product-supabase/          # Serviço principal de produtos
├── supabase/                  # Serviço de infraestrutura Supabase
└── index.ts                   # Arquivo de exportação
```

## 📦 **Serviços Disponíveis**

### **1. SupabaseService** (`/supabase`)

- **Responsabilidade**: Infraestrutura e conexão com Supabase
- **Funcionalidades**: Autenticação, configuração do cliente, gerenciamento de usuários
- **Uso**: Base para todos os outros serviços de dados

### **2. ProductSupabaseService** (`/product-supabase`)

- **Responsabilidade**: Operações CRUD de produtos
- **Funcionalidades**: Criar, ler, atualizar, deletar produtos
- **Dependência**: Requer SupabaseService configurado

### **3. ProductSearch** (`/product-search`)

- **Responsabilidade**: Busca e consultas específicas
- **Funcionalidades**: Busca por nome, busca por ID
- **Dependência**: Requer SupabaseService configurado

## 🔧 **Como Usar**

### **Importação**

```typescript
import {
  SupabaseService,
  ProductSupabaseService,
  ProductSearch,
  Product,
  Category,
} from '@marys-fashion-angular/product-data-access';
```

### **Configuração Básica**

```typescript
export class MeuComponente {
  private supabaseService = inject(SupabaseService);
  private productService = inject(ProductSupabaseService);
  private productSearch = inject(ProductSearch);

  ngOnInit() {
    // Configurar os serviços que precisam do Supabase
    this.productService.setSupabaseService(this.supabaseService);
    this.productSearch.setSupabaseService(this.supabaseService);
  }
}
```

## 🎯 **Arquitetura NX**

### **DATA ACCESS** (Esta biblioteca)

- ✅ **SupabaseService**: Infraestrutura e conexão
- ✅ **ProductSupabaseService**: Operações de produtos
- ✅ **ProductSearch**: Buscas específicas
- ✅ **Models**: Interfaces e tipos

### **FEATURE** (Componentes)

- Lógica de negócio
- Estado da aplicação
- Orquestração de serviços

### **UI** (Templates)

- Apresentação visual
- Interação com usuário
- Componentes reutilizáveis

## 🚀 **Exemplo de Uso Completo**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import {
  SupabaseService,
  ProductSupabaseService,
  Product,
} from '@marys-fashion-angular/product-data-access';

@Component({
  selector: 'app-produtos',
  template: '...',
})
export class ProdutosComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private productService = inject(ProductSupabaseService);

  products: Product[] = [];
  user$ = this.supabaseService.getCurrentUser();

  ngOnInit() {
    // 1. Configurar serviços
    this.productService.setSupabaseService(this.supabaseService);

    // 2. Carregar dados
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => (this.products = products),
      error: (error) => console.error('Erro:', error),
    });
  }
}
```

## 🔒 **Segurança**

- **Row Level Security (RLS)** configurado no Supabase
- **Autenticação** obrigatória para operações de escrita
- **Validação** de dados antes das operações
- **Tratamento de erros** robusto com fallbacks

## 📊 **Performance**

- **Queries otimizadas** com ordenação e filtros
- **Observables RxJS** para operações assíncronas
- **Cache automático** quando apropriado
- **Paginação** para grandes datasets

## 🧪 **Testes**

- **Dados mock** disponíveis para testes
- **Interfaces** bem definidas para mocks
- **Serviços** testáveis independentemente
- **Injeção de dependência** para facilitação de testes

## 🔄 **Migração**

Se você estava usando os serviços antigos:

```typescript
// ❌ ANTES (services/)
import { SupabaseService } from '../../services/supabase.service';
import { ProductSupabaseService } from '../../services/product-supabase.service';

// ✅ DEPOIS (data-access)
import {
  SupabaseService,
  ProductSupabaseService,
} from '@marys-fashion-angular/product-data-access';
```

## 🚨 **Importante**

1. **SEMPRE** configure o SupabaseService antes de usar outros serviços
2. **Verifique** as credenciais no environment.ts
3. **Configure** o RLS no Supabase para segurança
4. **Trate** os erros adequadamente nos componentes

## 📚 **Documentação Detalhada**

- [SupabaseService](./supabase/README.md) - Infraestrutura e autenticação
- [ProductSupabaseService](./product-supabase/README.md) - Operações de produtos
- [ProductSearch](./product-search/README.md) - Buscas e consultas
- [Models](./models/product.model.ts) - Interfaces e tipos

---

**Esta biblioteca segue as melhores práticas do NX e Angular, proporcionando uma arquitetura escalável e manutenível.** 🚀
