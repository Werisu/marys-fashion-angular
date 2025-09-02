# Exemplo de Uso do Componente ProductSearch

## Implementação Básica

```typescript
import { Component } from '@angular/core';
import { ProductSearch } from '@marys-fashion-angular/product-search';

@Component({
  selector: 'app-exemplo',
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Exemplo de Busca</h1>

      <lib-product-search
        (searchEvent)="handleSearch($event)"
      ></lib-product-search>

      <div *ngIf="searchResults.length > 0" class="mt-6">
        <h2 class="text-lg font-semibold mb-3">
          Resultados para: "{{ searchTerm }}"
        </h2>
        <ul class="space-y-2">
          <li
            *ngFor="let result of searchResults"
            class="p-3 bg-white rounded-lg shadow border"
          >
            {{ result }}
          </li>
        </ul>
      </div>

      <div *ngIf="searchTerm && searchResults.length === 0" class="mt-6">
        <p class="text-gray-600">
          Nenhum resultado encontrado para "{{ searchTerm }}"
        </p>
      </div>
    </div>
  `,
  imports: [ProductSearch],
  standalone: true,
})
export class ExemploComponent {
  searchTerm: string = '';
  searchResults: string[] = [];

  handleSearch(term: string): void {
    this.searchTerm = term;

    if (term.trim()) {
      // Simular busca
      this.searchResults = [
        `Resultado 1 para "${term}"`,
        `Resultado 2 para "${term}"`,
        `Resultado 3 para "${term}"`,
      ];
    } else {
      this.searchResults = [];
    }
  }
}
```

## Características do Componente

### ✅ Funcionalidades Implementadas

- Campo de busca com ícone de lupa
- Botão de busca com estado de loading
- Suporte a busca com Enter
- Botão de limpar busca
- Design responsivo com Tailwind CSS
- Animações e transições suaves
- Estados de foco e hover
- Acessibilidade completa

### 🎨 Design Features

- Cores modernas e consistentes
- Sombras e bordas arredondadas
- Transições suaves em todos os elementos
- Ícones SVG integrados
- Layout responsivo para mobile e desktop

### 🔧 Personalização

- Fácil customização de cores via Tailwind
- Animações personalizáveis via SCSS
- Tamanhos adaptáveis ao container pai
- Estados visuais para diferentes interações

## Integração com Backend

```typescript
// Exemplo de integração com serviço de produtos
handleSearch(term: string): void {
  if (term.trim()) {
    this.productService.searchProducts(term).subscribe({
      next: (products) => {
        this.searchResults = products;
      },
      error: (error) => {
        console.error('Erro na busca:', error);
        this.searchResults = [];
      }
    });
  } else {
    this.searchResults = [];
  }
}
```

## Estilos Personalizados

Para personalizar o componente, você pode sobrescrever as classes Tailwind ou modificar o arquivo `product-search.scss`:

```scss
// Exemplo de personalização
:host {
  .search-input {
    @apply border-pink-300 focus:border-pink-500 focus:ring-pink-500;
  }

  .search-button {
    @apply bg-pink-600 hover:bg-pink-700;
  }
}
```

## Acessibilidade

O componente inclui:

- Suporte completo a navegação por teclado
- Labels e placeholders descritivos
- Estados de foco visíveis
- Compatibilidade com leitores de tela
- Atributos ARIA apropriados

## Compatibilidade

- ✅ Angular 17+
- ✅ Tailwind CSS 3.0+
- ✅ Navegadores modernos
- ✅ Dispositivos móveis
- ✅ Modo escuro (via Tailwind)
