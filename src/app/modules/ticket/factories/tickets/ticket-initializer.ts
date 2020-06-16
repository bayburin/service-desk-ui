import { ClaimTicketFactory } from './claim-ticket.factory';
import { TicketFactoryT } from './ticket.factory.abstract';
import { QuestionFactory } from './question.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class TicketInitializer {
  static for(type: TicketTypes): TicketFactoryT {
    switch (type) {
      case TicketTypes.CLAIM:
        return new ClaimTicketFactory();
      case TicketTypes.QUESTION:
        return new QuestionFactory();
      default:
        throw new Error('Неизвестный тип тикета');
    }
  }
}
