import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { Service } from '@modules/ticket/models/service/service.model';
import { Question } from '@modules/ticket/models/question/question.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export interface TicketDataI {
  questions: Question[];
  apps: any[];
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient) {}

  loadDraftTickets(service: Service): Observable<TicketDataI> {
    const ticketsUri = this.apiBaseUri(service.id);

    return this.http.get<TicketDataI>(ticketsUri)
      .pipe(map(data => {
        // FIXME: Попробовать через Object.keys ?
        data.questions = data.questions.map(question => TicketFactory.create(TicketTypes.QUESTION, question));

        return data;
      }));
  }

  private apiBaseUri(serviceId: number) {
    return `${environment.serverUrl}/api/v1/services/${serviceId}/tickets`;
  }
}
