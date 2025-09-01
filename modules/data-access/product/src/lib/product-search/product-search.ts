import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
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

// Interface para sugestões de autocomplete
export interface AutocompleteSuggestion {
  id: string;
  text: string;
  type: 'name' | 'category' | 'description';
  highlight?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductSearch {
  private supabaseService?: SupabaseService;
  private searchCache = new Map<string, Product[]>();
  private suggestionsCache = new Map<string, AutocompleteSuggestion[]>();

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

    // Verificar cache primeiro
    if (this.searchCache.has(name)) {
      return of(this.searchCache.get(name)!);
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
        .limit(50) // Limitar resultados para performance
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        const products = response.data || [];
        // Armazenar no cache
        this.searchCache.set(name, products);
        return products;
      }),
      catchError((error) => {
        console.error('Erro ao buscar produtos por nome:', error);
        return of([]);
      })
    );
  }

  /**
   * Buscar sugestões para autocomplete
   */
  getAutocompleteSuggestions(
    query: string
  ): Observable<AutocompleteSuggestion[]> {
    if (!query.trim() || query.length < 2) {
      return of([]);
    }

    // Verificar cache primeiro
    if (this.suggestionsCache.has(query)) {
      return of(this.suggestionsCache.get(query)!);
    }

    if (!this.supabaseService) {
      console.warn('SupabaseService não configurado. Retornando array vazio.');
      return of([]);
    }

    return from(
      this.supabaseService
        .getClient()
        .from('products')
        .select('id, name, category, description')
        .or(
          `name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`
        )
        .order('name', { ascending: true })
        .limit(10) // Limitar sugestões para melhor UX
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        const products = response.data || [];

        // Criar sugestões únicas e relevantes
        const suggestions = this.createAutocompleteSuggestions(query, products);

        // Armazenar no cache
        this.suggestionsCache.set(query, suggestions);

        return suggestions;
      }),
      catchError((error) => {
        console.error('Erro ao buscar sugestões de autocomplete:', error);
        return of([]);
      })
    );
  }

  /**
   * Criar sugestões de autocomplete a partir dos produtos
   */
  private createAutocompleteSuggestions(
    query: string,
    products: Product[]
  ): AutocompleteSuggestion[] {
    const suggestions: AutocompleteSuggestion[] = [];
    const queryLower = query.toLowerCase();
    const seen = new Set<string>();

    // Processar nomes de produtos
    products.forEach((product) => {
      if (product.name && !seen.has(product.name.toLowerCase())) {
        const nameLower = product.name.toLowerCase();
        if (nameLower.includes(queryLower)) {
          suggestions.push({
            id: product.id.toString(),
            text: product.name,
            type: 'name',
            highlight: this.highlightMatch(product.name, query),
          });
          seen.add(product.name.toLowerCase());
        }
      }
    });

    // Processar categorias
    products.forEach((product) => {
      if (product.category && !seen.has(product.category.toLowerCase())) {
        const categoryLower = product.category.toLowerCase();
        if (categoryLower.includes(queryLower)) {
          suggestions.push({
            id: `cat_${product.category}`,
            text: product.category,
            type: 'category',
            highlight: this.highlightMatch(product.category, query),
          });
          seen.add(product.category.toLowerCase());
        }
      }
    });

    // Processar descrições (apenas se não tiver muitas sugestões)
    if (suggestions.length < 5) {
      products.forEach((product) => {
        if (product.description) {
          const descLower = product.description.toLowerCase();
          if (descLower.includes(queryLower)) {
            const words = product.description
              .split(' ')
              .filter(
                (word) =>
                  word.toLowerCase().includes(queryLower) && word.length > 2
              );

            words.forEach((word) => {
              if (!seen.has(word.toLowerCase()) && suggestions.length < 10) {
                suggestions.push({
                  id: `desc_${word}`,
                  text: word,
                  type: 'description',
                  highlight: this.highlightMatch(word, query),
                });
                seen.add(word.toLowerCase());
              }
            });
          }
        }
      });
    }

    return suggestions.slice(0, 10);
  }

  /**
   * Destacar a parte da query na sugestão
   */
  private highlightMatch(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  /**
   * Limpar cache de busca
   */
  clearSearchCache(): void {
    this.searchCache.clear();
  }

  /**
   * Limpar cache de sugestões
   */
  clearSuggestionsCache(): void {
    this.suggestionsCache.clear();
  }

  /**
   * Limpar todo o cache
   */
  clearAllCache(): void {
    this.searchCache.clear();
    this.suggestionsCache.clear();
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

  /**
   * Busca com debounce para autocomplete
   */
  getAutocompleteSuggestionsWithDebounce(
    query$: Observable<string>
  ): Observable<AutocompleteSuggestion[]> {
    return query$.pipe(
      debounceTime(300), // Aguardar 300ms após o usuário parar de digitar
      distinctUntilChanged(), // Só emitir se a query mudou
      switchMap((query) => this.getAutocompleteSuggestions(query))
    );
  }
}
