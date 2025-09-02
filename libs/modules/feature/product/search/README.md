# Componente ProductSearch

Um componente de busca moderno e responsivo para Angular, construído com Tailwind CSS.

## Características

- 🎨 Design moderno e responsivo com Tailwind CSS
- 🔍 Campo de busca com ícone e placeholder
- ⚡ Busca em tempo real com suporte a Enter
- 🚀 Estados de loading com animações
- 📱 Totalmente responsivo para dispositivos móveis
- ♿ Acessível com suporte a teclado
- 🎭 Transições e animações suaves

## Instalação

O componente já está configurado no projeto. Para usá-lo, importe-o em seu módulo ou componente:

```typescript
import { ProductSearch } from '@modules/feature/product/search';

@Component({
  // ... outras configurações
  imports: [ProductSearch],
})
export class SeuComponente {}
```

## Uso Básico

```html
<lib-product-search (searchEvent)="onSearch($event)"></lib-product-search>
```

## API

### Inputs

Nenhum input necessário.

### Outputs

- `searchEvent: EventEmitter<string>` - Emite o termo de busca quando o usuário clica no botão ou pressiona Enter.

### Métodos Públicos

- `onSearch()` - Executa a busca
- `onClear()` - Limpa o campo de busca
- `onKeyPress(event: KeyboardEvent)` - Manipula eventos de teclado

## Exemplo de Implementação

```typescript
import { Component } from '@angular/core';
import { ProductSearch } from '@modules/feature/product/search';

@Component({
  selector: 'app-catalog',
  template: `
    <lib-product-search
      (searchEvent)="handleSearch($event)"
    ></lib-product-search>

    <div *ngIf="searchResults.length > 0">
      <h2>Resultados da busca: {{ searchTerm }}</h2>
      <!-- Exibir resultados aqui -->
    </div>
  `,
  imports: [ProductSearch],
})
export class CatalogComponent {
  searchTerm: string = '';
  searchResults: any[] = [];

  handleSearch(term: string): void {
    this.searchTerm = term;
    if (term) {
      // Implementar lógica de busca aqui
      this.performSearch(term);
    } else {
      this.searchResults = [];
    }
  }

  private performSearch(term: string): void {
    // Simular busca
    console.log('Buscando por:', term);
    // Implementar sua lógica de busca aqui
  }
}
```

## Personalização

### Cores

O componente usa as cores padrão do Tailwind CSS. Para personalizar, você pode sobrescrever as classes CSS ou modificar o arquivo `product-search.scss`.

### Tamanhos

O componente é responsivo e se adapta automaticamente ao container pai. Para alterar o tamanho máximo, modifique a classe `max-w-2xl` no template HTML.

### Animações

As animações podem ser personalizadas editando o arquivo `product-search.scss` e modificando as keyframes e transições.

## Acessibilidade

- Suporte completo a navegação por teclado
- Labels e placeholders descritivos
- Estados de foco visíveis
- Suporte a leitores de tela

## Compatibilidade

- Angular 17+
- Tailwind CSS 3.0+
- Navegadores modernos (Chrome, Firefox, Safari, Edge)

## Contribuição

Para contribuir com melhorias no componente:

1. Faça suas alterações
2. Execute os testes: `npm test`
3. Verifique a acessibilidade
4. Teste em diferentes dispositivos e navegadores
5. Envie um pull request

## Licença

Este componente faz parte do projeto Mary's Fashion Angular.
