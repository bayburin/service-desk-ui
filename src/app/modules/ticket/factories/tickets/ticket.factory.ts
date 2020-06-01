import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketInitializer } from './ticket-initializer';
import { Question } from '@modules/ticket/models/question/question.model';
import { CaseTicket } from '@modules/ticket/models/case-ticket/case-ticket.model';

export class TicketFactory {
  static create(type: TicketTypes, params: any): Question;
  static create(type: TicketTypes, params: any): CaseTicket;
  static create(type: TicketTypes, params: any = {}): Question | CaseTicket {
    return TicketInitializer.for(type).create(params);
  }
}
