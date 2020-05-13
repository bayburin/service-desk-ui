import { TicketFactoryT } from './ticket.factory.abstract';
import { CaseTicket } from '@modules/ticket/models/case-ticket/case-ticket.model';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class CaseTicketFactory extends TicketFactoryT {
  create(params: any = {}): CaseTicket {
    return new CaseTicket(params);
  }
}
