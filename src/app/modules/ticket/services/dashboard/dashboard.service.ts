import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DashboardI } from '@models/dashboard.interface';
import { CategoryI } from '@models/category.interface';
import { ServiceI } from '@models/service.interface';
import { TicketI } from '@models/ticket.interface';
import { ServiceTemplateI } from '@models/service_template.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<DashboardI> {
    const params = new HttpParams().set('without_associations', 'true');

    return this.http.get<DashboardI>('http://inv-dev/api/v1/dashboard', { params: params });
  }

  search(searchValue: string): Observable<any> {
    const params = new HttpParams().set('search', searchValue).set('without_associations', 'true');

    return this.http.get<any>('http://inv-dev/api/v1/dashboard/search', { params: params })
      .pipe(map(service => {
        console.log(service);
        return service;
      }));
  }
}
