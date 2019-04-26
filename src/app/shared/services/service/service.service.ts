import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Service } from '@modules/ticket/models/service.model';
import { environment } from 'environments/environment';
import { BreadcrumbServiceI } from '@interfaces/breadcrumb-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements BreadcrumbServiceI {
  loadServiceUrl: string;
  private loadServicesUrl: string;
  private services = new Subject<Service[]>();
  private service = new Subject<Service>();

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
   *
   * @param categoryId - id категории
   * @param serviceId  id сервиса
   */
  loadService(categoryId: string, serviceId: string): Observable<Service> {
    this.loadServiceUrl = `${environment.serverUrl}/api/v1/categories/${categoryId}/services/${serviceId}`;

    return this.http.get<Service>(this.loadServiceUrl).pipe(
      map(data => new Service(data)),
      tap(service => this.service.next(service))
    );
  }

  getNodeName(): Observable<string> {
    return this.service.asObservable().pipe(
      map((service) => service ? service.name : '')
    );
  }

  getParentNodeName(): Observable<string> {
    return this.service.asObservable().pipe(
      map((service) => service ? service.category.name : '')
    );
  }
}
