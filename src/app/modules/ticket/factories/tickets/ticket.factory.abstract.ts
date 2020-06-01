import { Question } from '@modules/ticket/models/question/question.model';
import { CaseTicket } from '@modules/ticket/models/case-ticket/case-ticket.model';

export abstract class TicketFactoryT {
  abstract create(params: any): Question | CaseTicket;
}
