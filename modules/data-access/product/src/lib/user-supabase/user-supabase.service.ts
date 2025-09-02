import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@marys-fashion-angular/supabase';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
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
  private supabaseService = inject(SupabaseService);

  /**
   * Obtém todos os usuários com filtros opcionais
   * Sincroniza dados entre auth.users e user_profiles
   */
  getUsers(filters?: UserFilters): Observable<User[]> {
    return from(
      this.supabaseService.getAdminClient().auth.admin.listUsers()
    ).pipe(
      switchMap((authResponse) => {
        if (authResponse.error) {
          throw new Error(authResponse.error.message);
        }

        // Buscar perfis correspondentes na tabela user_profiles
        const userIds = authResponse.data.users.map((user) => user.id);

        return from(
          this.supabaseService
            .getClient()
            .from('user_profiles')
            .select('*')
            .in('id', userIds)
        ).pipe(
          map((profilesResponse) => {
            const profiles = profilesResponse.data || [];

            // Combinar dados do auth.users com user_profiles
            let users = authResponse.data.users.map((authUser) => {
              const profile = profiles.find((p) => p.id === authUser.id);

              return {
                id: authUser.id,
                email: authUser.email || '',
                role: this.mapUserRole(
                  profile?.role || authUser.user_metadata?.['role'] || 'user'
                ),
                is_active:
                  profile?.is_active ??
                  authUser.user_metadata?.['is_active'] ??
                  true,
                created_at: authUser.created_at,
                updated_at:
                  profile?.updated_at ||
                  authUser.updated_at ||
                  authUser.created_at,
                last_sign_in_at: authUser.last_sign_in_at,
                full_name:
                  profile?.full_name || authUser.user_metadata?.['full_name'],
                phone: profile?.phone || authUser.user_metadata?.['phone'],
              };
            });

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
          })
        );
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
      this.supabaseService.getAdminClient().auth.admin.getUserById(id)
    ).pipe(
      switchMap((authResponse) => {
        if (authResponse.error) {
          throw new Error(authResponse.error.message);
        }

        const authUser = authResponse.data.user;
        if (!authUser) return of(null);

        // Buscar perfil correspondente
        return from(
          this.supabaseService
            .getClient()
            .from('user_profiles')
            .select('*')
            .eq('id', id)
            .single()
        ).pipe(
          map((profileResponse) => {
            const profile = profileResponse.data;

            return {
              id: authUser.id,
              email: authUser.email || '',
              role: this.mapUserRole(
                profile?.role || authUser.user_metadata?.['role'] || 'user'
              ),
              is_active:
                profile?.is_active ??
                authUser.user_metadata?.['is_active'] ??
                true,
              created_at: authUser.created_at,
              updated_at:
                profile?.updated_at ||
                authUser.updated_at ||
                authUser.created_at,
              last_sign_in_at: authUser.last_sign_in_at,
              full_name:
                profile?.full_name || authUser.user_metadata?.['full_name'],
              phone: profile?.phone || authUser.user_metadata?.['phone'],
            };
          })
        );
      }),
      catchError((error) => {
        console.error('Erro ao buscar usuário:', error);
        return of(null);
      })
    );
  }

  /**
   * Cria um novo usuário
   * Cria tanto no auth.users quanto no user_profiles
   */
  createUser(userData: CreateUserRequest): Observable<User | null> {
    return from(
      this.supabaseService.getAdminClient().auth.admin.createUser({
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
      switchMap((authResponse) => {
        if (authResponse.error) {
          throw new Error(authResponse.error.message);
        }

        const authUser = authResponse.data.user;
        if (!authUser) return of(null);

        // Criar perfil na tabela user_profiles
        return from(
          this.supabaseService
            .getClient()
            .from('user_profiles')
            .insert({
              id: authUser.id,
              email: authUser.email,
              full_name: userData.full_name,
              role: userData.role,
              is_active: true,
            })
            .select()
            .single()
        ).pipe(
          map((profileResponse) => {
            const profile = profileResponse.data;

            return {
              id: authUser.id,
              email: authUser.email || '',
              role: this.mapUserRole(profile?.role || userData.role),
              is_active: profile?.is_active ?? true,
              created_at: authUser.created_at,
              updated_at: profile?.updated_at || authUser.created_at,
              last_sign_in_at: authUser.last_sign_in_at,
              full_name: profile?.full_name || userData.full_name,
              phone: profile?.phone || userData.phone,
            };
          })
        );
      }),
      catchError((error) => {
        console.error('Erro ao criar usuário:', error);
        return of(null);
      })
    );
  }

  /**
   * Atualiza um usuário existente
   * Atualiza tanto no auth.users quanto no user_profiles
   */
  updateUser(userData: UpdateUserRequest): Observable<User | null> {
    // Atualizar user_metadata no auth.users
    const authUpdate = from(
      this.supabaseService
        .getAdminClient()
        .auth.admin.updateUserById(userData.id, {
          user_metadata: {
            role: userData.role,
            is_active: userData.is_active,
            full_name: userData.full_name,
            phone: userData.phone,
          },
        })
    );

    // Atualizar perfil na tabela user_profiles
    const profileUpdate = from(
      this.supabaseService
        .getClient()
        .from('user_profiles')
        .update({
          full_name: userData.full_name,
          role: userData.role,
          is_active: userData.is_active,
          phone: userData.phone,
        })
        .eq('id', userData.id)
        .select()
        .single()
    );

    return authUpdate.pipe(
      switchMap((authResponse) => {
        if (authResponse.error) {
          throw new Error(authResponse.error.message);
        }

        return profileUpdate.pipe(
          map((profileResponse) => {
            const authUser = authResponse.data.user;
            const profile = profileResponse.data;

            if (!authUser) return null;

            return {
              id: authUser.id,
              email: authUser.email || '',
              role: this.mapUserRole(profile?.role || userData.role || 'user'),
              is_active: profile?.is_active ?? userData.is_active ?? true,
              created_at: authUser.created_at,
              updated_at:
                profile?.updated_at ||
                authUser.updated_at ||
                authUser.created_at,
              last_sign_in_at: authUser.last_sign_in_at,
              full_name: profile?.full_name || userData.full_name,
              phone: profile?.phone || userData.phone,
            };
          })
        );
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
    return this.updateUser({ id, is_active: false }).pipe(
      map((user) => user !== null),
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
    return this.updateUser({ id, is_active: true }).pipe(
      map((user) => user !== null),
      catchError((error) => {
        console.error('Erro ao reativar usuário:', error);
        return of(false);
      })
    );
  }

  /**
   * Exclui um usuário permanentemente
   * Remove tanto do auth.users quanto do user_profiles
   */
  deleteUser(id: string): Observable<boolean> {
    // Primeiro, remover da tabela user_profiles
    return from(
      this.supabaseService
        .getClient()
        .from('user_profiles')
        .delete()
        .eq('id', id)
    ).pipe(
      switchMap(() => {
        // Depois, remover do auth.users
        return from(
          this.supabaseService.getAdminClient().auth.admin.deleteUser(id)
        );
      }),
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
