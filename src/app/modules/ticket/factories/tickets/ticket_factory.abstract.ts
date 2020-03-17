import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export abstract class TicketFactoryT {
  abstract create(params: any): Ticket;
}
