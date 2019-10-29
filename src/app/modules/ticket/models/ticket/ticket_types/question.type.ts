import { AbstractTicketType } from './abstract-ticket.type';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export class QuestionType extends AbstractTicketType {
  getShowLink(ticket: Ticket): string {
    return `/categories/${ticket.service.categoryId}/services/${ticket.serviceId}?ticket=${ticket.id}`;
  }

  getPageContentComponent(): string {
    return 'app-question-page-content';
  }
}
