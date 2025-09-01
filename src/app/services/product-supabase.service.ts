import { Injectable } from '@angular/core';
import { Category, Product } from '@marys-fashion-angular/product-data-access';
import { Observable, catchError, from, map, of } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ProductSupabaseService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Obter todos os produtos
   */
  getProducts(): Observable<Product[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      }),
      catchError((error) => {
        console.error('Erro ao buscar produtos:', error);
        return of([]);
      })
    );
  }

  /**
   * Obter produto por ID
   */
  getProductById(id: number): Observable<Product | undefined> {
    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || undefined;
      }),
      catchError((error) => {
        console.error('Erro ao buscar produto:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Obter produtos por categoria
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      }),
      catchError((error) => {
        console.error('Erro ao buscar produtos por categoria:', error);
        return of([]);
      })
    );
  }

  /**
   * Obter produtos em destaque
   */
  getFeaturedProducts(): Observable<Product[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      }),
      catchError((error) => {
        console.error('Erro ao buscar produtos em destaque:', error);
        return of([]);
      })
    );
  }

  /**
   * Obter todas as categorias
   */
  getCategories(): Observable<Category[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      }),
      catchError((error) => {
        console.error('Erro ao buscar categorias:', error);
        return of([]);
      })
    );
  }

  /**
   * Buscar produtos
   */
  searchProducts(query: string): Observable<Product[]> {
    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
        )
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      }),
      catchError((error) => {
        console.error('Erro ao buscar produtos:', error);
        return of([]);
      })
    );
  }

  /**
   * Criar novo produto (apenas para usuários autenticados)
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product | null> {
    if (!this.supabaseService.isAuthenticated()) {
      console.error('Usuário não autenticado');
      return of(null);
    }

    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .insert([product])
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      catchError((error) => {
        console.error('Erro ao criar produto:', error);
        return of(null);
      })
    );
  }

  /**
   * Atualizar produto (apenas para usuários autenticados)
   */
  updateProduct(
    id: number,
    updates: Partial<Product>
  ): Observable<Product | null> {
    if (!this.supabaseService.isAuthenticated()) {
      console.error('Usuário não autenticado');
      return of(null);
    }

    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      catchError((error) => {
        console.error('Erro ao atualizar produto:', error);
        return of(null);
      })
    );
  }

  /**
   * Deletar produto (apenas para usuários autenticados)
   */
  deleteProduct(id: number): Observable<boolean> {
    if (!this.supabaseService.isAuthenticated()) {
      console.error('Usuário não autenticado');
      return of(false);
    }

    return from(
      this.supabaseService.getClient().from('products').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return true;
      }),
      catchError((error) => {
        console.error('Erro ao deletar produto:', error);
        return of(false);
      })
    );
  }

  /**
   * Upload de imagem para storage
   */
  uploadImage(file: File, path: string): Observable<string | null> {
    if (!this.supabaseService.isAuthenticated()) {
      console.error('Usuário não autenticado');
      return of(null);
    }

    return from(
      this.supabaseService
        .getClient()
        .storage.from('product-images')
        .upload(path, file)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        // Retornar URL pública da imagem
        const {
          data: { publicUrl },
        } = this.supabaseService
          .getClient()
          .storage.from('product-images')
          .getPublicUrl(path);

        return publicUrl;
      }),
      catchError((error) => {
        console.error('Erro ao fazer upload da imagem:', error);
        return of(null);
      })
    );
  }
}
