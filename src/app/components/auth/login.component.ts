import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '@marys-fashion-angular/product-data-access';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Mary's Fashion</h2>
          <p class="mt-2 text-sm text-gray-600">
            Faça login para acessar o painel administrativo
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  [(ngModel)]="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <!-- Senha -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  [(ngModel)]="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <!-- Botões -->
            <div class="space-y-4">
              <button
                type="submit"
                [disabled]="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="loading" class="mr-2">
                  <svg
                    class="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                {{ loading ? 'Entrando...' : 'Entrar' }}
              </button>

              <button
                type="button"
                (click)="toggleMode()"
                class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                {{ isLoginMode ? 'Criar conta' : 'Já tenho conta' }}
              </button>
            </div>

            <!-- Mensagens de erro/sucesso -->
            <div *ngIf="message" class="mt-4">
              <div
                [class]="
                  message.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-green-50 border-green-200 text-green-700'
                "
                class="border rounded-md p-3 text-sm"
              >
                {{ message.text }}
              </div>
            </div>

            <!-- Esqueci a senha -->
            <div class="text-center">
              <button
                type="button"
                (click)="resetPassword()"
                class="text-sm text-pink-600 hover:text-pink-500"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  isLoginMode = true;
  message: { type: 'error' | 'success'; text: string } | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.showMessage('error', 'Por favor, preencha todos os campos');
      return;
    }

    this.loading = true;
    this.message = null;

    try {
      let result;

      if (this.isLoginMode) {
        result = await this.supabaseService.signIn(this.email, this.password);
      } else {
        result = await this.supabaseService.signUp(this.email, this.password);
      }

      if (result.error) {
        this.showMessage('error', this.getErrorMessage(result.error));
      } else if (result.user) {
        if (this.isLoginMode) {
          this.showMessage('success', 'Login realizado com sucesso!');
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 1500);
        } else {
          this.showMessage(
            'success',
            'Conta criada! Verifique seu email para confirmar.'
          );
          this.isLoginMode = true;
        }
      }
    } catch (error) {
      this.showMessage('error', 'Erro inesperado. Tente novamente.');
    } finally {
      this.loading = false;
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message = null;
  }

  async resetPassword() {
    if (!this.email) {
      this.showMessage('error', 'Digite seu email primeiro');
      return;
    }

    try {
      const result = await this.supabaseService.resetPassword(this.email);
      if (result.error) {
        this.showMessage('error', this.getErrorMessage(result.error));
      } else {
        this.showMessage(
          'success',
          'Email de redefinição enviado! Verifique sua caixa de entrada.'
        );
      }
    } catch (error) {
      this.showMessage('error', 'Erro ao enviar email de redefinição');
    }
  }

  private showMessage(type: 'error' | 'success', text: string) {
    this.message = { type, text };
  }

  private getErrorMessage(error: any): string {
    if (error.message) {
      return error.message;
    }

    // Mapear códigos de erro comuns
    switch (error.status) {
      case 400:
        return 'Dados inválidos';
      case 401:
        return 'Credenciais inválidas';
      case 422:
        return 'Email já está em uso';
      default:
        return 'Erro desconhecido';
    }
  }
}
