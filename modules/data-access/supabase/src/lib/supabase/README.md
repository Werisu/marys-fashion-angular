# SupabaseService

Este serviço de **Data Access** gerencia a infraestrutura de conexão com o Supabase, incluindo autenticação e configuração do cliente.

## 🏗️ **Arquitetura NX**

- **DATA ACCESS**: Este serviço (infraestrutura e conexão)
- **FEATURE**: Lógica de negócio dos componentes
- **UI**: Componentes de interface

## 🔧 **Funcionalidades**

### **Conexão com Banco**

- `getClient()` - Retorna o cliente Supabase configurado
- Configuração automática baseada no environment

### **Autenticação**

- `signIn(email, password)` - Login de usuário
- `signUp(email, password)` - Cadastro de usuário
- `signOut()` - Logout do usuário
- `resetPassword(email)` - Reset de senha
- `getCurrentUser()` - Usuário atual como Observable
- `isAuthenticated()` - Verificar se está logado

## 📋 **Como Usar**

### 1. **Importar o Serviço**

```typescript
import { SupabaseService } from '@marys-fashion-angular/product-data-access';
```

### 2. **Injetar no Componente**

```typescript
import { inject } from '@angular/core';

export class MeuComponente {
  private supabaseService = inject(SupabaseService);
}
```

### 3. **Usar as Funcionalidades**

```typescript
// Verificar usuário atual
this.supabaseService.getCurrentUser().subscribe((user) => {
  if (user) {
    console.log('Usuário logado:', user.email);
  }
});

// Fazer login
const result = await this.supabaseService.signIn(email, password);
if (result.user) {
  console.log('Login realizado com sucesso!');
} else {
  console.error('Erro no login:', result.error);
}

// Verificar autenticação
if (this.supabaseService.isAuthenticated()) {
  console.log('Usuário autenticado');
}
```

## 🔒 **Segurança**

- Credenciais configuradas via environment
- Cliente Supabase com chave anônima
- Row Level Security (RLS) configurado no Supabase
- Tratamento seguro de erros de autenticação

## 📊 **Configuração**

O serviço usa automaticamente as configurações do `environment.ts`:

```typescript
export const environment = {
  supabase: {
    url: 'sua-url-do-supabase',
    anonKey: 'sua-chave-anonima',
  },
};
```

## 💡 **Exemplo de Uso Completo**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { SupabaseService } from '@marys-fashion-angular/product-data-access';

@Component({
  selector: 'app-login',
  template: '...',
})
export class LoginComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  user$ = this.supabaseService.getCurrentUser();

  async login(email: string, password: string) {
    const result = await this.supabaseService.signIn(email, password);

    if (result.user) {
      console.log('Login realizado com sucesso!');
      // Redirecionar para dashboard
    } else {
      console.error('Erro no login:', result.error);
      // Mostrar erro para o usuário
    }
  }

  async logout() {
    const result = await this.supabaseService.signOut();
    if (result.error) {
      console.error('Erro no logout:', result.error);
    }
  }
}
```

## 🔄 **Integração com Outros Serviços**

Este serviço é usado por outros serviços de data access:

```typescript
// No ProductSupabaseService
export class ProductSupabaseService {
  constructor(private supabaseService: SupabaseService) {}

  getProducts() {
    return from(this.supabaseService.getClient().from('products').select('*'));
  }
}
```

## 🚨 **Importante**

- **SEMPRE** use as credenciais corretas no environment
- Configure o RLS no Supabase para segurança
- Trate os erros de autenticação adequadamente
- O serviço é singleton e compartilhado globalmente
