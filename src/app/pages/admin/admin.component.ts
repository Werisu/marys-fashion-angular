import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Product,
  ProductSupabaseService,
} from '@marys-fashion-angular/product-data-access';
import {
  FileUploadService,
  SupabaseService,
} from '@marys-fashion-angular/supabase';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  currentUser: any = null;
  saving = false;
  uploading = false;
  editingProduct: Product | null = null;
  selectedFiles: File[] = [];
  uploadedImages: string[] = [];

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
  private fileUploadService = inject(FileUploadService);
  private router = inject(Router);

  ngOnInit() {
    // Configurar o serviço antes de usar
    this.productService.setSupabaseService(this.supabaseService);

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

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
