import { Injectable } from '@angular/core';
import { SupabaseService } from '@marys-fashion-angular/supabase';
import { Observable, catchError, from, map, of } from 'rxjs';
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserFilters,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserSupabaseService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Obtém todos os usuários com filtros opcionais
   */
  getUsers(filters?: UserFilters): Observable<User[]> {
    return from(this.supabaseService.getClient().auth.admin.listUsers()).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        let users = response.data.users.map((user) => ({
          id: user.id,
          email: user.email || '',
          role: this.mapUserRole(user.user_metadata?.role || 'user'),
          is_active: user.user_metadata?.is_active !== false,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          full_name: user.user_metadata?.full_name,
          phone: user.user_metadata?.phone,
        }));

        // Aplicar filtros
        if (filters) {
          if (filters.role) {
            users = users.filter((user) => user.role === filters.role);
          }
          if (filters.is_active !== undefined) {
            users = users.filter(
              (user) => user.is_active === filters.is_active
            );
          }
          if (filters.search) {
            const search = filters.search.toLowerCase();
            users = users.filter(
              (user) =>
                user.email.toLowerCase().includes(search) ||
                (user.full_name &&
                  user.full_name.toLowerCase().includes(search))
            );
          }
        }

        return users;
      }),
      catchError((error) => {
        console.error('Erro ao buscar usuários:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtém um usuário específico por ID
   */
  getUserById(id: string): Observable<User | null> {
    return from(
      this.supabaseService.getClient().auth.admin.getUserById(id)
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        const user = response.data.user;
        if (!user) return null;

        return {
          id: user.id,
          email: user.email || '',
          role: this.mapUserRole(user.user_metadata?.role || 'user'),
          is_active: user.user_metadata?.is_active !== false,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          full_name: user.user_metadata?.full_name,
          phone: user.user_metadata?.phone,
        };
      }),
      catchError((error) => {
        console.error('Erro ao buscar usuário:', error);
        return of(null);
      })
    );
  }

  /**
   * Cria um novo usuário
   */
  createUser(userData: CreateUserRequest): Observable<User | null> {
    return from(
      this.supabaseService.getClient().auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          role: userData.role,
          is_active: true,
          full_name: userData.full_name,
          phone: userData.phone,
        },
      })
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        const user = response.data.user;
        if (!user) return null;

        return {
          id: user.id,
          email: user.email || '',
          role: this.mapUserRole(user.user_metadata?.role || 'user'),
          is_active: user.user_metadata?.is_active !== false,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          full_name: user.user_metadata?.full_name,
          phone: user.user_metadata?.phone,
        };
      }),
      catchError((error) => {
        console.error('Erro ao criar usuário:', error);
        return of(null);
      })
    );
  }

  /**
   * Atualiza um usuário existente
   */
  updateUser(userData: UpdateUserRequest): Observable<User | null> {
    return from(
      this.supabaseService.getClient().auth.admin.updateUserById(userData.id, {
        user_metadata: {
          role: userData.role,
          is_active: userData.is_active,
          full_name: userData.full_name,
          phone: userData.phone,
        },
      })
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        const user = response.data.user;
        if (!user) return null;

        return {
          id: user.id,
          email: user.email || '',
          role: this.mapUserRole(user.user_metadata?.role || 'user'),
          is_active: user.user_metadata?.is_active !== false,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          full_name: user.user_metadata?.full_name,
          phone: user.user_metadata?.phone,
        };
      }),
      catchError((error) => {
        console.error('Erro ao atualizar usuário:', error);
        return of(null);
      })
    );
  }

  /**
   * Desativa um usuário
   */
  deactivateUser(id: string): Observable<boolean> {
    return from(
      this.supabaseService.getClient().auth.admin.updateUserById(id, {
        user_metadata: { is_active: false },
      })
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return true;
      }),
      catchError((error) => {
        console.error('Erro ao desativar usuário:', error);
        return of(false);
      })
    );
  }

  /**
   * Reativa um usuário
   */
  activateUser(id: string): Observable<boolean> {
    return from(
      this.supabaseService.getClient().auth.admin.updateUserById(id, {
        user_metadata: { is_active: true },
      })
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return true;
      }),
      catchError((error) => {
        console.error('Erro ao reativar usuário:', error);
        return of(false);
      })
    );
  }

  /**
   * Exclui um usuário permanentemente
   */
  deleteUser(id: string): Observable<boolean> {
    return from(
      this.supabaseService.getClient().auth.admin.deleteUser(id)
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return true;
      }),
      catchError((error) => {
        console.error('Erro ao excluir usuário:', error);
        return of(false);
      })
    );
  }

  /**
   * Mapeia o papel do usuário para valores válidos
   */
  private mapUserRole(role: string): 'admin' | 'user' | 'moderator' {
    switch (role) {
      case 'admin':
      case 'moderator':
        return role;
      default:
        return 'user';
    }
  }
}
