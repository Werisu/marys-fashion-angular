import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductUi } from './product-ui';

describe('ProductUi', () => {
  let component: ProductUi;
  let fixture: ComponentFixture<ProductUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductUi],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
