import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Category,
  CategorySupabaseService,
  CreateCategoryRequest,
} from '@marys-fashion-angular/product-data-access';
import { SupabaseService } from '@marys-fashion-angular/supabase';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center space-x-4">
              <button
                (click)="goBack()"
                class="text-gray-600 hover:text-gray-900"
              >
                ← Voltar
              </button>
              <h1 class="text-2xl font-bold text-gray-900">
                Gerenciar Categorias
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                Olá, {{ currentUser?.email }}
              </span>
              <button
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Adicionar/Editar Categoria -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            {{
              editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'
            }}
          </h2>

          <form (ngSubmit)="saveCategory()" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Nome da Categoria</label
              >
              <input
                type="text"
                [(ngModel)]="categoryForm.name"
                name="name"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700"
                >Descrição</label
              >
              <textarea
                [(ngModel)]="categoryForm.description"
                name="description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              ></textarea>
            </div>

            <div>
              <label for="image" class="block text-sm font-medium text-gray-700"
                >URL da Imagem</label
              >
              <input
                type="url"
                [(ngModel)]="categoryForm.image"
                name="image"
                placeholder="https://exemplo.com/imagem.jpg"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div class="flex space-x-4">
              <button
                type="submit"
                [disabled]="saving"
                class="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {{
                  saving
                    ? 'Salvando...'
                    : editingCategory
                    ? 'Atualizar'
                    : 'Adicionar'
                }}
              </button>

              <button
                type="button"
                (click)="cancelEdit()"
                *ngIf="editingCategory"
                class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Categorias -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              Categorias Cadastradas
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Categoria
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Descrição
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data de Criação
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let category of categories">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img
                          *ngIf="category.image"
                          [src]="category.image"
                          [alt]="category.name"
                          class="h-10 w-10 rounded-full object-cover"
                        />
                        <div
                          *ngIf="!category.image"
                          class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <span class="text-gray-500 text-sm">{{
                            category.name.charAt(0)
                          }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ category.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ category.description || 'Sem descrição' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ category.created_at | date : 'dd/MM/yyyy' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      (click)="editCategory(category)"
                      class="text-pink-600 hover:text-pink-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deleteCategory(category.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  currentUser: any = null;
  saving = false;
  editingCategory: Category | null = null;

  categoryForm: CreateCategoryRequest = {
    name: '',
    description: '',
    image: '',
  };

  private supabaseService = inject(SupabaseService);
  private categoryService = inject(CategorySupabaseService);
  private router = inject(Router);

  ngOnInit() {
    // Configurar o serviço antes de usar
    this.categoryService.setSupabaseService(this.supabaseService);

    this.checkAuth();
    this.loadCategories();
  }

  async checkAuth() {
    this.supabaseService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  saveCategory() {
    if (!this.categoryForm.name) {
      alert('Por favor, preencha o nome da categoria');
      return;
    }

    this.saving = true;

    if (this.editingCategory) {
      // Atualizar categoria existente
      this.categoryService
        .updateCategory(this.editingCategory.id, {
          ...this.categoryForm,
          id: this.editingCategory.id,
        })
        .subscribe((result) => {
          if (result) {
            this.loadCategories();
            this.resetForm();
            this.editingCategory = null;
          }
          this.saving = false;
        });
    } else {
      // Criar nova categoria
      this.categoryService
        .createCategory(this.categoryForm)
        .subscribe((result) => {
          if (result) {
            this.loadCategories();
            this.resetForm();
          }
          this.saving = false;
        });
    }
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.categoryForm = {
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    };
  }

  cancelEdit() {
    this.editingCategory = null;
    this.resetForm();
  }

  deleteCategory(id: number) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.categoryService.deleteCategory(id).subscribe((success) => {
        if (success) {
          this.loadCategories();
        }
      });
    }
  }

  resetForm() {
    this.categoryForm = {
      name: '',
      description: '',
      image: '',
    };
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
