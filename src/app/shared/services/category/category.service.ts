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
  categories: CategoryI[];
  private loadAllUrl = `${environment.serverUrl}/api/v1/categories`;

  constructor(private http: HttpClient) {}

  loadAll(): Observable<CategoryI[]> {
    return this.http.get<CategoryI[]>(this.loadAllUrl).pipe(map((categories: CategoryI[]) => this.categories = categories));
  }
}
