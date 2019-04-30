import { AbstractTicketState } from './abstract_ticket_state';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export class CaseState extends AbstractTicketState {
  getShowLink(ticket: Ticket): string {
    return 'Need implementation';
  }

  getPageContentComponent(): string {
    return 'CasePageContentComponent';
  }
}
