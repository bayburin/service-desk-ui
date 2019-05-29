import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DashboardI } from '@interfaces/dashboard.interface';
import { environment } from 'environments/environment';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private getAllUri = `${environment.serverUrl}/api/v1/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Загрузить данные, необходимые для страницы dashboard.
   */
  loadAll(): Observable<DashboardI> {
    return this.http.get<DashboardI>(this.getAllUri).pipe(
      map((data) => {
        data.services = data.services.map(service => ServiceFactory.create(service));
        data.categories = data.categories.map(category => CategoryFactory.create(category));

        return data;
      })
    );
  }
}
