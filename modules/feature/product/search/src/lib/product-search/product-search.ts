import { Component, EventEmitter, Output, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductSearch, AutocompleteSuggestion } from '@marys-fashion-angular/product-data-access';

@Component({
  selector: 'lib-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss',
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  @Output() searchEvent = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<AutocompleteSuggestion>();

  searchTerm = '';
  isSearching = false;
  showSuggestions = false;
  suggestions: AutocompleteSuggestion[] = [];
  selectedIndex = -1;

  private searchService = inject(ProductSearch);
  private destroy$ = new Subject<void>();
  private searchInput$ = new Subject<string>();

  ngOnInit() {
    // Configurar busca com debounce para autocomplete
    this.searchInput$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        if (query.trim().length >= 2) {
          this.loadSuggestions(query);
        } else {
          this.suggestions = [];
          this.showSuggestions = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(): void {
    this.searchInput$.next(this.searchTerm);
    this.showSuggestions = this.searchTerm.trim().length >= 2;
    this.selectedIndex = -1;
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.isSearching = true;
      this.searchEvent.emit(this.searchTerm.trim());
      this.showSuggestions = false;
      
      // Simular delay de busca (remover em implementação real)
      setTimeout(() => {
        this.isSearching = false;
      }, 1000);
    }
  }

  onClear(): void {
    this.searchTerm = '';
    this.suggestions = [];
    this.showSuggestions = false;
    this.selectedIndex = -1;
    this.searchEvent.emit('');
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
        this.selectSuggestion(this.suggestions[this.selectedIndex]);
      } else {
        this.onSearch();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateSuggestions(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateSuggestions(-1);
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
      this.selectedIndex = -1;
    }
  }

  onFocus(): void {
    if (this.searchTerm.trim().length >= 2) {
      this.showSuggestions = true;
    }
  }

  onBlur(): void {
    // Delay para permitir cliques nas sugestões
    setTimeout(() => {
      this.showSuggestions = false;
      this.selectedIndex = -1;
    }, 200);
  }

  selectSuggestion(suggestion: AutocompleteSuggestion): void {
    this.searchTerm = suggestion.text;
    this.showSuggestions = false;
    this.selectedIndex = -1;
    this.suggestionSelected.emit(suggestion);
    this.searchEvent.emit(suggestion.text);
  }

  private navigateSuggestions(direction: number): void {
    if (this.suggestions.length === 0) return;

    this.selectedIndex += direction;
    
    if (this.selectedIndex >= this.suggestions.length) {
      this.selectedIndex = 0;
    } else if (this.selectedIndex < 0) {
      this.selectedIndex = this.suggestions.length - 1;
    }
  }

  private loadSuggestions(query: string): void {
    this.searchService.getAutocompleteSuggestions(query).subscribe({
      next: (suggestions: AutocompleteSuggestion[]) => {
        this.suggestions = suggestions;
        this.showSuggestions = suggestions.length > 0;
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar sugestões:', error);
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  getSuggestionClass(index: number): string {
    const baseClasses = 'px-3 py-2 text-sm cursor-pointer transition-colors';
    if (index === this.selectedIndex) {
      return `${baseClasses} bg-blue-100 text-blue-900`;
    }
    return `${baseClasses} hover:bg-gray-100 text-gray-700`;
  }

  getSuggestionIcon(type: string): string {
    switch (type) {
      case 'name':
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
      case 'category':
        return 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10';
      case 'description':
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      default:
        return 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z';
    }
  }
}
