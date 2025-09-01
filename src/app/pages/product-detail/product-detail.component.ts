import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Footer, Header } from '@marys-fashion-angular/layout';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  template: `
    <lib-header></lib-header>

    <div *ngIf="product; else loading" class="bg-gray-50 min-h-screen py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <ol class="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a routerLink="/" class="hover:text-pink-600">Início</a>
            </li>
            <li>
              <span class="mx-2">/</span>
            </li>
            <li>
              <a routerLink="/catalogo" class="hover:text-pink-600">Catálogo</a>
            </li>
            <li>
              <span class="mx-2">/</span>
            </li>
            <li class="text-gray-900">{{ product.name }}</li>
          </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Product Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                [src]="selectedImage"
                [alt]="product.name"
                class="w-full h-96 object-cover"
              />
            </div>

            <!-- Thumbnail Images -->
            <div class="grid grid-cols-4 gap-2">
              <div
                *ngFor="let image of product.images; let i = index"
                (click)="selectImage(i)"
                class="cursor-pointer border-2 rounded-lg overflow-hidden"
                [class.border-pink-500]="selectedImageIndex === i"
                [class.border-gray-300]="selectedImageIndex !== i"
              >
                <img
                  [src]="image"
                  [alt]="product.name"
                  class="w-full h-20 object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Product Header -->
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                {{ product.name }}
              </h1>
              <div class="flex items-center space-x-4">
                <span class="text-3xl font-bold text-pink-600">
                  R$ {{ product.price.toFixed(2).replace('.', ',') }}
                </span>
                <span
                  *ngIf="product.featured"
                  class="bg-pink-500 text-white text-sm px-3 py-1 rounded-full"
                >
                  Destaque
                </span>
                <span
                  *ngIf="!product.inStock"
                  class="bg-red-500 text-white text-sm px-3 py-1 rounded-full"
                >
                  Esgotado
                </span>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Descrição
              </h3>
              <p class="text-gray-600 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Sizes -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                Tamanhos Disponíveis
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let size of product.sizes"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-pink-500 cursor-pointer transition-colors"
                >
                  {{ size }}
                </span>
              </div>
            </div>

            <!-- Colors -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                Cores Disponíveis
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let color of product.colors"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-pink-500 cursor-pointer transition-colors"
                >
                  {{ color }}
                </span>
              </div>
            </div>

            <!-- Stock Status -->
            <div>
              <div class="flex items-center space-x-2">
                <div
                  class="w-3 h-3 rounded-full"
                  [class.bg-green-500]="product.inStock"
                  [class.bg-red-500]="!product.inStock"
                ></div>
                <span class="text-gray-700">
                  {{ product.inStock ? 'Em estoque' : 'Esgotado' }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4 pt-6">
              <a
                [href]="getWhatsAppLink()"
                target="_blank"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M2.003 2.833C2.003 1.82 2.833 1 3.847 1h12.306c1.014 0 1.844.82 1.844 1.833v17.334c0 1.013-.83 1.833-1.844 1.833H3.847c-1.014 0-1.844-.82-1.844-1.833V2.833zM14.5 15.5c0 .276-.224.5-.5.5h-1.5c-.276 0-.5-.224-.5-.5v-1.5c0-.276.224-.5.5-.5h1.5c.276 0 .5.224.5.5v1.5zm-3 0c0 .276-.224.5-.5.5h-1.5c-.276 0-.5-.224-.5-.5v-1.5c0-.276.224-.5.5-.5h1.5c.276 0 .5.224.5.5v1.5zm-3 0c0 .276-.224.5-.5.5h-1.5c-.276 0-.5-.224-.5-.5v-1.5c0-.276.224-.5.5-.5h1.5c.276 0 .5.224.5.5v1.5z"
                  />
                </svg>
                <span>Fazer Pedido pelo WhatsApp</span>
              </a>

              <button
                (click)="goBack()"
                class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
              >
                Voltar ao Catálogo
              </button>
            </div>

            <!-- Additional Info -->
            <div class="bg-gray-100 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Informações Adicionais
              </h3>
              <div class="space-y-3 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>Categoria:</span>
                  <span class="font-medium">{{
                    getCategoryDisplayName(product.category)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Referência:</span>
                  <span class="font-medium"
                    >#{{ product.id.toString().padStart(4, '0') }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span>Disponibilidade:</span>
                  <span class="font-medium">{{
                    product.inStock ? 'Imediata' : 'Sob consulta'
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products Section -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
            Produtos Relacionados
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              *ngFor="let relatedProduct of relatedProducts.slice(0, 3)"
              class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              (click)="viewProduct(relatedProduct.id)"
            >
              <div class="h-48 bg-gray-200 overflow-hidden">
                <img
                  [src]="relatedProduct.images[0]"
                  [alt]="relatedProduct.name"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-800 mb-2">
                  {{ relatedProduct.name }}
                </h3>
                <p class="text-pink-600 font-bold">
                  R$ {{ relatedProduct.price.toFixed(2).replace('.', ',') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Template -->
    <ng-template #loading>
      <div class="bg-gray-50 min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    </ng-template>

    <lib-footer></lib-footer>
  `,
  styles: [],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImageIndex = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(productId: number) {
    this.productService.getProductById(productId).subscribe((product) => {
      if (product) {
        this.product = product;
        this.loadRelatedProducts(product.category, productId);
      } else {
        this.router.navigate(['/catalogo']);
      }
    });
  }

  loadRelatedProducts(category: string, excludeId: number) {
    this.productService
      .getProductsByCategory(category)
      .subscribe((products) => {
        this.relatedProducts = products.filter((p) => p.id !== excludeId);
      });
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  get selectedImage(): string {
    return this.product ? this.product.images[this.selectedImageIndex] : '';
  }

  getCategoryDisplayName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      vestidos: 'Vestidos',
      blazers: 'Blazers',
      calcas: 'Calças',
      blusas: 'Blusas',
      saias: 'Saias',
      esportivo: 'Esportivo',
    };
    return categoryNames[category] || category;
  }

  getWhatsAppLink(): string {
    if (!this.product) return '';

    const message = `Olá! Gostaria de fazer um pedido do produto: ${
      this.product.name
    } - R$ ${this.product.price.toFixed(2).replace('.', ',')}`;
    return `https://wa.me/5563992345422?text=${encodeURIComponent(message)}`;
  }

  viewProduct(productId: number) {
    this.router.navigate(['/produto', productId]);
  }

  goBack() {
    this.router.navigate(['/catalogo']);
  }
}
