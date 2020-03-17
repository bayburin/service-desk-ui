import { TicketFactoryT } from './ticket_factory.abstract';
import { QuestionTicket } from '@modules/ticket/models/question_ticket/question_ticket.model';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class QuestionTicketFactory extends TicketFactoryT {
  create(params: any = {}): QuestionTicket {
    const questionTicket = new QuestionTicket(params);

    questionTicket.ticketType = TicketTypes.QUESTION;

    return questionTicket;
  }
}
