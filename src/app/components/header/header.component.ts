import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center cursor-pointer" (click)="goHome()">
            <div class="text-2xl font-bold text-pink-600">Mary's Fashion</div>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a
              routerLink="/"
              routerLinkActive="text-pink-600"
              class="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Início
            </a>
            <a
              routerLink="/catalogo"
              routerLinkActive="text-pink-600"
              class="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Catálogo
            </a>
          </nav>

          <!-- WhatsApp Button -->
          <div class="flex items-center space-x-4">
            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de fazer um pedido."
              target="_blank"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M2.003 2.833C2.003 1.82 2.833 1 3.847 1h12.306c1.014 0 1.844.82 1.844 1.833v17.334c0 1.013-.83 1.833-1.844 1.833H3.847c-1.014 0-1.844-.82-1.844-1.833V2.833zM14.5 15.5c0 .276-.224.5-.5.5h-1.5c-.276 0-.5-.224-.5-.5v-1.5c0-.276.224-.5.5-.5h1.5c.276 0 .5.224.5.5v1.5zm-3 0c0 .276-.224.5-.5.5h-1.5c-.276 0-.5-.224-.5-.5v-1.5c0-.276.224-.5.5-.5h1.5c.276 0 .5.224.5.5v1.5zm-3 0c0 .276-.224.5-.5.5h-1.5c-.276 0-.5-.224-.5-.5v-1.5c0-.276.224-.5.5-.5h1.5c.276 0 .5.224.5.5v1.5z"
                />
              </svg>
              <span>Fazer Pedido</span>
            </a>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              type="button"
              class="text-gray-700 hover:text-pink-600 p-2"
              (click)="toggleMobileMenu()"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div *ngIf="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              routerLink="/"
              class="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium"
              (click)="closeMobileMenu()"
            >
              Início
            </a>
            <a
              routerLink="/catalogo"
              class="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium"
              (click)="closeMobileMenu()"
            >
              Catálogo
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
