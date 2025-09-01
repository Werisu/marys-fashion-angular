import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Category,
  Product,
} from '../../../modules/data-access/product/src/lib/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Vestido Floral Elegante',
      description:
        'Vestido lindo com estampa floral, perfeito para ocasiões especiais. Tecido leve e confortável.',
      price: 89.9,
      category: 'vestidos',
      images: [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop',
      ],
      sizes: ['P', 'M', 'G', 'GG'],
      colors: ['Azul', 'Rosa'],
      inStock: true,
      featured: true,
    },
    {
      id: 2,
      name: 'Blazer Feminino Clássico',
      description:
        'Blazer elegante e versátil, ideal para o trabalho ou eventos formais. Corte moderno e confortável.',
      price: 129.9,
      category: 'blazers',
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
      ],
      sizes: ['P', 'M', 'G'],
      colors: ['Preto', 'Bege'],
      inStock: true,
      featured: true,
    },
    {
      id: 3,
      name: 'Calça Jeans Skinny',
      description:
        'Calça jeans skinny de alta qualidade, com elastano para máximo conforto e movimento.',
      price: 79.9,
      category: 'calcas',
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
      ],
      sizes: ['36', '38', '40', '42', '44'],
      colors: ['Azul', 'Preto'],
      inStock: true,
    },
    {
      id: 4,
      name: 'Blusa de Seda Premium',
      description:
        'Blusa de seda natural, leve e elegante. Perfeita para combinar com calças ou saias.',
      price: 69.9,
      category: 'blusas',
      images: [
        'https://images.unsplash.com/photo-1564257631407-3deb25f7d8c9?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1564257631407-3deb25f7d8c9?w=400&h=500&fit=crop',
      ],
      sizes: ['P', 'M', 'G'],
      colors: ['Branco', 'Azul', 'Rosa'],
      inStock: true,
    },
    {
      id: 5,
      name: 'Saia Midi Plissada',
      description:
        'Saia midi plissada com movimento elegante. Ideal para criar looks sofisticados e femininos.',
      price: 59.9,
      category: 'saias',
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
      ],
      sizes: ['P', 'M', 'G'],
      colors: ['Preto', 'Azul Marinho'],
      inStock: true,
    },
    {
      id: 6,
      name: 'Conjunto Esportivo',
      description:
        'Conjunto esportivo confortável e estiloso, perfeito para atividades físicas ou uso casual.',
      price: 99.9,
      category: 'esportivo',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
      ],
      sizes: ['P', 'M', 'G'],
      colors: ['Preto', 'Azul'],
      inStock: true,
    },
  ];

  private categories: Category[] = [
    {
      id: 'vestidos',
      name: 'Vestidos',
      description: 'Vestidos elegantes para todas as ocasiões',
      image:
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
    },
    {
      id: 'blazers',
      name: 'Blazers',
      description: 'Blazers sofisticados para o trabalho e eventos',
      image:
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
    },
    {
      id: 'calcas',
      name: 'Calças',
      description: 'Calças confortáveis e estilosas',
      image:
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop',
    },
    {
      id: 'blusas',
      name: 'Blusas',
      description: 'Blusas versáteis para qualquer look',
      image:
        'https://images.unsplash.com/photo-1564257631407-3deb25f7d8c9?w=300&h=400&fit=crop',
    },
    {
      id: 'saias',
      name: 'Saias',
      description: 'Saias femininas e elegantes',
      image:
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
    },
    {
      id: 'esportivo',
      name: 'Esportivo',
      description: 'Roupas confortáveis para atividades físicas',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop',
    },
  ];

  constructor() {}

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find((p) => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(
      (p) => p.category === category
    );
    return of(filteredProducts);
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featuredProducts = this.products.filter((p) => p.featured);
    return of(featuredProducts);
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  searchProducts(query: string): Observable<Product[]> {
    const searchResults = this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
    return of(searchResults);
  }
}
