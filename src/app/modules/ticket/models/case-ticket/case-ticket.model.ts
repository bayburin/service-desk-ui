import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Ticket } from '../ticket/ticket.model';

export class CaseTicket extends Ticket {
  readonly ticketType = TicketTypes.CASE;

  constructor(caseTicket: any = {}) {
    super(caseTicket);
    this.id = caseTicket.id;
  }

  getShowLink(): string {
    return 'Need implementation';
  }

  pageComponent(): string {
    return 'app-claim-page-content';
  }
}
