import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@marys-fashion-angular/product-data-access';

@Component({
  selector: 'lib-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input() product!: Product;

  constructor(private router: Router) {}

  viewProduct() {
    this.router.navigate(['/produto', this.product.id]);
  }

  getWhatsAppLink(): string {
    const message = `Olá! Gostaria de fazer um pedido do produto: ${
      this.product.name
    } - R$ ${this.product.price.toFixed(2).replace('.', ',')}`;
    return `https://wa.me/5563992345422?text=${encodeURIComponent(message)}`;
  }
}
