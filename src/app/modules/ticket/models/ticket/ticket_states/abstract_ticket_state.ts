import { Ticket } from '../ticket.model';

export abstract class AbstractTicketState {
  protected ticket: Ticket;

  constructor(ticket: Ticket) {
    this.ticket = ticket;
  }

  /**
   * Получить ссылку на просмотр текущего вопроса или ссылку на создание заявки.
   */
  abstract getShowLink(): string;
}
