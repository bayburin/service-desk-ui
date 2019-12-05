import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketService } from '@shared/services/ticket/ticket.service';

@Injectable()
export class TicketResolver implements Resolve<Ticket> {
  constructor(private ticketService: TicketService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Ticket> {
    const id = route.params.id;
    const serviceId = route.parent.parent.parent.params.id;

    return this.ticketService.loadTicket(serviceId, id);
  }
}
