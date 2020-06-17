import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketInitializer } from './ticket-initializer';
import { Question } from '@modules/ticket/models/question/question.model';
import { Claim } from '@modules/ticket/models/claim/claim.model';

export class TicketFactory {
  static create(type: TicketTypes, params: any): Question;
  static create(type: TicketTypes, params: any): Claim;
  static create(type: TicketTypes, params: any = {}): Question | Claim {
    return TicketInitializer.for(type).create(params);
  }
}
