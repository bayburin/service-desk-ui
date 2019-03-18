import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardI } from '@models/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<DashboardI> {
    const params = new HttpParams().set('without_associations', 'true');

    return this.http.get<DashboardI>('https://dc-dev.iss-reshetnev.ru/api/v1/dashboard', { params: params });
  }
}
