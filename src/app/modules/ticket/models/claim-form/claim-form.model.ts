import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Ticket } from '../ticket/ticket.model';

export class ClaimForm extends Ticket {
  description: string;
  destination: string;
  message: string;
  info: string;
  readonly ticketType = TicketTypes.CLAIM_FORM;

  constructor(form: any = {}) {
    super(form);
    this.id = form.id;
    this.description = form.description;
    this.destination = form.destination;
    this.message = form.message;
    this.info = form.info;
  }

  getShowLink(): string {
    return 'Need implementation';
  }

  pageComponent(): string {
    return 'app-claim-form-page-content';
  }
}
