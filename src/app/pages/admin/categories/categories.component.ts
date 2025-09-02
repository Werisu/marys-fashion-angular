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
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
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
