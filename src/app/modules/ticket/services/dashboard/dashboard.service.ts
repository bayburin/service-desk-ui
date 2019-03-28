import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardI } from '@models/dashboard.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private getAllUrl = `${environment.serverUrl}/api/v1/dashboard`;
  private searchUrl = `${environment.serverUrl}/api/v1/dashboard/search`;
  constructor(private http: HttpClient) {}

  loadAll(): Observable<DashboardI> {
    return this.http.get<DashboardI>(this.getAllUrl);
  }

  search(searchValue: string): Observable<any> {
    const params = new HttpParams().set('search', searchValue).set('without_associations', 'true');

    return this.http.get<any>(this.searchUrl, { params: params });
  }
}
