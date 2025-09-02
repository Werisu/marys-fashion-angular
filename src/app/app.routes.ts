import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/catalog/catalog.component').then(
        (m) => m.CatalogComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'admin/categories',
    loadComponent: () =>
      import('./pages/admin/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('@marys-fashion-angular/product-detail').then(
        (m) => m.ProductDetail
      ),
  },
];
