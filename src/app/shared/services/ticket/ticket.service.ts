import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { environment } from 'environments/environment';
import { TicketI } from '@interfaces/ticket.interface';
import { TagI } from '@interfaces/tag.interface';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { Service } from '@modules/ticket/models/service/service.model';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  draftTickets: Ticket[];

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
      .pipe(
        map((tickets: TicketI[]) => tickets.map(ticket => TicketFactory.create(ticket))),
        tap(tickets => this.draftTickets = tickets)
      );
  }

  /**
   * Отправляет запрос на сервер на изменение рейтинга указанного вопроса.
   */
  raiseRating(ticket: Ticket): Observable<TicketI> {
    const raiseRatingUrl = `${environment.serverUrl}/api/v1/services/${ticket.serviceId}/tickets/${ticket.id}/raise_rating`;

    return this.http.post<TicketI>(raiseRatingUrl, {});
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

  /**
   * Загрузить вопрос.
   *
   * @param serviceId - id услуги.
   * @param ticketId - id вопроса.
   */
  loadTicket(serviceId: number, ticketId: number): Observable<Ticket> {
    const ticketUri = `${environment.serverUrl}/api/v1/services/${serviceId}/tickets/${ticketId}`;

    return this.http.get(ticketUri).pipe(map((ticket: TicketI) => TicketFactory.create(ticket)));
  }

  /**
   * Обновить вопрос.
   *
   * @params ticket - объект Ticket
   * @params data - новые данные.
   */
  updateTicket(ticket: Ticket, data: any): Observable<Ticket> {
    const ticketUri = `${environment.serverUrl}/api/v1/services/${ticket.serviceId}/tickets/${ticket.id}`;

    ticket.responsibleUsers.forEach(user => {
      if (!data.responsible_users.find((u: ResponsibleUserI) => u.id === user.id)) {
        user._destroy = true;
        data.responsible_users.push(user);
      }
    });

    return this.http.put(ticketUri, { ticket: data })
      .pipe(map((ticketI: TicketI) => TicketFactory.create(ticketI)));
  }

  /**
   * Утвердить изменения в указанных вопросах.
   *
   * @param serviceId - id услуги.
   * @param tickets - список вопросов для утверждения изменений.
   */
  publishTickets(tickets: Ticket[]): Observable<Ticket[]> {
    const ticketUri = `${environment.serverUrl}/api/v1/tickets/publish`;
    const ticketIds = tickets.map(t => t.correction ? t.correction.id : t.id);
    const httpParams = new HttpParams().append('ids', `${[ticketIds]}`);

    return this.http.post(ticketUri, {}, { params: httpParams })
      .pipe(map((ticketsI: TicketI[]) => ticketsI.map(t => TicketFactory.create(t))));
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
}
