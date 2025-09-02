import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Footer, Header } from '@marys-fashion-angular/layout';
import {
  Product,
  ProductCategory,
  ProductSupabaseService,
} from '@marys-fashion-angular/product-data-access';
import { ProductCard } from '@marys-fashion-angular/product-ui';
import { SupabaseService } from '@marys-fashion-angular/supabase';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [Header, Footer, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  categories: ProductCategory[] = [];
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
