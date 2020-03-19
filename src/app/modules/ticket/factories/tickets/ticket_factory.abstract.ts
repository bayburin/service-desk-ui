import { QuestionTicket } from '@modules/ticket/models/question_ticket/question_ticket.model';
import { CaseTicket } from '@modules/ticket/models/case_ticket/case_ticket.model';

export abstract class TicketFactoryT {
  abstract create(params: any): QuestionTicket | CaseTicket;
}
