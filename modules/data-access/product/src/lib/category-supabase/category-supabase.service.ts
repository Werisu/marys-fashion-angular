import { Injectable } from '@angular/core';
import { SupabaseService } from '@marys-fashion-angular/supabase';
import { Observable, from, map } from 'rxjs';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategorySupabaseService {
  private supabaseService: SupabaseService | null = null;

  setSupabaseService(supabaseService: SupabaseService) {
    this.supabaseService = supabaseService;
  }

  /**
   * Obter todas as categorias
   */
  getCategories(): Observable<Category[]> {
    if (!this.supabaseService) {
      throw new Error('SupabaseService não foi configurado');
    }

    return from(
      this.supabaseService
        .getClient()
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Erro ao buscar categorias:', error);
          throw error;
        }
        return data || [];
      })
    );
  }

  /**
   * Obter categoria por ID
   */
  getCategoryById(id: number): Observable<Category | null> {
    if (!this.supabaseService) {
      throw new Error('SupabaseService não foi configurado');
    }

    return from(
      this.supabaseService
        .getClient()
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Erro ao buscar categoria:', error);
          return null;
        }
        return data;
      })
    );
  }

  /**
   * Obter categoria por nome
   */
  getCategoryByName(name: string): Observable<Category | null> {
    if (!this.supabaseService) {
      throw new Error('SupabaseService não foi configurado');
    }

    return from(
      this.supabaseService
        .getClient()
        .from('categories')
        .select('*')
        .eq('name', name)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Erro ao buscar categoria por nome:', error);
          return null;
        }
        return data;
      })
    );
  }

  /**
   * Criar nova categoria
   */
  createCategory(
    categoryData: CreateCategoryRequest
  ): Observable<Category | null> {
    if (!this.supabaseService) {
      throw new Error('SupabaseService não foi configurado');
    }

    const categoryToCreate = {
      ...categoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return from(
      this.supabaseService
        .getClient()
        .from('categories')
        .insert(categoryToCreate)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Erro ao criar categoria:', error);
          throw error;
        }
        return data;
      })
    );
  }

  /**
   * Atualizar categoria existente
   */
  updateCategory(
    id: number,
    categoryData: UpdateCategoryRequest
  ): Observable<Category | null> {
    if (!this.supabaseService) {
      throw new Error('SupabaseService não foi configurado');
    }

    const updateData = {
      ...categoryData,
      updated_at: new Date().toISOString(),
    };

    return from(
      this.supabaseService
        .getClient()
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Erro ao atualizar categoria:', error);
          throw error;
        }
        return data;
      })
    );
  }

  /**
   * Deletar categoria
   */
  deleteCategory(id: number): Observable<boolean> {
    if (!this.supabaseService) {
      throw new Error('SupabaseService não foi configurado');
    }

    return from(
      this.supabaseService.getClient().from('categories').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) {
          console.error('Erro ao deletar categoria:', error);
          throw error;
        }
        return true;
      })
    );
  }
}
