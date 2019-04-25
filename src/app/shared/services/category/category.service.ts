import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CategoryI } from '@models/category.interface';
import { environment } from 'environments/environment';
import { CommonServiceI } from '@models/common-service.interface';
import { ServiceTemplateI } from '@models/service-template.interface';
import { BreadcrumbServiceI } from '@models/breadcrumb-service.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements CommonServiceI, BreadcrumbServiceI {
  private loadCategoriesUrl = `${environment.serverUrl}/api/v1/categories`;
  private loadCategoryUrl: string;
  private categories: CategoryI[];
  private category = new BehaviorSubject<CategoryI>(null);

  constructor(private http: HttpClient) {}

  /**
   * Загрузить список категорий.
   */
  loadCategories(): Observable<CategoryI[]> {
    return this.http.get<CategoryI[]>(this.loadCategoriesUrl).pipe(map((categories: CategoryI[]) => this.categories = categories));
  }

  /**
   * Получить текущий список категорий.
   */
  getCategories(): CategoryI[] {
    return this.categories;
  }

  /**
   * Загрузить данные о категории и список связанных сервисов.
   */
  loadCategory(categoryId): Observable<CategoryI> {
    this.loadCategoryUrl = `${this.loadCategoriesUrl}/${categoryId}`;

    return this.http.get<CategoryI>(this.loadCategoryUrl).pipe(
      map((category: CategoryI) => {
        this.category.next(category);

        return category;
      })
    );
  }

  getNodeName(): Observable<string> {
    return this.category.asObservable().pipe(
      map((category: CategoryI) => category ? category.name : '')
    );
  }

  getParentNodeName(): Observable<string> {
    return this.getNodeName();
  }

  getListLink(template: ServiceTemplateI): string {
    return `/categories/${template.id}`;
  }
}
