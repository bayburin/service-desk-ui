import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';
import { CaseTicket } from '@modules/ticket/models/case-ticket/case-ticket.model';

export abstract class TicketFactoryT {
  abstract create(params: any): QuestionTicket | CaseTicket;
}
