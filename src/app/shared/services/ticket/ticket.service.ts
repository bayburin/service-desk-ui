import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { environment } from 'environments/environment';
import { TicketI } from '@interfaces/ticket.interface';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { TagI } from '@interfaces/tag.interface';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { Service } from '@modules/ticket/models/service/service.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient) {}

  /**
   * Загружает список черновых вопросов для указанной услуги.
   *
   * @param service - услуга.
   */
  loadDraftTicketsFor(service: Service): Observable<Ticket[]> {
    const ticketsUri = `${environment.serverUrl}/api/v1/services/${service.id}/tickets`;
    const httpParams = new HttpParams().set('state', 'draft');

    return this.http.get(ticketsUri, { params:  httpParams })
      .pipe(map((tickets: TicketI[]) => tickets.map(ticket => TicketFactory.create(ticket))));
  }

  /**
   * Отправляет запрос на сервер на изменение рейтинга указанного вопроса.
   */
  raiseRating(ticket: Ticket): Observable<TicketI> {
    const raiseRatingUrl = `${environment.serverUrl}/api/v1/services/${ticket.serviceId}/tickets/${ticket.id}`;

    return this.http.get<TicketI>(raiseRatingUrl);
  }

  /**
   * Загружает с сервера указанный файл.
   */
  downloadAttachmentFromAnswer(attachment: AnswerAttachmentI): Observable<Blob> {
    const downloadAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/attachments/${attachment.id}`;

    return this.http.get(downloadAttachmentUrl, { responseType: 'blob' });
  }

  /**
   * Создает вопрос.
   *
   * @param ticketI - объект ticket
   */
  createTicket(ticketI: TicketI): Observable<Ticket> {
    const ticketUri = `${environment.serverUrl}/api/v1/services/${ticketI.service_id}/tickets`;

    return this.http.post(ticketUri, { ticket: ticketI })
      .pipe(map((ticket: TicketI) => TicketFactory.create(ticket)));
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
}
