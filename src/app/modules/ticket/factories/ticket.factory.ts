import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export class TicketFactory {
  static create(params) {
    return new Ticket(params);
  }
}
