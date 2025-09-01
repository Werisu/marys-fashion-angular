import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '@marys-fashion-angular/product-data-access';
import { ProductSupabaseService } from '../../services/product-supabase.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <h1 class="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
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
        <!-- Adicionar Produto -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            {{ editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto' }}
          </h2>

          <form (ngSubmit)="saveProduct()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nome</label
                >
                <input
                  type="text"
                  [(ngModel)]="productForm.name"
                  name="name"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Preço</label
                >
                <input
                  type="number"
                  [(ngModel)]="productForm.price"
                  name="price"
                  step="0.01"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Categoria</label
                >
                <select
                  [(ngModel)]="productForm.category"
                  name="category"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="vestidos">Vestidos</option>
                  <option value="blazers">Blazers</option>
                  <option value="calcas">Calças</option>
                  <option value="blusas">Blusas</option>
                  <option value="saias">Saias</option>
                  <option value="esportivo">Esportivo</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tamanhos (separados por vírgula)</label
                >
                <input
                  type="text"
                  [(ngModel)]="productForm.sizes"
                  name="sizes"
                  placeholder="P, M, G, GG"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Cores (separadas por vírgula)</label
                >
                <input
                  type="text"
                  [(ngModel)]="productForm.colors"
                  name="colors"
                  placeholder="Azul, Rosa, Preto"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Imagens (URLs separadas por vírgula)</label
                >
                <input
                  type="text"
                  [(ngModel)]="productForm.images"
                  name="images"
                  placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Descrição</label
              >
              <textarea
                [(ngModel)]="productForm.description"
                name="description"
                rows="3"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="productForm.featured"
                  name="featured"
                  class="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span class="ml-2 text-sm text-gray-700"
                  >Produto em destaque</span
                >
              </label>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="productForm.in_stock"
                  name="in_stock"
                  class="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span class="ml-2 text-sm text-gray-700">Em estoque</span>
              </label>
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
                    : editingProduct
                    ? 'Atualizar'
                    : 'Adicionar'
                }}
              </button>

              <button
                type="button"
                (click)="cancelEdit()"
                *ngIf="editingProduct"
                class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Produtos -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              Produtos Cadastrados
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Produto
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Categoria
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Preço
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let product of products">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img
                          [src]="product.images[0]"
                          [alt]="product.name"
                          class="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ product.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ product.description.substring(0, 50) }}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      {{ product.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {{ product.price.toFixed(2).replace('.', ',') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      [class]="
                        product.in_stock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ product.in_stock ? 'Em estoque' : 'Esgotado' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      (click)="editProduct(product)"
                      class="text-pink-600 hover:text-pink-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deleteProduct(product.id)"
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
export class AdminComponent implements OnInit {
  products: Product[] = [];
  currentUser: any = null;
  saving = false;
  editingProduct: Product | null = null;

  productForm = {
    name: '',
    description: '',
    price: 0,
    category: '',
    images: '',
    sizes: '',
    colors: '',
    in_stock: true,
    featured: false,
  };

  constructor(
    private supabaseService: SupabaseService,
    private productService: ProductSupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadProducts();
  }

  async checkAuth() {
    this.supabaseService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  saveProduct() {
    if (
      !this.productForm.name ||
      !this.productForm.description ||
      !this.productForm.category
    ) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.saving = true;

    const productData = {
      name: this.productForm.name,
      description: this.productForm.description,
      price: this.productForm.price,
      category: this.productForm.category,
      images: this.productForm.images
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url),
      sizes: this.productForm.sizes
        .split(',')
        .map((size) => size.trim())
        .filter((size) => size),
      colors: this.productForm.colors
        .split(',')
        .map((color) => color.trim())
        .filter((color) => color),
      in_stock: this.productForm.in_stock,
      featured: this.productForm.featured,
    };

    if (this.editingProduct) {
      // Atualizar produto existente
      this.productService
        .updateProduct(this.editingProduct.id, productData)
        .subscribe((result) => {
          if (result) {
            this.loadProducts();
            this.resetForm();
            this.editingProduct = null;
          }
          this.saving = false;
        });
    } else {
      // Criar novo produto
      this.productService.createProduct(productData).subscribe((result) => {
        if (result) {
          this.loadProducts();
          this.resetForm();
        }
        this.saving = false;
      });
    }
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images.join(', '),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      in_stock: product.in_stock,
      featured: product.featured || false,
    };
  }

  cancelEdit() {
    this.editingProduct = null;
    this.resetForm();
  }

  deleteProduct(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe((success) => {
        if (success) {
          this.loadProducts();
        }
      });
    }
  }

  resetForm() {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      category: '',
      images: '',
      sizes: '',
      colors: '',
      in_stock: true,
      featured: false,
    };
  }

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
