import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Ticket } from '../ticket/ticket.model';

export class ClaimTicket extends Ticket {
  readonly ticketType = TicketTypes.CLAIM;

  constructor(claim: any = {}) {
    super(claim);
    this.id = claim.id;
  }

  getShowLink(): string {
    return 'Need implementation';
  }

  pageComponent(): string {
    return 'app-claim-page-content';
  }
}
