import { Question } from '@modules/ticket/models/question/question.model';
import { ClaimTicket } from '@modules/ticket/models/claim-ticket/claim-ticket.model';

export abstract class TicketFactoryT {
  abstract create(params: any): Question | ClaimTicket;
}
