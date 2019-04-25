import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServiceI } from '@models/service.interface';
import { environment } from 'environments/environment';
import { CommonServiceI } from '@models/common-service.interface';
import { ServiceTemplateI } from '@models/service-template.interface';
import { BreadcrumbServiceI } from '@models/breadcrumb-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements CommonServiceI, BreadcrumbServiceI {
  private loadServicesUrl: string;
  public loadServiceUrl: string;
  private services = new Subject<ServiceI[]>();
  private service = new Subject<ServiceI>();

  constructor(private http: HttpClient) { }

  // /**
  //  * Загрузить список услуг для указанной категории
  //  *
  //  * @param categoryId - Id выбранной категории
  //  */
  // loadServices(categoryId: number): Observable<ServiceI[]> {
  //   this.loadServicesUrl = `${environment.serverUrl}/api/v1/categories/${categoryId}/services`;

  //   return this.http.get<ServiceI[]>(this.loadServicesUrl)
  //     .pipe(map((services: ServiceI[]) => {
  //       this.services.next(services);

  //       return services;
  //     }));
  // }

  /**
   * Загрузить данные о категории и список связанных сервисов.
   */
  loadService(categoryId, serviceId): Observable<ServiceI> {
    this.loadServiceUrl = `${environment.serverUrl}/api/v1/categories/${categoryId}/services/${serviceId}`;

    return this.http.get<ServiceI>(this.loadServiceUrl).pipe(
      map((service: ServiceI) => {
        this.service.next(service);

        return service;
      })
    );
  }

  getNodeName(): Observable<string> {
    return this.service.asObservable().pipe(
      map((service: ServiceI) => service ? service.name : '')
    );
  }

  getParentNodeName(): Observable<string> {
    return this.service.asObservable().pipe(
      map((service: ServiceI) => service ? service.category.name : '')
    );
  }

  getListLink(template: ServiceTemplateI): string {
    return `/categories/${template.category_id}/services`;
  }
}
