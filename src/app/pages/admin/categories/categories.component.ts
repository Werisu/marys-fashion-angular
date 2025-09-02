import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Category,
  CategorySupabaseService,
  CreateCategoryRequest,
} from '@marys-fashion-angular/product-data-access';
import {
  FileUploadService,
  SupabaseService,
} from '@marys-fashion-angular/supabase';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <!-- Logo e Título -->
            <div class="flex items-center space-x-4">
              <button
                (click)="goBack()"
                class="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all duration-200 border border-white/20"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <div class="flex items-center space-x-3">
                <div
                  class="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm"
                >
                  <svg
                    class="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-white">
                    Gerenciar Categorias
                  </h1>
                  <p class="text-blue-100 text-sm">Mary's Fashion</p>
                </div>
              </div>
            </div>

            <!-- Ações e Usuário -->
            <div class="flex items-center space-x-4">
              <!-- Informações do Usuário -->
              <div
                class="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20"
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
                <div class="text-white">
                  <p class="text-sm font-medium">{{ userEmail }}</p>
                  <p class="text-xs text-blue-100">Administrador</p>
                </div>
              </div>

              <!-- Botão Logout -->
              <button
                (click)="logout()"
                class="bg-red-500/80 hover:bg-red-600/80 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-all duration-200 flex items-center space-x-2 border border-red-400/20"
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
              <label
                for="imageUpload"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Upload de Imagem</label
              >
              <div class="space-y-4">
                <!-- Input de arquivo -->
                <div class="flex items-center space-x-4">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                  <button
                    type="button"
                    (click)="uploadImage()"
                    [disabled]="!selectedFile || uploading"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {{ uploading ? 'Enviando...' : 'Enviar Imagem' }}
                  </button>
                </div>

                <!-- Preview da imagem selecionada -->
                <div *ngIf="selectedFile" class="relative">
                  <img
                    [src]="getFilePreview(selectedFile)"
                    [alt]="'Preview da imagem'"
                    class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    (click)="removeSelectedFile()"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>

                <!-- Imagem já enviada -->
                <div *ngIf="uploadedImageUrl" class="relative">
                  <div class="block text-sm font-medium text-gray-700 mb-2">
                    Imagem Enviada:
                  </div>
                  <img
                    [src]="uploadedImageUrl"
                    [alt]="'Imagem da categoria'"
                    class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    (click)="removeUploadedImage()"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>

                <!-- Campo de texto para URL (fallback) -->
                <div class="mt-4">
                  <label
                    for="manualImage"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ou adicione URL da imagem
                  </label>
                  <input
                    type="url"
                    id="manualImage"
                    [(ngModel)]="categoryForm.image"
                    name="image"
                    placeholder="https://exemplo.com/imagem.jpg"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
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
  currentUser: unknown = null;

  get userEmail(): string {
    return (this.currentUser as any)?.email || 'Usuário';
  }
  saving = false;
  uploading = false;
  editingCategory: Category | null = null;
  selectedFile: File | null = null;
  uploadedImageUrl: string | null = null;

  categoryForm: CreateCategoryRequest = {
    name: '',
    description: '',
    image: '',
  };

  private supabaseService = inject(SupabaseService);
  private categoryService = inject(CategorySupabaseService);
  private fileUploadService = inject(FileUploadService);
  private router = inject(Router);

  ngOnInit() {
    // Configurar o serviço antes de usar
    this.categoryService.setSupabaseService(this.supabaseService);

    // Carregar usuário atual para exibir informações
    this.loadCurrentUser();
    this.loadCategories();
  }

  loadCurrentUser() {
    this.supabaseService.getCurrentUser().subscribe((user: unknown) => {
      this.currentUser = user;
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
  }

  removeUploadedImage() {
    this.uploadedImageUrl = null;
    this.categoryForm.image = '';
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  async uploadImage() {
    if (!this.selectedFile) return;

    this.uploading = true;

    try {
      const result = await this.fileUploadService
        .uploadImage(this.selectedFile, 'category-images')
        .toPromise();

      if (result && result.success && result.url) {
        this.uploadedImageUrl = result.url;
        this.categoryForm.image = result.url;
        this.selectedFile = null;
        console.log('Imagem enviada com sucesso:', result.url);
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Erro ao enviar imagem. Verifique o console para mais detalhes.');
    } finally {
      this.uploading = false;
    }
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
    this.uploadedImageUrl = category.image || null;
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
    this.selectedFile = null;
    this.uploadedImageUrl = null;
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
