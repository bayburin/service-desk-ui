import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketInitializer } from './ticket-initializer';
import { Question } from '@modules/ticket/models/question/question.model';
import { ClaimTicket } from '@modules/ticket/models/claim-ticket/claim-ticket.model';

export class TicketFactory {
  static create(type: TicketTypes, params: any): Question;
  static create(type: TicketTypes, params: any): ClaimTicket;
  static create(type: TicketTypes, params: any = {}): Question | ClaimTicket {
    return TicketInitializer.for(type).create(params);
  }
}
