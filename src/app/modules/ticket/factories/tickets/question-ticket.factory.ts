import { TicketFactoryT } from './ticket.factory.abstract';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class QuestionTicketFactory extends TicketFactoryT {
  create(params: any = {}): QuestionTicket {
    return new QuestionTicket(params);
  }
}
