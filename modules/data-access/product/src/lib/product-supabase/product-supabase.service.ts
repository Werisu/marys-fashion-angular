import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, of } from 'rxjs';
import { Product, ProductCategory } from '../models/product.model';

// Interface para o cliente Supabase
interface SupabaseClient {
  from(table: string): any;
}

// Interface para o serviço Supabase
interface SupabaseService {
  getClient(): SupabaseClient;
  isAuthenticated(): boolean;
}

/**
 * Serviço de data access para gerenciar produtos via Supabase
 *
 * Este serviço deve ser configurado com uma instância do SupabaseService
 * antes de ser usado.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductSupabaseService {
  private supabaseService?: SupabaseService;

  /**
   * Configurar o serviço Supabase
   */
  setSupabaseService(service: SupabaseService) {
    this.supabaseService = service;
  }

  /**
   * Verificar se o serviço está configurado
   */
  private checkService(): boolean {
    if (!this.supabaseService) {
      console.error(
        'SupabaseService não configurado. Use setSupabaseService() primeiro.'
      );
      return false;
    }
    return true;
  }

  /**
   * Obter todos os produtos
   */
  getProducts(): Observable<Product[]> {
    if (!this.checkService()) return of([]);

    return from(
      this.supabaseService!.getClient()
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || [];
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
    if (!this.checkService()) return of(undefined);

    return from(
      this.supabaseService!.getClient()
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || undefined;
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
    if (!this.checkService()) return of([]);

    return from(
      this.supabaseService!.getClient()
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || [];
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
    if (!this.checkService()) return of([]);

    return from(
      this.supabaseService!.getClient()
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || [];
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
  getCategories(): Observable<ProductCategory[]> {
    if (!this.checkService()) return of([]);

    return from(
      this.supabaseService!.getClient()
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || [];
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
    if (!this.checkService()) return of([]);

    return from(
      this.supabaseService!.getClient()
        .from('products')
        .select('*')
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
        )
        .order('created_at', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || [];
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
    if (!this.checkService()) return of(null);
    if (!this.supabaseService!.isAuthenticated()) {
      console.error('Usuário não autenticado');
      return of(null);
    }

    return from(
      this.supabaseService!.getClient()
        .from('products')
        .insert([product])
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data;
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
    if (!this.checkService()) return of(null);
    if (!this.supabaseService!.isAuthenticated()) {
      console.error('Usuário não autenticado');
      return of(null);
    }

    return from(
      this.supabaseService!.getClient()
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data;
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
    if (!this.checkService()) return of(false);
    if (!this.supabaseService!.isAuthenticated()) {
      console.error('Usuário não autenticado');
      return of(false);
    }

    return from(
      this.supabaseService!.getClient().from('products').delete().eq('id', id)
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
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
   * TODO: Implementar quando storage estiver configurado
   */
  uploadImage(file: File, path: string): Observable<string | null> {
    console.warn('Upload de imagem não implementado ainda');
    return of(null);
  }
}
