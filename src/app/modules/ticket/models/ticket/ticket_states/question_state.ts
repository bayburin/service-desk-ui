import { AbstractTicketState } from './abstract_ticket_state';

export class QuestionState extends AbstractTicketState {
  getShowLink(): string {
    return `/categories/${this.ticket.service.categoryId}/services/${this.ticket.serviceId}?ticket=${this.ticket.id}`;
  }
}
