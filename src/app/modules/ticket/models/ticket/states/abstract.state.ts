import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export abstract class AbstractState {
  /**
   * Меняет статус вопроса с чернового на опубликованный.
   */
  abstract publish(ticket: Ticket): void;
}
