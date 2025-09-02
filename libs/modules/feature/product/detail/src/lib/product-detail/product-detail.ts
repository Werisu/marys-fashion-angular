import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Footer, Header } from '@marys-fashion-angular/layout';
import {
  Product,
  ProductSupabaseService,
} from '@marys-fashion-angular/product-data-access';
import { SupabaseService } from '@marys-fashion-angular/supabase';

@Component({
  selector: 'lib-product-detail',
  imports: [Header, Footer, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImageIndex = 0;

  private productService = inject(ProductSupabaseService);
  private supabaseService = inject(SupabaseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    // Configurar o serviço antes de usar
    this.productService.setSupabaseService(this.supabaseService);

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
}
