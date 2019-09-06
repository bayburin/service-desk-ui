import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

export abstract class AbstractTicketState {
  /**
   * Возвращает ссылку на просмотр текущего вопроса или ссылку на создание заявки.
   */
  abstract getShowLink(ticket: Ticket): string;
  /**
   * Возвращает компонент выбранного шаблона для выдачи пользователю.
   */
  abstract getPageContentComponent(): string;
}
