import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServiceI } from '@models/service.interface';
import { environment } from 'environments/environment';
import { CommonServiceI } from '@models/common-service.interface';
import { ServiceTemplateI } from '@models/service-template.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements CommonServiceI {
  private loadServicesUrl: string;
  private services = new Subject<ServiceI[]>();

  constructor(private http: HttpClient) { }

  loadServices(categoryId: number): Observable<ServiceI[]> {
    this.loadServicesUrl = `${environment.serverUrl}/api/v1/categories/${categoryId}/services`;

    return this.http.get<ServiceI[]>(this.loadServicesUrl)
      .pipe(map((services: ServiceI[]) => {
        this.services.next(services);

        return services;
      }));
  }

  getListLink(template: ServiceTemplateI): string {
    return `/categories/${template.category_id}/services`;
  }
}
