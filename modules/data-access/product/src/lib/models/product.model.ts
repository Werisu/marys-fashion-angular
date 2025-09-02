export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  id: string | number;
  name: string;
  description: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}
