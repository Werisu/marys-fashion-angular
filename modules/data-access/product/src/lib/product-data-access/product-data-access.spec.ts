import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDataAccess } from './product-data-access';

describe('ProductDataAccess', () => {
  let component: ProductDataAccess;
  let fixture: ComponentFixture<ProductDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
