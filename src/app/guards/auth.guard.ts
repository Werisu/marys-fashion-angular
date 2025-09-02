import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '@marys-fashion-angular/supabase';
import { of } from 'rxjs';
import { delay, filter, map, switchMap, take } from 'rxjs/operators';

export const authGuard = () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  return supabaseService.getCurrentUser().pipe(
    // Aguardar um pouco para a sessão ser inicializada
    delay(300),
    // Filtrar valores undefined (sessão ainda não carregada)
    filter((user) => user !== undefined),
    // Aguardar até que tenhamos uma resposta definitiva sobre a autenticação
    // Se o usuário for null, aguardar um pouco mais antes de redirecionar
    switchMap((user) => {
      if (user) {
        console.log('Guard: Usuário autenticado, permitindo acesso');
        return of(true);
      } else {
        // Se o usuário for null, aguardar um pouco mais para ver se a sessão carrega
        console.log('Guard: Usuário null, aguardando sessão...');
        return supabaseService.getCurrentUser().pipe(
          delay(500), // Aguardar mais 500ms
          take(1),
          map((delayedUser) => {
            if (delayedUser) {
              console.log('Guard: Sessão carregada, usuário autenticado');
              return true;
            } else {
              console.log(
                'Guard: Usuário não autenticado, redirecionando para login'
              );
              router.navigate(['/login']);
              return false;
            }
          })
        );
      }
    }),
    // Pegar apenas o primeiro valor válido
    take(1)
  );
};
