import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketInitializer } from './ticket_initializer';
import { QuestionTicket } from '@modules/ticket/models/question_ticket/question_ticket.model';
import { CaseTicket } from '@modules/ticket/models/case_ticket/case_ticket.model';

export class TicketFactory {
  static create(type: TicketTypes, params: any): QuestionTicket;
  static create(type: TicketTypes, params: any): CaseTicket;
  static create(type: TicketTypes, params: any = {}): QuestionTicket | CaseTicket {
    return TicketInitializer.for(type).create(params);
  }
}
