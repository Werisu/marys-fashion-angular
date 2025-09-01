# ProductSearch Service

Este serviço fornece funcionalidades de busca de produtos usando Supabase, seguindo o padrão do `ProductSupabaseService`.

## Funcionalidades

- **`searchByName(name: string)`**: Busca produtos por nome, descrição ou categoria
- **`getById(id: string)`**: Obtém um produto específico por ID

## Como Usar

### 1. Importar o Serviço

```typescript
import { ProductSearch } from '@marys-fashion-angular/product-data-access';
```

### 2. Injetar no Componente

```typescript
import { inject } from '@angular/core';

export class MeuComponente {
  private productSearch = inject(ProductSearch);
}
```

### 3. Configurar o SupabaseService

```typescript
import { SupabaseService } from 'caminho/para/supabase.service';

export class MeuComponente {
  private productSearch = inject(ProductSearch);
  private supabaseService = inject(SupabaseService);

  ngOnInit() {
    // Configurar o serviço Supabase
    this.productSearch.setSupabaseService(this.supabaseService);
  }
}
```

### 4. Usar as Funcionalidades

```typescript
// Buscar produtos por nome
this.productSearch.searchByName('vestido').subscribe({
  next: (products) => {
    console.log('Produtos encontrados:', products);
  },
  error: (error) => {
    console.error('Erro na busca:', error);
  },
});

// Obter produto por ID
this.productSearch.getById('123').subscribe({
  next: (product) => {
    if (product) {
      console.log('Produto encontrado:', product);
    } else {
      console.log('Produto não encontrado');
    }
  },
  error: (error) => {
    console.error('Erro ao buscar produto:', error);
  },
});
```

## Características

- ✅ **Integração com Supabase**: Usa o mesmo padrão do `ProductSupabaseService`
- ✅ **Tratamento de Erros**: Inclui tratamento robusto de erros
- ✅ **Fallback Seguro**: Retorna arrays vazios ou undefined em caso de erro
- ✅ **Tipagem TypeScript**: Totalmente tipado com interfaces
- ✅ **RxJS**: Usa Observables para operações assíncronas

## Estrutura da Busca

A busca por nome inclui:

- Nome do produto
- Descrição do produto
- Categoria do produto

Os resultados são ordenados por data de criação (mais recentes primeiro).
