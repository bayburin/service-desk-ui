import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { BreadcrumbServiceI } from '@interfaces/breadcrumb-service.interface';
import { SearchSortingPipe } from '@shared/pipes/search-sorting/search-sorting.pipe';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements BreadcrumbServiceI {
  private loadServicesUri: string;
  private loadServiceUri: string;
  private service = new Subject<Service>();

  constructor(private http: HttpClient, private searchSortingPipe: SearchSortingPipe) { }

  /**
   * Загрузить список всех услуг (вместе с вопросами/заявками)
   */
  loadServices(): Observable<Service[]> {
    this.loadServicesUri = `${environment.serverUrl}/api/v1/services`;

    return this.http.get(this.loadServicesUri).pipe(map((services: ServiceI[]) => services.map(service => ServiceFactory.create(service))));
  }

  /**
   * Загрузить данные об услуге, список вопросов и ответов.
   *
   * @param categoryId - id категории
   * @param serviceId - id услуги
   */
  loadService(categoryId: number, serviceId: number): Observable<Service> {
    this.loadServiceUri = `${environment.serverUrl}/api/v1/categories/${categoryId}/services/${serviceId}`;

    return this.http.get(this.loadServiceUri).pipe(
      map((data: ServiceI) => {
        const service = ServiceFactory.create(data);
        service.tickets = this.searchSortingPipe.transform(service.tickets);
        return service;
      }),
      tap(service => this.service.next(service))
    );
  }

  getNodeName(): Observable<string> {
    return this.service.asObservable().pipe(
      map((service: Service) => service ? service.name : '')
    );
  }

  getParentNodeName(): Observable<string> {
    return this.service.asObservable().pipe(
      map((service: Service) => service ? service.category.name : '')
    );
  }
}
