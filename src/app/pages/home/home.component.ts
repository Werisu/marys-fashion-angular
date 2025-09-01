import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Footer, Header } from '@marys-fashion-angular/layout';
import {
  Category,
  Product,
  ProductSupabaseService,
} from '@marys-fashion-angular/product-data-access';
import { SupabaseService } from '@marys-fashion-angular/supabase';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Header, Footer, ProductCardComponent],
  template: `
    <lib-header></lib-header>

    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">Mary's Fashion</h1>
          <p class="text-xl md:text-2xl mb-8 text-pink-100">
            Descubra seu estilo único com nossa coleção exclusiva de roupas
            femininas
          </p>
          <div class="space-x-4">
            <button
              (click)="goToCatalog()"
              class="bg-white text-pink-600 hover:bg-pink-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Ver Catálogo
            </button>
            <a
              href="https://wa.me/5563992345422?text=Olá! Gostaria de conhecer mais sobre os produtos."
              target="_blank"
              class="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Nossas Categorias
          </h2>
          <p class="text-lg text-gray-600">
            Encontre o que procura em nossa ampla seleção
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            *ngFor="let category of categories"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            (click)="goToCategory(category.id)"
          >
            <div class="h-48 bg-gray-200 overflow-hidden">
              <img
                [src]="category.image"
                [alt]="category.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6 text-center">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                {{ category.name }}
              </h3>
              <p class="text-gray-600">{{ category.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Produtos em Destaque
          </h2>
          <p class="text-lg text-gray-600">
            Nossas peças mais populares e elegantes
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-product-card
            *ngFor="let product of featuredProducts"
            [product]="product"
          ></app-product-card>
        </div>

        <div class="text-center mt-12">
          <button
            (click)="goToCatalog()"
            class="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Ver Todos os Produtos
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">
              Sobre a Mary's Fashion
            </h2>
            <p class="text-lg text-gray-600 mb-6">
              Somos especialistas em moda feminina, oferecendo peças únicas e
              elegantes para mulheres que valorizam qualidade, conforto e
              estilo.
            </p>
            <p class="text-lg text-gray-600 mb-8">
              Nossa missão é ajudar você a se sentir confiante e bonita em todas
              as ocasiões, com roupas que combinam perfeitamente com seu estilo
              de vida.
            </p>
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span class="text-gray-700"
                  >Qualidade premium em todos os produtos</span
                >
              </div>
              <div class="flex items-center space-x-3">
                <div
                  class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span class="text-gray-700"
                  >Atendimento personalizado via WhatsApp</span
                >
              </div>
              <div class="flex items-center space-x-3">
                <div
                  class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span class="text-gray-700">Entrega rápida e segura</span>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="bg-pink-600 rounded-lg p-8 text-white text-center">
              <h3 class="text-2xl font-bold mb-4">Faça seu Pedido Agora!</h3>
              <p class="mb-6">
                Entre em contato conosco pelo WhatsApp e receba atendimento
                personalizado
              </p>
              <a
                href="https://wa.me/5563992345422?text=Olá! Gostaria de fazer um pedido."
                target="_blank"
                class="inline-block bg-white text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Pedir pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <lib-footer></lib-footer>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];

  private productService = inject(ProductSupabaseService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  ngOnInit() {
    // Configurar o serviço antes de usar
    this.productService.setSupabaseService(this.supabaseService);

    this.loadCategories();
    this.loadFeaturedProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadFeaturedProducts() {
    this.productService.getFeaturedProducts().subscribe((products) => {
      this.featuredProducts = products;
    });
  }

  goToCatalog() {
    this.router.navigate(['/catalogo']);
  }

  goToCategory(categoryId: string | number) {
    this.router.navigate(['/catalogo'], {
      queryParams: { categoria: categoryId },
    });
  }
}
