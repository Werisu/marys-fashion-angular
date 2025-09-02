import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserSupabaseService,
} from '@marys-fashion-angular/product-data-access';
import { SupabaseService } from '@marys-fashion-angular/supabase';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 space-y-4 sm:space-y-0"
          >
            <!-- Logo e Título -->
            <div class="flex items-center space-x-3 sm:space-x-4">
              <div
                class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl backdrop-blur-sm"
              >
                <svg
                  class="w-5 h-5 sm:w-7 sm:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  ></path>
                </svg>
              </div>
              <div class="text-center sm:text-left">
                <h1 class="text-xl sm:text-2xl font-bold text-white">
                  Gerenciar Usuários
                </h1>
                <p class="text-indigo-100 text-xs sm:text-sm">Mary's Fashion</p>
              </div>
            </div>

            <!-- Ações -->
            <div
              class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            >
              <!-- Botão Voltar -->
              <button
                (click)="goBack()"
                class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20 w-full sm:w-auto"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
                <span>Voltar</span>
              </button>

              <!-- Informações do Usuário -->
              <div
                class="flex items-center justify-center sm:justify-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 w-full sm:w-auto"
              >
                <div
                  class="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div class="text-white text-center sm:text-left">
                  <p class="text-sm font-medium">{{ userEmail }}</p>
                  <p class="text-xs text-indigo-100">Administrador</p>
                </div>
              </div>

              <!-- Botão Logout -->
              <button
                (click)="logout()"
                class="bg-red-500/80 hover:bg-red-600/80 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-all duration-200 flex items-center justify-center space-x-2 border border-red-400/20 w-full sm:w-auto"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Formulário -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-6">
                {{ editingUser ? 'Editar Usuário' : 'Novo Usuário' }}
              </h2>

              <form (ngSubmit)="onSubmit()" #form="ngForm" class="space-y-4">
                <!-- Email -->
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    [(ngModel)]="userForm.email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    [disabled]="!!editingUser"
                  />
                </div>

                <!-- Senha (apenas para novos usuários) -->
                <div *ngIf="!editingUser">
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Senha *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    [(ngModel)]="userForm.password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <!-- Nome Completo -->
                <div>
                  <label
                    for="fullName"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    [(ngModel)]="userForm.fullName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <!-- Telefone -->
                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    [(ngModel)]="userForm.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <!-- Papel -->
                <div>
                  <label
                    for="role"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Papel *
                  </label>
                  <select
                    id="role"
                    name="role"
                    [(ngModel)]="userForm.role"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="user">Usuário</option>
                    <option value="moderator">Moderador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <!-- Status Ativo (apenas para edição) -->
                <div *ngIf="editingUser">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      [(ngModel)]="userForm.isActive"
                      class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >Usuário Ativo</span
                    >
                  </label>
                </div>

                <!-- Botões -->
                <div class="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    [disabled]="saving"
                    class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <span *ngIf="!saving">{{
                      editingUser ? 'Atualizar' : 'Criar'
                    }}</span>
                    <span *ngIf="saving">Salvando...</span>
                  </button>

                  <button
                    type="button"
                    (click)="resetForm()"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Lista de Usuários -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
              >
                <h2 class="text-xl font-bold text-gray-900">Usuários</h2>

                <!-- Filtros -->
                <div
                  class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
                >
                  <input
                    type="text"
                    placeholder="Buscar por email ou nome..."
                    [(ngModel)]="searchTerm"
                    (input)="applyFilters()"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <select
                    [(ngModel)]="roleFilter"
                    (change)="applyFilters()"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Todos os papéis</option>
                    <option value="user">Usuário</option>
                    <option value="moderator">Moderador</option>
                    <option value="admin">Administrador</option>
                  </select>

                  <select
                    [(ngModel)]="statusFilter"
                    (change)="applyFilters()"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Todos os status</option>
                    <option value="true">Ativos</option>
                    <option value="false">Inativos</option>
                  </select>
                </div>
              </div>

              <!-- Tabela -->
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Usuário
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Papel
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Criado em
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      *ngFor="let user of filteredUsers"
                      class="hover:bg-gray-50"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ user.full_name || 'Sem nome' }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ user.email }}
                          </div>
                          <div *ngIf="user.phone" class="text-xs text-gray-400">
                            {{ user.phone }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          [ngClass]="{
                            'bg-green-100 text-green-800':
                              user.role === 'admin',
                            'bg-blue-100 text-blue-800':
                              user.role === 'moderator',
                            'bg-gray-100 text-gray-800': user.role === 'user'
                          }"
                        >
                          {{
                            user.role === 'admin'
                              ? 'Admin'
                              : user.role === 'moderator'
                              ? 'Moderador'
                              : 'Usuário'
                          }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          [ngClass]="{
                            'bg-green-100 text-green-800': user.is_active,
                            'bg-red-100 text-red-800': !user.is_active
                          }"
                        >
                          {{ user.is_active ? 'Ativo' : 'Inativo' }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {{ formatDate(user.created_at) }}
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                      >
                        <button
                          (click)="editUser(user)"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                        <button
                          *ngIf="user.is_active"
                          (click)="deactivateUser(user.id)"
                          class="text-yellow-600 hover:text-yellow-900"
                        >
                          Desativar
                        </button>
                        <button
                          *ngIf="!user.is_active"
                          (click)="activateUser(user.id)"
                          class="text-green-600 hover:text-green-900"
                        >
                          Ativar
                        </button>
                        <button
                          (click)="deleteUser(user.id)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mensagem de carregamento -->
              <div *ngIf="loading" class="text-center py-8">
                <div
                  class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-indigo-600"
                >
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
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
                  Carregando usuários...
                </div>
              </div>

              <!-- Mensagem de lista vazia -->
              <div
                *ngIf="!loading && filteredUsers.length === 0"
                class="text-center py-8"
              >
                <p class="text-gray-500">Nenhum usuário encontrado.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  saving = false;
  editingUser: User | null = null;

  // Formulário
  userForm = {
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'user' as 'admin' | 'user' | 'moderator',
    isActive: true,
  };

  // Filtros
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';

  constructor(
    private userService: UserSupabaseService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUsers();
  }

  get userEmail(): string {
    // Para simplificar, vamos usar um valor padrão
    // Em uma implementação real, você poderia usar um BehaviorSubject local
    return 'Administrador';
  }

  loadCurrentUser(): void {
    this.supabaseService.getCurrentUser().subscribe();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(search) ||
          (user.full_name && user.full_name.toLowerCase().includes(search))
      );
    }

    if (this.roleFilter) {
      filtered = filtered.filter((user) => user.role === this.roleFilter);
    }

    if (this.statusFilter !== '') {
      const isActive = this.statusFilter === 'true';
      filtered = filtered.filter((user) => user.is_active === isActive);
    }

    this.filteredUsers = filtered;
  }

  onSubmit(): void {
    if (this.editingUser) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser(): void {
    if (!this.userForm.email || !this.userForm.password) {
      alert('Email e senha são obrigatórios');
      return;
    }

    this.saving = true;
    const userData: CreateUserRequest = {
      email: this.userForm.email,
      password: this.userForm.password,
      role: this.userForm.role,
      full_name: this.userForm.fullName || undefined,
      phone: this.userForm.phone || undefined,
    };

    this.userService.createUser(userData).subscribe({
      next: (user) => {
        if (user) {
          alert('Usuário criado com sucesso!');
          this.resetForm();
          this.loadUsers();
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Erro ao criar usuário:', error);
        alert('Erro ao criar usuário: ' + error.message);
        this.saving = false;
      },
    });
  }

  updateUser(): void {
    if (!this.editingUser) return;

    this.saving = true;
    const userData: UpdateUserRequest = {
      id: this.editingUser.id,
      role: this.userForm.role,
      is_active: this.userForm.isActive,
      full_name: this.userForm.fullName || undefined,
      phone: this.userForm.phone || undefined,
    };

    this.userService.updateUser(userData).subscribe({
      next: (user) => {
        if (user) {
          alert('Usuário atualizado com sucesso!');
          this.resetForm();
          this.loadUsers();
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro ao atualizar usuário: ' + error.message);
        this.saving = false;
      },
    });
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.userForm = {
      email: user.email,
      password: '',
      fullName: user.full_name || '',
      phone: user.phone || '',
      role: user.role,
      isActive: user.is_active,
    };
  }

  deactivateUser(id: string): void {
    if (confirm('Tem certeza que deseja desativar este usuário?')) {
      this.userService.deactivateUser(id).subscribe({
        next: (success) => {
          if (success) {
            alert('Usuário desativado com sucesso!');
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Erro ao desativar usuário:', error);
          alert('Erro ao desativar usuário');
        },
      });
    }
  }

  activateUser(id: string): void {
    this.userService.activateUser(id).subscribe({
      next: (success) => {
        if (success) {
          alert('Usuário ativado com sucesso!');
          this.loadUsers();
        }
      },
      error: (error) => {
        console.error('Erro ao ativar usuário:', error);
        alert('Erro ao ativar usuário');
      },
    });
  }

  deleteUser(id: string): void {
    if (
      confirm(
        'Tem certeza que deseja excluir este usuário permanentemente? Esta ação não pode ser desfeita.'
      )
    ) {
      this.userService.deleteUser(id).subscribe({
        next: (success) => {
          if (success) {
            alert('Usuário excluído com sucesso!');
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          alert('Erro ao excluir usuário');
        },
      });
    }
  }

  resetForm(): void {
    this.editingUser = null;
    this.userForm = {
      email: '',
      password: '',
      fullName: '',
      phone: '',
      role: 'user',
      isActive: true,
    };
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.supabaseService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
