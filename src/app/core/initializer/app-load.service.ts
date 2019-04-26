import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DashboardI } from '@interfaces/dashboard.interface';
import { environment } from 'environments/environment';

@Injectable()
export class AppLoadService {
  private loadUrl = `${environment.serverUrl}/api/v1/dashboard`;
  private dashboardData: DashboardI;

  constructor(private http: HttpClient) {}

  getData(): DashboardI {
    return this.dashboardData;
  }

  load(): Promise<DashboardI> {
    const params = new HttpParams().set('without_associations', 'true');

    return this.http.get<DashboardI>(this.loadUrl, { params: params })
      .toPromise()
      .then(
        response => {
          this.dashboardData = response;

          return response;
        }
      );
  }
}
