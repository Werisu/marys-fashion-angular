import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, of } from 'rxjs';
import { Product } from '../models/product.model';

// Interface para o cliente Supabase
interface SupabaseClient {
  from(table: string): any;
}

// Interface para o serviço Supabase
interface SupabaseService {
  getClient(): SupabaseClient;
}

// Interface para resposta do Supabase
interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

@Injectable({
  providedIn: 'root',
})
export class ProductSearch {
  private supabaseService?: SupabaseService;

  /**
   * Método para injetar o serviço Supabase (deve ser chamado pelo app principal)
   */
  setSupabaseService(service: SupabaseService) {
    this.supabaseService = service;
  }

  /**
   * Buscar produtos por nome
   */
  searchByName(name: string): Observable<Product[]> {
    if (!this.supabaseService) {
      console.warn('SupabaseService não configurado. Retornando array vazio.');
      return of([]);
    }

    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .or(
          `name.ilike.%${name}%,description.ilike.%${name}%,category.ilike.%${name}%`
        )
        .order('created_at', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError((error) => {
        console.error('Erro ao buscar produtos por nome:', error);
        return of([]);
      })
    );
  }

  /**
   * Obter produto por ID
   */
  getById(id: string): Observable<Product | undefined> {
    if (!this.supabaseService) {
      console.warn('SupabaseService não configurado. Retornando undefined.');
      return of(undefined);
    }

    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .eq('id', +id) // Converter string para number
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || undefined;
      }),
      catchError((error) => {
        console.error('Erro ao buscar produto por ID:', error);
        return of(undefined);
      })
    );
  }
}
