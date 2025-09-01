import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductSearch {
  readonly apiUrl = 'https://65009f9718c34dee0cd53786.mockapi.io';

  constructor(private http: HttpClient) {}

  searchByName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {
      params: { name },
    });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}
