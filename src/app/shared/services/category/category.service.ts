import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CategoryI } from '@interfaces/category.interface';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { Category } from '@modules/ticket/models/category.model';
import { environment } from 'environments/environment';
import { BreadcrumbServiceI } from '@interfaces/breadcrumb-service.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements BreadcrumbServiceI {
  private loadCategoriesUri = `${environment.serverUrl}/api/v1/categories`;
  private loadCategoryUri: string;
  private category = new Subject<Category>();

  constructor(private http: HttpClient) {}

  /**
   * Загрузить список категорий.
   */
  loadCategories(): Observable<Category[]> {
    return this.http.get(this.loadCategoriesUri).pipe(
      map((categories: CategoryI[]) => categories.map(category => CategoryFactory.create(category)))
    );
  }

  /**
   * Загрузить данные о категории и список связанных сервисов.
   */
  loadCategory(categoryId: number): Observable<Category> {
    this.loadCategoryUri = `${this.loadCategoriesUri}/${categoryId}`;

    return this.http.get(this.loadCategoryUri).pipe(
      map((data: CategoryI) => CategoryFactory.create(data)),
      tap(category => this.category.next(category))
    );
  }

  getNodeName(): Observable<string> {
    return this.category.asObservable().pipe(
      map((category: Category) => category ? category.name : '')
    );
  }

  getParentNodeName(): Observable<string> {
    return this.getNodeName();
  }
}
