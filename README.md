# Mary's Fashion - Site de Catálogo de Roupas

Um site moderno e responsivo para catálogo de roupas femininas, desenvolvido com Angular e Tailwind CSS.

## 🚀 Funcionalidades

### ✨ Página Inicial

- **Banner principal** com chamada para ação
- **Seção de categorias** com navegação visual
- **Produtos em destaque** para mostrar as melhores peças
- **Seção "Sobre nós"** com informações da empresa
- **Botões de WhatsApp** para contato direto

### 🛍️ Catálogo de Produtos

- **Grid responsivo** de produtos
- **Filtros por categoria** para facilitar a busca
- **Sistema de busca** por nome, descrição ou categoria
- **Ordenação** por nome, preço ou destaque
- **Paginação** com botão "Carregar mais"
- **Filtros ativos** com opção de limpeza

### 📱 Detalhes do Produto

- **Galeria de imagens** com miniaturas
- **Informações completas** do produto
- **Tamanhos e cores** disponíveis
- **Status de estoque** em tempo real
- **Produtos relacionados** da mesma categoria
- **Integração direta** com WhatsApp para pedidos

### 📱 Design Responsivo

- **Mobile-first** design
- **Navegação adaptativa** para dispositivos móveis
- **Grid flexível** que se adapta a diferentes telas
- **Componentes otimizados** para touch

## 🛠️ Tecnologias Utilizadas

- **Angular 20** - Framework principal
- **Tailwind CSS** - Framework de CSS utilitário
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **Angular Router** - Navegação entre páginas

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── header/         # Cabeçalho com navegação
│   │   ├── footer/         # Rodapé com informações
│   │   └── product-card/   # Card de produto
│   ├── models/             # Interfaces e tipos
│   │   └── product.model.ts
│   ├── pages/              # Páginas da aplicação
│   │   ├── home/           # Página inicial
│   │   ├── catalog/        # Catálogo de produtos
│   │   └── product-detail/ # Detalhes do produto
│   ├── services/           # Serviços e lógica de negócio
│   │   └── product.service.ts
│   ├── app.routes.ts       # Configuração de rotas
│   ├── app.config.ts       # Configuração da aplicação
│   └── app.ts              # Componente principal
├── styles.scss             # Estilos globais com Tailwind
└── main.ts                 # Ponto de entrada
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd marys-fashion-angular
```

2. Instale as dependências:

```bash
npm install
```

3. Execute a aplicação:

```bash
npm start
```

4. Abra o navegador em `http://localhost:4200`

### Build para Produção

```bash
npm run build
```

## 📱 Funcionalidades de WhatsApp

O site está integrado com WhatsApp para facilitar os pedidos:

- **Botão principal** no cabeçalho
- **Botões em cada produto** para pedidos específicos
- **Mensagens pré-formatadas** com informações do produto
- **Link direto** para o WhatsApp Business

### Configuração do WhatsApp

Para personalizar o número do WhatsApp, edite os arquivos:

- `src/app/components/header/header.component.ts`
- `src/app/components/footer/footer.component.ts`
- `src/app/components/product-card/product-card.component.ts`
- `src/app/pages/product-detail/product-detail.component.ts`

Substitua `5511999999999` pelo seu número real.

## 🎨 Personalização

### Cores

As cores principais podem ser alteradas no arquivo `tailwind.config.js`:

- **Primária**: Rosa (`pink-600`)
- **Secundária**: Verde para WhatsApp (`green-500`)
- **Neutras**: Tons de cinza (`gray-50`, `gray-900`)

### Produtos

Para adicionar ou modificar produtos, edite o arquivo `src/app/services/product.service.ts`:

- Adicione novos produtos no array `products`
- Modifique categorias no array `categories`
- Atualize imagens, preços e descrições

### Imagens

- Use URLs de imagens externas (como Unsplash)
- Ou adicione imagens locais na pasta `src/assets/`
- Mantenha proporção 4:5 para melhor visualização

## 🔧 Configurações Adicionais

### SEO

- Títulos e meta tags podem ser adicionados em cada componente
- Use Angular Universal para SSR se necessário

### Analytics

- Integre Google Analytics ou outras ferramentas
- Adicione tracking de eventos de clique

### Performance

- Implemente lazy loading para imagens
- Use service workers para cache offline
- Otimize bundles com tree shaking

## 📞 Suporte

Para dúvidas ou suporte:

- Abra uma issue no repositório
- Entre em contato via WhatsApp
- Consulte a documentação do Angular

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

---

**Desenvolvido com ❤️ para Mary's Fashion**
