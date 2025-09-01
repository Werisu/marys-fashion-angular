import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss',
})
export class ProductSearch {
  @Output() searchEvent = new EventEmitter<string>();

  searchTerm: string = '';
  isSearching: boolean = false;

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.isSearching = true;
      this.searchEvent.emit(this.searchTerm.trim());

      // Simular delay de busca (remover em implementação real)
      setTimeout(() => {
        this.isSearching = false;
      }, 1000);
    }
  }

  onClear(): void {
    this.searchTerm = '';
    this.searchEvent.emit('');
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
