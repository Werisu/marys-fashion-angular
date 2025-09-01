import { Product } from '../models/product.model';

export const mockProducts: Product[] = [
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
