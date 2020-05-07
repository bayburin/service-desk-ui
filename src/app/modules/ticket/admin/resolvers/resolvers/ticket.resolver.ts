import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { QuestionTicket } from '@modules/ticket/models/question_ticket/question_ticket.model';

@Injectable()
export class TicketResolver implements Resolve<QuestionTicket> {
  constructor(private ticketService: TicketService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<QuestionTicket> {
    const id = route.params.id;
    const serviceId = route.parent.parent.parent.params.id;

    return this.ticketService.loadQuestion(serviceId, id);
  }
}
