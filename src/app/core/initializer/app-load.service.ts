import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DashboardI } from '@models/dashboard.interface';

@Injectable()
export class AppLoadService {
  private dashboardData: DashboardI;

  constructor(private http: HttpClient) {}

  getData(): DashboardI {
    return this.dashboardData;
  }

  load(): Promise<DashboardI> {
    const params = new HttpParams().set('without_associations', 'true');

    return this.http.get<DashboardI>('https://dc-dev.iss-reshetnev.ru/api/v1/dashboard', { params: params })
      .toPromise()
      .then(
        response => {
          this.dashboardData = response;

          return response;
        }
      );
  }
}
