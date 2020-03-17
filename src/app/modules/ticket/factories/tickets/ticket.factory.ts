import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketInitializer } from './ticket_initializer';

export class TicketFactory {
  static create(type: TicketTypes, params: any = {}) {
    return TicketInitializer.for(type).create(params);
  }
}
