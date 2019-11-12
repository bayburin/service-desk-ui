import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { BreadcrumbServiceI } from '@interfaces/breadcrumb-service.interface';
import { SearchSortingPipe } from '@shared/pipes/search-sorting/search-sorting.pipe';
import { TagI } from '@interfaces/tag.interface';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements BreadcrumbServiceI {
  service: Service;
  service$ = new Subject<Service>();
  private loadServicesUri: string;
  private loadServiceUri: string;
  private returnCached: boolean;
  private cache: Observable<Service>;
  private readonly CACHE_SIZE = 1;

  constructor(private http: HttpClient, private searchSortingPipe: SearchSortingPipe) { }

  /**
   * Загрузить список всех услуг (вместе с вопросами/заявками)
   */
  loadServices(): Observable<Service[]> {
    this.loadServicesUri = `${environment.serverUrl}/api/v1/services`;

    return this.http.get(this.loadServicesUri).pipe(
      map((services: ServiceI[]) => services.map(service => ServiceFactory.create(service)))
    );
  }

  /**
   * Загрузить данные об услуге, список вопросов и ответов.
   *
   * @param categoryId - id категории
   * @param serviceId - id услуги
   * @param caching - флаг кеширования. Если true - запрос будет закеширован на количество запросов, равное константе CACHE_SIZE.
   */
  loadService(categoryId: number, serviceId: number, caching = false): Observable<Service> {
    this.loadServiceUri = `${environment.serverUrl}/api/v1/categories/${categoryId}/services/${serviceId}`;
    if (caching) {
      this.cache = this.getServiceObservable().pipe(
        tap(() => this.returnCached = true),
        shareReplay(this.CACHE_SIZE)
      );

      return this.cache;
    } else if (this.returnCached) {
      return this.cache.pipe(tap(() => {
        this.returnCached = false;
        this.service$.next(this.service);
      }));
    } else {
      return this.getServiceObservable();
    }
  }

  /**
   * Загружает список тегов для текущего сервиса, отсортированный по популярности.
   */
  loadTags(): Observable<TagI[]> {
    const tagsUri = `${environment.serverUrl}/api/v1/tags/popularity`;
    const httpParams = new HttpParams().set('service_id', `${this.service.id}`);

    return this.http.get<TagI[]>(tagsUri, { params: httpParams });
  }

  /**
   * Добавить вопросы к услуге.
   *
   * @param tickets - вопросы.
   */
  addTickets(tickets: Ticket[]): void {
    this.service.tickets = tickets.concat(this.service.tickets);
  }

  /**
   * Находит ticket в списке и заменяет указанным.
   *
   * @param ticketId - id заменяемого объекта Ticket.
   * @param ticket - новый объект Ticket.
   */
  replaceTicket(ticketId: number, newTicket: Ticket): void {
    let original: Ticket;

    const index = this.service.tickets.findIndex(ticket => {
      if (ticket.id === ticketId) {
        return true;
      } else if (ticket.correction && ticket.correction.id === ticketId) {
        ticket.correction = newTicket;
        newTicket.original = ticket;
        original = ticket;

        return true;
      } else {
        return false;
      }
    });

    if (index !== -1) {
      this.service.tickets.splice(index, 1, original || newTicket);
    }
  }

  /**
   * Удалить вопросы из услуги.
   *
   * @param tickets - вопросы.
   */
  removeTickets(tickets: Ticket[]): void {
    this.service.tickets = this.service.tickets.filter(el => !tickets.find(draft => draft.id === el.id));
  }

  getNodeName(): Observable<string> {
    return this.service$.asObservable().pipe(
      map((service: Service) => service ? service.name : '')
    );
  }

  getParentNodeName(): Observable<string> {
    return this.service$.asObservable().pipe(
      map((service: Service) => service ? service.category.name : '')
    );
  }

  private getServiceObservable(): Observable<Service> {
    return this.http.get(this.loadServiceUri).pipe(
      map((data: ServiceI) => {
        const service = ServiceFactory.create(data);
        service.tickets = this.searchSortingPipe.transform(service.tickets);

        return service;
      }),
      tap(service => {
        this.service$.next(service);
        this.service = service;
      })
    );
  }
}
