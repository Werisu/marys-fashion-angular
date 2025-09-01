import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Footer, Header } from '@marys-fashion-angular/layout';
import {
  Category,
  Product,
  ProductSupabaseService,
} from '@marys-fashion-angular/product-data-access';
import { SupabaseService } from '@marys-fashion-angular/supabase';
import { ProductCardComponent } from './../../../../../../src/app/components/product-card/product-card.component';

@Component({
  selector: 'lib-home',
  imports: [Header, Footer, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
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
