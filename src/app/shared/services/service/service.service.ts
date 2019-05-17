import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { Service } from '@modules/ticket/models/service.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { BreadcrumbServiceI } from '@interfaces/breadcrumb-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements BreadcrumbServiceI {
  private loadServicesUri: string;
  private loadServiceUri: string;
  private service = new Subject<Service>();

  constructor(private http: HttpClient) { }

  /**
   * Загрузить список всех услуг (вместе с вопросами/заявками)
   */
  loadServices(): Observable<Service[]> {
    this.loadServicesUri = `${environment.serverUrl}/api/v1/services`;

    return this.http.get<Service[]>(this.loadServicesUri).pipe(map((services) => services.map(service => ServiceFactory.create(service))));
  }

  /**
   * Загрузить данные о категории и список связанных сервисов.
   *
   * @param categoryId - id категории
   * @param serviceId  id сервиса
   */
  loadService(categoryId: string, serviceId: string): Observable<Service> {
    this.loadServiceUri = `${environment.serverUrl}/api/v1/categories/${categoryId}/services/${serviceId}`;

    return this.http.get<Service>(this.loadServiceUri).pipe(
      map(data => ServiceFactory.create(data)),
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
