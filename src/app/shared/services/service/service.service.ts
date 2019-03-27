import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServiceI } from '@models/service.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private loadServicesUrl: string;
  private services: ServiceI[];

  constructor(private http: HttpClient) { }

  loadServices(categoryId: number): Observable<ServiceI[]> {
    this.loadServicesUrl = `${environment.serverUrl}/api/v1/categories/${categoryId}/services`;

    return this.http.get<ServiceI[]>(this.loadServicesUrl)
      .pipe(map((services: ServiceI[]) => this.services = services));
  }

  getServices(): ServiceI[] {
    return this.services;
  }
}
