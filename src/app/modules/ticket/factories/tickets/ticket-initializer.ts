import { ClaimFormFactory } from './claim-form.factory';
import { TicketFactoryT } from './ticket.factory.abstract';
import { QuestionFactory } from './question.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class TicketInitializer {
  static for(type: TicketTypes): TicketFactoryT {
    switch (type) {
      case TicketTypes.CLAIM_FORM:
        return new ClaimFormFactory();
      case TicketTypes.QUESTION:
        return new QuestionFactory();
      default:
        throw new Error('Неизвестный тип тикета');
    }
  }
}
