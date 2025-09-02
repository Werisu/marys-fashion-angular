import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '@marys-fashion-angular/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  message: { type: 'error' | 'success'; text: string } | null = null;

  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  async onSubmit() {
    if (!this.email || !this.password) {
      this.showMessage('error', 'Por favor, preencha todos os campos');
      return;
    }

    this.loading = true;
    this.message = null;

    try {
      const result = await this.supabaseService.signIn(
        this.email,
        this.password
      );

      if (result.error) {
        this.showMessage('error', this.getErrorMessage(result.error));
      } else if (result.user) {
        this.showMessage('success', 'Login realizado com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      }
    } catch {
      this.showMessage('error', 'Erro inesperado. Tente novamente.');
    } finally {
      this.loading = false;
    }
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
    } catch {
      this.showMessage('error', 'Erro ao enviar email de redefinição');
    }
  }

  private showMessage(type: 'error' | 'success', text: string) {
    this.message = { type, text };
  }

  private getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message;
    }

    if (error && typeof error === 'object' && 'status' in error) {
      // Mapear códigos de erro comuns
      switch ((error as { status: number }).status) {
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

    return 'Erro desconhecido';
  }
}
