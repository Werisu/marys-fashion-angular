import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '@marys-fashion-angular/layout';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Category, Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Header,
    FooterComponent,
    ProductCardComponent,
  ],
  template: `
    <lib-header></lib-header>

    <div class="bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Page Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Catálogo de Produtos
          </h1>
          <p class="text-lg text-gray-600">
            Descubra nossa coleção completa de roupas femininas
          </p>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Buscar Produtos</label
              >
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                placeholder="Digite o nome do produto..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Categoria</label
              >
              <select
                [(ngModel)]="selectedCategory"
                (change)="onCategoryChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Todas as Categorias</option>
                <option
                  *ngFor="let category of categories"
                  [value]="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Ordenar por</label
              >
              <select
                [(ngModel)]="sortBy"
                (change)="onSortChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="name">Nome A-Z</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="featured">Destaques</option>
              </select>
            </div>
          </div>

          <!-- Active Filters -->
          <div
            *ngIf="selectedCategory || searchQuery"
            class="mt-4 pt-4 border-t border-gray-200"
          >
            <div class="flex flex-wrap gap-2">
              <span *ngIf="selectedCategory" class="text-sm text-gray-600">
                Categoria:
                <strong>{{ getCategoryName(selectedCategory) }}</strong>
                <button
                  (click)="clearCategory()"
                  class="ml-2 text-pink-600 hover:text-pink-800"
                >
                  ✕
                </button>
              </span>
              <span *ngIf="searchQuery" class="text-sm text-gray-600">
                Busca: <strong>"{{ searchQuery }}"</strong>
                <button
                  (click)="clearSearch()"
                  class="ml-2 text-pink-600 hover:text-pink-800"
                >
                  ✕
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            Mostrando {{ filteredProducts.length }} de
            {{ totalProducts }} produtos
          </p>
          <button
            *ngIf="selectedCategory || searchQuery"
            (click)="clearAllFilters()"
            class="text-pink-600 hover:text-pink-800 font-medium"
          >
            Limpar Filtros
          </button>
        </div>

        <!-- Products Grid -->
        <div
          *ngIf="filteredProducts.length > 0; else noProducts"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <app-product-card
            *ngFor="let product of filteredProducts"
            [product]="product"
          ></app-product-card>
        </div>

        <!-- No Products Message -->
        <ng-template #noProducts>
          <div class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg
                class="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p class="text-gray-600 mb-6">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <button
              (click)="clearAllFilters()"
              class="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </ng-template>

        <!-- Load More Button -->
        <div
          *ngIf="
            filteredProducts.length > 0 &&
            filteredProducts.length < totalProducts
          "
          class="text-center mt-12"
        >
          <button
            (click)="loadMore()"
            class="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Carregar Mais Produtos
          </button>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];

  searchQuery = '';
  selectedCategory = '';
  sortBy = 'name';

  totalProducts = 0;
  itemsPerPage = 12;
  currentPage = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();

    // Check for category filter in URL
    this.route.queryParams.subscribe((params) => {
      if (params['categoria']) {
        this.selectedCategory = params['categoria'];
        this.applyFilters();
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.totalProducts = products.length;
      this.applyFilters();
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          product.category
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    // Apply sorting
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered.slice(
      0,
      this.currentPage * this.itemsPerPage
    );
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.sortBy) {
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return products.sort((a, b) => b.price - a.price);
      case 'featured':
        return products.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
      default:
        return products;
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  clearSearch() {
    this.searchQuery = '';
    this.applyFilters();
  }

  clearCategory() {
    this.selectedCategory = '';
    this.applyFilters();
  }

  clearAllFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = 'name';
    this.currentPage = 1;
    this.applyFilters();
  }

  loadMore() {
    this.currentPage++;
    this.applyFilters();
  }
}
