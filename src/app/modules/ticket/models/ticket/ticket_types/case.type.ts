import { AbstractTicketType } from './abstract-ticket.type';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export class CaseType extends AbstractTicketType {
  getShowLink(ticket: Ticket): string {
    return 'Need implementation';
  }

  getPageContentComponent(): string {
    return 'app-case-page-content';
  }
}
