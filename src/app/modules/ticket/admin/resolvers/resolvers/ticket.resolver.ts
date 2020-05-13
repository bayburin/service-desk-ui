import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { QuestionTicketService } from '@shared/services/question-ticket/question-ticket.service';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';

@Injectable()
export class TicketResolver implements Resolve<QuestionTicket> {
  constructor(private questionTicketService: QuestionTicketService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<QuestionTicket> {
    const id = route.params.id;
    const serviceId = route.parent.parent.parent.params.id;

    return this.questionTicketService.loadQuestion(serviceId, id);
  }
}
