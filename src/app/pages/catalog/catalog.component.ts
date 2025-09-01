import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Footer, Header } from '@marys-fashion-angular/layout';
import {
  Category,
  Product,
  ProductSupabaseService,
} from '@marys-fashion-angular/product-data-access';
import { ProductSearchComponent } from '@marys-fashion-angular/product-search';
import { SupabaseService } from '@marys-fashion-angular/supabase';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Header,
    Footer,
    ProductCardComponent,
    ProductSearchComponent,
  ],
  template: `
    <lib-header></lib-header>

    <div class="bg-gray-50 min-h-screen py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Catálogo de Produtos
          </h1>
          <p class="text-lg text-gray-600">
            Descubra nossa coleção exclusiva de roupas femininas
          </p>
        </div>

        <!-- Componente de Busca -->
        <div class="mb-8">
          <lib-product-search
            (searchEvent)="onSearchEvent($event)"
          ></lib-product-search>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Category Filter -->
            <div>
              <label
                for="category"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Categoria</label
              >
              <select
                id="category"
                [(ngModel)]="selectedCategory"
                (change)="onCategoryChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Todas as Categorias</option>
                <option
                  *ngFor="let category of categories"
                  [value]="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label
                for="sort"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Ordenar por</label
              >
              <select
                id="sort"
                [(ngModel)]="sortBy"
                (change)="onSortChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="name">Nome</option>
                <option value="price">Preço</option>
                <option value="created_at">Mais Recentes</option>
              </select>
            </div>
          </div>

          <!-- Clear Filters -->
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              *ngIf="searchQuery"
              (click)="clearSearch()"
              class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm"
            >
              Limpar busca
            </button>
            <button
              *ngIf="selectedCategory"
              (click)="clearCategory()"
              class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm"
            >
              Limpar categoria
            </button>
            <button
              *ngIf="searchQuery || selectedCategory"
              (click)="clearAllFilters()"
              class="px-3 py-1 bg-pink-200 hover:bg-pink-300 text-pink-700 rounded-full text-sm"
            >
              Limpar todos os filtros
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mb-6">
          <p class="text-gray-600">
            {{ totalProducts }} produto{{
              totalProducts !== 1 ? 's' : ''
            }}
            encontrado{{ totalProducts !== 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Products Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <app-product-card
            *ngFor="let product of filteredProducts"
            [product]="product"
          ></app-product-card>
        </div>

        <!-- Load More -->
        <div
          *ngIf="filteredProducts.length < totalProducts"
          class="text-center mt-12"
        >
          <button
            (click)="loadMore()"
            class="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Carregar Mais Produtos
          </button>
        </div>

        <!-- No Results -->
        <div
          *ngIf="filteredProducts.length === 0 && totalProducts > 0"
          class="text-center py-12"
        >
          <div class="text-gray-500">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p class="text-gray-600">
              Tente ajustar os filtros ou fazer uma nova busca.
            </p>
          </div>
        </div>
      </div>
    </div>

    <lib-footer></lib-footer>
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

  private productService = inject(ProductSupabaseService);
  private supabaseService = inject(SupabaseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    // Configurar o serviço antes de usar
    this.productService.setSupabaseService(this.supabaseService);

    this.loadProducts();
    this.loadCategories();
    this.checkQueryParams();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.applyFilters();
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSearchEvent(searchTerm: string): void {
    this.searchQuery = searchTerm;
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

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    // Sort
    filtered = this.sortProducts(filtered);

    this.totalProducts = filtered.length;
    this.filteredProducts = filtered.slice(
      0,
      this.currentPage * this.itemsPerPage
    );
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.sortBy) {
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return products.sort((a, b) => a.price - b.price);
      case 'created_at':
        return products.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        });
      default:
        return products;
    }
  }

  getCategoryName(categoryName: string): string {
    return categoryName;
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearchEvent('');
  }

  clearCategory() {
    this.selectedCategory = '';
    this.onCategoryChange();
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

  private checkQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (params['categoria']) {
        this.selectedCategory = params['categoria'];
        this.onCategoryChange();
      }
    });
  }
}
