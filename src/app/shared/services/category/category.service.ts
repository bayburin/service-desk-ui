import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoryI } from '@models/category.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private loadCategoriesUrl = `${environment.serverUrl}/api/v1/categories`;
  private categories: CategoryI[];

  constructor(private http: HttpClient) {}

  loadCategories(): Observable<CategoryI[]> {
    return this.http.get<CategoryI[]>(this.loadCategoriesUrl).pipe(map((categories: CategoryI[]) => this.categories = categories));
  }

  getCategories(): CategoryI[] {
    return this.categories;
  }
}
