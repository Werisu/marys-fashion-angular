import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Product,
  ProductSupabaseService,
  User,
  UserSupabaseService,
} from '@marys-fashion-angular/product-data-access';
import {
  FileUploadService,
  SupabaseService,
} from '@marys-fashion-angular/supabase';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  currentUser: any = null;
  currentUserProfile: User | null = null;
  saving = false;
  uploading = false;
  editingProduct: Product | null = null;
  selectedFiles: File[] = [];
  uploadedImages: string[] = [];
  editingPrice: { [key: number]: boolean } = {};
  tempPrices: { [key: number]: number } = {};
  bulkAdjustment: number | null = null;

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

  private supabaseService = inject(SupabaseService);
  private productService = inject(ProductSupabaseService);
  private userService = inject(UserSupabaseService);
  private fileUploadService = inject(FileUploadService);
  private router = inject(Router);

  ngOnInit() {
    // Configurar o serviço antes de usar
    this.productService.setSupabaseService(this.supabaseService);

    // Carregar usuário atual para exibir informações
    this.loadCurrentUser();
    this.loadProducts();
  }

  loadCurrentUser() {
    this.supabaseService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (user?.id) {
        // Buscar perfil completo do usuário
        this.userService.getUserById(user.id).subscribe((userProfile) => {
          this.currentUserProfile = userProfile;
        });
      }
    });
  }

  get userDisplayName(): string {
    if (this.currentUserProfile?.full_name) {
      return this.currentUserProfile.full_name;
    }
    if (this.currentUser?.email) {
      return this.currentUser.email;
    }
    return 'Usuário';
  }

  get userRole(): string {
    if (this.currentUserProfile?.role) {
      switch (this.currentUserProfile.role) {
        case 'admin':
          return 'Administrador';
        case 'moderator':
          return 'Moderador';
        case 'user':
          return 'Usuário';
        default:
          return 'Usuário';
      }
    }
    return 'Usuário';
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = [
        ...this.selectedFiles,
        ...(Array.from(files) as File[]),
      ];
    }
  }

  removeSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  removeUploadedImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  async uploadImages() {
    if (this.selectedFiles.length === 0) return;

    this.uploading = true;

    try {
      const results = await this.fileUploadService
        .uploadMultipleImages(this.selectedFiles)
        .toPromise();

      if (results) {
        const successfulUploads = results.filter((result) => result.success);
        const newImageUrls = successfulUploads.map((result) => result.url!);

        this.uploadedImages = [...this.uploadedImages, ...newImageUrls];
        this.selectedFiles = [];

        // Atualizar o campo de imagens com as URLs
        const allImages = [...this.uploadedImages];
        if (this.productForm.images) {
          const existingUrls = this.productForm.images
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url);
          allImages.push(...existingUrls);
        }
        this.productForm.images = allImages.join(', ');

        console.log('Imagens enviadas com sucesso:', newImageUrls);
      }
    } catch (error) {
      console.error('Erro ao enviar imagens:', error);
      alert(
        'Erro ao enviar algumas imagens. Verifique o console para mais detalhes.'
      );
    } finally {
      this.uploading = false;
    }
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

    // Combinar imagens enviadas com URLs manuais
    let allImages = [...this.uploadedImages];
    if (this.productForm.images) {
      const manualUrls = this.productForm.images
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url);
      allImages = [...allImages, ...manualUrls];
    }

    const productData = {
      name: this.productForm.name,
      description: this.productForm.description,
      price: this.productForm.price,
      category: this.productForm.category,
      images: allImages,
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
    this.uploadedImages = [...product.images];
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: '', // Será preenchido com as imagens já enviadas
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
    this.selectedFiles = [];
    this.uploadedImages = [];
  }

  // Métodos para edição rápida de preços
  startPriceEdit(productId: number, currentPrice: number): void {
    this.editingPrice[productId] = true;
    this.tempPrices[productId] = currentPrice;

    // Focar no input após a próxima verificação de mudanças
    setTimeout(() => {
      const input = document.querySelector(
        `input[data-product-id="${productId}"]`
      ) as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  }

  cancelPriceEdit(productId: number): void {
    this.editingPrice[productId] = false;
    delete this.tempPrices[productId];
  }

  savePriceEdit(productId: number): void {
    const newPrice = this.tempPrices[productId];
    if (newPrice === undefined || newPrice < 0) {
      alert('Preço inválido');
      return;
    }

    // Encontrar o produto
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    // Atualizar o preço
    const productData = {
      name: product.name,
      description: product.description,
      price: newPrice,
      category: product.category,
      images: product.images,
      sizes: product.sizes,
      colors: product.colors,
      in_stock: product.in_stock,
      featured: product.featured,
    };

    this.productService.updateProduct(productId, productData).subscribe({
      next: (result) => {
        if (result) {
          // Atualizar o produto na lista local
          const index = this.products.findIndex((p) => p.id === productId);
          if (index !== -1) {
            this.products[index].price = newPrice;
          }
          this.cancelPriceEdit(productId);
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar preço:', error);
        alert('Erro ao atualizar preço');
      },
    });
  }

  onPriceKeyDown(event: KeyboardEvent, productId: number): void {
    if (event.key === 'Enter') {
      this.savePriceEdit(productId);
    } else if (event.key === 'Escape') {
      this.cancelPriceEdit(productId);
    }
  }

  applyBulkAdjustment(): void {
    if (!this.bulkAdjustment || this.products.length === 0) return;

    const adjustment = this.bulkAdjustment / 100; // Converter para decimal
    const confirmMessage = `Deseja aplicar ${
      this.bulkAdjustment > 0 ? 'aumento' : 'redução'
    } de ${Math.abs(this.bulkAdjustment)}% em todos os produtos?`;

    if (!confirm(confirmMessage)) return;

    let updatedCount = 0;
    const totalProducts = this.products.length;

    this.products.forEach((product, index) => {
      const newPrice = product.price * (1 + adjustment);

      const productData = {
        name: product.name,
        description: product.description,
        price: Math.round(newPrice * 100) / 100, // Arredondar para 2 casas decimais
        category: product.category,
        images: product.images,
        sizes: product.sizes,
        colors: product.colors,
        in_stock: product.in_stock,
        featured: product.featured,
      };

      this.productService.updateProduct(product.id, productData).subscribe({
        next: (result) => {
          if (result) {
            this.products[index].price = productData.price;
            updatedCount++;

            if (updatedCount === totalProducts) {
              alert(
                `Preços atualizados com sucesso! ${updatedCount} produtos alterados.`
              );
              this.bulkAdjustment = null;
            }
          }
        },
        error: (error) => {
          console.error(`Erro ao atualizar produto ${product.name}:`, error);
        },
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
