import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'environment';
import { BehaviorSubject, Observable } from 'rxjs';

// Interface para o ambiente
interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Configuração temporária - deve ser configurada externamente
const DEFAULT_CONFIG: SupabaseConfig = {
  url: environment.supabase.url,
  anonKey: environment.supabase.anonKey,
};

/**
 * Serviço de infraestrutura para gerenciar conexão com Supabase
 *
 * Este serviço está na camada DATA ACCESS e gerencia:
 * - Conexão com o banco de dados
 * - Autenticação de usuários
 * - Cliente Supabase para operações de dados
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    // Configuração do Supabase
    const config: SupabaseConfig = {
      url: DEFAULT_CONFIG.url,
      anonKey: DEFAULT_CONFIG.anonKey,
    };

    // Criar cliente Supabase
    this.supabase = createClient(config.url, config.anonKey);

    // Verificar usuário atual
    this.checkUser();

    // Escutar mudanças de autenticação
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.next(session?.user ?? null);
    });
  }

  /**
   * Obter cliente Supabase
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Verificar usuário atual
   */
  private async checkUser(): Promise<void> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser();
      this.currentUser.next(user);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      this.currentUser.next(null);
    }
  }

  /**
   * Obter usuário atual como Observable
   */
  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  /**
   * Fazer login com email e senha
   */
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: any }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  /**
   * Fazer cadastro com email e senha
   */
  async signUp(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: any }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  /**
   * Fazer logout
   */
  async signOut(): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Resetar senha
   */
  async resetPassword(email: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUser.value !== null;
  }
}
