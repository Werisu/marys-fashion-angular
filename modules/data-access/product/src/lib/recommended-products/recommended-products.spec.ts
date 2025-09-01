import { TestBed } from '@angular/core/testing';

import { RecommendedProducts } from './recommended-products';

describe('RecommendedProducts', () => {
  let service: RecommendedProducts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendedProducts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
