import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketInitializer } from './ticket-initializer';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';
import { CaseTicket } from '@modules/ticket/models/case-ticket/case-ticket.model';

export class TicketFactory {
  static create(type: TicketTypes, params: any): QuestionTicket;
  static create(type: TicketTypes, params: any): CaseTicket;
  static create(type: TicketTypes, params: any = {}): QuestionTicket | CaseTicket {
    return TicketInitializer.for(type).create(params);
  }
}
