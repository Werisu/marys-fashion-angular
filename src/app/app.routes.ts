import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('@marys-fashion-angular/home').then((m) => m.Home),
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalog/catalog.component').then(
        (m) => m.CatalogComponent
      ),
  },
  {
    path: 'produto/:id',
    loadComponent: () =>
      import('@marys-fashion-angular/product-detail').then(
        (m) => m.ProductDetail
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
    canActivate: [authGuard],
  },
  {
    path: 'admin/categories',
    loadComponent: () =>
      import('./pages/admin/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./pages/admin/users/users.component').then(
        (m) => m.UsersComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
