import { CaseTicketFactory } from './case-ticket.factory';
import { TicketFactoryT } from './ticket.factory.abstract';
import { QuestionTicketFactory } from './question-ticket.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class TicketInitializer {
  static for(type: TicketTypes): TicketFactoryT {
    switch (type) {
      case TicketTypes.CASE:
        return new CaseTicketFactory();
      case TicketTypes.QUESTION:
        return new QuestionTicketFactory();
      default:
        throw new Error('Неизвестный тип тикета');
    }
  }
}
