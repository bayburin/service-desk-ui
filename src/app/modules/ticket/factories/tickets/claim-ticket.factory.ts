import { TicketFactoryT } from './ticket.factory.abstract';
import { ClaimTicket } from '@modules/ticket/models/claim-ticket/claim-ticket.model';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class ClaimTicketFactory extends TicketFactoryT {
  create(params: any = {}): ClaimTicket {
    return new ClaimTicket(params);
  }
}
