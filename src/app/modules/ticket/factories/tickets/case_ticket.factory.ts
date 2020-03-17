import { TicketFactoryT } from './ticket_factory.abstract';
import { CaseTicket } from '@modules/ticket/models/case_ticket/case_ticket.model';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class CaseTicketFactory extends TicketFactoryT {
  create(params: any = {}): CaseTicket {
    const caseTicket = new CaseTicket(params);

    caseTicket.ticketType = TicketTypes.CASE;

    return caseTicket;
  }
}
