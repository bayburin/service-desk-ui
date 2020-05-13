import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { environment } from 'environments/environment';
import { TicketI } from '@interfaces/ticket.interface';
import { TagI } from '@interfaces/tag.interface';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { Service } from '@modules/ticket/models/service/service.model';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { QuestionTicketI } from '@interfaces/question-ticket.interface';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionTicketService {
  draftTickets: QuestionTicket[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Загружает список черновых вопросов для указанной услуги.
   *
   * @param service - услуга.
   */
  loadDraftTicketsFor(service: Service): Observable<QuestionTicket[]> {
    const ticketsUri = `${environment.serverUrl}/api/v1/services/${service.id}/question_tickets`;

    return this.http.get(ticketsUri)
      .pipe(
        map((questions: QuestionTicketI[]) => questions.map(question => TicketFactory.create(TicketTypes.QUESTION, question))),
        tap(tickets => this.draftTickets = tickets)
      );
  }

  /**
   * Добавляет вопросы к списку черновых.
   *
   * @param ticket - список вопросов
   */
  addDraftTickets(tickets: QuestionTicket[]): void {
    this.draftTickets.push(...tickets);
  }

  /**
   * Отправляет запрос на сервер на изменение рейтинга указанного вопроса.
   */
  raiseRating(ticket: Ticket): Observable<TicketI> {
    const raiseRatingUrl = `${environment.serverUrl}/api/v1/services/${ticket.serviceId}/question_tickets/${ticket.ticketId}/raise_rating`;

    return this.http.post<TicketI>(raiseRatingUrl, {});
  }

  /**
   * Создает вопрос.
   *
   * @param questionI - объект questionTicket
   */
  createQuestion(questionI: QuestionTicketI): Observable<QuestionTicket> {
    const questionUri = `${environment.serverUrl}/api/v1/services/${questionI.ticket.service_id}/question_tickets`;

    return this.http.post(questionUri, { question: questionI })
      .pipe(map((question: QuestionTicketI) => TicketFactory.create(TicketTypes.QUESTION, question)));
  }

  /**
   * Загружает список тегов.
   *
   * @param - поисковая строка
   */
  loadTags(term: string): Observable<TagI[]> {
    const tagUri = `${environment.serverUrl}/api/v1/tags`;
    const httpParams = new HttpParams().set('search', term);

    return this.http.get<TagI[]>(tagUri, { params: httpParams });
  }

  /**
   * Загрузить вопрос.
   *
   * @param serviceId - id услуги.
   * @param questionId - id вопроса.
   */
  loadQuestion(serviceId: number, questionId: number): Observable<QuestionTicket> {
    const questionUri = `${environment.serverUrl}/api/v1/services/${serviceId}/question_tickets/${questionId}`;

    return this.http.get(questionUri).pipe(map((question: QuestionTicketI) => TicketFactory.create(TicketTypes.QUESTION, question)));
  }

  /**
   * Обновить вопрос.
   *
   * @params questionTicket - объект QuestionTicket
   * @params data - новые данные.
   */
  updateQuestion(questionTicket: QuestionTicket, data: QuestionTicketI): Observable<QuestionTicket> {
    const questionUri = `${environment.serverUrl}/api/v1/services/${questionTicket.serviceId}/question_tickets/${questionTicket.id}`;

    questionTicket.responsibleUsers.forEach(user => {
      if (!data.ticket.responsible_users.find((u: ResponsibleUserI) => u.id === user.id)) {
        user._destroy = true;
        data.ticket.responsible_users.push(user);
      }
    });

    return this.http.put(questionUri, { question: data })
      .pipe(map((questionI: QuestionTicketI) => TicketFactory.create(TicketTypes.QUESTION, questionI)));
  }

  /**
   * Утвердить изменения в указанных вопросах.
   *
   * @param ticketIds - список id вопросов для утверждения изменений.
   */
  publishTickets(ticketIds: number[]): Observable<Ticket[]> {
    const ticketUri = `${environment.serverUrl}/api/v1/question_tickets/publish`;
    const httpParams = new HttpParams().append('ids', `${[ticketIds]}`);

    return this.http.post(ticketUri, {}, { params: httpParams })
      .pipe(map((ticketsI: QuestionTicketI[]) => ticketsI.map(ticket => TicketFactory.create(ticket.ticket.ticketable_type, ticket))));
  }

  /**
   * Удалить тикет из списка черновых.
   *
   * @param ticket - удаляемый тикет.
   */
  removeDraftTicket(ticket: Ticket): void {
    const index = this.draftTickets.findIndex(draft => draft.id === ticket.id);

    if (index !== -1) {
      this.draftTickets.splice(index, 1);
    }
  }

  /**
   * Удалить вопрос.
   *
   * @param questionTicket - удаляемый тикет.
   */
  destroyQuestion(questionTicket: QuestionTicket): Observable<any> {
    const questionUri = `${environment.serverUrl}/api/v1/services/${questionTicket.serviceId}/question_tickets/${questionTicket.id}`;

    return this.http.delete(questionUri);
  }
}
