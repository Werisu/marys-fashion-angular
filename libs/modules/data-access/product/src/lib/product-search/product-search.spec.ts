import { TestBed } from '@angular/core/testing';

import { ProductSearch } from './product-search';

describe('ProductSearch', () => {
  let service: ProductSearch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSearch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
