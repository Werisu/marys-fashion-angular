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
import { SupabaseService } from '@marys-fashion-angular/supabase';

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
  currentUserProfile: User | null = null;

  private supabaseService = inject(SupabaseService);
  private productService = inject(ProductSupabaseService);
  private userService = inject(UserSupabaseService);
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

  // Métodos para estatísticas do dashboard
  getProductsInStock(): number {
    return this.products.filter((product) => product.in_stock).length;
  }

  getFeaturedProducts(): number {
    return this.products.filter((product) => product.featured).length;
  }

  getUniqueCategories(): number {
    const categories = new Set(
      this.products.map((product) => product.category)
    );
    return categories.size;
  }

  getRecentProducts(): Product[] {
    return this.products
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 6);
  }

  goToProducts() {
    this.router.navigate(['/admin/products']);
  }

  goToCategories() {
    this.router.navigate(['/admin/categories']);
  }

  goToUsers() {
    this.router.navigate(['/admin/users']);
  }

  goToCatalog() {
    this.router.navigate(['/catalog']);
  }

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
