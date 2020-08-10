import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketInitializer } from './ticket-initializer';
import { Question } from '@modules/ticket/models/question/question.model';
import { ClaimForm } from '@modules/ticket/models/claim-form/claim-form.model';

export class TicketFactory {
  static create(type: TicketTypes.QUESTION, params: any): Question;
  static create(type: TicketTypes.CLAIM_FORM, params: any): ClaimForm;
  static create(type: TicketTypes, params: any): Question | ClaimForm;
  static create(type: TicketTypes, params: any = {}): Question | ClaimForm {
    return TicketInitializer.for(type).create(params);
  }
}
