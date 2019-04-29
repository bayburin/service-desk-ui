import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DashboardI } from '@interfaces/dashboard.interface';
import { environment } from 'environments/environment';
import { Category } from '@modules/ticket/models/category.model';
import { Service } from '@modules/ticket/models/service.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private getAllUrl = `${environment.serverUrl}/api/v1/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Загрузить данные, необходимые для страницы dashboard.
   */
  loadAll(): Observable<DashboardI> {
    return this.http.get<DashboardI>(this.getAllUrl).pipe(
      map((data) => {
        data.services = data.services.map(service => new Service(service));
        data.categories = data.categories.map(category => new Category(category));

        return data;
      })
    );
  }
}
