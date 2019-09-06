import { AbstractTicketState } from './abstract-ticket.state';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export class QuestionState extends AbstractTicketState {
  getShowLink(ticket: Ticket): string {
    return `/categories/${ticket.service.categoryId}/services/${ticket.serviceId}?ticket=${ticket.id}`;
  }

  getPageContentComponent(): string {
    return 'app-question-page-content';
  }
}
