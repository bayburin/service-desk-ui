import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { BreadcrumbServiceI } from '@interfaces/breadcrumb-service.interface';
import { SearchSortingPipe } from '@shared/pipes/search-sorting/search-sorting.pipe';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';
import { TicketDataI } from '../ticket/ticket.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements BreadcrumbServiceI {
  service: Service;
  service$ = new BehaviorSubject<Service>(this.service);
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

  // FIXME: Метод должен быть изменен
  /**
   * Добавить тикеты к услуге.
   *
   * @param data - вопросы.
   */
  addTickets(data: TicketDataI): void {
    this.service.questionTickets = data.questions.concat(this.service.questionTickets);
    // this.service.caseTickets = data.cases.concat(this.service.caseTickets);
  }

  // FIXME: Метод должен быть изменен
  /**
   * Находит ticket в списке и заменяет указанным.
   *
   * @param ticketId - id заменяемого объекта QuestionTicket.
   * @param ticket - новый объект QuestionTicket.
   */
  replaceQuestion(questionId: number, newQuestion: QuestionTicket): void {
    let original: QuestionTicket;

    const index = this.service.questionTickets.findIndex(question => {
      if (question.id === questionId) {
        return true;
      } else if ((question as QuestionTicket).correction && (question as QuestionTicket).correction.id === questionId) {
        (question as QuestionTicket).correction = newQuestion as QuestionTicket;
        (newQuestion as QuestionTicket).original = question as QuestionTicket;
        original = question;

        return true;
      } else {
        return false;
      }
    });

    if (index !== -1) {
      this.service.questionTickets.splice(index, 1, original || newQuestion);
    }
  }

  // FIXME: Метод должен быть изменен
  /**
   * Удалить вопросы из услуги.
   *
   * @param questions - вопросы.
   */
  removeQuestions(questions: QuestionTicket[]): void {
    this.service.questionTickets = this.service.questionTickets.filter(el => !questions.find(draft => draft.id === el.id));
  }

  // FIXME: Метод должен быть изменен
  /**
   * Удалить черновые вопросы.
   */
  removeDraftTickets(): void {
    this.service.questionTickets = this.service.questionTickets.filter(question => !question.isDraftState());
    // this.service.caseTickets = this.service.caseTickets.filter(question => !question.isDraftState());
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
    this.service$.next(null);

    return this.http.get(this.loadServiceUri).pipe(
      map((data: ServiceI) => {
        const service = ServiceFactory.create(data);

        service.questionTickets = this.searchSortingPipe.transform(service.questionTickets);

        return service;
      }),
      tap(service => {
        this.service$.next(service);
        this.service = service;
      })
    );
  }
}
